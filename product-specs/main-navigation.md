<!--
Created: Sep 16, 2026
Created by: Julio Caunedo
Last updated: Sep 18, 2026
Scope: Verita AI professional-facing main navigation — the primary nav items and their naming rationale, shared across every page-level PRD.
Purpose: Give a single, high-level reference for the site's top-level destinations and the naming decisions behind them, split out of the Dashboard PRD (product-specs/dashboard.md) [§6.1](dashboard.md#61-main-navigation) once it became clear this content governs more than just Home.
-->

# Main Navigation

**Status:** Draft for product and design alignment

**Related docs:** Every page-level PRD in this folder implements one of the destinations named here. `product-specs/dashboard.md` is Home; `product-specs/engagements.md` is Engagements. Earnings and Referrals do not yet have dedicated PRDs.

## 1. Naming strategy

The navigation is organized around the talent lifecycle, from discovering opportunities to securing work, managing engagements, and receiving compensation.

The naming strategy prioritizes familiar, approachable terminology while establishing a distinct product taxonomy. Each navigation item represents a clear user intent rather than an internal business process or technical system.

### Core principles

- **User-centered:** names reflect what talent wants to accomplish, not how Verita operates internally.
- **Distinct destinations:** each section has a defined purpose, minimizing conceptual overlap.
- **Lifecycle-oriented:** the structure supports the progression from discovery to active work and compensation.
- **Scalable:** labels accommodate future capabilities without requiring the main navigation to change.
- **Accessible:** short, recognizable terms minimize interpretation and cognitive load.

## 2. Navigation model

