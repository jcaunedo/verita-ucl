<!--
Created: Sep 12, 2026
Created by: Tien Mai
Last updated: Sep 12, 2026
Scope: Foundry — Automated MSA and SOW Generation.
Purpose: Define the automated pipeline for generating, reviewing, and sending MSA, SOW, SOW change-order, and MNDA documents, replacing manual assembly by the SPLs team.
-->

# Automated MSA and SOW Generation

**Last Updated:** 2026-09-12 **Owner:** Tien Mai **Status:** Draft

## 1. The Problem

SPLs team spent hours assembling MSA and SOW for each client to ensure the client information and operating terms such as payment cadence, QC practice, reporting, etc stay up-to-date and accurate. While it is manageable today, it can become a bottleneck in the future once our pool of clients scale. Time spent on manually creating contracts and legal terms could have spent on managing client relationship. This PRD aims to automate this process

### Non-Goals

What we're explicitly NOT doing in v1:

- **Client-facing portal:** SPLs and ops prepare drafts internally.
- **Legal review automation:** Rishi/legal reviews drafts and negotiated deviations before sending. The system uses approved language and flags exceptions.
- **Expert-side contractor agreements:** Client contracting is in scope; generating expert agreements and releases is not.
- **Automatic pricing calculation:** SPLs input rates, fees, and any time assumptions. Future pricing suggestions may use historical AHT and margin data.
- **MNDA customization:** No clause-selection engine or additional deal questionnaire. The only new fill-in is the company's official address.

**Trade-offs Made:**

- Ship the simpler MSA generation flow first; focus configuration work on SOWs.
- Reuse approved templates and clauses. Custom terms remain visible exceptions for review.
- ~~Keep the prospecting sequence separate from engineering priority: MNDA is signed first operationally, while MSA and SOW generation take development priority.~~

## 2. Contract Structure and Parameter Rules

### Standard and Variable Content

| Content | Treatment |
| --- | --- |
| Client details | Reusable, editable fields for entity, address, contacts, representative, and dates. |
| Standard MSA body | Preserve approved provisions covering confidentiality, IP, liability, governing law, and other framework terms. **Negotiated deviations require review.** |
| SOW commercial and operating terms | Configure scope, rates, delivery, staffing, platform, reporting, and applicable licensing terms for each engagement. |
| Conditional SOW clauses | Include approved blocks only when their applicability rules are met, such as ramp-up, baselining, QC, likeness capture, or client-platform work. |
| MNDA | Fill the company's official address into the standard template; reuse the client record.; this needs to be editable given Clayton's note on country official name & dba may differ |

The MSA establishes the relationship without committing Verita to a particular engagement. A new SOW must reference the client's executed MSA, including negotiated deviations.

### Defaults from the MSA

