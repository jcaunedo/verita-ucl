<!--
Created: Sep 30, 2026
Created by: Julio Caunedo
Last updated: Oct 01, 2026
Scope: Verita AI professional Referrals destination — its two tabs (My referrals and My network), how a referral is made, the referral and network lifecycles, rewards, and the referral entry points on Home and on application rows.
Purpose: Give Referrals its own page-level PRD, split out of product-specs/main-navigation.md §2.5 and product-specs/dashboard.md §7.7 now that the destination exists in the product.
-->

# Referrals PRD

**Status:** Draft for product and design alignment

**Related docs:** [`main-navigation.md` §2.5](main-navigation.md#25-referrals) defines Referrals as a top-level destination and why it's named that way. [`dashboard.md` §7.7](dashboard.md#77-referrals) defines when referrals surface on Home. [`applications-card.md` §4.1](applications-card.md#41-actions-menu) defines the application row's actions menu, where the Refer action lives.

## 1. Context

Referrals is the fifth main-navigation destination: `Home` → `Opportunities` → `Engagements` → `Earnings` → `Referrals` ([`main-navigation.md` §4](main-navigation.md#4-lifecycle-sequence)). It answers the professional's question "Who can I refer, and what's their status?" ([`main-navigation.md` §3](main-navigation.md#3-how-the-navigation-works-as-a-system)). That question has two halves, and each half is its own product concept (§2): "who can I refer" is **My network**, and "what's their status" is **My referrals**.

Opportunities, Engagements, and Earnings are about the professional's own work. Referrals is about bringing other qualified professionals into the network. It is a secondary growth feature: useful, but never ahead of the professional's current work and required actions ([`dashboard.md` §4](dashboard.md#4-dashboard-priority-engine), priority P4).

ℹ️ The prototype has the destination in the sidebar (Referrals, `users-right` icon) with an empty page that shows only the title. No Figma design exists for the page yet.

## 2. Two concepts: My referrals and My network

Referrals and My network are related but distinct concepts.

| | My referrals | My network |
| --- | --- | --- |
| **Definition** | People the professional has actively referred to Verita, either generally or for a specific opportunity. | People in the professional's network who could potentially be referred. They are not referrals yet. |
| **Exists when** | Only after the professional takes an explicit referral action (§6). | Once the professional imports or uploads their connections. |
| **User question** | Who have I referred, and what is happening with those referrals? | Who in my network could be a good fit for current opportunities? |
| **Responsibilities** | Track referral status, show reward eligibility, show earned and pending rewards, let the professional view referral details. | Import or upload professional connections, match people to active opportunities, surface potential referral value, let the professional decide who to refer. |
| **Lifecycle** | §7 | §8 |

The mental model:

- **My network** is the pool of people I may refer.
- **My referrals** is the record of people I actually referred.

Together they form one flow: `My network` → identify opportunity fit → **Refer** → `My referrals` → track → reward. Once the professional refers someone, that person moves from the network model into the referral model.

✅ **Resolved (2026-09-30) — naming:** the tabs are **My referrals** and **My network**. "My network" is preferred over "Connections" because it is broader and more future-proof: "Connections" can feel LinkedIn-specific, while the source may eventually include CSV uploads, manually added contacts, or other professional networks.

## 3. Goals and non-goals

**Goals**

- Let a professional refer someone in a few steps, generally or to a specific opportunity.
- Let them see who they've referred, where each referral stands, and how close it is to earning a reward.
- Let them bring their professional network into Verita and see who fits current opportunities.
- Surface referral activity on Home only when something meaningful happens ([`dashboard.md` §7.7](dashboard.md#77-referrals)).

**Non-goals**

- Referral program economics (budgets, caps, per-opportunity reward amounts). This doc defines how rewards are shown and who gets them; the only amount it sets is the general referral reward (§9).
- How connections are matched to opportunities. This doc defines how matches are shown, not how they're computed.
- Fraud and abuse detection logic.
- The referred person's sign-up and onboarding flow, beyond what the referrer sees and the one rule in §6 (an invited person can preview the opportunity before joining).
- Partner or employer referrals. This doc covers professionals referring professionals.

## 4. Entry points

| Entry point | Where | What it does |
| --- | --- | --- |
| Main navigation | Sidebar → **Referrals** | Opens the Referrals page on **My referrals** (§5). Always available ([`dashboard.md` §2](dashboard.md#2-experience-rules), "Stable navigation, adaptive content"). |
| Home callout | "Refer and earn" callout card, bottom of Home | Low-priority, always-available entry point. Opens the Referrals page. See §9 for its copy. |
| Home event | Home, promoted | Only when there is a meaningful referral event, such as a referral earning a reward ([`dashboard.md` §7.7](dashboard.md#77-referrals)). |
| Application row | Engagements and Home → Applications → row `···` → **Refer** | Refers someone to that specific opportunity (§6). |

⚠️ **Decision needed:** what the Home event looks like (a Next steps card, the Opportunity alert, or a callout) and which events qualify. My network could also produce one, such as "3 people in your network match a new opportunity".

## 5. Referrals page

The page has two tabs, in this order: **My referrals** (primary, the default) and **My network** (secondary). My referrals comes first because tracking actual referrals and rewards is the core ongoing job. The tabs follow the same pattern as the Engagements views ([`engagements.md` §2](engagements.md#2-engagement-views)).

Page conventions follow the rest of the product:

- Same page shell as every layout ([DESIGN.md](../DESIGN.md) "Page shell responsiveness"), with the page title "Referrals".
- Each tab's list is one table list, like Applications and Offers ([DESIGN.md](../DESIGN.md) "Lists of rows are one table list").
- An empty tab shows an empty state with its primary action, and no search or filters ([DESIGN.md](../DESIGN.md) "Hide search and filters when a view is empty").

### 5.1 My referrals

- **Refer action:** a way to make a general referral (§6), such as copying the referral link.
- **Referrals list:** one row per referral, the same pattern as application and offer rows. Referring the same person to two opportunities makes two rows. The row opens the referral details. Columns are listed below.
- **Summary:** five figures, in this order: `Total referrals` → `In progress` → `Qualified` → `Rewards earned` → `Pending payout`. The two reward figures follow the reward flow in §9.1 ([`main-navigation.md` §2.5](main-navigation.md#25-referrals): "see any associated rewards").
- **Empty state:** no referrals yet; the primary action is to refer someone or go to My network.

**Referrals list columns**

| Column | Shows |
| --- | --- |
| **Name** | The referred person's name and email. |
| **Referred for** | What the person was referred to (below). |
| **Status** | The referral's stage (§7) as a badge. |
| **Reward** | The reward amount and where it stands, e.g. `$50 potential`, `$300 pending payout`, `$300 paid` (§9). |

**Referred for** comes from the referral's `opportunityId` (§10) and has two values:

| `opportunityId` | Column shows | Comes from (§6) |
| --- | --- | --- |
| Set | The opportunity title, e.g. `Senior Financial Analyst` | **Refer** on an application row, or on a matched connection in My network |
| Not set | `General referral`, an invitation to join Verita | The general referral link |

- **An introduction isn't a third value.** It's a way of referring (`method`, §10), not a destination, so it shows the opportunity title or `General referral`.
- **The value is set when the referral is made.** The column represents how the referral originated, not what eventually happened later. A general referral whose person later applies somewhere still reads `General referral`. An opportunity referral keeps its title even if the person applies elsewhere (see the `Applied` decision in §7).
- **A closed or filled opportunity keeps its title.** Status and Reward show the outcome.
- **Plain text, not a link.** The whole row opens the referral details, so a link inside it would compete with the row click. Long titles truncate to one line.

⚠️ **Decision needed:** the earlier list also showed the referral date. The Figma table has no date column; confirm whether it's dropped or moves into the referral details.

**Summary figures** — what each one includes, by referral stage (§7):

| Figure | Definition |
| --- | --- |
| **Total referrals** | All referrals the professional has made, whatever their current status. A lifetime count unless a date filter is added later. |
| **In progress** | Referrals currently at `Referred`, `Joined`, `Applied`, or `Hired`. |
| **Qualified** | Referrals whose person started working (their contract became `Active`, §9), including referrals at `Reward earned` or `Paid`. |
| **Rewards earned** | Total value of every reward the professional has earned across qualified referrals, both already paid and still awaiting payout. |
| **Pending payout** | Total reward amount for referrals currently at `Reward earned`: earned, but not yet paid. |

So `Rewards earned` = paid rewards + `Pending payout`. `Pending payout` is derived from referral stages, not a stage of its own (§9.1).

ℹ️ Referrals that end without success (§7's undecided end states) count only toward `Total referrals`.

⚠️ **Decision needed:** whether the list needs filters (e.g. `In progress` / `Completed`, matching the Engagements filter pattern) or whether a single list with status badges is enough at launch.

### 5.2 My network

- **Import action:** import or upload professional connections (LinkedIn, CSV, and possibly manually added contacts later).
- **Network list:** one row per connection, with the opportunities they match and their potential referral value. Each row has a **Refer** action.
- **Empty state:** no connections yet; the primary action is to import them.

⚠️ **Constraint:** LinkedIn heavily restricts access to a member's connections through its API. A CSV of the member's own LinkedIn data export may be the realistic first source. Engineering needs to confirm what's possible before design commits to a "Connect LinkedIn" flow.

⚠️ **Risk:** imported contacts are personal data about people who haven't agreed to anything with Verita. Consent, storage, retention, and whether Verita may contact them need a legal and privacy review before launch.

## 6. Ways to refer

A Referral exists only after the professional takes an explicit referral action:

- **Refer with a general referral link** to Verita. Only for people new to Verita: an existing member is already on the platform.
- **Refer someone to a specific opportunity**, from the application row's **Refer** action or from a matched connection in My network. The person can be anyone: in or outside the professional's network, new to Verita or already a member.
- **Send an introduction** on their behalf. An introduction is either to a specific opportunity or general, like the two options above.

✅ **Resolved (2026-10-01) — referring someone new to an opportunity:** the invite opens a read-only preview of the opportunity. To apply, the person joins Verita first (§7: `Referred` → `Joined` → `Applied`).

✅ **Resolved (2026-10-01) — existing members can be referred to an opportunity:** a professional can refer someone who already has a Verita account, as long as it's to a specific opportunity. Two rules keep the reward tied to the referral actually causing something:

- **Not to an opportunity they already applied to.** The Refer flow tells the professional this person has already applied, and no referral is created.
- **Not with a general referral.** They're already on Verita, so there's nothing to invite them to.

The member skips `Joined` in the lifecycle (§7).

✅ **Resolved (2026-09-30) — what Refer does:** the application row's **Refer** action creates a tracked referral to that opportunity. It isn't an untracked share. This replaces the original **Share** action ([`applications-card.md` §4.1](applications-card.md#41-actions-menu)).

⚠️ **Decision needed:** whether **Refer** is also offered on opportunities the professional hasn't applied to (Opportunities → Matches), not only on their own applications.

⚠️ **Decision needed:** what "Send an introduction" means in practice: Verita emails the person on the professional's behalf, or the professional sends a prefilled message themselves.

## 7. Referral lifecycle

Each referral moves through these stages. The row shows the current stage as a badge.

`Referred` → `Joined` → `Applied` → `Hired` → `Reward earned` → `Paid`

| Stage | Meaning |
| --- | --- |
| **Referred** | The professional made the referral (§6); the person hasn't acted on it yet. |
| **Joined** | The person created a Verita account. Only for people new to Verita: an existing member goes from `Referred` to `Applied` (§6). |
| **Applied** | The person applied to an opportunity. |
| **Hired** | The person's application was accepted and their contract is signed, but it hasn't started yet (`Awaiting start`, [`contract-card.md` §6.1](contract-card.md#61-contract-status-rules)). The reward follows once the contract becomes `Active`. |
| **Reward earned** | The referred person started working: their contract became `Active` (§9). The referral succeeded, and the reward is earned and awaiting payout. |
| **Paid** | The referral reward has been paid. |

⚠️ **Decision needed:** what happens to a referral that stops moving. Examples: the person never joins, isn't selected, or doesn't pass vetting. These need end states (e.g. `Expired`, `Not eligible`) so the list doesn't fill with stalled referrals.

⚠️ **Decision needed:** whether `Applied` refers to the referred opportunity only (for an opportunity referral) or to any opportunity. For an existing member, "any opportunity" would credit applications the referral had nothing to do with, which argues for the referred opportunity only.

## 8. My network lifecycle

Each connection moves through these stages:

`Not connected to Verita yet` → `Imported` → `Matched` → `Reviewed` → `Referred`

| Stage | Meaning |
| --- | --- |
| **Not connected to Verita yet** | The person is in the professional's network outside Verita. |
| **Imported** | The professional imported or uploaded the connection. |
| **Matched** | Verita matched the connection to one or more active opportunities. |
| **Reviewed** | The professional reviewed the match. |
| **Referred** | The professional referred the person. The person now also appears in My referrals, starting at `Referred` (§7). |

✅ **Resolved (2026-10-01) — referred people live only in My referrals:** a referred connection leaves My network, and a new invitee who joins Verita isn't added to it. My network stays the pool of people not referred yet (§2). To refer the same person to another opportunity, the professional uses that opportunity's **Refer** action, which creates a new referral row.

⚠️ **Decision needed:** what happens when the professional dismisses a match.

## 9. Rewards

✅ **Resolved (2026-10-01) — when a referral succeeds:** the moment the referred person starts working, when their contract becomes `Active` ([`contract-card.md` §6.1](contract-card.md#61-contract-status-rules)). Signing up isn't enough, and neither is being hired: a contract still `Awaiting start` keeps the referral at `Hired` (§7). That moment moves the referral to `Reward earned` (§7). The contract that counts:

- **Opportunity referral:** a contract for the referred opportunity.
- **General referral:** any contract.

This replaces the earlier rule (2026-09-30) that the reward also waited for a further qualifying milestone after work started. That rule is now an open question to verify with the team (§11).

⚠️ **Copy fix needed:** the "Refer and earn" callout on Home says "Refer talented professionals and earn rewards when they join the network." That promises a reward on joining, but the reward comes when the person starts working. New copy is needed before launch.

✅ **Resolved (2026-10-01) — who gets the reward:** the professional who made the referral (`referrerId`, §10). The invited person doesn't receive a referral reward.

✅ **Resolved (2026-10-01) — reward amount by type:** every general referral pays a fixed $50. An opportunity referral pays the reward set by that opportunity.

⚠️ **Gap:** how an opportunity's reward amount gets configured (e.g. by Verita ops, or by the partner) isn't defined yet.

⚠️ **Decision needed:** how rewards are paid and whether they appear in Earnings ([`main-navigation.md` §2.4](main-navigation.md#24-earnings)). If they do, Earnings becomes the record of payment and the `Paid` stage links to it.

### 9.1 Reward flow

Referral and reward states are related but separate. `Reward earned` and `Paid` are referral lifecycle stages (§7). `Pending payout` and `Paid` are reward statuses. They run as two parallel tracks:

- **Referral lifecycle:** `Referred` → `Joined` → `Applied` → `Hired` → `Reward earned` → `Paid`
- **Reward status:** `Not earned` → `Pending payout` → `Paid`

| Reward status | Meaning |
| --- | --- |
| **Not earned** | The referred person hasn't started working yet. |
| **Pending payout** | The referred person started working, and the reward is owed but not yet paid. |
| **Paid** | The reward has been paid. |

How they move together:

- When a referral reaches `Reward earned`, its reward status becomes `Pending payout`.
- Once the reward is paid, the referral moves to `Paid` and the reward status becomes `Paid`.

`Rewards earned` never means money received; it includes rewards still awaiting payout (§5.1). To show money already received, label it `Total paid` or `Rewards paid`.

## 10. Data model

Three entities, one per stage of the flow in §2:

| Entity | What it is |
| --- | --- |
| `Connection` | A person in the professional's network. |
| `ReferralCandidate` | A `Connection` plus a matched opportunity. |
| `Referral` | Created only after the professional takes a referral action (§6). |

All three are collections on `User` ([`dashboard.md` §9.1](dashboard.md#91-entities)).

**`Referral` fields (proposed)**

| Field | Description |
| --- | --- |
| `id` | Referral ID. |
| `referrerId` | The professional who made the referral. |
| `connectionId` | Optional. Set when the referral came from My network. |
| `inviteeEmail` / `inviteeName` | Who was referred. |
| `opportunityId` | Optional. Set when the referral was for a specific opportunity. Drives the list's `Referred for` column (§5.1). |
| `method` | How the referral was made: link, opportunity referral, or introduction (§6). |
| `stage` | One of §7's stages. |
| `createdAt` / `updatedAt` | When it was created and last changed. |
| `rewardStatus` / `rewardAmount` | `rewardStatus` is one of `Not earned`, `Pending payout`, or `Paid` (§9.1). `rewardAmount` is $50 for a general referral, and set by the opportunity otherwise (§9). |

⚠️ **Gap:** `Connection` and `ReferralCandidate` fields aren't defined yet. They depend on the import sources (§5.2).

## 11. Open questions

- 🙋 Verify with the team: should the reward wait for a further business milestone after the person starts working, such as a number of hours worked or a first completed contract? That was the previous rule (2026-09-30), with a `Qualifying` stage between `Started working` and `Reward earned` that showed progress (e.g. "12 of 40 hours"). It was replaced on 2026-10-01 by earning the reward when the contract becomes `Active` (§9).
- 🙋 What should the "Refer and earn" callout say now that rewards come after the person starts working (§9)?
- 🙋 Are referral rewards paid through Earnings, and does Referrals link there (§9)?
- 🙋 What end states does a stalled referral get (§7)?
- 🙋 Is Refer offered on Opportunities → Matches too (§6)?
- 🙋 What does "Send an introduction" do in practice (§6)?
- 🙋 Which LinkedIn import is technically possible, and is CSV the first source (§5.2)?
- 🙋 What consent and retention rules apply to imported contacts (§5.2)?
- 🙋 Which referral and network events promote Referrals on Home, and in which module (§4, [`dashboard.md` §7.7](dashboard.md#77-referrals))?
- 🙋 Is there a limit on how many people a professional can refer, or on rewards per period?
- 🙋 How is an opportunity's referral reward amount configured, and by which team (§9)?
- 🙋 If two professionals refer the same person, to the same opportunity or generally, who gets the credit?
- 🙋 Is the Referrals program a launch requirement or future scope, and does My network ship with it or later ([`dashboard.md` §22](dashboard.md#22-recommended-mvp-boundary))?