Primary navigation is fixed and state-independent ([`dashboard.md` §2](dashboard.md#2-experience-rules), "Stable navigation, adaptive content"). Five destinations, summarized below and detailed in §2.1–§2.5.

| Navigation item | Concept | Purpose | Rationale for the name |
| --- | --- | --- | --- |
| Home | Your personal command center | Gives the user a personalized overview of what requires attention now: next steps, active applications, matches, active engagements, and relevant updates. | Familiar and universally understood as the primary entry point, without committing to a single task the way a name like "Dashboard" or "Overview" would. |
| Opportunities | Discover what's available | Takes the user to the marketplace to review available work, evaluate fit, and decide what to apply to — spanning a range of engagement terms (time commitment, duration) or Talent Network membership. Includes a personalized Matches view ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)). | Matches the underlying `Opportunity` entity and covers the non-job-shaped `Talent Network` type without straining the word "job" or "work." More explicit than "Explore"/"Discover" (which name an action, not a destination); avoids "Browse Work," which could imply work already secured. |
| Engagements | Manage everything you're pursuing or committed to | Houses the user's ongoing and historical interactions with opportunities the user is actively pursuing — applications, assessments, offers, contracts, and Talent Network membership. Full definition in `engagements.md`. | Broader than "Applications" or "Contracts," since the relationship continues beyond applying and not every engagement reaches the contractual stage. Creates one centralized destination instead of fragmenting into several. |
| Earnings | Understand your compensation | Gives the user visibility into compensation generated through their engagements, including earned, pending, paid, and upcoming payouts. | More user-centered than "Billing"/"Finance" (internal-sounding) and more comprehensive than "Payments" (transaction-focused, not an outcome view). |
| Referrals | Grow the network through trusted connections | Lets users invite other professionals, track their referrals, understand referral status, and see any associated rewards. | Established marketplace terminology that communicates both the action and the program — a more branded or abstract term would trade away instant legibility for no real gain in clarity. |

### 2.1 Home

**Concept:** Your personal command center.

Home provides a personalized overview of what matters to the user right now, consolidating relevant information and actionable next steps.

Design rationale:

- Familiar and universally understood as the primary entry point, without committing to a single task the way a name like "Dashboard" or "Overview" would.
- Aggregates information without duplicating the functionality of other destinations.
- Prioritizes actions such as profile completion, assessments, and upcoming work.
- Adapts to the user's lifecycle, from new candidate to active contributor.

**Key distinction:** Home tells users what needs their attention. Other sections provide the tools to act on it.

### 2.2 Opportunities

**Concept:** Discover what's available.

Opportunities is the discovery destination for available projects, roles, and potential work aligned with the user's expertise and interests — spanning a range of engagement terms (time commitment, duration) or Talent Network membership. Includes a personalized Matches view ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)).

Design rationale:

- Matches the underlying `Opportunity` entity ([`dashboard.md` §9.1](dashboard.md#91-entities), [§11](dashboard.md#11-opportunity-data-required-by-the-dashboard)), so the nav label matches what it actually points to.
- More explicit than "Explore" or "Discover," which describe an action rather than the destination.
- Broader than "Jobs," accommodating projects, contracts, and single scoped deliverables — including the non-job-shaped Opportunity type `Talent Network` ([`dashboard.md` §11.1](dashboard.md#111-opportunity-types)) that isn't a "job" in the common sense.
- Avoids "Browse Work," which could imply work already secured rather than work still under consideration.
- Establishes a clear separation between potential work and the user's existing relationships with opportunities.
- Supports searching, browsing, filtering, and evaluating opportunities.

See §5 for other names considered along the way.

**Key distinction:** Opportunities answers "What work is available to me?"

### 2.3 Engagements

**Concept:** Manage everything you're pursuing or committed to.

Engagements represents the user's ongoing relationships with opportunities, from initial interest through applications, assessments, offers, contracts, and Talent Network membership. Full definition, views, and object model in `engagements.md`.

Design rationale:

- Broader than "Applications," because the relationship continues beyond applying.
- Broader than "Contracts," because not every engagement has reached the contractual stage.
- Creates a centralized location for tracking progress across multiple opportunities.
- Supports distinct statuses and workflows without fragmenting the navigation into separate destinations.
- Provides continuity as a user moves from candidate to active contributor.

> ✅ **Resolved — `Saved` is a possible on-ramp, not a required first step, and stays out of Engagements' scope:** the arc "Saved → Applications → Assessments → Offers → Contracts" is not a static, linear path every engagement must follow in order — it's one possible route among several, and a professional can apply directly to a match without ever saving it first. Each object in the arc (Applications, Assessments, Offers, Contracts) is described fully in [`engagements.md` §2](engagements.md#2-engagement-views) (Engagement views). `Saved` itself is not part of the Engagements destination regardless: per the resolved decision in [`dashboard.md` §6.3](dashboard.md#63-opportunity-views) and [`engagements.md` §1](engagements.md#1-what-engagements-is), `Saved` lives under **Opportunities** — bookmarking starts no actual relationship with an opportunity, so the Engagements boundary is Apply (or Join, for Talent Network), not Save.

**Key distinction:** Opportunities is about what's available. Engagements is about what the user has expressed interest in, initiated, or secured.

### 2.4 Earnings

**Concept:** Understand your compensation.

Earnings gives users visibility into the financial outcomes of their work, including compensation, payment activity, and historical earnings — earned, pending, paid, and upcoming payouts.

Design rationale:

- More user-centered than "Billing" or "Finance," which describe internal or administrative functions.
- More comprehensive than "Payments," which emphasizes individual transactions over a running account of what the professional has made.
- Creates a dedicated financial destination separate from work management.
- Can scale to support earnings summaries, payment statuses, history, and payout details.

**Key distinction:** Engagements manages the work relationship. Earnings provides visibility into the money earned from that work.

### 2.5 Referrals

**Concept:** Grow the network through trusted connections.

Referrals provides a dedicated destination for inviting qualified professionals and tracking the resulting referral activity, referral status, and any associated rewards.

Design rationale:

- A familiar term that communicates a specific action and associated program — introducing a more branded or abstract term here would trade away instant legibility for no real gain in clarity.
- Separates network growth from individual opportunity discovery.
- Supports referral links, invitations, tracking, and potential rewards.
- Establishes a scalable destination for a referral program without introducing unnecessary complexity into the primary work lifecycle.

**Key distinction:** Opportunities focuses on the user's own potential work. Referrals focuses on bringing other professionals into the network.

## 3. How the navigation works as a system

| Navigation | Primary user question |
| --- | --- |
| Home | What needs my attention? |
| Opportunities | What's available to me? |
| Engagements | Where do I stand with my opportunities and work? |
| Earnings | What have I earned, and what's being paid? |
| Referrals | Who can I refer, and what's their status? |

**Overall design rationale:**

The navigation establishes five distinct domains: overview, discovery, relationship management, compensation, and network growth.

Rather than mirroring Verita's internal operational structure, it organizes the product around the user's mental model and progression.

Home orchestrates the experience. Opportunities introduces potential work. Engagements manages the relationship from interest to completion. Earnings provides financial visibility. Referrals extends participation through the user's professional network.

The result is a navigation architecture designed to remain consistent as Verita introduces new opportunity types, engagement workflows, and compensation models without requiring additional top-level destinations.

## 4. Lifecycle sequence

The overall IA follows a lifecycle sequence:

`Home` (what matters now) → `Opportunities` (work I can pursue) → `Engagements` (work I've taken action on) → `Earnings` (what I've earned) → `Referrals` (people I've introduced)

This gives navigation a coherent mental model — find work → do work → get paid — with Home as the orchestration layer ([`dashboard.md` §1](dashboard.md#1-context), [§3](dashboard.md#3-user-lifecycle-model)) and Referrals as a secondary growth feature ([`dashboard.md` §7.7](dashboard.md#77-referrals)).

## 5. Naming history

Other names considered for **Opportunities** along the way:

- **"Browse Work"** — used briefly, then reverted. "Work" implies an existing engagement rather than something still under consideration — to a professional evaluating what to pursue next, a name built around "work" reads as if they already have it, working against the destination's actual purpose of browsing candidates for work, not managing work already underway.
- **"Jobs"** — rejected for carrying employee/W2 connotations that work against a marketplace built on independent, contract-based engagements.
- **"Discover"** — rejected for colliding with the existing "Discover more opportunities" CTA elsewhere in the product; using it as the nav label too would blur the line between naming a destination and naming an action.

## 6. Open questions

- 🙋 Earnings and Referrals have no dedicated page-level PRD yet — should they get one once their scope grows, following the same split pattern as Engagements and Next steps?
  </content>
