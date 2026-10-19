/* 5iveLevels IT Maturity Assessment: domains, milestones, levels and sample data.
   Edit wording here; the engine in app.js reads everything from FW. */
const FW = {
 "title": "5iveLevels IT Maturity Assessment",
 "copy": {
  "key": "itm-session-v1",
  "org": "organization",
  "orgLabel": "Organization",
  "orgPh": "Company or division name",
  "untitled": "Untitled organization",
  "leaderPh": "e.g. CIO, IT Director, VP of Infrastructure",
  "thesis": "IT maturity is measured by what holds without heroics.",
  "who": "IT staff and business users",
  "r2Who": "IT staff and business users",
  "r2Include": "Include at least one business user outside IT and one person from the service desk.",
  "stPh": "e.g. Service Desk Lead",
  "roleLabel": "Area",
  "kindLabel": "Role",
  "sampleNote": "You're viewing a fictional sample company.",
  "loadSample": "Load the sample company",
  "coherence": "IT maturity across the organization",
  "readout": "Maturity readout",
  "levelWord": "Maturity level",
  "overview": "{n} domains, rated on one five-level scale, trace IT maturity from governance and risk through infrastructure, access and end-user services to applications and data.",
  "r1Text": "The IT leader rates every domain in scope. Ratings of Standardized or higher must be backed by that stage's milestones, and strengths that outrun Governance & Risk get a dependency question. The result selects what Round 2 verifies.",
  "r2Text": "IT staff and business users rate the same domains blind, then confirm the leader's milestones and diagnosis. Blind spots, hidden strengths and fractures appear where IT's view and the business's experience diverge.",
  "scaleTitle": "Five levels of maturity",
  "dimWord": "domains",
  "scopeTitle": "Domains in scope",
  "scopeText": "Untick any domain this organization doesn't run or isn't responsible for, such as physical security handled by facilities. Out-of-scope domains are skipped in both rounds and the layer weights re-balance.",
  "ceilingNote": "Maturity elsewhere won't hold without the governance underneath it."
 },
 "kinds": [
  "IT leader or manager",
  "IT staff",
  "Business leader",
  "Business user"
 ],
 "next": {
  "title": "Next steps",
  "intro": "What to do with this result. The group sets the kind of work. It starts at the foundation: Governance & Risk if it scores below 3, otherwise the lowest layer. Each flag adds a step.",
  "upstream": 3,
  "cap": 4,
  "min": 3,
  "labels": {
   "start": "Start here",
   "standing": "At this stage",
   "first": "First step",
   "hold": "Hold off on",
   "also": "Also keep in view",
   "blind": "Blind spot",
   "fracture": "Fracture",
   "fragile": "Fragile signal",
   "hidden": "Hidden strength",
   "gap": "Context gap",
   "then": "Then"
  },
  "help": "These are steps an IT team can start on its own. If the first one stalls, that is the point where an outside facilitator helps.",
  "leaderNote": "Recommended next steps appear on the full readout, after Round 2.",
  "groups": [
   {
    "id": "align",
    "levels": [
     "Initial",
     "Managed"
    ],
    "name": "Stabilize",
    "posture": "IT runs on effort and individual knowledge. The work is to put governance and ownership in place before investing in new tools.",
    "hold": "Major platform purchases or migrations. They would automate processes that aren't defined yet.",
    "sound": {
     "posture": "Governance is in place, but the rest of the estate hasn't caught up. The work is to standardize the weakest domains.",
     "hold": "New tools in domains that haven't been standardized yet."
    },
    "tie": [
     "GV",
     "IA",
     "IN",
     "EU",
     "AD"
    ],
    "flags": [
     "blind",
     "fracture",
     "fragile",
     "hidden"
    ],
    "second": {
     "title": "Name one owner for every domain",
     "why": "A domain with no owner has no one to write the standard, fund the fix or answer for the result.",
     "first": "List every domain in scope and write one name next to each. Leave no blanks and no team names."
    },
    "standing": {
     "title": "Review this readout with IT leadership and business sponsors",
     "why": "Stabilizing needs the business to agree what matters most, including the uncomfortable findings.",
     "first": "Walk through the readout at the next leadership meeting. Ask the business sponsors which finding surprised them."
    },
    "layers": {
     "GV": {
      "title": "Put change, security and recovery under control",
      "why": "Governance & Risk scores {v}. Until changes are controlled and recovery is proven, gains elsewhere can be undone overnight. Lowest domain: {dim} ({dimv}).",
      "first": "Stand up a weekly change review for anything that affects more than one person, and test-restore one critical system this month."
     },
     "IN": {
      "title": "Document and stabilize the core infrastructure",
      "why": "Governance is in place (Governance & Risk {sy}), but infrastructure is still run reactively (Infrastructure {v}). Lowest domain: {dim} ({dimv}).",
      "first": "Inventory every network device, server and storage platform with its owner, age and support status."
     },
     "IA": {
      "title": "Take control of who has access",
      "why": "Governance is in place (Governance & Risk {sy}), but access is granted and removed inconsistently (Identity & Access {v}). Lowest domain: {dim} ({dimv}).",
      "first": "Pull a list of every account with admin rights and every account belonging to someone who has left. Remove what isn't needed."
     },
     "EU": {
      "title": "Get every request into one queue",
      "why": "Governance is in place (Governance & Risk {sy}), but end-user support is still improvised (End-User Services {v}). Lowest domain: {dim} ({dimv}).",
      "first": "Route every request through the ticketing system for one month and review the top ten categories."
     },
     "AD": {
      "title": "Give every key application an owner",
      "why": "Governance is in place (Governance & Risk {sy}), but applications and data are run without clear ownership (Applications & Data {v}). Lowest domain: {dim} ({dimv}).",
      "first": "List the ten most important applications and name a business owner and an IT owner for each."
     }
    }
   },
   {
    "id": "carry",
    "levels": [
     "Standardized"
    ],
    "name": "Automate and measure",
    "posture": "Standards are in place. The work is to make results predictable: automate what's documented and measure what matters.",
    "hold": "Adding new platforms before the current ones are automated and measured.",
    "tie": [
     "GV",
     "IA",
     "IN",
     "EU",
     "AD"
    ],
    "flags": [
     "blind",
     "fracture",
     "hidden",
     "fragile"
    ],
    "standing": {
     "title": "Pick three measures and report them monthly",
     "why": "What's standardized becomes predictable only when someone watches the numbers.",
     "first": "Choose one measure each for reliability, security and service, such as change success rate, patch compliance and SLA attainment. Report them next month."
    },
    "layers": {
     "GV": {
      "title": "Finish the foundation before automating",
      "why": "Governance & Risk scores {v}. Automation built on loose controls spreads mistakes faster. Lowest domain: {dim} ({dimv}).",
      "first": "Take {dim} to its owner and agree the two milestones that would bring it to Standardized this quarter."
     },
     "IN": {
      "title": "Automate infrastructure builds and patching",
      "why": "Infrastructure ({v}) lags the rest: standards exist but are applied by hand. Lowest domain: {dim} ({dimv}).",
      "first": "Pick one repeatable build, such as a server or network device, and turn it into a template."
     },
     "IA": {
      "title": "Connect access to HR events",
      "why": "Identity & Access ({v}) lags: accounts still depend on someone remembering. Lowest domain: {dim} ({dimv}).",
      "first": "Map every step from an HR hire or termination to account changes, and mark which are manual."
     },
     "EU": {
      "title": "Move common requests to self-service",
      "why": "End-User Services ({v}) lags: users still wait on IT for routine work. Lowest domain: {dim} ({dimv}).",
      "first": "Take the five most common ticket types and publish a self-service option or knowledge article for each."
     },
     "AD": {
      "title": "Document the data and integrations behind key applications",
      "why": "Applications & Data ({v}) lags: owners exist, but data flows and sources of truth aren't clear. Lowest domain: {dim} ({dimv}).",
      "first": "Draw the integrations for the most important application and mark the source of truth for each shared data item."
     }
    }
   },
   {
    "id": "deepen",
    "levels": [
     "Predictable",
     "Optimizing"
    ],
    "name": "Optimize and sustain",
    "posture": "IT runs predictably. The work is to keep improving and make sure maturity survives turnover, growth and acquisitions.",
    "hold": "Assuming maturity will survive key staff leaving, a merger or a major migration without deliberate work.",
    "tie": [
     "GV",
     "AD",
     "IA",
     "IN",
     "EU"
    ],
    "flags": [
     "fragile",
     "blind",
     "fracture",
     "hidden"
    ],
    "standing": {
     "title": "Re-run the assessment every year and at every major change",
     "why": "Maturity slips at moments of change, and a strong result is the easiest one to stop checking.",
     "first": "Put next year's date in the calendar now. Add a re-run to the plan for any acquisition, leadership change or major platform migration."
    },
    "layers": {
     "GV": {
      "title": "Shore up governance behind the results",
      "why": "Results run ahead of Governance & Risk ({v}), which usually means a few people are holding them together. Lowest domain: {dim} ({dimv}).",
      "first": "List what would stop working if your two most senior engineers left this quarter."
     },
     "IN": {
      "title": "Raise infrastructure to the level of the rest",
      "why": "Infrastructure ({v}) is the lowest layer. Lowest domain: {dim} ({dimv}).",
      "first": "Take {dim} to the people closest to it and ask what one change would bring it level with the rest."
     },
     "IA": {
      "title": "Move access to roles and risk",
      "why": "Identity & Access ({v}) is the lowest layer. Lowest domain: {dim} ({dimv}).",
      "first": "Define access bundles for your three largest roles and test granting them automatically."
     },
     "EU": {
      "title": "Raise the everyday experience",
      "why": "End-User Services ({v}) is the lowest layer, and it's the part of IT the business sees most. Lowest domain: {dim} ({dimv}).",
      "first": "Survey twenty users on their worst recurring IT annoyance and fix the top one this month."
     },
     "AD": {
      "title": "Put data to work",
      "why": "Applications & Data ({v}) is the lowest layer. The infrastructure is ready for more than the data delivers. Lowest domain: {dim} ({dimv}).",
      "first": "Ask two department heads which decision they'd make differently with better data, and trace what's missing."
     }
    }
   }
  ],
  "flagActions": {
   "blind": {
    "title": "Talk about {dim} first",
    "why": "{leader} rated it {L}; staff and business users averaged {m}. This is the widest gap between how IT sees itself and what others experience.",
    "first": "Show this one row before any other finding, and ask a business user for a recent example.",
    "also": "{dim}: IT leadership rates it higher than staff and users do."
   },
   "fracture": {
    "title": "Find out why {dim} looks different across the organization",
    "why": "Ratings ran from {min} to {max}. On this point, different teams or sites are getting different service.",
    "first": "Ask the highest and lowest raters to describe one recent experience each.",
    "also": "{dim}: ratings ran from {min} to {max}."
   },
   "fragile": {
    "title": "Plan for who carries {dim} next",
    "why": "It scores well today because of one or two people or a past project, not a sustained process.",
    "first": "Write down what those people do that no one else does, and name a backup who learns it this quarter.",
    "also": "{dim}: rests on one or two people or a past project."
   },
   "hidden": {
    "title": "Name the strength in {dim} and build on it",
    "why": "Staff and users averaged {m}; {leader} rated it {L}. Something is working that leadership hasn't noticed.",
    "first": "Ask the people closest to it what they do, and recognize it in front of the team.",
    "also": "{dim}: stronger than leadership realizes."
   },
   "gap": {
    "title": "{label}",
    "why": "{label}",
    "first": "{label}",
    "also": "{label}"
   }
  }
 },
 "levels": [
  {
   "n": 1,
   "name": "Initial",
   "summary": "Practices are inconsistent and crisis-driven. Systems were deployed quickly without strategic planning, and results depend on who happens to be available.",
   "next": "Put governance and ownership in place before buying new tools."
  },
  {
   "n": 2,
   "name": "Managed",
   "summary": "A management foundation exists, but operations are disjointed. Little integration or improvement planning, little documentation and mostly tribal knowledge.",
   "next": "Write down what's known and standardize the most critical domains first."
  },
  {
   "n": 3,
   "name": "Standardized",
   "summary": "Implementation and processes are consistent and documented, with only minimal, deliberate deviations from the standards.",
   "next": "Automate and measure, so results stop depending on effort."
  },
  {
   "n": 4,
   "name": "Predictable",
   "summary": "Systems deliver reliable results because variation is controlled. Little care and feeding is needed, and work is automated wherever possible.",
   "next": "Shift effort from running systems to improving them."
  },
  {
   "n": 5,
   "name": "Optimizing",
   "summary": "Continuously improving and watching for new developments. Regular operations need no manual intervention; people work on enhancements.",
   "next": "Protect it through staff turnover, growth and acquisitions, the moments that undo maturity."
  }
 ],
 "layers": [
  {
   "id": "GV",
   "name": "Governance & Risk",
   "role": "Foundation",
   "weight": 0.3,
   "source": "NIST CSF 2.0, ITIL 4, COSO / ITGC",
   "desc": "Whether change, security, recovery and compliance are controlled. The foundation everything else depends on: maturity elsewhere won't hold without it."
  },
  {
   "id": "IN",
   "name": "Infrastructure",
   "role": "Platform",
   "weight": 0.2,
   "source": "Infrastructure & operations practice",
   "desc": "Whether the network, servers, storage and physical systems are standardized, resilient, current and secure."
  },
  {
   "id": "IA",
   "name": "Identity & Access",
   "role": "Access",
   "weight": 0.15,
   "source": "Zero-trust identity practice",
   "desc": "Whether the right people get the right access at the right time, and lose it when they should."
  },
  {
   "id": "EU",
   "name": "End-User Services",
   "role": "Service",
   "weight": 0.15,
   "source": "ITIL 4 service management",
   "desc": "Whether the tools and support people use every day are consistent, reliable and easy to use."
  },
  {
   "id": "AD",
   "name": "Applications & Data",
   "role": "Value",
   "weight": 0.2,
   "source": "Application and data management practice",
   "desc": "Whether business applications and data are owned, governed, integrated and kept current."
  }
 ],
 "rules": {
  "foundation": "GV",
  "top_layer": "GV",
  "evidence_from": 3,
  "evidence_share": 0.5,
  "evidence_threshold": 2,
  "evidence_rule": "A rating of Standardized (3) or higher holds only if at least half of that stage's milestones are in place. Otherwise the domain drops one level (claim unverified).",
  "dependency_rule": "When a domain outside Governance & Risk is rated 2+ levels above the Governance & Risk score, ask what sustains it. If the answer is one or two people or a past project, the domain drops one level (fragile signal).",
  "ceiling_rule": "The overall index cannot exceed the Governance & Risk score + 1. Maturity elsewhere won't hold without the governance underneath it.",
  "resonance_rule": "Optimizing requires a Governance & Risk score of 4 or higher. Otherwise the result caps at Predictable.",
  "light_route_rule": "Light mode: if Governance & Risk scores 2 or below, the remaining domains are asked as gate questions only, and the result is flagged Upstream root cause.",
  "bands": [
   [
    1.0,
    "Initial"
   ],
   [
    1.5,
    "Managed"
   ],
   [
    2.5,
    "Standardized"
   ],
   [
    3.5,
    "Predictable"
   ],
   [
    4.5,
    "Optimizing"
   ]
  ],
  "blind_spot_gap": 1.5,
  "fracture_spread": 2,
  "fracture_penalty": 0.5,
  "min_stakeholders": 2,
  "verify_count": 3,
  "confirm_count": 2
 },
 "dependency_options": [
  {
   "id": "individual",
   "label": "One or two specific people, such as a long-tenured administrator",
   "fragile": true
  },
  {
   "id": "legacy",
   "label": "A past project or investment that isn't being maintained",
   "fragile": true
  },
  {
   "id": "unit",
   "label": "One strong team, working somewhat on its own",
   "fragile": false
  },
  {
   "id": "system",
   "label": "A documented, automated process that holds regardless of who is involved",
   "fragile": false
  }
 ],
 "roots": {
  "GV": [
   "No one owns the process or the policy",
   "Policies exist on paper but aren't enforced",
   "Leadership hasn't funded or prioritized it",
   "Growth, an acquisition or staff turnover outpaced the controls",
   "We rely on outside parties without verifying what they do"
  ],
  "IN": [
   "Equipment and platforms are past end of life",
   "Each site or project built its own way",
   "No standard builds or configuration templates",
   "Too little staff time for anything beyond firefighting",
   "Monitoring doesn't exist, so problems are found by users"
  ],
  "IA": [
   "Access is granted by hand, system by system",
   "HR and IT aren't connected, so changes arrive late",
   "No one reviews who has access",
   "Admin rights were handed out for convenience",
   "Data owners aren't named, so IT decides access"
  ],
  "EU": [
   "Tools were adopted team by team with no standard",
   "No service desk process or ticket data to manage by",
   "Users weren't trained, so they work around the tools",
   "Hardware and software aren't managed on a lifecycle",
   "Support depends on a few people who know the fixes"
  ],
  "AD": [
   "Applications have no business owner",
   "Integrations and data flows aren't documented",
   "Vendor or contractor work isn't held to IT standards",
   "Data quality is no one's job",
   "Old systems are kept because no one plans their retirement"
  ]
 },
 "dimensions": [
  {
   "id": "GV1",
   "layer": "GV",
   "name": "Change Management",
   "q": "How are changes to IT systems planned, reviewed, approved and checked afterward?",
   "qs": "From what you see, how are changes to IT systems planned, reviewed, approved and checked afterward?",
   "anchors": [
    "Changes go straight to production when someone decides to make them. Outages caused by changes are discovered by users.",
    "Changes to regulated or compliance systems are reviewed and tested first. Everything else is changed ad hoc.",
    "Every change that could affect more than one person goes through a ticketed process and is approved by a change advisory board (CAB).",
    "Changes carry implementation, test and back-out plans, close only after review, and emergency changes follow a defined path.",
    "Routine changes are pre-approved standard changes. Change data is analyzed to cut failed changes, and adherence is audited."
   ],
   "milestones": {
    "2": [
     "Changes to regulated or compliance systems are approved by an advisory board before implementation",
     "Changes to regulated or compliance systems are tested before implementation"
    ],
    "3": [
     "Every change that could affect more than one person goes through the change process",
     "Changes are logged in the ITSM ticketing system as the single record of change",
     "A change advisory board meets on a regular schedule to review upcoming changes",
     "Changes are approved before implementation"
    ],
    "4": [
     "Change requests include implementation, test and back-out plans",
     "Changes stay open until a post-implementation review is complete",
     "An emergency change process defines escalation paths and a deadline for follow-up documentation",
     "Change success rate and change-related incidents are tracked"
    ],
    "5": [
     "Recurring, low-risk changes are pre-approved as standard changes with documented procedures",
     "Configuration changes are compared against approved changes to catch unauthorized work",
     "Change data is reviewed regularly to reduce failed changes and lead time"
    ]
   },
   "tension": "Which kinds of change still bypass the process, and who makes them?"
  },
  {
   "id": "GV2",
   "layer": "GV",
   "name": "Cyber Security",
   "q": "How well does the organization know what it must protect, and how consistently is that protection applied and tested?",
   "qs": "From what you see, how well does the organization know what it must protect, and how consistently is that protection applied and tested?",
   "anchors": [
    "Security is reactive. Critical assets aren't identified, and known severe vulnerabilities stay open.",
    "Priorities and scope are defined, critical vulnerabilities are being fixed, and baseline controls such as MFA and endpoint protection are rolling out.",
    "Controls are standardized across all systems and locations, outside assessments happen regularly, and medium-risk findings are remediated.",
    "Staff are trained and phish-tested, networks are segmented, 24/7 detection and response is in place, and low-risk findings are fixed or formally accepted.",
    "Security is managed against a framework such as NIST CSF 2.0. New vulnerabilities are fixed fast, incident response is drilled, and access is least-privilege everywhere."
   ],
   "milestones": {
    "2": [
     "Critical assets, data and people to protect are identified and ranked",
     "The scope of the security program is defined, including what is out of bounds",
     "Critical and high-severity vulnerabilities are being remediated",
     "Multi-factor authentication is enforced for email, remote access and admin accounts"
    ],
    "3": [
     "Security controls are standardized across all systems and locations",
     "Changes to security-relevant systems go through change management with oversight",
     "Independent assessments or penetration tests happen at least annually",
     "Medium-severity vulnerabilities are remediated on a defined timeline",
     "Endpoint detection and response (EDR) runs on all servers and endpoints"
    ],
    "4": [
     "Security awareness training and phishing simulations run on a regular schedule",
     "Networks are segmented into zones with access policies that limit lateral movement",
     "Alerts are monitored 24/7, in-house or through a managed detection and response (MDR) provider",
     "Low-risk findings are fixed or formally accepted by management with a documented response"
    ],
    "5": [
     "The program is measured against a recognized framework such as NIST CSF 2.0 or CIS Controls, with leadership reporting",
     "The incident response plan is known by the whole team and exercised with tabletop drills at least annually",
     "New critical vulnerabilities are remediated within days, with patch compliance tracked",
     "Access is least-privilege, using phishing-resistant MFA and just-in-time admin rights"
    ]
   },
   "tension": "Which critical asset would you least like an auditor to test today?"
  },
  {
   "id": "GV3",
   "layer": "GV",
   "name": "Disaster Recovery & Continuity",
   "q": "If a major outage or ransomware attack hit tomorrow, how prepared is the organization to recover?",
   "qs": "From what you see, if a major outage or ransomware attack hit tomorrow, how prepared is the organization to recover?",
   "anchors": [
    "No formal plan. Critical systems and dependencies aren't documented, and recovery depends on individual knowledge.",
    "A basic plan exists and backups run, but there's no offsite or immutable copy, testing is inconsistent and no recovery targets are set.",
    "A documented plan sets recovery time and data-loss targets (RTO/RPO) from a business impact analysis, is tested routinely and has clear roles.",
    "Leadership has adopted a DR policy, business stakeholders are part of the plan, exercises run at least annually and alerting is in place.",
    "Failover is automated and near-real-time, recovery is proven against ransomware, and the plan is reviewed continuously with funded resilience."
   ],
   "milestones": {
    "2": [
     "A disaster recovery policy exists and has a named owner",
     "Critical IT assets, dependencies and risks are being documented",
     "Backups run on a regular schedule with a copy stored offsite or in the cloud",
     "IT staff have basic training on DR responsibilities"
    ],
    "3": [
     "A business impact analysis (BIA) ranks critical systems",
     "RTO and RPO targets are set for each critical system",
     "Backups are encrypted, with at least one immutable or air-gapped copy",
     "DR tests run on a schedule and findings are documented",
     "A response team with defined roles and responsibilities is in place"
    ],
    "4": [
     "DR planning is part of enterprise risk management and business continuity planning",
     "Business stakeholders outside IT take part in planning and exercises",
     "Tabletop exercises and recovery drills run at least annually, with a debrief",
     "Actual recovery times are measured against RTO and RPO targets",
     "Alerting reaches the right people, who know their required response times"
    ],
    "5": [
     "Failover for critical systems is automated, through replication or DR-as-a-service",
     "Recovery from a ransomware scenario has been tested end to end, including clean-room restore",
     "Monitoring and analytics flag likely failures before they cause outages",
     "The plan is reviewed after every exercise and change, and resilience is funded in the budget"
    ]
   },
   "tension": "When was a critical system last restored from backup in a test, and how long did it take?"
  },
  {
   "id": "GV4",
   "layer": "GV",
   "name": "IT Compliance & SOX Controls",
   "q": "How are IT general controls (ITGCs) for financially significant systems documented, evidenced and reviewed?",
   "qs": "From what you see, how are IT general controls (ITGCs) for financially significant systems documented, evidenced and reviewed?",
   "anchors": [
    "Nobody has defined which applications are in scope. Control steps are tribal knowledge and evidence is gathered in a scramble.",
    "In-scope applications are defined, but processes live in people's heads and approvals take constant back-and-forth.",
    "Control processes are documented, standard reports exist, and control owners and approvers know their roles.",
    "Reports run on a schedule, approvals flow through the ticketing system, and reviewers respond within set timeframes.",
    "Evidence collection and notifications are automated, reviewers act in a governance tool, and audits find no IT control exceptions."
   ],
   "milestones": {
    "2": [
     "In-scope (SOX) applications are defined and listed",
     "Control owners and approvers for each in-scope system are named"
    ],
    "3": [
     "IT general control processes (access, change, operations) are documented",
     "A standard user access review report exists for each in-scope system",
     "Approvers and IT administrators understand their control responsibilities"
    ],
    "4": [
     "Access reviews and control reports run on a schedule",
     "Approvals are captured automatically through the ticketing system",
     "Reviewers respond within defined timeframes, and late reviews are escalated",
     "Control evidence is stored in one central location"
    ],
    "5": [
     "Evidence collection and reviewer notifications are automated",
     "Reviewers record decisions in a governance or GRC tool instead of email",
     "Recent external audits found no significant IT control deficiencies"
    ]
   },
   "tension": "Where does the scramble happen each audit cycle?"
  },
  {
   "id": "IN1",
   "layer": "IN",
   "name": "Network Infrastructure",
   "q": "How standardized, resilient and secure is the network that connects people, sites and cloud services?",
   "qs": "From what you see, how standardized, resilient and secure is the network that connects people, sites and cloud services?",
   "anchors": [
    "Sites and the internet are reachable, but performance is unpredictable and support is mostly firefighting.",
    "Routing works between sites and a perimeter firewall is in place, but paths are inefficient and designs vary by site.",
    "A consistent WAN design is in place, VLANs and access policies segment traffic, and device configurations are backed up.",
    "Hardware is standardized, the WAN fails over automatically, LANs have redundancy and most devices run current firmware.",
    "Configuration is consistent and centrally managed, access is zero-trust, security policies are reviewed routinely and nearly all devices are current."
   ],
   "milestones": {
    "2": [
     "All internal sites and required internet services are reachable",
     "A firewall protects the network perimeter",
     "Network devices and circuits are inventoried"
    ],
    "3": [
     "A consistent WAN architecture or SD-WAN is in place across sites",
     "VLANs separate traffic types such as users, servers, voice and guests",
     "Access policies limit traffic between segments",
     "Device configurations are backed up automatically"
    ],
    "4": [
     "Network hardware is standardized on a small set of vendors and models",
     "The WAN fails over automatically when a circuit or device fails",
     "Core and distribution layers have hardware redundancy",
     "About 75% of devices run the current supported firmware",
     "Network monitoring alerts on outages and capacity limits"
    ],
    "5": [
     "Devices are configured from templates or automation, with centralized authentication",
     "Network access control or zero-trust access verifies users and devices before granting access",
     "Security policies are reviewed and tightened on a set schedule",
     "More than 95% of devices run the current supported firmware"
    ]
   },
   "tension": "Which site or link would you least like to lose during month-end close?"
  },
  {
   "id": "IN2",
   "layer": "IN",
   "name": "Server & Cloud Systems",
   "q": "How consistently are on-premises and cloud servers built, secured, patched and retired?",
   "qs": "From what you see, how consistently are on-premises and cloud servers built, secured, patched and retired?",
   "anchors": [
    "Servers were stood up as needed. Naming, versions and permissions vary, and support is reactive.",
    "Most servers are backed up, but standards are loose and cloud resources grow without oversight.",
    "Naming, versions and access are standardized, patching runs in pilot and production rings, and cloud provisioning needs approval.",
    "Platforms are consolidated, cloud is tied into central identity, security baselines apply everywhere and most servers are current.",
    "Servers are built from code wherever they run, unused systems are retired safely, costs are managed and nearly all servers are current."
   ],
   "milestones": {
    "2": [
     "All servers, on-premises and cloud, are inventoried",
     "Backup and recovery covers most servers",
     "Administrative access is limited to IT"
    ],
    "3": [
     "Servers follow naming, version and access standards",
     "Cloud resources are provisioned through an approval process with tagging to limit sprawl",
     "Patching runs in rings (pilot, standard, protected) through change management",
     "A consistent backup and retention policy applies to all servers"
    ],
    "4": [
     "On-premises virtualization is consolidated on one platform",
     "Cloud workloads use central identity and single sign-on for administration",
     "A security baseline (hardening standard) is applied to every server",
     "About 75% of servers run a current supported operating system",
     "Cloud spend is reported by owner or department"
    ],
    "5": [
     "Servers are deployed from templates or infrastructure-as-code wherever they run",
     "Unused servers are decommissioned on a schedule without data loss",
     "Security baselines are monitored continuously, with drift corrected",
     "More than 95% of servers run a current supported operating system",
     "Cloud costs are optimized through rightsizing and reserved capacity"
    ]
   },
   "tension": "Which server would no one dare reboot, and why?"
  },
  {
   "id": "IN3",
   "layer": "IN",
   "name": "Storage & Data Retention",
   "q": "How organized, governed and protected is where the organization's files and data are stored?",
   "qs": "From what you see, how organized, governed and protected is where the organization's files and data are stored?",
   "anchors": [
    "Files sit across file shares, personal drives and several cloud services, with no retention rules.",
    "File shares and cloud storage are available and mostly backed up, but organization, permissions and retention are inconsistent.",
    "Storage is consolidated, a data governance policy is being defined, and legal holds are executed consistently.",
    "Data loss prevention watches sensitive data, retention follows Legal's guidance, and users store and recover files correctly on their own.",
    "All data is organized and classified under policy, unapproved storage is blocked and data moves between tiers automatically."
   ],
   "milestones": {
    "2": [
     "File shares and approved cloud storage are available to users",
     "Backup and recovery covers most storage platforms",
     "Storage locations are known and inventoried"
    ],
    "3": [
     "On-premises file storage is consolidated onto one platform",
     "Cloud storage is consolidated onto one approved platform",
     "A data governance policy for organization and access is being written",
     "Legal hold requests are understood by IT and executed consistently"
    ],
    "4": [
     "Data loss prevention (DLP) monitors key sensitive data",
     "Retention and sharing rules follow Legal's guidance",
     "Users store files in the right places and restore deleted files themselves",
     "Sensitivity labels classify confidential data",
     "Storage tiers are defined, even if moving data between them is manual"
    ],
    "5": [
     "All data is organized and access-controlled under the data governance policy",
     "Unapproved storage such as USB drives and personal cloud is blocked",
     "Data moves between tiers automatically based on age and use",
     "Retention and deletion run automatically under policy"
    ]
   },
   "tension": "If Legal asked for every copy of a contract tomorrow, where would you have to look?"
  },
  {
   "id": "IN4",
   "layer": "IN",
   "name": "Physical Security Systems",
   "q": "How standardized and centrally managed are badge access, door control and cameras across facilities?",
   "qs": "From what you see, how standardized and centrally managed are badge access, door control and cameras across facilities?",
   "anchors": [
    "Entry depends on keys and a mix of systems. Cameras are few, unmanaged and not monitored.",
    "Some sites have badges, some cameras and some intercoms, each managed separately with no standard.",
    "Every facility has badge access and cameras where required, access follows an approval list, and badges are part of onboarding and offboarding.",
    "Systems are being standardized, firmware is updated on a cycle, and each person carries one badge.",
    "One centrally managed platform covers all locations. Access ties to HR status, and logs are reviewed."
   ],
   "milestones": {
    "2": [
     "Badge or key access is recorded for each facility",
     "Cameras cover the main entrances of key sites",
     "Physical security systems are on the network inventory"
    ],
    "3": [
     "A facility access approval list governs all new access",
     "Badge access is granted and removed as part of onboarding and offboarding",
     "Every facility uses badge access control",
     "Intercoms and cameras are installed at all required facilities"
    ],
    "4": [
     "Badge, camera and intercom systems are being consolidated onto standard platforms",
     "Firmware and operating system updates follow a defined cycle",
     "Each person has one badge for all the facilities they need",
     "Physical security devices sit on a segmented network"
    ],
    "5": [
     "All systems are standardized and centrally managed across locations",
     "Badge access is granted and revoked automatically from HR status",
     "Access logs and camera health are reviewed on a schedule"
    ]
   },
   "tension": "If someone was let go today, how long would their badge keep working?"
  },
  {
   "id": "IA1",
   "layer": "IA",
   "name": "Identity & Access Management",
   "q": "How are identities, sign-in and privileged access managed across the organization?",
   "qs": "From what you see, how are identities, sign-in and privileged access managed across the organization?",
   "anchors": [
    "Accounts are created by hand in each system. Passwords are the only control and shared admin accounts are common.",
    "A central directory exists and MFA covers email, but many apps have separate logins and admin rights are broadly held.",
    "Single sign-on covers most apps, MFA is enforced for all users, and admin accounts are separate and inventoried.",
    "Accounts are provisioned automatically from HR, access is reviewed on a schedule and privileged access is time-limited.",
    "Access is granted by role and risk, sign-in is passwordless or phishing-resistant, and conditional access adapts to device and location."
   ],
   "milestones": {
    "2": [
     "One central directory holds all user accounts",
     "MFA is enforced for email and remote access",
     "Shared and generic accounts are inventoried"
    ],
    "3": [
     "Single sign-on (SSO) covers most business applications",
     "MFA is enforced for all users and all external access",
     "Administrators use separate admin accounts",
     "Service accounts have owners and are documented"
    ],
    "4": [
     "Accounts are created and disabled automatically from the HR system (for example through SCIM)",
     "User access reviews run on a schedule for critical systems",
     "Privileged access is granted just in time and expires automatically",
     "Conditional access policies check device health and location"
    ],
    "5": [
     "Access is assigned by role and adjusts automatically when a role changes",
     "Sign-in is passwordless or uses phishing-resistant methods such as passkeys",
     "Risky sign-ins are detected and blocked automatically",
     "Identity metrics are reported to leadership"
    ]
   },
   "tension": "Who in the organization holds admin rights they don't need today?"
  },
  {
   "id": "IA2",
   "layer": "IA",
   "name": "Onboarding & Offboarding",
   "q": "How reliably and quickly do new hires get what they need, and do departing staff lose access?",
   "qs": "From what you see, how reliably and quickly do new hires get what they need, and do departing staff lose access?",
   "anchors": [
    "IT hears about joiners and leavers late or by word of mouth, and does everything by hand.",
    "Forms capture the basics and notify the right people, but IT does the work manually with constant follow-up.",
    "Policies and procedures exist for both processes, scripts handle most cases and hardware is tracked in an asset system.",
    "A modular request form triggers automation, approvals are defined, and the processes start with little IT involvement.",
    "Every scenario is automated end to end from the HR system, including role changes, with no IT action needed to start."
   ],
   "milestones": {
    "2": [
     "Request forms capture joiner and leaver details and notify the responsible teams",
     "A checklist covers the IT steps for each process"
    ],
    "3": [
     "Onboarding and offboarding have documented policies and procedures",
     "Scripts automate most account creation and removal",
     "An asset management system tracks hardware assigned to each person",
     "Departing staff lose access on their last day"
    ],
    "4": [
     "The request form is modular and feeds the automation directly, with reporting",
     "Approval steps are defined and executed every time",
     "The processes start with little or no IT involvement",
     "Role changes (movers) trigger access updates"
    ],
    "5": [
     "All known scenarios are automated end to end, triggered by the HR system",
     "No IT action is needed to start onboarding or offboarding",
     "Time-to-productive for new hires is measured and reported"
    ]
   },
   "tension": "What does a new hire still wait for on day one?"
  },
  {
   "id": "IA3",
   "layer": "IA",
   "name": "File & Folder Access",
   "q": "How are permissions to shared files and folders requested, approved and kept clean?",
   "qs": "From what you see, how are permissions to shared files and folders requested, approved and kept clean?",
   "anchors": [
    "Shared files are open to almost everyone, and permissions are set person by person.",
    "Confidential folders are protected and some access uses groups, but most permissions are set folder by folder.",
    "Parent folders are permissioned by group, managers approve new access and folders are being organized by department.",
    "Department structures are in place, owners keep approval lists and access is reviewed quarterly.",
    "Access requests, approvals and removals are automated and owner-driven, with no service desk involvement."
   ],
   "milestones": {
    "2": [
     "Shared files live on managed shares or sites",
     "Confidential folders are restricted to the people who need them",
     "Some permissions are managed through security groups"
    ],
    "3": [
     "Top-level folders are permissioned by security groups, with few individual grants",
     "A manager or owner approves all new access",
     "Folders are being reorganized into department areas"
    ],
    "4": [
     "Shared storage is organized into department areas with named owners",
     "Each area has an approved access list that governs new requests",
     "Access is reviewed quarterly and unneeded access is removed",
     "External sharing is controlled and expires automatically"
    ],
    "5": [
     "Access requests and approvals run through self-service with owner approval",
     "Access expires or is recertified automatically",
     "Oversharing is monitored, including content reachable by AI assistants"
    ]
   },
   "tension": "Which folder holds the most sensitive data, and who can open it today?"
  },
  {
   "id": "EU1",
   "layer": "EU",
   "name": "Service Desk & IT Service Management",
   "q": "How are incidents and requests logged, prioritized, resolved and measured?",
   "qs": "From what you see, how are incidents and requests logged, prioritized, resolved and measured?",
   "anchors": [
    "Requests arrive by email, phone and hallway. Nothing is tracked consistently and priorities are set by whoever pushes hardest.",
    "A ticketing system is in place, but categories, priorities and response times are applied unevenly.",
    "All requests go through one ticketing tool with defined priorities, SLAs, escalation paths and a growing knowledge base.",
    "SLAs are reported and met, common requests are self-service, and problem management fixes recurring causes.",
    "Service data drives improvement, satisfaction is measured continuously and routine requests resolve automatically."
   ],
   "milestones": {
    "2": [
     "All requests and incidents are logged in one ticketing system",
     "Tickets have categories and priorities"
    ],
    "3": [
     "Priorities have defined response and resolution targets (SLAs)",
     "Escalation from Tier 1 to Tier 2 and 3 is defined",
     "A knowledge base covers common issues",
     "A service catalog lists what users can request"
    ],
    "4": [
     "SLA performance is reported monthly",
     "A self-service portal handles common requests and password resets",
     "Recurring incidents are traced to root causes through problem management",
     "User satisfaction is surveyed after tickets close"
    ],
    "5": [
     "Routine requests are fulfilled automatically",
     "AI-assisted triage or virtual agents resolve common questions",
     "Service trends are reviewed with the business to plan improvements"
    ]
   },
   "tension": "What do users do instead of opening a ticket, and why?"
  },
  {
   "id": "EU2",
   "layer": "EU",
   "name": "Endpoint Management",
   "q": "How are laptops and desktops deployed, patched, secured and replaced?",
   "qs": "From what you see, how are laptops and desktops deployed, patched, secured and replaced?",
   "anchors": [
    "Computers are set up by hand, updates are irregular and users install what they like.",
    "Computers are joined to the domain and receive updates, and an asset tool covers most machines, but software isn't managed.",
    "One management platform covers all computers, patches run on a schedule, approved software is defined and a self-help portal exists.",
    "Approved software deploys automatically, patches deploy with rollback, lifecycle and peripheral policies apply and local admin is being removed.",
    "Devices are cloud-managed and zero-touch deployed, no one has standing local admin rights and devices are replaced on a lifecycle."
   ],
   "milestones": {
    "2": [
     "All computers are joined to a managed directory",
     "Operating system updates are deployed centrally",
     "An asset management agent runs on most machines"
    ],
    "3": [
     "One management platform covers all computers",
     "An approved software list is defined and managed",
     "Patches deploy on a defined schedule",
     "A self-help portal (Tier 0) is available to users",
     "A peripheral hardware standard is defined"
    ],
    "4": [
     "A device lifecycle policy is defined and being applied",
     "All approved software deploys through the management platform",
     "Local admin rights are being removed, with an elevation process for exceptions",
     "Patches deploy automatically in rings, with rollback",
     "Disk encryption is enforced on all laptops"
    ],
    "5": [
     "New devices are provisioned zero-touch and ship directly to users",
     "No users have standing local admin rights",
     "Devices are replaced on the lifecycle schedule",
     "Device health and compliance are reported continuously"
    ]
   },
   "tension": "How long does it take to get a new laptop into someone's hands, ready to work?"
  },
  {
   "id": "EU3",
   "layer": "EU",
   "name": "Mobility & Remote Work",
   "q": "How securely and consistently can people work from anywhere, on laptops and phones?",
   "qs": "From what you see, how securely and consistently can people work from anywhere, on laptops and phones?",
   "anchors": [
    "Remote access is improvised. Phones and hotspots are handed out without standards and support is ad hoc.",
    "Laptops connect through a VPN or virtual desktop, phones are issued, but remote support has no standard tool.",
    "Phone standards, lifecycle and redeployment policies exist, a remote support tool is on every machine and mobile management has been evaluated.",
    "Mobile device management is rolling out, and remote access is moving to identity-based, zero-trust connections.",
    "Every device is managed, remote access is zero-trust, and people work the same way in the office or out of it."
   ],
   "milestones": {
    "2": [
     "Laptops can reach company resources remotely through VPN or a virtual desktop",
     "Company phones and hotspots are issued to people who need them"
    ],
    "3": [
     "Phone standards, lifecycle and redeployment policies are defined",
     "A remote support tool is deployed to all machines",
     "Mobile device management (MDM) options have been evaluated",
     "Published or web apps reduce the need for VPN"
    ],
    "4": [
     "Unified endpoint management (UEM) is rolling out to laptops and phones",
     "Company data on personal phones is protected by app policies",
     "Remote access is moving from VPN to zero-trust network access (ZTNA)"
    ],
    "5": [
     "All laptops and phones are enrolled in unified endpoint management",
     "Remote access is zero-trust, with device health checked at sign-in",
     "Remote and office users get the same support experience"
    ]
   },
   "tension": "What can't someone do from home that they can do in the office?"
  },
  {
   "id": "EU4",
   "layer": "EU",
   "name": "Collaboration",
   "q": "How unified and well adopted are email, chat, meetings, calling and file sharing?",
   "qs": "From what you see, how unified and well adopted are email, chat, meetings, calling and file sharing?",
   "anchors": [
    "Communication tools vary by team, accounts are scattered and people improvise with personal apps.",
    "Everyone has email and an account in one directory, and calling works internally and externally.",
    "One chat platform and one meeting platform are rolled out to everyone who needs them.",
    "Standard tools exist for projects, file sharing with data protection and team sites, and the org chart is accurate.",
    "Tools are used consistently, leaders model their use, cross-team metrics flow automatically and collaboration is second nature."
   ],
   "milestones": {
    "2": [
     "Everyone uses one common email platform",
     "All users have accounts in a single directory",
     "Calling works internally and externally, by desk phone or soft phone"
    ],
    "3": [
     "One chat platform is rolled out to all users",
     "One virtual meeting platform is available to everyone who needs it",
     "Guidance exists on which tool to use for what"
    ],
    "4": [
     "A standard project management tool is available to leaders and managers",
     "A standard file-sharing platform has expiration and data-leak protections",
     "Team sites or workspaces are available to team leaders",
     "The org chart is accurate inside the collaboration tools",
     "Guest access and external collaboration are governed"
    ],
    "5": [
     "Leaders and managers use the standard project tool consistently, with cross-team metrics",
     "All users are trained, and managers actively model the tools",
     "AI assistants are rolled out with governance over what content they can reach"
    ]
   },
   "tension": "Where do people still go outside the approved tools to get work done?"
  },
  {
   "id": "EU5",
   "layer": "EU",
   "name": "Audio & Video Conferencing",
   "q": "How reliable and consistent is the meeting-room experience?",
   "qs": "From what you see, how reliable and consistent is the meeting-room experience?",
   "anchors": [
    "Rooms have a screen to plug into. Every room is different and IT is constantly fixing connections.",
    "Rooms are starting to be standardized for online video meetings, but users still need IT to start meetings.",
    "Room standards are defined and most rooms meet them, and people can start a meeting without help.",
    "All rooms are standardized, monitored remotely with alerts, and updated and restarted on a schedule.",
    "Rooms are one-touch and seamless, IT rarely does break-fix and equipment follows a lifecycle policy."
   ],
   "milestones": {
    "2": [
     "Every conference room has a display people can connect to",
     "Room equipment is inventoried"
    ],
    "3": [
     "A room standard is defined for small, medium and large rooms",
     "Most rooms support online video meetings on the standard platform",
     "Users can start a meeting without IT's help"
    ],
    "4": [
     "All rooms meet the standard and support video meetings",
     "Rooms are monitored remotely, with alerts for high-priority issues",
     "Room systems restart and update on a schedule",
     "A firmware and software update policy keeps rooms consistent"
    ],
    "5": [
     "Rooms are one-touch to join, and IT is rarely called for break-fix",
     "An equipment lifecycle policy governs room refreshes",
     "Room usage data guides investment"
    ]
   },
   "tension": "Which room do people avoid booking, and why?"
  },
  {
   "id": "EU6",
   "layer": "EU",
   "name": "Printing",
   "q": "How managed, secure and necessary is printing?",
   "qs": "From what you see, how managed, secure and necessary is printing?",
   "anchors": [
    "Printers are installed by IP address or shared from someone's computer, with no contract or oversight.",
    "Printers run through a print server under a managed print contract, and scan-to-email works.",
    "Printers deploy through a print management platform, and printers handling sensitive documents have security settings.",
    "Secure release printing is in place, a lifecycle policy is followed and digital workflows are reducing print volume.",
    "Printing is rarely needed. Remaining devices are cloud-managed with secure release, and paper processes have gone digital."
   ],
   "milestones": {
    "2": [
     "Printers are installed through a print server or management tool",
     "All printers are covered by a managed print contract",
     "Scan-to-email is configured"
    ],
    "3": [
     "Printers deploy automatically through a print management platform",
     "Security settings are applied to printers that handle sensitive documents",
     "Printer firmware is kept current"
    ],
    "4": [
     "Badge or secure release printing is in place",
     "A printer lifecycle policy is written and followed",
     "Paper-based processes are being moved to digital workflows",
     "Print volume is tracked by department"
    ],
    "5": [
     "Most printers have been retired because processes went digital",
     "Remaining printers are cloud-managed with no print servers"
    ]
   },
   "tension": "Which business process still depends on paper, and why?"
  },
  {
   "id": "EU7",
   "layer": "EU",
   "name": "Application Support (Tier 1)",
   "q": "How well can the service desk install, support and fix the organization's applications?",
   "qs": "From what you see, how well can the service desk install, support and fix the organization's applications?",
   "anchors": [
    "Application issues go straight to whoever installed the app, and nothing is written down.",
    "Some install and support documents exist and a RACI chart has been started, but coverage is patchy.",
    "All applications are listed, the top applications have maintained support procedures and Tier 1 to Tier 2 escalation is defined.",
    "The RACI chart is current, many applications are packaged for automated install by role, and scripts fix most known issues.",
    "All applications are packaged and deployable automatically, and every known Tier 1 issue has documentation and a fix script."
   ],
   "milestones": {
    "2": [
     "Install and support documents exist for some applications and are handed to the service desk",
     "A RACI chart for application support has been started",
     "Triage steps are defined for some applications"
    ],
    "3": [
     "All applications in use are listed in an application inventory",
     "Support procedures for the top 10 applications are maintained",
     "Escalation from Tier 1 to Tier 2 support is defined"
    ],
    "4": [
     "The RACI chart is current for all applications",
     "Many applications are packaged for automatic install based on role",
     "Scripts or automations fix most known Tier 1 issues"
    ],
    "5": [
     "All applications are packaged and deployable from the software management system",
     "Every known Tier 1 issue has documentation and a scripted fix"
    ]
   },
   "tension": "Which application generates the most tickets, and who really knows it?"
  },
  {
   "id": "AD1",
   "layer": "AD",
   "name": "Business Applications",
   "q": "How well are the organization's key business applications owned, provisioned, integrated and kept current?",
   "qs": "From what you see, how well are the organization's key business applications owned, provisioned, integrated and kept current?",
   "anchors": [
    "Applications were deployed quickly without planning. IT hears about access needs from users and reacts to problems.",
    "User groups are known by name and requests are handled ad hoc, with little documentation.",
    "Provisioning is documented, users are trained and know who to contact, integrations are documented and a role-based user group meets regularly.",
    "Each application has a business owner and source of truth, access is role-based, upgrades follow tested procedures and alerts flag issues.",
    "Processes are documented end to end, master data is managed, exception reports catch issues and provisioning is automated through SSO and groups."
   ],
   "milestones": {
    "2": [
     "The user group for each key application is identified",
     "Access requests are tracked, even if handled ad hoc"
    ],
    "3": [
     "The application provisioning process is defined and documented",
     "Users have basic training and know how to sign in and who to contact",
     "Troubleshooting documents exist for common issues",
     "Integrations with other systems are documented",
     "A user group, organized by role, meets regularly to review issues and enhancements",
     "Maintenance and enhancements are scheduled"
    ],
    "4": [
     "A business owner and subject-matter expert are named for each key application",
     "The source of truth for key data in each application is agreed",
     "Access is provisioned by role",
     "Upgrades follow standard test plans with defined testing roles",
     "The system sends notifications when issues occur"
    ],
    "5": [
     "Business processes in the application are documented",
     "Master data management (MDM) is in place for shared data",
     "Exception reports flag data and process issues",
     "Provisioning is automated through SSO and group-based access"
    ]
   },
   "tension": "Which application has no clear business owner?"
  },
  {
   "id": "AD2",
   "layer": "AD",
   "name": "Legacy Applications",
   "q": "How well understood and planned for are the older applications the organization still keeps running?",
   "qs": "From what you see, how well understood and planned for are the older applications the organization still keeps running?",
   "anchors": [
    "Nobody is sure which legacy applications exist, who uses them or why they're kept.",
    "Users tell IT what access they need, and problems are handled as they come up.",
    "Legacy applications are listed with their purpose, users, server, integrations and vendor contact, and access is documented.",
    "Each legacy application has a source of truth, regular evaluations and a decommission plan.",
    "A legacy application policy governs retirement, contracts are tracked and data has been migrated or archived."
   ],
   "milestones": {
    "2": [
     "Users of each legacy application are identified by name",
     "Access requests are tracked"
    ],
    "3": [
     "A list of legacy applications exists",
     "The reason for keeping each application is documented",
     "IT knows who uses each application and what server or service it runs on",
     "Vendor support contacts and integrations are documented",
     "Users know how to sign in and who to contact"
    ],
    "4": [
     "The source of truth for each application's data is understood",
     "Legacy applications are evaluated on a schedule",
     "Each legacy application has a decommission plan"
    ],
    "5": [
     "A legacy application policy sets how long apps remain, contract end dates and how to retire them",
     "Data has been migrated or archived wherever needed",
     "Retired applications are removed from infrastructure and licensing"
    ]
   },
   "tension": "Which legacy application are you most afraid to touch?"
  },
  {
   "id": "AD3",
   "layer": "AD",
   "name": "Database Management",
   "q": "How standardized, monitored, secure and current are the organization's databases?",
   "qs": "From what you see, how standardized, monitored, secure and current are the organization's databases?",
   "anchors": [
    "Databases are set up project by project, with no standards and no monitoring.",
    "Some standards exist for naming, versions and deployments, backups and retention are defined and basic monitoring runs.",
    "One management plan covers every database, including security, patching and DR, with enterprise monitoring and thresholds.",
    "Security is consistent and threat-assessed, health checks and audits are routine, versions are current and legacy instances are retired.",
    "Database practices align with business goals, predictive tools tune performance, and access and logs are actively governed."
   ],
   "milestones": {
    "2": [
     "Database instances follow some naming, versioning and deployment standards",
     "Security, backup and retention practices are defined",
     "Monitoring and maintenance jobs are in place"
    ],
    "3": [
     "One management plan covers every database instance: deployment, security, scalability, DR and patching",
     "Enterprise database monitoring runs with defined thresholds",
     "Performance bottlenecks are found and addressed proactively"
    ],
    "4": [
     "Security controls are consistent across all database instances, and key systems are threat-assessed",
     "Database health checks and audits run on a schedule",
     "Poorly performing code from vendors and contractors is reviewed and optimized",
     "Database versions are kept current and supported",
     "Legacy instances are decommissioned to free resources"
    ],
    "5": [
     "Database technology choices are aligned with IT and business goals",
     "Predictive analytics tools manage performance and capacity",
     "Access is reviewed and database activity logs are monitored",
     "Managed cloud database services are used where they fit"
    ]
   },
   "tension": "Which database would cause the most damage if it ran slow or went down at month end?"
  },
  {
   "id": "AD4",
   "layer": "AD",
   "name": "Data Engineering & Analytics",
   "q": "How reliable, governed and automated are the pipelines that move data into reporting and analytics?",
   "qs": "From what you see, how reliable, governed and automated are the pipelines that move data into reporting and analytics?",
   "anchors": [
    "Data is moved by hand or by one-off scripts, and reports conflict with each other.",
    "Pipelines meet the main business needs and some orchestration exists, but tools and versions are scattered.",
    "Pipelines are standardized on current orchestration tools, built with data quality and security controls, and documented end to end.",
    "Pipelines are monitored and measured, orchestration is complete and data lineage is tracked.",
    "Ingestion through analytics is fully automated, business users self-serve from a governed catalog and data quality is managed proactively."
   ],
   "milestones": {
    "2": [
     "Data pipelines meet the main business reporting needs",
     "An orchestration tool automates some data transfers",
     "Access to reporting data is secured",
     "Reporting frameworks are cleaned up and standardized"
    ],
    "3": [
     "Pipelines are built with data quality, standardization, security and compliance controls",
     "Legacy pipelines are migrated to the standard orchestration tools",
     "Sources, ingestion, transformations, storage and consumption are documented"
    ],
    "4": [
     "Pipeline health and performance are measured and monitored",
     "All data workflows run on the standard orchestration tools",
     "Data lineage is tracked from source to report",
     "Machine learning or automation improves pipeline efficiency"
    ],
    "5": [
     "Everything from ingestion to analytics is automated",
     "Business users self-serve from governed data models and a data catalog",
     "Data quality issues are detected and reported to business owners for correction automatically"
    ]
   },
   "tension": "Which report would two departments give different numbers for?"
  }
 ],
 "enhanced": {
  "button": "Proceed to Enhanced Report",
  "locked": "Unlocks when the leader and two stakeholder interviews are complete.",
  "title": "Enhanced Report",
  "lede": "A conversation with an AI adviser about this organization's result. It works from the full assessment report, asks what the report can't show, and recommends what to do next.",
  "consentTitle": "Before you start",
  "consent": "Starting sends the full assessment report to Anthropic's Claude API. That includes the scores, the leader's notes and the stakeholders' comments. Stakeholder comments carry no names, but with few respondents they can still point to a person. Nothing is sent until you choose to start.",
  "start": "Send the report and start",
  "review": "Review what is sent",
  "assistant": "AI Adviser",
  "you": "You",
  "placeholder": "Answer, or ask about the result",
  "send": "Send",
  "stop": "Stop",
  "retry": "Try again",
  "restart": "Start over",
  "writing": "The AI Adviser is writing",
  "disclaimer": "Replies are generated by the AI adviser from the report as it stood when this conversation began. Check anything important before acting on it.",
  "limit": "This conversation has reached its length limit. Download it, or start over.",
  "preview": "The live conversation runs on the hosted website, where the Claude API key is kept on the server. This preview shows the full brief that will be sent: the instructions, the description of the assessment, and the report.",
  "maxTurns": 20,
  "maxChars": 2000,
  "opening": "Here is the assessment report for this organization. Begin as your instructions say.",
  "instructions": "You are an IT strategy and operations consultant. You are speaking with the person who has just completed the 5iveLevels IT Maturity Assessment for their organization, usually the CIO, IT director or the facilitator who ran the interviews. You have the full assessment report below. Your job is to help them understand the result, ask what the report cannot show, and recommend what to do next.\n\nHow to run the conversation:\n- Open with two or three sentences that name the organization's maturity level and the single finding that matters most, in plain words. Then ask one question.\n- Ask one question at a time. Over the conversation, ask three to five questions the report cannot answer: what has changed recently (acquisitions, migrations, staff turnover), what has already been tried, the size of the IT team and budget, what the business most needs from IT in the next year, and any regulatory or audit pressure.\n- After each answer, connect what you heard to a specific finding in the report before you move on.\n- Keep each reply under about 200 words unless you are asked for a written summary.\n\nHow to recommend:\n- Tie every recommendation to something in the report: a domain and its score, a flag, a layer or a milestone. Say which.\n- Follow the report's Next steps and their order. Work from the foundation first. When Governance & Risk is low, do not recommend major platform purchases or migrations; say why they should wait. Respect the \"Hold off on\" line.\n- Use the milestones for the next stage of a domain as the concrete actions, since they are the assessment's own definition of progress.\n- Make actions small and concrete: something an IT team can start this month, with a named owner and a first step.\n- Give at most three actions at a time, in the order to do them.\n- When you are asked for the Enhanced Report, or once you have asked your questions, offer to write it: a one-page summary with where the organization stands, the three things that matter most, a 90-day plan with owners, what to hold off on, and the questions still open.\n\nHow to handle the evidence:\n- Be honest. Do not flatter. Say what the numbers show, including uncomfortable parts such as blind spots, and say it with respect.\n- Use only what is in the report and what the person tells you. Do not invent facts, figures, products or quotes. If you need something, ask for it.\n- Do not recalculate, adjust or dispute the scores. They come from the assessment's fixed rules.\n- Stakeholder comments are unattributed. Never guess, hint at or help work out who said what, and do not repeat a comment in a way that would identify its author.\n- If the report's status is not \"Complete\", say that the result is partial and what is missing.\n\nScope and tone:\n- Stay with IT maturity: governance, infrastructure, identity, end-user services, applications and data. You may reference frameworks such as NIST CSF 2.0, CIS Controls, ITIL 4 and COBIT where they help, but do not claim the organization is compliant with any of them.\n- Recommend practices and categories of tools, not specific vendors, unless the person names the vendors they use.\n- For legal, HR, procurement or specific security incident questions, say this is outside your role and suggest who could help.\n- Be plain and direct. Write as a trusted adviser would speak to a CIO, without jargon or sales language.\n- If asked about hiring help, say an outside facilitator is most useful when the first step stalls. Do not sell.",
  "context": "The 5iveLevels IT Maturity Assessment is a guided interview from 5iveDays Strategy. Its premise: IT maturity is measured by what holds without heroics. It rates 22 IT domains on a five-level scale (Initial, Managed, Standardized, Predictable, Optimizing), anchored in governance, and compares IT leadership's view with what IT staff and business users experience.\n\nHow it runs:\n- Scope: the facilitator can mark domains out of scope (for example physical security run by facilities). Out-of-scope domains are skipped and layer weights re-balance. The report lists which domains were assessed.\n- Round 1: one IT leader rates each domain in scope from 1 to 5 by choosing the description closest to reality today. A rating of 3 or higher must be backed by that stage's milestones.\n- Round 2: 2 or more IT staff and business users rate the same domains without seeing the leader's answers. They also say which of the leader's milestones they have seen first-hand, and whether they see the same root cause the leader named for the weakest domains.\n\nThe five layers (each layer's score is the average of its domains in scope):\n- Governance & Risk (foundation, 30% of the index): Whether change, security, recovery and compliance are controlled. The foundation everything else depends on: maturity elsewhere won't hold without it. Domains: GV1 Change Management, GV2 Cyber Security, GV3 Disaster Recovery & Continuity, GV4 IT Compliance & SOX Controls.\n- Infrastructure (platform, 20% of the index): Whether the network, servers, storage and physical systems are standardized, resilient, current and secure. Domains: IN1 Network Infrastructure, IN2 Server & Cloud Systems, IN3 Storage & Data Retention, IN4 Physical Security Systems.\n- Identity & Access (access, 15% of the index): Whether the right people get the right access at the right time, and lose it when they should. Domains: IA1 Identity & Access Management, IA2 Onboarding & Offboarding, IA3 File & Folder Access.\n- End-User Services (service, 15% of the index): Whether the tools and support people use every day are consistent, reliable and easy to use. Domains: EU1 Service Desk & IT Service Management, EU2 Endpoint Management, EU3 Mobility & Remote Work, EU4 Collaboration, EU5 Audio & Video Conferencing, EU6 Printing, EU7 Application Support (Tier 1).\n- Applications & Data (value, 20% of the index): Whether business applications and data are owned, governed, integrated and kept current. Domains: AD1 Business Applications, AD2 Legacy Applications, AD3 Database Management, AD4 Data Engineering & Analytics.\n\nThe five maturity levels (index on a scale of 1 to 5):\n- 1 Initial (1.00 to 1.49): Practices are inconsistent and crisis-driven. Systems were deployed quickly without strategic planning, and results depend on who happens to be available.\n- 2 Managed (1.50 to 2.49): A management foundation exists, but operations are disjointed. Little integration or improvement planning, little documentation and mostly tribal knowledge.\n- 3 Standardized (2.50 to 3.49): Implementation and processes are consistent and documented, with only minimal, deliberate deviations from the standards.\n- 4 Predictable (3.50 to 4.49): Systems deliver reliable results because variation is controlled. Little care and feeding is needed, and work is automated wherever possible.\n- 5 Optimizing (4.50 to 5.00): Continuously improving and watching for new developments. Regular operations need no manual intervention; people work on enhancements.\n\nHow scores are adjusted:\n- Unverified claim: a leader rating of 3 or higher scores one level lower unless at least half of that stage's milestones are in place.\n- Fragile signal: a domain rated 2 or more levels above Governance & Risk that rests on one or two people or a past project scores one level lower.\n- Composite: each domain's score is the average of the leader's adjusted score and every stakeholder rating, minus 0.5 if it is fractured.\n- Governance ceiling: the index cannot exceed the Governance & Risk score plus one.\n- Optimizing requires a Governance & Risk score of 4 or higher.\n\nFlags:\n- Blind spot: the leader scored a domain 1.5 or more above the stakeholders' average. IT leadership believes something works that others don't experience.\n- Hidden strength: the leader scored it 1.5 or more below the stakeholders' average.\n- Fracture: stakeholder ratings differ by 2 or more. Different teams or sites get different service.\n- Alignment index: 100% means every respondent gave the same rating on every domain.\n\nNext steps in the report:\n- Initial and Managed: Stabilize. IT runs on effort and individual knowledge. The work is to put governance and ownership in place before investing in new tools. Hold off on: Major platform purchases or migrations. They would automate processes that aren't defined yet.\n- Standardized: Automate and measure. Standards are in place. The work is to make results predictable: automate what's documented and measure what matters. Hold off on: Adding new platforms before the current ones are automated and measured.\n- Predictable and Optimizing: Optimize and sustain. IT runs predictably. The work is to keep improving and make sure maturity survives turnover, growth and acquisitions. Hold off on: Assuming maturity will survive key staff leaving, a merger or a major migration without deliberate work.\n- Work starts at the foundation: Governance & Risk if it scores below 3, otherwise the lowest layer.\n\nReference frameworks the domains were checked against: NIST Cybersecurity Framework 2.0, CIS Controls v8, ITIL 4, COBIT 2019 and CMMI-style maturity levels. The milestones are the assessment's own; the frameworks are context, not scoring criteria."
 },
 "roles": [
  {
   "id": "infra",
   "name": "Infrastructure & Operations",
   "prompts": [
    "What breaks most often, and what do you do to keep it running?",
    "Which systems would only you know how to recover?",
    "What would you fix first with one extra person for a quarter?"
   ]
  },
  {
   "id": "security",
   "name": "Security",
   "prompts": [
    "Which risk keeps you up at night that leadership doesn't talk about?",
    "Where do exceptions to security policy pile up?",
    "How would you know within an hour if an account was compromised?"
   ]
  },
  {
   "id": "desk",
   "name": "Service Desk",
   "prompts": [
    "What are the top three reasons people call?",
    "Which issues come back no matter how often they're fixed?",
    "What do you have to escalate that you could fix with the right access or documentation?"
   ]
  },
  {
   "id": "apps",
   "name": "Business Applications",
   "prompts": [
    "Which application has no clear business owner?",
    "Where does data get re-keyed between systems?",
    "Which upgrade has been postponed the longest, and why?"
   ]
  },
  {
   "id": "data",
   "name": "Data & Analytics",
   "prompts": [
    "Which numbers do departments argue about?",
    "Where does a pipeline depend on one person's script?",
    "What would the business ask for if they trusted the data?"
   ]
  },
  {
   "id": "finance",
   "name": "Finance & Accounting",
   "prompts": [
    "Where does IT slow down month-end close or the audit?",
    "How long does it take to get access for a new team member?",
    "What do you work around instead of asking IT?"
   ]
  },
  {
   "id": "ops",
   "name": "Business Operations",
   "prompts": [
    "When IT fails you, what does it cost the operation?",
    "Which tool would you replace tomorrow if you could?",
    "How do you find out about IT changes that affect your work?"
   ]
  },
  {
   "id": "exec",
   "name": "Executive Leadership",
   "prompts": [
    "What does IT do well that the business takes for granted?",
    "Which IT risk would you most hate to explain to the board?",
    "What would a more mature IT function let the business do that it can't today?"
   ]
  }
 ]
};

