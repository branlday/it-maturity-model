// Enhanced Report: relays the facilitator's conversation to the Claude API and streams the reply back.
// The API key lives only in Netlify (Site configuration > Environment variables > ANTHROPIC_API_KEY).
// The model is set here; to change it without editing code, add an ANTHROPIC_MODEL environment variable.

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_REPLY_TOKENS = 2000;      // about 1,500 words: enough for the one-page written summary
const LIMITS = { brief: 150000, opening: 2000, user: 4000, assistant: 12000, messages: 41 };

const json = (status, message) =>
  new Response(JSON.stringify({ message }), { status, headers: { "content-type": "application/json" } });

function allowedOrigin(origin) {
  if (!origin) return true; // same-origin requests from some browsers omit it
  const sites = [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL].filter(Boolean);
  if (!sites.length) return true; // local testing
  return sites.some(s => origin === new URL(s).origin);
}

function validate(body) {
  if (!body || typeof body !== "object") return "The request was empty.";
  const { brief, opening, messages } = body;
  if (typeof brief !== "string" || !brief.trim() || brief.length > LIMITS.brief) return "The assessment brief is missing or too long.";
  if (typeof opening !== "string" || !opening.trim() || opening.length > LIMITS.opening) return "The opening message is missing.";
  if (!Array.isArray(messages) || messages.length > LIMITS.messages) return "The conversation is too long. Download it, or start over.";
  for (const [i, m] of messages.entries()) {
    const want = i % 2 === 0 ? "assistant" : "user"; // the server's opening message is the first user turn
    if (!m || m.role !== want || typeof m.content !== "string" || !m.content.trim()) return "The conversation history is out of order. Start over.";
    if (m.content.length > LIMITS[m.role]) return "One of the messages is too long.";
  }
  if (messages.length && messages[messages.length - 1].role !== "user") return "Waiting for your reply before the adviser can answer.";
  return "";
}

function friendly(status) {
  if (status === 401 || status === 403) return "The Claude API key was rejected. Check ANTHROPIC_API_KEY in Netlify's environment variables.";
  if (status === 402) return "The Claude account is out of credit. Add credit in the Claude Console billing page.";
  if (status === 429) return "Too many requests to the Claude API right now. Wait a minute and try again.";
  if (status === 529 || status >= 500) return "The Claude API is busy. Try again in a moment.";
  return `The Claude API refused the request (${status}).`;
}

export default async (req) => {
  if (req.method !== "POST") return json(405, "Use POST.");
  if (!allowedOrigin(req.headers.get("origin"))) return json(403, "Requests are only accepted from this site.");
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json(500, "The Enhanced Report isn't set up: ANTHROPIC_API_KEY is missing in Netlify.");

  let body;
  try { body = await req.json(); } catch { return json(400, "The request wasn't valid JSON."); }
  const problem = validate(body);
  if (problem) return json(400, problem);

  const messages = [{ role: "user", content: body.opening }, ...body.messages.map(m => ({ role: m.role, content: m.content }))];

  let upstream;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_REPLY_TOKENS, system: body.brief, messages, stream: true }),
    });
  } catch {
    return json(502, "Couldn't reach the Claude API. Try again in a moment.");
  }
  if (!upstream.ok || !upstream.body) {
    let detail = "";
    try { detail = (await upstream.json())?.error?.message || ""; } catch {}
    console.error("Claude API error", upstream.status, detail);
    return json(502, friendly(upstream.status));
  }

  // Translate Claude's event stream into the simple "data: {choices:[{delta:{content}}]}" lines the page reads.
  const enc = new TextEncoder(), dec = new TextDecoder();
  const send = (ctrl, obj) => ctrl.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = upstream.body.getReader();
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue;
            let ev; try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
              send(ctrl, { choices: [{ delta: { content: ev.delta.text } }] });
            } else if (ev.type === "error") {
              console.error("Claude stream error", ev.error);
              send(ctrl, { error: ev.error?.type === "overloaded_error" ? "The Claude API is busy. Try again in a moment." : "The Claude API stopped partway through. Try again." });
            }
          }
        }
        ctrl.enqueue(enc.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("Relay failed", err);
        send(ctrl, { error: "The connection to the Claude API dropped. Try again." });
      } finally {
        ctrl.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
};

export const config = { path: "/api/enhanced" };
