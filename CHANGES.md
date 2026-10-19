# What changed from the source documents

This assessment was built from 20 maturity-model documents. The five level names and the stage milestones are yours. This file records what was adjusted, so you can review or reverse any of it in `assets/framework.js`.

## Across all domains

- **Structure.** The 20 documents became 22 domains in five weighted groups. Governance & Risk is the foundation: the overall result can't exceed it by more than one level.
- **Level descriptions.** Your five level descriptions were the same in every document except DR. Each domain now has its own description of each level, written from its milestones, so the answer choices differ question to question.
- **Evidence.** Stage milestones are the evidence check. A rating of 3 (Standardized) or higher holds only if at least half of that stage's milestones are in place.
- **Generalized for any client.** Removed company names (Civitas), the oil-and-gas framing and product names (Printer Logic, WSUS, RDS, Cisco, Palo Alto, VMware, Dell, SQL Server-only wording).
- **Problem statements moved.** Milestones that described a problem, such as "IT is constantly troubleshooting connection issues", became level descriptions, since a problem can't be ticked as evidence.
- **Counts fixed.** Several documents said "These 4 things" and listed 3 or 5. The tool lists the actual milestones without counts.
- **New domains.** Identity & Access Management (IA1) and Service Desk & IT Service Management (EU1).
- **Reference frameworks.** Domains were checked against NIST CSF 2.0, CIS Controls v8, ITIL 4 and COBIT 2019. These inform the wording and the AI adviser's brief; they aren't scoring criteria.

## By domain

### Governance & Risk

**GV1 Change Management** (from *Change Management*)

- Used ITIL 4 terms: change enablement, standard changes, post-implementation review.
- Added change success rate tracking at stage 4 and unauthorized-change detection at stage 5.

**GV2 Cyber Security** (from *Cyber Security*)

- Aligned to NIST CSF 2.0 (adds the Govern function) and CIS Controls.
- Added MFA at stage 2, EDR at stage 3, 24/7 MDR at stage 4, phishing-resistant MFA and just-in-time admin at stage 5.
- Replaced the 'end-user posture technical document' with measurable controls.

**GV3 Disaster Recovery & Continuity** (from *DR and CoOP*)

- Added immutable or air-gapped backups (3-2-1-1-0) and ransomware clean-room recovery.
- Added DR-as-a-service as an option for automated failover.
- Kept the reference to NIST and ISO standards in the AI brief rather than as a milestone.

**GV4 IT Compliance & SOX Controls** (from *SOX Documentation*)

- Broadened from 'SOX Documentation' to IT general controls, so it also fits clients without SOX obligations.
- Added audit outcomes and a GRC tool at stage 5.

### Infrastructure

**IN1 Network Infrastructure** (from *Network Infrastructure*)

- Removed vendor names (Cisco, Palo Alto).
- Added SD-WAN, network access control and zero-trust access, template-driven configuration and monitoring.
- Dropped 'multiple vendors are used' from stage 3; it described the starting point, not an achievement.

**IN2 Server & Cloud Systems** (from *Server Systems*)

- Renamed from 'Server Systems' to cover cloud explicitly.
- Added infrastructure-as-code, security baselines with drift detection, and cloud cost management (FinOps).
- Removed the vendor example (VMware/Dell).

**IN3 Storage & Data Retention** (from *Storage Systems*)

- Added sensitivity labeling and automated retention.
- Noted that data exposed to AI assistants depends on this domain (see the AI brief).

**IN4 Physical Security Systems** (from *Physical Security*)

- Added network segmentation for cameras and door controllers (a common attack path).
- Added automatic badge revocation from HR status.

### Identity & Access

**IA1 Identity & Access Management** (new domain)

- New domain. Your documents cover access in Onboarding and File Access, but not identity as a whole, which is now the main security perimeter.

**IA2 Onboarding & Offboarding** (from *On-Boarding and Off-Boarding*)

- Added movers (role changes) alongside joiners and leavers.
- Added same-day access removal at stage 3 and HR-system triggers at stage 5.

**IA3 File & Folder Access** (from *File Folder Access Provisioning*)

- Generalized from Active Directory to security groups, which covers Entra ID and SharePoint sites.
- Added external-sharing expiry and oversharing checks, which matter now that AI assistants can surface anything a user can open.

### End-User Services

**EU1 Service Desk & IT Service Management** (new domain)

- New domain. Your documents reference the service desk in several places, but it had no model of its own. It's often where business users feel IT maturity most directly.

**EU2 Endpoint Management** (from *User Experience and Endpoint Management*)

- Renamed from 'User Experience / Endpoint Management'.
- Replaced WSUS with centrally managed, ring-based patching (for example Intune or Autopatch, kept vendor-neutral).
- Added zero-touch provisioning, disk encryption and an elevation process to replace local admin.

**EU3 Mobility & Remote Work** (from *Mobility*)

- Updated MDM to unified endpoint management (UEM) and added app protection for personal phones.
- Added zero-trust network access (ZTNA) as the successor to VPN.
- Replaced RDS-specific wording with 'published or web apps'.

**EU4 Collaboration** (from *Collaboration*)

- Treated the desk phone as optional; calling can be soft-phone or Teams-style calling.
- Added guest-access governance and AI assistants (Copilot-style) with content governance at stage 5.

**EU5 Audio & Video Conferencing** (from *Audio and Video*)

- Rewrote problem statements ('IT is constantly troubleshooting', 'user acceptance is low') as level descriptions instead of milestones.
- Added room usage data at stage 5.

**EU6 Printing** (from *Printers*)

- Removed the product name (Printer Logic); described it as a print management platform, which includes serverless cloud printing.
- Added firmware currency and print volume tracking.

**EU7 Application Support (Tier 1)** (from *Application Tier-1 Support*)

- Removed company names and the RDS reference; publishing is covered under Mobility.

### Applications & Data

**AD1 Business Applications** (from *Application Template*)

- Built from your Application Template, which was written as a per-application model. In this tool it rates the application portfolio as a whole; a per-application version can be added later.

**AD2 Legacy Applications** (from *Legacy Apps*)

- Added removal from infrastructure and licensing on retirement.

**AD3 Database Management** (from *Database Management*)

- Generalized from SQL Server to all database platforms, including managed cloud databases.

**AD4 Data Engineering & Analytics** (from *Data Engineering*)

- Added data lineage and a governed data catalog.
- Moved 'data infrastructure is scattered' from a milestone to the level 2 description.

## Suggestions for later

- **Per-application assessments.** Your Application Template was written to be filled in for each key system. A later version could let the facilitator add named applications (ERP, CRM, field systems) and rate each one.
- **AI governance.** AI assistants appear inside Collaboration, File & Folder Access and Storage. If clients ask about AI readiness, it could become its own domain.
- **IT asset and vendor management.** Licensing, contracts and cloud spend are touched in several domains but have no domain of their own.