| Parameter | Default in MSA | How the automation handles it |
| --- | --- | --- |
| Pricing methods | Template baseline permits hourly, task, deliverable, milestone, fixed, placement, dataset license, or another agreed basis (§3.1 in [MSA reference doc](https://docs.google.com/document/d/1EZikOfCvy2Ftoi1-lTuLSr8P-SbcbK0P/edit)) | The form asks ops to select a method and billing unit and rate, then inserts them into the SOW. |
| Acceptance and rejection | The client has five business days after submission to reject specific billable units, with supporting reasons. (3.2); editable so that it can be overriden by ops case-by-case | Capture the applicable acceptance criteria and display the review rules. |
| Invoicing | Invoices are issued monthly, after the work period, unless the SOW specifies otherwise. (§3.3); editable so that it can be overriden by ops case-by-case | Show monthly invoicing as the default. Allow ops to enter an agreed alternative in the SOW. |
| Payment deadline | Payment is due within 15 days of receiving a valid invoice unless the SOW specifies otherwise. (§3.4); editable so that it can be overriden by ops case-by-case | Show 15 days as the default. Capture any agreed alternative separately from invoice frequency. |
| Delivery platform | Work takes place on Verita's platform unless the SOW specifies otherwise. Client-platform work carries additional client responsibilities. (§1.6) | Default to Verita's platform. If ops selects Client or Both, ask about platform responsibilities, access, reporting, and payment during downtime. |
| Client-platform reporting | For work on the client's platform, the client must provide access or reports covering expert activity and performance, including time, throughput, quality, and operational metrics. (§1.7) | Ask which metrics are needed, how they will be shared, in what format, and how often. Include those details in the SOW. |
| Dataset license | The standard license is for internal business use, non-exclusive, non-transferable, and non-sublicensable. It is perpetual unless the SOW specifies a license term. (§4.6) | Identify the dataset and show the standard terms. Capture any agreed license duration, restrictions, or approved exceptions in the SOW. |
| Expert removal and wind-down | The client can request immediate removal of an individual expert by written notice. Accrued fees and specified removal-related costs remain payable. (§6.10) | Preserve this provision |
| Notice to end an engagement | For termination for convenience, the client gives 30 days' written notice (§10.1) | Display the applicable notice periods. Flag proposed changes for review; |
| Wind-down costs | The MSA provides for reasonable, documented demobilization costs when the client terminates for convenience. The SOW may specify a cost window, cap, calculation method, or exclusions. (§10.1) | Ask ops to define any agreed limits or calculation rules in the SOW. |

Ramp tolerances, baselining, QC coverage, and likeness fees are engagement-specific requirements. Their values and approved wording must be defined in the SOW clause library; this MSA does not supply universal defaults for them.

## 3. Solution Overview

### Pipeline and User Flow

| Pipeline stage | Document action |
| --- | --- |
| Prospect contacted | Ops team fill the official company address into the standard MNDA. |
| MNDA signed → first meeting | Record the signed MNDA and reuse client details. |
| After first meeting | Generate the standard MSA without requiring engagement scope, rates, team size, or delivery commitments. |
| MSA signed → engagement discussion | Configure an initial SOW for one or more initial engagements, typically a pilot. |
| Steady-state delivery | Keep the executed agreements and current engagement terms available. |
| Existing engagement changes | Generate a change-order draft referencing the affected SOW and changed terms; send through DocuSign after review. |
| Additional engagement identified | Create another SOW under the existing MSA, with its own scope and terms. |

1. SPL selects or creates the client record and chooses MSA, SOW, or change order
2. The form requests only the inputs needed for that document and engagement.
3. The system fills the approved template, applies relevant clauses, and shows inherited defaults and exceptions.
4. SPL and Rishi/legal review the final document version. Editable Google Doc and PDF exports remain available for review. Include a toggle to show signatory from the required party
5. An authorized sender confirms the approved version, signer names and email addresses, signing order, and signature fields, then selects **Send via DocuSign** in Foundry. Clients and Verita sign through DocuSign.
6. Foundry syncs signing progress and links the DocuSign signature request to the exact contract version.
7. When DocuSign reports completion, Foundry saves the completed signed documents and Certificate of Completion against the client and agreement.

Keep the business pipeline separate from contract preparation and signing:

- **Preparation:** Draft / Internal review / Ready to send, maintained in Foundry.
- **Signing:** Not sent / Sent / Signed / Declined / Voided, based on the linked DocuSign request. Viewed or partially signed requests remain pending; mark **Signed only when DocuSign reports the envelope completed**, meaning all required recipient actions are finished.
- **Version history:** Superseded is a separate label linking an older version to its replacement. Preserve its original signing history. A change order does not automatically supersede the entire underlying SOW.

Saving, exporting, or approving a draft does not mark it signed. Display cancellation or expiration reasons when available; a stale sync or send error is not a signature outcome.

Technical references: DocuSign Connect updates, completion status, and document retrieval.

### Client Details and MSA Inputs

| MSA field | Type and use |
| --- | --- |
| Effective date | Date for this agreement |
| Legal entity name | Official company name; reused in the signature block |
| Jurisdiction of organization | Text |
| Registered address | Official company address; reused for MNDA |
| Legal notice email | Email |
| Billing / accounts payable email | Email |
| Authorized representative name | Text; reused in the signature block |
| Authorized representative title | Text; reused in the signature block |

The MSA flow requires these client details and the approved template version. The MNDA flow only asks for the official company address if it is not already saved. Verita signatory details come from the approved template configuration.

### Engagement Shapes

| Engagement shape | Scope to configure |
| --- | --- |
| Managed services | Verita's delivery responsibilities, staffing, QC, deliverables, and acceptance |
| Expert placement / client-directed work | Sourcing, administration, supervision, QC responsibility, and who contracts with and pays experts; direct hiring is a separate handoff condition |
| Existing dataset licensing | Dataset/version, delivery, fees, license term, and permitted uses |
| Custom dataset creation with Verita ownership | Production requirements plus explicit Verita ownership in exchange for a discounted fee and client license terms (§§1.9, 4.6) |

Support multiple engagement records or workstreams in an initial SOW and multiple pricing line items where agreed. Keep their scope, responsibilities, and terms attributable to the correct engagement.

### SOW Parameters and Applicability

> ⚠️ **Gap:** the source table for this section is wider than the captured screenshot — its rightmost "What ops need to enter" column is cut off for several rows below. Cells are transcribed as far as visible; truncated cells are marked accordingly and need to be re-pulled from the source doc.

| Parameter | Applies when | What ops need to enter |
| --- | --- | --- |
| Agreement and engagement references | All SOWs | Governing executed MSA, SOW number, engagement IDs, effective date |
| Scope and delivery | All SOWs | Objectives, services/deliverables, performance period, kickoff, schedule, dependencies, Scoping Materials reviewed |
| Domain | Relevant service work | Coding / Design / Audio / Video / Geospatial / Legal / Medical / General annotation / Other; descriptive context, with separate feature triggers |
| Pricing *(truncated)* | All SOWs | Hourly / Per-task / ~~Per deliverable / Milestone / Fixed~~ / Placement / ~~Dataset license~~ / Other; billable-unit definition, rates by role or unit, quantities, budget caps *(truncated)* or minimum commitments where agreed |
| Payment billing | All SOWs | Invoice cadence, payment period, optional prepayment *(truncated)* or escrow; show inherited defaults |
| Submission and acceptance | Verita submits work or deliverables for client review | Submission channel/schedule, unit identification, criteria and guideline version, review window, rejection *(truncated)* evidence, rework treatment |
| Staffing | Expert-based work | Roles: Annotator / QC Reviewer / Domain Expert / Project Lead; qualifications, team size, lifecycle responsibilities, request lead time, replacements |
| Expert engagement model | Expert-based work | Who directs work, contracts with experts, and pays them; approved client-direct handoff and communication channels where applicable |
| Platform and tracking | Work performed on a platform | Verita / Client / Both; identify work on each platform *(truncated)*, tracking method, and responsibility |
| Client-platform reporting | Client / Both | Metrics including FTA, completion, quality, AHT as relevant; export/access method, format, cadence, owner |
| Client-platform availability | Client / Both | Access provisioning, delay handling, standby/unavailability payment treatment |
| Unit billing details | Task, deliverable, or other unit pricing | Subtype rates, unit completion definition, treatment *(truncated)* of partial/rejected work, time assumption where relevant |
| Baselining | Baselining enabled | Duration, initial billing basis/rate, completion criteria *(truncated)*, transition to production rates |
| Ramp tolerance | Ramp-up enabled | Window, permitted quality/AHT deviations, rework and payment treatment; explicit values rather than inference from project duration |
| QC responsibility | Service work with QC | Verita / Client / Shared; coverage, sampling/routing *(truncated)*, reviewers, quality ownership, and rework responsibility |
| Likeness capture | Identifiable voice, image, or video captured | Permitted uses, license scope/duration, fees, and required release references; trigger from actual capture *(truncated)* rather than domain |
| Ownership and dataset rights | Work Product or dataset delivery | Identify client-owned Work Product versus licensed dataset components; dataset/version, ownership, discount where relevant, license term, field of use, volume, exclusivity, redistribution, and Verita resale restrictions |
| Conversion | Expert engagement or direct-hire path | Fee or formula, applicable rate/time assumption, and handoff timing (§6.3); show inherited terms |
| Termination and wind-down | Applicable service/staffing commitments | Termination notice separately from demobilization cost window, cap, methodology, or exclusions |
| Additional terms | Applicable requirement or negotiated exception | Insurance and client-specific terms, with review status *(truncated)* |

### Permutations and Validation

Maintain an explicit rule registry for every parameter: definition, field type, allowed values, applicability, requiredness, default and source clause, dependencies, incompatible selections, generated clause, template version, and approval requirement. Mark every supported combination as using approved rules or requiring review; unsupported combinations must be flagged rather than silently assembled.

- **Per-task + baselining:** Require both billing phases, unit/subtype definitions, partial/rejected-work treatment, and the transition rule.
- **Client platform + shared QC:** Require reporting/access terms and an explicit split of review and rework responsibility.
- **Existing dataset license only:** Omit staffing, ramp, and QC questions that do not apply to the purchase.
- **Placement + client-direct handoff:** Require the handoff responsibilities and conversion terms
- **Mixed scope or pricing:** Attach each rate, owner, platform, and acceptance rule to the relevant engagement, workstream, or line item.

Allow incomplete drafts. Distinguish **missing required information**, **inherited default**, **explicit override**, and **not applicable**. Block marking a draft ready for review when required inputs are missing, unresolved placeholders remain, or combinations have no supported rule.

### Template Structure

Maintain separate versioned assets: **standard MSA**, **SOW template and approved clause library**, **SOW change-order template**, and **standard MNDA**. MSA and MNDA generation fill template fields; SOW generation selects approved clause blocks from engagement inputs.

- A client record links its agreements and engagements. An MSA can govern multiple SOWs; an initial SOW can cover one or more engagements.
- Each SOW references the applicable executed MSA and its negotiated deviations. A later SOW must not overwrite unrelated engagements.
- A change order identifies its parent SOW, affected engagement, changed terms, and effective date. It changes only the identified SOW; MSA changes use a separate reviewed amendment.
- Generated drafts record input snapshots, template/clause versions, author, and review status.
- Signed documents remain immutable. Revisions and regenerated drafts create new versions; changing the client record does not alter signed copies.
- Apply the MSA's precedence rules (§1.2). Flag conflicts between structured fields and edited scope/special terms for review, using the approved SOW template's precedence rules.
- Support existing signed or client-provided agreements through linked/uploaded copies and reviewed deviations.

## 6. Implementation

**This automation will exist as an internal tool in Foundry**

- Build an internal Foundry page with reusable client records, versioned templates, a parameter registry, and conditional SOW assembly.
- Output an editable Google Doc and/or PDF for review. Send the approved final version through the connected DocuSign account, sync signing status, and save completed documents.
- Use DocuSign Connect for status updates with retry/reconciliation for missed events. Keep contract versions, envelope IDs, and recipients linked.
- Validate inputs and combinations before marking a draft ready for review. Pricing remains manually entered.

### Delivery Order

1. **MSA generation and DocuSign integration:** Populate the standard template, reuse client details, review the final version, send through DocuSign from Foundry, sync signature status, and save executed documents. Confirm the standalone-template fixes and DocuSign account/API access before release.
2. **SOW generation:** Implement approved engagement shapes, pricing line items, applicability rules, defaults, multiple initial engagements, and additional SOWs under an existing MSA. Reuse the DocuSign sending and tracking flow.
3. **SOW change orders:** Generate revisions for an existing engagement with explicit parent-SOW references and changed terms; reuse the same review and DocuSign workflow.

**MNDA companion feature:** Fill the company's official address into the existing standard template using the shared client record. Add this wherever it fits without delaying MSA or SOW delivery; operationally, MNDA signing still precedes the first meeting.

### Acceptance Scenarios

- Generate an MSA using the eight client-detail fields without requiring pricing, staffing, or a completed SOW.
- Generate an MNDA using the saved official address without an engagement questionnaire.
- Generate an initial SOW covering one or more engagements with clear scope and terms for each.
- Generate an additional SOW under the existing executed MSA without modifying previous SOWs.
- Apply the conditional rules above for per-task baselining, client-platform/shared-QC work, dataset licensing, likeness capture, and mixed pricing.
- Require an explicit value, inherited default, or not-applicable state for each applicable parameter; surface missing inputs and unsupported combinations.
- Export drafts with consistent client information and approved clauses; preserve actual signature status separately.
- Generate a change order that changes only the referenced SOW and preserves the executed original.
- Regenerate a draft with a new version and review status while retaining the prior inputs and approved/executed copies.
- Send only the reviewed final version to the confirmed recipients through DocuSign after an explicit send action.
- Keep a request pending when only one of multiple required signers has signed; mark Signed when the envelope completes.
- Sync declined or voided requests and available reasons. Preserve preparation state and business stage separately.
- Save completed PDFs, the Certificate of Completion, and signature timestamps without changing the effective date.
- Retry failed sends, syncs, and downloads without duplicate signature requests or loss of completed status.

## Open Questions @clayton @Aaditya Aswadhati @Rishi

- [x] ~~**MSA reference reviewed:** TEMPLATE MSA (sans SoW).docx supplied by Tien. It contains no tracked changes and is the source for the MSA findings in this PRD.~~
- [x] ~~**MNDA scope and priority confirmed:** Standard template; only the company's official address needs filling. MSA and SOW generation take priority.~~
- [ ] 🙋 **Standalone MSA wording:** §1.2 still says the initial SOW is attached as Exhibit A, although this version has no SOW. Rishi/Clayton to confirm the approved standalone wording and SOW reference.
- [ ] 🙋 **SOW and change-order templates:** Confirm the standalone templates and approved treatment of multiple initial engagements, scope precedence, and negotiated exceptions.
- [ ] 🙋 **Engagement shapes and permutations:** Confirm the starting taxonomy and all supported combinations; approve the parameter registry, defaults, dependencies, exclusions, and clause mapping.
- [ ] 🙋 **Client-specific paper:** Confirm how ops captures reviewed deviations when a client uses its own MSA or SOW.
- [ ] 🙋 **MNDA template reference:** Identify the standard template/version and address field for the lightweight fill-in.
- [x] ~~**DocuSign integration in scope:** Foundry sends reviewed MSA/SOW/change-order documents through DocuSign, syncs signing status, and saves completed documents.~~
- [ ] 🙋 **DocuSign account setup:** Confirm the production account, API/Connect availability, authentication approach, authorized senders, and client/Verita signing order.
- [ ] 🙋 **Existing DocuSign requests:** Confirm how already-sent requests are linked for tracking without resending, and who handles corrections or cancellations in DocuSign.
