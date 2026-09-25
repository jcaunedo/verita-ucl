<!--
Created: Aug 28, 2026
Created by: Julio Caunedo
Last updated: Sep 25, 2026
Scope: Verita AI professional Home/Dashboard after sign-in — onboarding, matching, task orchestration, and the Home-page previews of Applications/Offers/Contracts. Full Engagements-page detail (Applications, Offers, Contracts, Assessments, Talent Network, Training, Payments) lives in product-specs/engagements.md.
Purpose: Define the product, UX, information architecture, state, and data requirements needed to design the Dashboard.
-->

# Professional Dashboard PRD

**Status:** Draft for product and design alignment  
**Primary users:** Independent professionals and experts across various fields and professions who use Verita to find, apply to, and get paid for project-based work opportunities.

## 1. Context

- Verita: AI-powered marketplace matching independent professionals to remote, project-based work.
- Dashboard = the signed-in landing page. State-driven orchestration, not fixed widgets or a generic job board — content, order, and CTAs adapt to lifecycle state, unresolved requirements, time-sensitive events, match quality, application activity, and active engagements.
- Primary user: an independent professional whose profile, qualification, application, or engagement status may be incomplete or changing.
- Non-goals: the complete onboarding flow; full opportunity-detail/application/interview/contract/training/payment/referral flows; the employer/partner experience; match-scoring algorithm internals or exposing a numeric score; legal/identity/work-authorization/tax/background-check/payment-provider requirements; replacing dedicated marketplace, profile, applications, or work-management pages.

## 2. Experience rules

- **State before sections:** page hierarchy responds to lifecycle state — not a fixed module order.
- **Opportunity-anchored requirements:** when a task blocks a specific opportunity, keep the opportunity as the anchor and explain the required action in that context (e.g. "You're a strong match for Senior Product Designer — complete your AI interview to apply").
- **One dominant action** (§7.1): the highest-priority unresolved item gets the strongest visual emphasis; other actions remain available but must not compete equally.
- **Explain fit, not scoring machinery:** plain-language tier (e.g. "Strong match") plus a concise reason. Never expose internal scores or confidence values by default.
- **Progressive requirements:** ask for information when it becomes useful or necessary — don't front-load work-authorization, payout, tax, or training tasks before their journey stage unless policy requires it.
- **Honest status:** never imply an application, interview, offer, contract, training module, or payment has advanced when it hasn't. State whether the next action belongs to the professional, Verita, or a partner.
- **Stable navigation, adaptive content:** primary navigation stays predictable while Dashboard content changes with state.

## 3. User lifecycle model

The Dashboard must support these product-level lifecycle states:

1. Account created
2. Profile started
3. Qualification pending
4. Marketplace ready
5. Matches available
6. Application active
7. Interviewing
8. Offer received
9. Engagement onboarding
10. Active engagement
11. Engagement completed
12. Available again
13. Inactive

The lifecycle is not strictly linear. A professional may have multiple applications, retain marketplace access while working, return to qualification for a role-specific assessment, or become available again after an engagement.

> ⚠️ **Decision needed:** Define the canonical lifecycle enum, transition rules, precedence when multiple states coexist, and whether `Inactive` is user-selected, system-derived, or both.

## 4. Dashboard priority engine

The system must rank candidate Dashboard items before rendering the page.

| Priority | Class                  | Definition                                                      | Examples                                                        |
| -------- | ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| P0       | Blocking action        | Prevents the professional from advancing in an active journey   | Sign contract, complete required assessment, verify eligibility |
| P1       | Time-sensitive action  | Has an approaching deadline or requires a prompt response       | Interview requested, offer expires tomorrow, role closes Friday |
| P2       | Strong recommendation  | High-value opportunity or action that is not currently blocking | New strong match                                                |
| P3       | Profile improvement    | Improves match quality, confidence, or readiness                | Add portfolio, confirm availability, link LinkedIn              |
| P4       | Discovery or ecosystem | Useful but secondary to current work and required actions       | Browse roles, referral program                                  |

### Ranking requirements

- Rank by priority class first.
- Within a class, consider deadline, lifecycle relevance, opportunity strength, age, and whether the item was already seen.
- A P0 or P1 task should rank at the top of its module (e.g. the lead card in Next steps or Applications) — this ranking governs order within and across modules, and is independent of whether an item also qualifies as an Opportunity alert (§7.1), which is scoped to externally-initiated offer/interview/contract events only, not to task urgency generally.
- Do not let a generic profile recommendation (Next steps) outrank an application, interview, offer, contract, training, or payment deadline.
- Suppress completed, expired, superseded, and inapplicable items.
- Avoid duplicating the same underlying action in multiple modules.
- When several items share priority, use deterministic tie-breaking so the page does not reorder unpredictably.
- Preserve access to all unresolved items through a secondary task view or expandable list.

> ⚠️ **Decision needed:** Define scoring weights, tie-break rules, caps per module, refresh cadence, and whether operations can manually override ranking.

## 5. Task requirement taxonomy

Every task must have one of four requirement levels:

| Level          | Meaning                                                     | UX treatment                                                                        |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Blocking       | Must be completed now to advance in a current journey       | Highest urgency; state consequence explicitly; cannot be dismissed while applicable |
| Required later | Will be required before a known future step                 | Explain the future trigger; allow deferral until it becomes blocking                |
| Recommended    | Improves matching likelihood, readiness, or profile quality | Encourage without implying that it is mandatory                                     |
| Optional       | Adds value but has no workflow consequence                  | Low emphasis; may be dismissed                                                      |

