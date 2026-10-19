# IT Maturity Assessment

A facilitated IT maturity assessment from 5iveDays Strategy (inspired by CMMI framework). An IT leader rates 22 domains on a five-level scale (Initial, Managed, Standardized, Predictable, Optimizing), backing higher ratings with each domain's stage milestones. IT staff and business users then rate the same domains blind. The readout shows the maturity level, where IT's view and the business's experience differ, and what to do next.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell: header, step rail and the main area the app draws into |
| `assets/styles.css` | Colors, type and layout for light and dark mode |
| `assets/framework.js` | All assessment content: levels, the five groups and their weights, the 22 domains with level descriptions and stage milestones, root causes, next steps, the AI adviser brief and the sample company |
| `assets/app.js` | The engine: interview flow, scoring rules, flags, readout, Markdown report and saved sessions |
| `assets/config.js` | Site settings, such as the address for the live AI conversation |
| `netlify/functions/enhanced.mjs` | Server function for the Enhanced Report: sends the conversation to the Claude API and streams the reply back |
| `CHANGES.md` | What was adjusted from the source maturity-model documents |
| `netlify.toml` | Netlify settings: no build step, publish the root folder |

## Deploying

Netlify imports this repository with no build command. Every commit to the main branch redeploys the site.

## Enhanced Report (Claude API)

The live AI conversation runs through `netlify/functions/enhanced.mjs` at `/api/enhanced`.

- Netlify environment variable `ANTHROPIC_API_KEY` must hold a Claude API key. The key never reaches the browser.
- The model is `claude-sonnet-5-5`. To change it without editing code, add an environment variable `ANTHROPIC_MODEL`, for example `claude-opus-5-5`, and redeploy.
- Set a monthly spend limit in the Claude Console billing settings.

## Data

Answers are saved in the browser of whoever runs the session, separately for each site address. Nothing leaves the browser unless the facilitator starts an Enhanced Report conversation, which sends the assessment report to Anthropic's Claude API.
