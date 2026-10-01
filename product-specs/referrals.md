<!--
Created: Sep 30, 2026
Created by: Julio Caunedo
Last updated: Sep 30, 2026
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
| **Responsibilities** | Track referral status, show qualification progress, show reward eligibility, show earned and pending rewards, let the professional view referral details. | Import or upload professional connections, match people to active opportunities, surface potential referral value, let the professional decide who to refer. |
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

- Referral program economics (reward amounts, budgets, caps). This doc defines how rewards are shown, not how much they are.
- How connections are matched to opportunities. This doc defines how matches are shown, not how they're computed.
- Fraud and abuse detection logic.
- The referred person's sign-up and onboarding flow, beyond what the referrer sees.
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
- **Referrals list:** one row per referral, with the person, the opportunity (when the referral was for one), the date, and its status as a badge (§7), the same pattern as application and offer rows. The row opens the referral details.
- **Rewards summary:** earned, pending, and paid ([`main-navigation.md` §2.5](main-navigation.md#25-referrals): "see any associated rewards").
- **Empty state:** no referrals yet; the primary action is to refer someone or go to My network.

⚠️ **Decision needed:** whether the list needs filters (e.g. `In progress` / `Completed`, matching the Engagements filter pattern) or whether a single list with status badges is enough at launch.

### 5.2 My network

- **Import action:** import or upload professional connections (LinkedIn, CSV, and possibly manually added contacts later).
- **Network list:** one row per connection, with the opportunities they match and their potential referral value. Each row has a **Refer** action.
- **Empty state:** no connections yet; the primary action is to import them.

⚠️ **Constraint:** LinkedIn heavily restricts access to a member's connections through its API. A CSV of the member's own LinkedIn data export may be the realistic first source. Engineering needs to confirm what's possible before design commits to a "Connect LinkedIn" flow.

⚠️ **Risk:** imported contacts are personal data about people who haven't agreed to anything with Verita. Consent, storage, retention, and whether Verita may contact them need a legal and privacy review before launch.

## 6. Ways to refer

A Referral exists only after the professional takes an explicit referral action:

- **Refer with a general referral link** to Verita.
- **Refer someone to a specific opportunity**, from the application row's **Refer** action or from a matched connection in My network.
- **Send an introduction** on their behalf.

✅ **Resolved (2026-09-30) — what Refer does:** the application row's **Refer** action creates a tracked referral to that opportunity. It isn't an untracked share. This replaces the original **Share** action ([`applications-card.md` §4.1](applications-card.md#41-actions-menu)).

⚠️ **Decision needed:** whether **Refer** is also offered on opportunities the professional hasn't applied to (Opportunities → Matches), not only on their own applications.

⚠️ **Decision needed:** what "Send an introduction" means in practice: Verita emails the person on the professional's behalf, or the professional sends a prefilled message themselves.

## 7. Referral lifecycle

Each referral moves through these stages. The row shows the current stage as a badge.

`Referred` → `Joined` → `Applied` → `Started working` → `Qualifying` → `Reward earned` → `Paid`

| Stage | Meaning |
| --- | --- |
| **Referred** | The professional made the referral (§6); the person hasn't joined yet. |
| **Joined** | The person created a Verita account. |
| **Applied** | The person applied to an opportunity. |
| **Started working** | The person started an engagement. |
| **Qualifying** | The person is working toward the program's qualifying milestone (§9). The row shows their progress. |
| **Reward earned** | The person met the milestone; the professional's reward is due. |
| **Paid** | The reward was paid. |

⚠️ **Decision needed:** what happens to a referral that stops moving. Examples: the person never joins, isn't selected, or doesn't pass vetting. These need end states (e.g. `Expired`, `Not eligible`) so the list doesn't fill with stalled referrals.

⚠️ **Decision needed:** whether `Applied` refers to the referred opportunity only (for an opportunity referral) or to any opportunity.

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

⚠️ **Decision needed:** whether a referred connection stays visible in My network (marked as referred) or leaves it, and what happens when the professional dismisses a match.

## 9. Rewards

✅ **Resolved (2026-09-30) — when a reward is earned:** after the referred person starts working and meets the qualifying milestone (§7: `Started working` → `Qualifying` → `Reward earned`), not when they create an account.

⚠️ **Copy fix needed:** the "Refer and earn" callout on Home says "Refer talented professionals and earn rewards when they join the network." That promises a reward on joining, which no longer matches. New copy is needed before launch.

⚠️ **Decision needed:** the exact qualifying milestone (e.g. a number of hours worked or a first completed contract), and how its progress is shown on the row.

⚠️ **Decision needed:** how rewards are paid and whether they appear in Earnings ([`main-navigation.md` §2.4](main-navigation.md#24-earnings)). If they do, Earnings becomes the record of payment and the `Paid` stage links to it.

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
| `opportunityId` | Optional. Set when the referral was for a specific opportunity. |
| `method` | How the referral was made: link, opportunity referral, or introduction (§6). |
| `stage` | One of §7's stages. |
| `createdAt` / `updatedAt` | When it was created and last changed. |
| `rewardStatus` / `rewardAmount` | Optional. Set once a reward applies (§9). |

⚠️ **Gap:** `Connection` and `ReferralCandidate` fields aren't defined yet. They depend on the import sources (§5.2).

## 11. Open questions

- 🙋 What is the exact qualifying milestone for a reward, and how is progress shown (§9)?
- 🙋 What should the "Refer and earn" callout say now that rewards come after the person starts working (§9)?
- 🙋 Are referral rewards paid through Earnings, and does Referrals link there (§9)?
- 🙋 What end states does a stalled referral get (§7)?
- 🙋 Is Refer offered on Opportunities → Matches too (§6)?
- 🙋 What does "Send an introduction" do in practice (§6)?
- 🙋 Which LinkedIn import is technically possible, and is CSV the first source (§5.2)?
- 🙋 What consent and retention rules apply to imported contacts (§5.2)?
- 🙋 Which referral and network events promote Referrals on Home, and in which module (§4, [`dashboard.md` §7.7](dashboard.md#77-referrals))?
- 🙋 Is there a limit on how many people a professional can refer, or on rewards per period?
- 🙋 Can a professional refer someone who already has a Verita account?
- 🙋 Is the Referrals program a launch requirement or future scope, and does My network ship with it or later ([`dashboard.md` §22](dashboard.md#22-recommended-mvp-boundary))?