> ℹ️ In the Next steps module specifically, `Optional` never renders as a visible badge — see [`product-specs/next-steps-card.md` §2.3](next-steps-card.md#23-precise-behavior-per-level): every task shown there must have an identifiable benefit or dependency (`Recommended`, `Required later`, or `Required now`), so a task with no established benefit simply isn't shown rather than being labeled `Optional`. This taxonomy's four levels remain the system-wide model; the restriction is scoped to Next steps' rendering rule, not a change to the taxonomy itself.

Examples from the source model:

| Task                 | During onboarding | Later consequence                                        |
| -------------------- | ----------------- | -------------------------------------------------------- |
| Expertise summary    | Required          | Required to use the matching experience                  |
| Resume               | Skippable         | May be required for some opportunities                   |
| LinkedIn             | Optional          | Remains optional unless product policy changes           |
| Phone                | Skippable         | May be required for identity, communication, or recovery |
| Availability         | Skippable         | Needed for strong matching                               |
| Rate                 | Skippable         | Needed for rate alignment and strong matching            |
| General AI interview | Skippable         | May be required for some opportunities                   |
| Work authorization   | Skippable         | Required before certain applications or engagements      |

> ⚠️ **Policy validation:** The table above reflects the source proposal, not confirmed Verita policy. Each task's requirement level and trigger must be approved by product, operations, legal, and engineering as applicable.

## 6. Information architecture

The Dashboard may draw from these modules. Visibility and order are state-dependent.

1. **Opportunity alert** — an externally-initiated opportunity event (new offer, interview requested, contract ready to sign), shown only when one exists (§7.1).
2. **Next steps** — a row of individual blocking, required-later, and recommended tasks, shown only while at least one is applicable. Filtered top-of-list surface over `product-specs/next-steps-card.md` — full card content, badge model, and visibility rule live there (§7.2).
3. **Contracts** — the professional's active and upcoming contracts, when any exist. Filtered top-of-list surface over [`engagements.md` §2](engagements.md#2-engagement-views)'s `Contracts` view/object — full field list, status model, and resolved notes live there. Titled **"Current contracts"** on Home, matching the Engagements `Contracts` → `Current` filter its `View All` opens (formerly "Active work"; renamed 2026-09-24, since `Active` is also a contract status and the module shows paused contracts too).
4. **Matching opportunities** — AI-selected opportunities with fit explanations and readiness state (§6.3).
5. **Your applications** — active applications, current stage, and next action. Filtered top-of-list surface over [`engagements.md` §2](engagements.md#2-engagement-views)'s `Applications` view — full row content lives in [`engagements.md` §3](engagements.md#3-applications). Shows the first 3 applications of Engagements → Applications → `Open`, in that filter's default sort, with `View All` routing there ([`applications-card.md` §5](applications-card.md#5-visibility-rule)). Titled **"Open applications"** on Home, matching that filter (formerly "Active Applications"; renamed 2026-09-24).
6. **Offers** — offers awaiting the professional's response, when any exist. Filtered top-of-list surface over [`engagements.md` §2](engagements.md#2-engagement-views)'s `Offers` view — full definition, fields, and resolved notes live in [`engagements.md` §4](engagements.md#4-offers-and-contracting).
7. **Discover more opportunities** — entry to broader marketplace browsing.
8. **Referrals** — secondary unless a referral event requires attention.

> ✅ **Resolved — "Contracts"/"Applications"/"Offers" name both a Home module and an Engagements view:** this follows the same pattern already established for Matches (§6.3): each Home module is a filtered, top-of-list surface over the same underlying objects as the full Engagements view ([`engagements.md` §2](engagements.md#2-engagement-views)), not a competing or differently-scoped concept. The Home module shows only what's active/upcoming/awaiting response; the Engagements view shows the full history. For Contracts specifically: when a contract is active it must outrank job discovery ([`engagements.md` §5](engagements.md#5-active-engagement)) — so unlike other Home modules, Contracts is not merely present, it is the most prominent content on the page whenever at least one exists. This supersedes the earlier "Current work" module name.
>
> ✅ **Resolved:** "Next steps" supersedes what this list previously called "Complete your profile" — it is the final, deliberately generic module name, not scoped to profile-completion tasks alone. See [`product-specs/next-steps-card.md` §1](next-steps-card.md#1-what-next-steps-is) for the full naming rationale.

### 6.1 Main navigation

Moved to `product-specs/main-navigation.md`. That doc is the source of truth for the 5 nav items (Home, Opportunities, Engagements, Earnings, Referrals), their purpose, naming rationale, naming history, and the lifecycle-sequence mental model — split out of this doc once it became clear the nav model governs more than just Home.

> ⚠️ **Decision needed:** Confirm whether "Your applications," "Contracts," and "Offers" (§6, modules 3/5/6) remain distinct Home-page modules pointing into the Engagements destination, or should be merged/renamed to match [`engagements.md` §2](engagements.md#2-engagement-views)'s view names.

### 6.2 Engagements

Moved to a dedicated PRD — see `product-specs/engagements.md`. That doc covers Engagement views (Applications, Offers, Contracts, Assessments, Talent Network), the Applications row model, Offers and contracting, Active engagement, Training, Payments, the Application status enum, and Application/Talent-Network fields. This Dashboard PRD keeps only the brief Home-module pointers in §6's list above; the `Engagements` nav item itself is defined in `product-specs/main-navigation.md`.

### 6.3 Opportunity views

**Opportunities:** everything the user can discover and pursue — the full, unfiltered set of open roles and engagements in the marketplace, independent of whether any given one fits this professional. This is the broadest term in the IA; `Matches`, `Saved`, and `Browse / Search` (below) are all views *into* this same underlying set, not separate pools of content.

**Matches:** opportunities identified as relevant to this professional based on their profile, expertise, and preferences. A Match is not a copy of the Opportunity — it's the system's relevance judgment layered on top of one (see the object model below), which is why it carries its own tier and fit reasons rather than just being a filtered list. The full relevance signal set is broader than the one-line definition above — profile, expertise, and preferences, plus availability, rate, and eligibility (detailed in the views table below).

Views within Opportunities ([`main-navigation.md` §2.2](main-navigation.md#22-opportunities)) that organize how the professional discovers work — Matches, Saved, and Browse / Search are all views into the same underlying Opportunities set defined above, not separate pools of content:

| View            | Meaning                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matches         | Opportunities the system has proactively identified as relevant to this professional, ranked by fit. Surfaced both within Opportunities and, when strong, promoted to the Home module described below. |
| Saved           | Opportunities the user has bookmarked for later consideration — moved here from Engagements ([`engagements.md` §2](engagements.md#2-engagement-views), resolved) since bookmarking starts no actual relationship with the opportunity; it is pre-engagement intent, not pursuit. |
| Browse / Search | The full open marketplace, unfiltered by personalization — the entry point named `Discover more opportunities` / `Explore opportunities` elsewhere in this doc ([`main-navigation.md` §2.2](main-navigation.md#22-opportunities), resolved). |

A `Match` additionally carries a readiness state independent of the opportunity's own data (§9.4 Match fields already models this distinction).

Object model:

`Opportunity` → discoverable work
`Match` → system-identified relevance between a professional and an opportunity
`Saved` → user bookmark relationship (moved from Engagements, [`engagements.md` §2](engagements.md#2-engagement-views), resolved)

**Home module — "Matching opportunities":** this is the Home-page surface for the Matches view (§6 module 4), not a separate destination. It promotes the professional's strongest current matches — same underlying `Match` objects as the full Matches view within Opportunities, just the top few, ranked per the priority engine (§4). Selecting one takes the professional to the same match detail used within Opportunities.

> ⚠️ **Decision needed:** Confirm the cap on matches shown in the Home "Matching opportunities" module (e.g. top 2–4) versus the full, paginated Matches view within Opportunities, and whether "Browse / Search" needs its own named view or stays an unstructured entry point into Opportunities.

### State-driven hierarchy

| Dominant state                         | Primary content order                                                                    | Primary intent                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| Profile started                        | Next steps → Matches preview or discovery                                                | Reach useful matching readiness     |
| Qualification pending                  | Next steps → Qualification status → Relevant matches                                     | Complete qualification with purpose |
| Marketplace ready / matches available  | Best match or Next steps → Matches → Applications → Profile improvements                 | Evaluate and apply                  |
| Application active / interviewing      | Next application action → Applications → New matches → Profile improvements              | Advance active applications         |
| Offer received                         | Opportunity alert → Offer summary → Applications → New matches                           | Review before expiration            |
| Engagement onboarding                  | Contracting/onboarding action → Training/setup → Engagement summary                      | Become ready to work                |
| Active engagement                      | Current engagement → Required actions → Milestones/training/payments → New opportunities | Deliver current work                |
| Engagement completed / available again | Completion or payment status → Confirm availability → New matches                        | Close out and re-enter matching     |
| Inactive                               | Availability/status action → Relevant history                                            | Restore or manage availability      |

> ✅ **Resolved:** rows above use `Next steps` for onboarding/qualification-stage dominance and `Opportunity alert` for externally-initiated offer/interview/contract events, matching the §7.1 rename — no row here should read "Next best action" as a named module going forward.

### Desktop layout guidance

- Keep the dominant module (Opportunity alert when present, otherwise Next steps or the top lifecycle content) in the first meaningful viewport.
- Use a primary content column for the dominant journey and a secondary region only for lower-priority context.
- Do not make every module a same-sized card grid.
- Allow opportunity and application cards enough width for fit reason, status, key terms, and action.
- Keep section headings descriptive and action-oriented.

### Mobile layout guidance

- Render a single prioritized column.
- Place the dominant action before secondary summaries.
- Preserve opportunity context when a requirement blocks application.
- Avoid horizontal card carousels when they hide status or create ambiguous ordering.
- Keep primary CTAs reachable without obscuring content or system navigation.

## 7. Key Dashboard experiences

### 7.1 Opportunity alert

> ✅ **Resolved (renamed from "Next best action"):** this module is scoped specifically to **externally-initiated opportunity events** — an offer received, an interview requested, a contract ready to sign — not to onboarding or profile-improvement tasks, and not to a generic "whatever is currently most urgent" slot. The distinction: Next steps (§7.2 / `next-steps-card.md`) holds tasks the professional does *to themselves* — building or completing their profile, self-directed and onboarding-flavored. An Opportunity alert is something that happens *to* the professional — a partner or client (or Verita on their behalf) has taken an action that produces real work, which is the core outcome Verita exists to deliver. That category difference, not urgency alone, is why it gets a dedicated top-of-page module rather than being folded into or ranked alongside Next steps. A Next steps task can still be urgent (`Blocking` per §5) without ever qualifying as an Opportunity alert — urgency and category are independent.

Opportunity alert is a single-emphasis module: it surfaces exactly one opportunity event at a time, sourced from the Offers or Applications objects ([`engagements.md` §2](engagements.md#2-engagement-views)), never from Next steps.

Qualifying events (non-exhaustive):

- A new offer has been received.
- An interview has been requested.
- A contract is ready to sign.

When the module is populated, it must include:

- Event title (e.g. "New offer for you" — see the heading copy rule below).
- The opportunity, partner, and key terms (compensation, engagement type) when applicable.
- Deadline or expiration when material (e.g. an offer's expiration date/time).
- One primary CTA (e.g. "View offer").

**Offer heading copy.** When the event is a new offer, the module heading reads **"New offer for you"**. If the module ever shows more than one offer at once, the heading counts them with a numeral: **"2 new offers for you"**, **"3 new offers for you"**, and so on. It never reads "1 new offer for you" — a single offer always uses the singular heading with no number.

| Offers shown | Heading               |
| ------------ | --------------------- |
| 1            | New offer for you     |
| 2 or more    | {n} new offers for you |

The count is the number of offers rendered in the module, not the professional's total open offers — offers that aren't shown here are counted in Engagements → Offers ([`engagements.md` §4.1](engagements.md#41-offer-filters)), not in this heading. When an offer is declined from the module, the heading updates to the new count; declining the last one closes the module ([`engagements.md` §4.1](engagements.md#41-offer-filters): offers are declined from the row's `···` menu).

> ✅ **Copy fix (2026-09-25):** "You have a new offer" → "New offer for you". The new heading leads with what arrived and reads as a section title, matching the Dashboard's other module headings.

> ℹ️ Today the module shows a single offer (single-emphasis, above), so only the singular heading appears. The plural form applies only if the multi-offer decision below lands on showing several offers together.

If no qualifying event exists, the module does not render — it must not be replaced with a placeholder or generic empty state; the Dashboard falls through to its next-highest content (Contracts, Applications, Matches — see §7.6's resolved default-empty-state note for what renders when none of those have content either).

> ⚠️ **Decision needed:** confirm the full, exhaustive list of qualifying event types (does a returned assessment result or a rejected application ever qualify, or only forward-moving opportunity events?), and confirm behavior when more than one qualifying event exists at once (e.g. two pending offers) — does the module show the single most urgent one, stack multiple, or route to a list?

### 7.2 Next steps

Moved to `product-specs/next-steps-card.md`. This Dashboard PRD's §6 module list (item 2) and §7.1 (distinction from Opportunity alert) reference this module; the full card content, requirement-level badge model, and visibility rule now live in that doc.

### 7.3 Matching opportunities

The Home module and Opportunities → Matches view (§6.3) share the same card content.

| Field                       | Content                                                                                                                                                   | Source       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Opportunity title           | The role or engagement name.                                                                                                                              | §11          |
| Partner                     | Partner name or an approved anonymized label, per partner-visibility policy.                                                                              | §11          |
| Opportunity type            | Engagement or Talent Network — shown as a plain-language badge. Engagement terms (time commitment, duration) are separate content, not part of this badge. | §11.1        |
| Match tier                  | Plain-language fit tier (e.g. "Strong match"). Never the internal numeric score.                                                                          | §9.4, §2  |
| Fit explanation             | Concise reason grounded in supported professional and opportunity signals — what the professional will recognize as evidence, not scoring machinery.      | §9.4, §12   |
| Compensation & terms        | Compensation, engagement type, remote/location constraints, hours, and duration, when available.                                                          | §11          |
| Deadline / urgency          | Shown only when material to the decision (e.g. a closing date) — not shown as a generic freshness indicator.                                              | §11          |
| Application-readiness state | One of: not a fit, potential fit with missing data, matched but blocked, ready to apply (§FR-4).                                                          | §FR-4, §9.6 |
| Missing-requirement summary | When blocked, names the specific missing requirement inline on the card rather than requiring a separate screen (§7.5 contextual blocker).               | §7.5, §9.4 |
| Saved state                 | Whether the professional has bookmarked this match — surfaces the card in the Saved view (§6.3) and lets the affordance be toggled from the card itself. | §9.4, §6.3 |
| Recommended action          | The single primary CTA for this card's current state.                                                                                                     | —            |

Possible recommended actions:

- Learn more
- Apply
- Complete requirement to apply
- Finish assessment
- Resume application
- Interview
- Review offer
- Start onboarding

The system should not expose the internal numeric match score by default.

> ⚠️ **Decision needed:** Confirm whether Deadline/urgency and the Missing-requirement summary should always render on the card or only when applicable (to avoid empty/placeholder states crowding the default card), and confirm the Saved toggle's interaction pattern (icon affordance vs. menu action) against §13 motion requirements.

### 7.4 Matching opportunities: empty states

The Matching opportunities module (§7.3) has no matches to show under two different circumstances, and they must not share the same copy or visibility rule.

> ⚠️ **Gap:** the general empty-state guidance in FR-9 ("No matches: explain what Verita is doing and recommend the most useful profile or preference action") does not yet distinguish *when* that empty state should appear versus stay hidden, or that a returning professional needs different copy than a first-time one. This section supersedes FR-9's one-line treatment with the fuller model below.

**Visibility logic:**

| Professional state                                | Behavior                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| New professional, matching-readiness not yet met     | Hide the module entirely. Prioritize Next steps and profile completion (§4, §6). |
| Matching-readiness met, matching not yet run         | Hide the module; do not show an empty state prematurely.                              |
| Matching in progress                                 | Show a loading/processing state (§15), not "No matches yet."                          |
| Matching completed, zero results                     | Show **No matches yet** (below), with a constructive next action.                     |
| Matching completed, results available                | Show the matched opportunities (§7.3's card content).                                 |
| Professional has previously seen matches, none active now | Show **No new matches** (below) instead of "No matches yet."                     |

> ✅ **Resolved — matching readiness is not the same threshold as profile completion:** a professional can become eligible for matching without completing every profile field. Rather than gating this module on an arbitrary profile-completion percentage (already discouraged generally — §21, "Is `Profile completeness` useful..."; §22 defers an exposed completeness percentage), the module's visibility is gated on a **minimum matching-readiness threshold** — the specific set of fields matching actually requires (§9.6's `Application readiness` derivation is the closest existing analog, though that's opportunity-specific readiness rather than this global matching-eligibility gate). Once that threshold is met and matching has run, the module can render its result — zero or more matches — rather than waiting on full profile completion.

**Empty-state copy:**

| State | Title | Body | CTA |
| --- | --- | --- | --- |
| First-time, zero results | No matches yet | We haven't found opportunities that align with your profile. Keep your experience and preferences up to date to improve future matches. | Review your profile |
| Previously had matches, none currently available | No new matches | *(Copy not yet drafted — same constructive framing as "No matches yet," but must not read as a first-time message.)* |  🙋 See open question below. |

> ✅ **Resolved — empty-state copy avoids implying fault or a guarantee:** "No matches yet" deliberately does not suggest the professional did something wrong, and does not promise that completing their profile guarantees matches — it frames profile/preference upkeep as improving *future* matches, not as a fix for a failure.
>
> ✅ **Resolved — first-time vs. returning empty states must be visually and textually distinct:** a professional who has already seen matches before, but currently has none available, is in a materially different situation (temporary unavailability) than a professional who has never had a match (first-time discovery). Reusing "No matches yet" for both would misrepresent the returning professional's history. `No new matches` is the distinct state for the second case.

### 7.5 Contextual application blocker

When the professional is a match but cannot apply:

- Keep the role visible.
- Name the missing requirement.
- Explain that completing it enables the application.
- Route the CTA directly to the correct task.
- Return the professional to the role or resume the application after task completion.
- Recalculate readiness immediately or explain any processing delay.

### 7.6 Applications, Offers, Active engagement, Training, Payments

Moved to [`product-specs/engagements.md` §3–7](engagements.md#3-applications). This Dashboard PRD's §6 module list (items 3, 5, 6) covers only the brief Home-page previews of these; the full row content, Offer definition/fields, active-engagement summary, Training, and Payments requirements now live in that doc.

> ✅ **Resolved — Applications is the Dashboard's default empty state, not a separate "no active work" placeholder:** [Empty State — A](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5642-2215) confirms that when a professional has no active engagement yet, the Dashboard does not fall through to a generic "no active work" placeholder (the phrase used earlier in §7.1 before this note) — there is no such separate empty state to design or build. Applications is the natural step before an active Contract exists, so it is the module that carries the empty condition itself: the **Your applications** module (§6 item 5) always renders in this state and shows its own empty-state content inline — title "No applications yet," description "Find opportunities that fit your expertise and interests.," and a single primary CTA "Discover opportunities" routing into opportunity discovery ([`main-navigation.md` §2.2](main-navigation.md#22-opportunities)). This reuses [`applications-card.md` §5.1](applications-card.md#51-zero-state-on-engagements--applications)'s zero-state pattern for the Engagements → Applications destination, applied here to the Home module instead of a bespoke Home-specific empty state.
>
> Once an application progresses far enough to become an active Contract, the **Contracts** module (§6 item 3) takes over as the dominant module per its existing "outranks job discovery" resolution above — the Applications module's empty state is specifically the pre-Contract, pre-any-application starting point, not a state that persists once real engagement activity exists.
>
> This resolves the dangling "no active work empty state" reference in §7.1 — no such state is defined or needed separately from the Applications module's own empty content.

### 7.7 Referrals

Referrals remain secondary to the professional's work journey. Promote them when there is a meaningful event, such as an accepted referral or pending reward. Otherwise provide a lower-priority entry point.

## 8. Functional requirements

### FR-1: Personalization

- The Dashboard must address the signed-in professional using available account data.
- Content must be calculated for the current user and must not leak another user's profile, matches, applications, or engagement information.

### FR-2: Lifecycle-aware composition

- The Dashboard must determine the dominant lifecycle state.
- It must show, hide, and reorder modules based on that state.
- It must support concurrent applications and engagements without reducing the user to a single irreversible state.

### FR-3: Task generation and management

- Tasks must be generated from current data and workflow triggers, not only manually defined cards.
- Tasks must support status, priority, requirement level, blocking state, relationship, due date, CTA, and completion.
- Dismiss and snooze must be available only when allowed by task policy.
- Completing a task must update or remove its Dashboard representation.

### FR-4: Matching and eligibility

- Match recommendations must consider approved signals such as expertise, skills, experience, domain, rate, availability, location, and work authorization.
- Eligibility and match quality must remain distinct.
- The Dashboard must distinguish `not a fit`, `potential fit with missing data`, `matched but blocked`, and `ready to apply`.

### FR-5: Application readiness

- The system must calculate readiness per opportunity.
- Readiness must account for global requirements and opportunity-specific requirements.
- A professional may be ready for one role and blocked for another.
- The CTA must reflect the current readiness and application state.

### FR-6: Status synchronization

- Dashboard status must reflect authoritative application, interview, offer, engagement, training, and payment systems.
- Stale data must not produce an invalid CTA.
- When synchronization is delayed, show a processing state instead of contradictory content.

### FR-7: Notifications and lifecycle events

- The system must ingest lifecycle events such as new match, interview request, stage change, offer, missing requirement, expiring role, assigned training, ready contract, payment, stale availability, and referral reward.
- Event-driven items must link to their related entity and expire or resolve appropriately.

### FR-8: Availability freshness

- Store when availability was last confirmed.
- Derive a freshness state.
- Prompt the professional to reconfirm stale availability without silently changing it.

### FR-9: Empty and fallback states

- No matches: explain what Verita is doing and recommend the most useful profile or preference action.
- No applications: do not render an empty tracker as the dominant module.
- No urgent tasks: confirm that nothing requires attention and promote the best relevant next step.
- No active engagement: hide current-work modules.
- Data error: preserve navigation, explain the issue, and provide retry or support as appropriate.

## 9. Core data model

### 9.1 Entities

- `User`
- `ProfessionalProfile`
- `Expertise`
- `Skill`
- `WorkPreference`
- `Availability`
- `CompensationPreference`
- `Verification`
- `Assessment`
- `Task`
- `Opportunity`
- `Match`
- `Application`
- `Interview`
- `Offer`
- `Engagement`
- `Training`
- `Payment`
- `TalentNetworkMembership`
- `Referral`
- `Notification`

### 9.2 Relationships

This diagram shows entity ownership: which object each `User` owns directly, and what each of those objects in turn owns. It answers "what data hangs off what" — not the same question as [`engagements.md` §2](engagements.md#2-engagement-views)'s Engagement views, which group these same objects into user-facing navigation (this diagram's `Engagements` node is a data-ownership grouping, not that doc's `Engagement views` concept).

How to read it:

- Each line is an entity from §9.1.
- Indentation and `├──`/`└──` mark a child owned by the entity above it (e.g. `Expertise`, `Skills`, `WorkPreferences`, `CompensationPreference`, and `Availability` all belong to one `ProfessionalProfile`).
- A childless entity (e.g. `Verifications`, `Tasks`, `Referrals`) is a direct, flat collection on `User` with no further nesting shown here.
- The tree tracks ownership/containment only — it is not a sequence or lifecycle order, and a line's position top-to-bottom carries no priority meaning (contrast with §4's priority classes or [`engagements.md` §3](engagements.md#3-applications)'s lifecycle sequence).

```text
User
├── ProfessionalProfile
│   ├── Expertise
│   ├── Skills
│   ├── WorkPreferences
│   ├── CompensationPreference
│   └── Availability
├── Assessments
├── Verifications
├── Tasks
├── Matches
│   └── Opportunity
├── Applications
│   └── Opportunity
├── Interviews
├── Offers
├── Engagements
│   ├── Training
│   └── Payments
├── TalentNetworkMemberships
│   └── Opportunity
├── Referrals
└── Notifications
```

### 9.3 Task fields

At minimum:

| Field                                       | Purpose                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`                                        | Stable task identity                                                               |
| `type`                                      | Behavior and routing, such as `resume_upload`                                      |
| `title` / `description`                     | User-facing guidance                                                               |
| `status`                                    | Pending, in progress, completed, expired, or superseded                            |
| `priority`                                  | P0–P4 ranking class                                                                |
| `requirement_level`                         | Blocking, required later, recommended, or optional                                 |
| `blocking_reason`                           | Consequence of not completing the task                                             |
| `related_entity_type` / `related_entity_id` | Opportunity, application, offer, engagement, training, payment, or profile context |
| `trigger`                                   | Event or condition that created the task                                           |
| `cta_label` / `cta_destination`             | Action and route                                                                   |
| `created_at` / `due_at` / `completed_at`    | Timing                                                                             |
| `dismissible` / `snoozable`                 | Allowed user controls                                                              |
| `estimated_completion_time`                 | Optional effort guidance                                                           |
| `sort_priority`                             | Deterministic ordering within a class                                              |

### 9.4 Match fields

At minimum:

- User and opportunity IDs.
- Status and user-facing tier.
- Internal score and confidence, if implemented.
- Skills, experience, domain, rate, availability, location, and authorization alignment.
- Missing requirements.
- Structured recommendation reasons with evidence provenance.
- Created and refreshed timestamps.
- Viewed, saved, dismissed, dismissal reason, and interested states.
- Recommended action.

### 9.5 Application fields and status enum

Moved to `product-specs/engagements.md` [§8](engagements.md#8-application-status-enum) (status enum) and [§9](engagements.md#9-application-fields) (fields).

### 9.6 Derived values

The Dashboard should derive rather than independently store:

- **Profile completeness:** completed relevant profile attributes ÷ relevant profile attributes.
- **Application readiness:** all global requirements needed for application are satisfied.
- **Role eligibility:** global requirements + opportunity requirements + geography + authorization.
- **Strong matches:** open matches above the approved recommendation threshold.
- **Action count:** unresolved, applicable tasks in the current lifecycle.
- **Dominant lifecycle state:** highest-precedence current journey state.
- **Availability freshness:** elapsed time and policy since last confirmation.

Derived values must identify their source data and calculation version for debugging and analytics.

## 10. Profile and matching data

The professional profile may include:

- Identity and contact status.
- Location, country, timezone, and work authorization.
- Expertise summary, profession, seniority, experience, domains, specialties, skills, and industries.
- Management experience and IC/management preference.
- Resume, portfolio, and LinkedIn status.
- AI-generated profile and user confirmation.
- General and opportunity-specific assessments.
- Work types, availability, hours, schedule, and exceptions.
- Desired and minimum rates, fixed-project minimum, currency, and negotiability.
- Remote, hybrid, on-site, travel, company-stage, industry, project-duration, working-style, collaboration, client-facing, leadership, and team-size preferences.
- Negative preferences and exclusions.

Internal confidence or evaluation data may improve matching but must not be shown unless a specific user benefit and explanation are defined.

> ⚠️ **Privacy and fairness review:** Determine which profile and assessment signals may be used for matching, which require consent, how users can review or correct them, and how bias, provenance, retention, and explainability will be managed.

## 11. Opportunity data required by the Dashboard

At minimum:

- ID, title, partner, and partner-visibility policy.
- Opportunity type (§11.1) and engagement terms (time commitment, duration — see [`contract-card.md` §3.2](contract-card.md#32-engagement-terms)).
- Authorization constraints. Location is not a modeled dimension for Verita's marketplace (§11.1).
- Compensation type, range, currency, and expected hours.
- Duration and start date.
- Required and preferred expertise, skills, seniority, and industry.
- Openings, deadline, status, date posted, and urgency.
- Requirements needed to apply or begin the engagement.

Internal application counts or capacity should not be shown unless product explicitly approves their meaning and user value.

### 11.1 Opportunity types

These describe the kind of Opportunity being offered before a professional applies — not the status of a secured Engagement (§6.2).

**Simplified from a three-way taxonomy to a two-way distinction.** `Project-based` and `One-time` previously stood as separate "types," but for Verita every engagement is one-off and contract-based — classifying them into named categories the way a traditional job board classifies employment type (Contract vs. Project-based vs. etc.) didn't provide meaningful differentiation, since every engagement here already is a contract. The only distinction that actually matters at the Opportunity-type level is whether the Opportunity offers secured work at all:

| Type           | Definition                                                                                                                             | Example                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Engagement     | Secured, contract-based work — a defined project, ongoing capacity, or a single scoped deliverable. Its actual terms (time commitment, duration) are shown as [`contract-card.md` §3.2](contract-card.md#32-engagement-terms)'s Engagement terms, not as a further sub-type here. | Product Designer for 20 hrs/week for 3 months; or Review 50 AI-generated designs for $300 |
| Talent Network | No immediate project. The professional joins a qualified pool so Verita can match or invite them when relevant work becomes available. | Join the Product Design expert network        |

`Project-based` and `One-time` are retired as Opportunity types — they're now differences in engagement terms (time commitment/duration), not separate categories. `Talent Network` is unaffected: it marks a genuinely different state (no secured work yet), not a terms classification.

> ⚠️ **Decision needed:** Confirm naming for the `Engagement` type above (a placeholder label, not yet product-reviewed), and how it maps to application readiness, contracting, and Dashboard treatment before implementation.

## 12. UX content requirements

- State the action before supporting detail.
- Explain why an action matters and what it unlocks.
- Use specific nouns: `Complete interview`, `Review offer`, `Sign contract`.
- Avoid generic CTAs such as `Continue` when the destination can be named.
- Distinguish recommendations from requirements.
- Distinguish `waiting on Verita` or `waiting on partner` from `action required`.
- Describe match rationale using evidence the professional recognizes.
- Do not imply certainty when the recommendation is probabilistic.
- Do not present internally generated profile or assessment claims as user-confirmed facts.
- Show deadlines with date, time, and timezone when the time is material.

## 13. Interaction and motion requirements

- Completing a task should update related readiness and CTA state without disorienting reflow.
- When a blocking action resolves, the related opportunity should transition to its new state and remain easy to find.
- Use restrained layout transitions to explain card removal, reordering, or expansion.
- Do not animate every data refresh or routine status poll.
- Do not delay action availability for animation.
- Respect reduced-motion preferences and preserve equivalent state feedback without motion.

## 14. Accessibility requirements

- Meet WCAG 2.2 AA for the Dashboard experience.
- Preserve a logical heading hierarchy and landmark structure.
- Make priority, requirement level, match tier, stage, and status understandable without color alone.
- Ensure all actions are keyboard accessible with visible focus.
- Announce meaningful async status changes without repeatedly interrupting assistive-technology users.
- Provide accessible names that include enough context to distinguish repeated CTAs, for example `Apply to Senior Product Designer`.
- Do not encode progress only as a visual bar; provide status text.
- Do not use motion as the only indication of completion, removal, or reprioritization.
- Maintain readable touch targets, contrast, zoom behavior, and responsive reflow.
- Keep deadlines and compensation understandable to screen readers, including currency, rate unit, date, time, and timezone.

## 15. Loading, error, and edge states

Design must cover:

- Initial Dashboard loading.
- Partial loading when one data source is delayed.
- Newly completed onboarding with no generated matches yet.
- Match generation or assessment evaluation in progress.
- One or more stale matches.
- Opportunity closed while the professional is viewing or completing a blocker.
- A previously required task becoming inapplicable.
- The same task blocking multiple opportunities.
- Multiple P0 or P1 actions.
- Conflicting deadlines.
- Concurrent active engagement and active applications.
- Application updated by a partner while the page is open.
- Offer expired or withdrawn.
- Training assigned after engagement starts.
- Payment issue containing sensitive details.
- Professional changes availability to unavailable.
- Data unavailable, unauthorized, or out of sync.

## 16. Analytics events

Instrument at minimum:

- `dashboard_viewed` with lifecycle state and rendered module set.
- `next_best_action_impression` and `next_best_action_clicked`.
- `task_impression`, `task_clicked`, `task_snoozed`, `task_dismissed`, and `task_completed`.
- `match_impression`, `match_viewed`, `match_saved`, `match_dismissed`, and `match_apply_clicked`.
- `application_status_viewed` and `application_next_action_clicked`.
- `offer_action_clicked`, `engagement_action_clicked`, `training_action_clicked`, and `payment_action_clicked`.
- `availability_reconfirmation_prompted` and `availability_reconfirmed`.
- `dashboard_error_shown` with safe error classification.

Events must include the priority class, lifecycle state, related entity type, and surface position where applicable. Do not include sensitive profile, assessment, authorization, payment, or partner-confidential values in analytics payloads.

## 17. Acceptance criteria

### State and hierarchy

- Given a professional with a pending offer, interview request, or contract-ready-to-sign event, the Dashboard displays it as the dominant Opportunity alert (§7.1).
- Given a time-sensitive interview or offer event and a generic profile recommendation (Next steps), the Opportunity alert ranks above Next steps.
- Given an active engagement, current work appears before new opportunities.
- Given no applicable content for a module, the module is hidden or replaced by a purposeful state rather than an empty shell.

### Matching and readiness

- A match explains fit using approved evidence and does not expose an internal numeric score by default.
- A role-specific blocker appears in the context of that role.
- Completing the final requirement updates the role CTA to `Apply` or the next valid application action.
- Eligibility and match strength are represented as distinct states.

### Tasks

- Every task has a requirement level and consequence.
- A blocking task cannot be dismissed while it remains applicable.
- A recommended or optional task does not use mandatory language.
- Completed, expired, superseded, or inapplicable tasks do not remain actionable.

### Applications and work

- Every active application shows its current stage, last update, next action, and next-action owner.
- Offers and expiring actions receive time-sensitive priority.
- Training and payout setup appear only when relevant to an engagement or required milestone.

### Quality

- Desktop and mobile designs cover the lifecycle states and edge cases listed in this PRD.
- Keyboard, screen-reader, reduced-motion, zoom, and responsive behavior are defined and verified.
- Analytics contain no prohibited sensitive values.

## 18. Design deliverables

The UX/UI design phase should produce:

1. A lifecycle-to-Dashboard state map.
2. A priority and collision matrix for P0–P4 items.
3. Low-fidelity layouts for each dominant lifecycle state.
4. Responsive desktop and mobile layouts.
5. Component states for Opportunity alert, task, match, application, offer, engagement, training, payment, notification, and empty/error states.
6. A match/readiness state matrix including eligible, blocked, processing, closed, saved, dismissed, and applied.
7. Interaction flows for completing a contextual blocker and returning to the opportunity.
8. Content examples for every requirement level and next-action owner.
9. Accessibility annotations and keyboard order.
10. A prototype covering incomplete profile → strong match → blocker → apply → interview → offer → engagement onboarding → active work.

## 19. Dependencies

- Canonical professional profile and preference schema.
- Opportunity and requirement schema.
- Match generation, tiering, rationale, and refresh behavior.
- Application, interview, offer, and engagement status integrations.
- Task generation and priority service.
- Identity, authorization, payment, tax, background-check, and training providers as applicable.
- Notification/event infrastructure.
- Analytics taxonomy and privacy review.
- Operations tooling for exceptions, overrides, and support.

## 20. Risks

- Incorrect prioritization can hide a deadline or block progression.
- Poor match explanations can reduce trust or reveal sensitive/internal logic.
- Stale availability and opportunity data can create invalid recommendations.
- Over-personalization can make navigation or page order feel unstable.
- A completeness percentage can encourage irrelevant data collection or falsely imply readiness.
- Multiple concurrent journeys can make a single lifecycle state misleading.
- Assessment and eligibility data can introduce privacy, fairness, and legal risk.
- Contextual tasks can become repetitive if the same underlying requirement is rendered once per opportunity.
- Partner status latency can create contradictory next actions.

## 21. Open questions

### Product and policy

- 🙋 Which onboarding fields are truly required, skippable, recommended, or optional?
- 🙋 Which requirements apply globally, per opportunity, before engagement, or before payment?
- 🙋 Can a professional browse, save, or express interest before they are eligible to apply?
- 🙋 Which partner and client names may be shown?
- 🙋 Is `Profile completeness` useful to professionals, or should the product show only specific improvements?
- 🙋 When should a professional be considered inactive or unavailable?

### Matching

- 🙋 Which signals drive matching, and which are hard eligibility gates?
- 🙋 What defines Strong, Good, and Possible match tiers?
- 🙋 How should missing or low-confidence profile data affect recommendations?
- 🙋 What rationale is safe, accurate, and useful to expose?
- 🙋 How quickly are matches refreshed after profile, rate, or availability changes?

### Priority engine

- 🙋 What are the exact rank weights and tie-break rules?
- 🙋 How are multiple deadlines compared?
- 🙋 Can users pin, snooze, or reorder tasks?
- 🙋 Can operations promote, suppress, or correct an item?
- 🙋 How many items appear before the user must open a full task view?

### Applications and engagements

Moved to [`product-specs/engagements.md` §12](engagements.md#12-open-questions), plus one Home-specific question retained here:

- 🙋 What engagement progress, earnings, and performance data is appropriate for Home (vs. the full Engagements page)?

### UX/UI

- 🙋 What is the exact "No new matches" copy (§7.4) for a professional who has previously seen matches but currently has none — needs the same constructive framing as "No matches yet" without reading as a first-time message.
- 🙋 Should the Opportunity alert be a dedicated hero, the first item in a feed, or a stateful summary panel?
- 🙋 How much application and engagement history belongs on Home versus dedicated pages?
- 🙋 What is the navigation model for Dashboard, Opportunities, Applications, Work, Profile, and Referrals?
- 🙋 Should match reasons be always visible or progressively disclosed?
- 🙋 What content order feels stable enough while still adapting to lifecycle changes?

### Technical and operations

- 🙋 Which proposed entities and fields already exist?
- 🙋 What freshness guarantees are available for partner status and opportunity data?
- 🙋 What is the fallback when match rationale or priority calculation fails?
- 🙋 How are task deduplication, supersession, and audit history handled?
- 🙋 What administrative tools are required to diagnose a wrong task or status?

## 22. Recommended MVP boundary

The MVP should validate the central orchestration model before implementing every downstream domain.

Include:

- Dominant lifecycle state.
- Opportunity alert.
- Next steps.
- Generic task model with P0–P4 priority and four requirement levels.
- Matches with plain-language fit explanation.
- Opportunity-specific application readiness and blocker handling.
- Active application summaries with next-action owner.
- Profile improvements and availability freshness.
- Empty, loading, processing, stale, and error states.
- Core analytics and accessibility requirements.

Defer unless already supported:

- Detailed active-engagement hours, earnings, deliverables, and performance.
- Full training, payment, referral, and contract summaries.
- Complex manual priority overrides.
- Exposed profile-completeness percentage.
- Advanced multi-engagement aggregation.

> ⚠️ **Decision needed:** Confirm whether offer, contracting, engagement, training, payment, and referral states are launch requirements or future-state requirements before design fidelity increases.