const SAMPLE = {"v": 1, "mode": "full", "sample": true, "sampleId": "it-maturity-v1", "org": "Cedar Hollow Manufacturing (fictional sample)", "leader": {"title": "IT Director", "answers": {"GV1": {"rating": 3, "ev": [2, 3, 4]}, "GV2": {"rating": 3, "ev": [4, 5, 6], "note": "MFA and EDR are everywhere now. Outside testing happens, but medium findings sit for months."}, "GV3": {"rating": 2, "ev": [], "root": "Leadership hasn't funded or prioritized it", "note": "Backups run nightly, but nobody has done a full restore test since we moved to the new backup platform."}, "GV4": {"rating": 3, "ev": [2, 3]}, "IN1": {"rating": 4, "ev": [7, 8, 9]}, "IN2": {"rating": 3, "ev": [3, 4, 5]}, "IN3": {"rating": 2, "ev": [], "root": "Each site or project built its own way", "note": "We have three file servers, two cloud drives and a lot of USB sticks on the plant floor."}, "IN4": {"rating": 3, "ev": [3, 4]}, "IA1": {"rating": 3, "ev": [3, 4]}, "IA2": {"rating": 2, "ev": [], "root": "HR and IT aren't connected, so changes arrive late", "note": "HR emails us a name on the Friday before someone starts."}, "IA3": {"rating": 2, "ev": [], "root": "Data owners aren't named, so IT decides access", "note": "Most department folders are open to everyone in that office."}, "EU1": {"rating": 3, "ev": [2, 3]}, "EU2": {"rating": 4, "ev": [8], "note": "Patching is solid. Lifecycle and local admin removal haven't started."}, "EU3": {"rating": 3, "ev": [2, 3]}, "EU4": {"rating": 4, "ev": [6, 7, 8]}, "EU5": {"rating": 3, "ev": [2, 3]}, "EU6": {"rating": 3, "ev": [3, 4]}, "EU7": {"rating": 2, "ev": [], "root": "Support depends on a few people who know the fixes", "note": "The service desk forwards almost every application issue to us."}, "AD1": {"rating": 3, "ev": [2, 3, 4, 5]}, "AD2": {"rating": 2, "ev": [], "root": "Old systems are kept because no one plans their retirement", "note": "We still run the old inventory system because a few reports only exist there."}, "AD3": {"rating": 5, "ev": [11, 12], "dep": "individual"}, "AD4": {"rating": 3, "ev": [4, 5]}}}, "stakeholders": [{"name": "Service Desk Lead", "role": "Service Desk", "kind": "IT staff", "answers": {"GV1": {"rating": 3}, "GV2": {"rating": 3}, "GV3": {"rating": 2}, "GV4": {"rating": 3}, "IN1": {"rating": 3}, "IN2": {"rating": 3}, "IN3": {"rating": 2}, "IN4": {"rating": 3}, "IA1": {"rating": 3}, "IA2": {"rating": 4}, "IA3": {"rating": 2, "note": "Half our tickets are folder access requests that need someone to guess who should approve."}, "EU1": {"rating": 3}, "EU2": {"rating": 3}, "EU3": {"rating": 3}, "EU4": {"rating": 3}, "EU5": {"rating": 2}, "EU6": {"rating": 3}, "EU7": {"rating": 2}, "AD1": {"rating": 2}, "AD2": {"rating": 2}, "AD3": {"rating": 4}, "AD4": {"rating": 2}}, "lens": {"0": "Password resets, printer problems on the plant floor, and access to department folders.", "1": "Meeting room displays. We reboot the same three rooms every week.", "2": "Application issues. We have no documentation for most of the plant systems."}, "verify": {"IN1": [7, 8, 9], "EU4": [6, 7, 8], "AD3": [11, 12]}, "confirm": {"GV3": {"v": "Y"}, "IN3": {"v": "Y"}}}, {"name": "Controller", "role": "Finance & Accounting", "kind": "Business leader", "answers": {"GV1": {"rating": 3}, "GV2": {"rating": 3}, "GV3": {"rating": 2}, "GV4": {"rating": 2}, "IN1": {"rating": 4}, "IN2": {"rating": 3}, "IN3": {"rating": 2}, "IN4": {"rating": 3}, "IA1": {"rating": 3}, "IA2": {"rating": 3}, "IA3": {"rating": 2}, "EU1": {"rating": 3}, "EU2": {"rating": 3}, "EU3": {"rating": 3}, "EU4": {"rating": 2}, "EU5": {"rating": 3}, "EU6": {"rating": 3}, "EU7": {"rating": 3}, "AD1": {"rating": 3}, "AD2": {"rating": 2}, "AD3": {"rating": 4}, "AD4": {"rating": 4}}, "lens": {"0": "Access reviews for the audit. We chase approvals by email for two weeks every quarter.", "1": "About three days, usually because the request sits waiting for someone.", "2": "We keep our own shared spreadsheet of who has access to the ERP."}, "verify": {"IN1": [7, 8], "EU4": [6, 7], "AD3": [11]}, "confirm": {"GV3": {"v": "Y"}, "IN3": {"v": "Y"}}}, {"name": "Plant Operations Supervisor", "role": "Business Operations", "kind": "Business user", "answers": {"GV1": {"rating": 2}, "GV2": {"rating": 3}, "GV3": {"rating": 1}, "GV4": {"rating": 3}, "IN1": {"rating": 3}, "IN2": {"rating": 3}, "IN3": {"rating": 2}, "IN4": {"rating": 2}, "IA1": {"rating": 3}, "IA2": {"rating": 4}, "IA3": {"rating": 2}, "EU1": {"rating": 2}, "EU2": {"rating": 3}, "EU3": {"rating": 3}, "EU4": {"rating": 2}, "EU5": {"rating": 2}, "EU6": {"rating": 2}, "EU7": {"rating": 2}, "AD1": {"rating": 2}, "AD2": {"rating": 2}, "AD3": {"rating": 3}, "AD4": {"rating": 2}}, "lens": {"0": "When the line system goes down we lose a shift's worth of tracking and re-key it from paper.", "1": "The chat tool. Half the floor never got trained, so we still text each other.", "2": "Usually when something stops working on Monday morning."}, "verify": {"IN1": [7, 8, 9], "EU4": [6, 7, 8], "AD3": [11, 12]}, "confirm": {"GV3": {"v": "Y"}, "IN3": {"v": "N", "alt": "It's not just owners. The plant systems were never set up for anyone but the person who installed them."}}}], "scope": [], "view": {"screen": "results", "dim": 0, "st": null, "sstep": 0}};
