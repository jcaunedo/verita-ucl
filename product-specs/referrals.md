<!--
Created: Sep 30, 2026
Created by: Julio Caunedo
Last updated: Oct 05, 2026
Scope: Verita AI professional Referrals destination — its two tabs (My referrals and My network), how a referral is made, the referral and network lifecycles, rewards, and the referral entry points on Home and on application rows.
Purpose: Give Referrals its own page-level PRD, split out of product-specs/main-navigation.md §2.5 and product-specs/dashboard.md §7.7 now that the destination exists in the product.
-->

# Referrals PRD

**Status:** Draft for product and design alignment

**Related docs:** [`main-navigation.md` §2.5](main-navigation.md#25-referrals) defines Referrals as a top-level destination and why it's named that way. [`dashboard.md` §7.7](dashboard.md#77-referrals) defines when referrals surface on Home. [`applications-card.md` §4.1](applications-card.md#41-actions-menu) defines the application row's actions menu, where the Refer action lives.

## 1. Context

Referrals is the fifth main-navigation destination: `Home` → `Opportunities` → `Engagements` → `Earnings` → `Referrals` ([`main-navigation.md` §4](main-navigation.md#4-lifecycle-sequence)). It answers the professional's question "Who can I refer, and what's their status?" ([`main-navigation.md` §3](main-navigation.md#3-how-the-navigation-works-as-a-system)). That question has two halves, and each half is its own product concept (§2): "who can I refer" is **My network**, and "what's their status" is **My referrals**.

Opportunities, Engagements, and Earnings are about the professional's own work. Referrals is about bringing other qualified professionals into the network. It is a secondary growth feature: useful, but never ahead of the professional's current work and required actions ([`dashboard.md` §4](dashboard.md#4-dashboard-priority-engine), priority P4).

ℹ️ The prototype has the destination in the sidebar (Referrals, `users-right` icon) with an empty page that shows only the title.

## 2. Two concepts: My referrals and My network

Referrals and My network are related but distinct concepts.

| | My referrals | My network |
| --- | --- | --- |
| **Definition** | Referral records: each time the professional actively referred someone to Verita, either generally or for a specific opportunity. | People in the professional's network: who they could refer now, and who they've referred before. One row per person. |
| **Exists when** | Only after the professional takes an explicit referral action (§6). | Once the professional imports or uploads their connections. |
| **User question** | Who have I referred, and what is happening with those referrals? | Who in my network could be a good fit for current opportunities, and what have those relationships earned so far? |
| **Responsibilities** | Track referral status, show qualification progress, show reward eligibility, show earned and pending rewards, let the professional view referral details. | Import or upload professional connections, match people to active opportunities, show each connection's referral history and earnings, surface potential referral value, let the professional decide who to refer. |
| **Lifecycle** | §7 | §8 |

The mental model:

- **My network** is people: everyone in my network, whether or not I've referred them.
- **My referrals** is referrals: the record of each referral I actually made.

One person appears once in My network, however many times they're referred. In My referrals the same person can have several rows, one per referral (§5.1).

Together they form one flow: build network → find matches → **Refer** → `My referrals` → track → reward. Referring someone creates a referral record in My referrals; the person stays in My network, because new opportunities may make them worth referring again (§8).

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
| **In progress** | Referrals currently at `Referred`, `Joined`, `Applied`, `Hired`, or `Qualifying`. |
| **Qualified** | Referrals that have met the program's qualifying milestone (§9), including referrals at `Reward earned` or `Paid`. |
| **Rewards earned** | Total value of every reward the professional has earned across qualified referrals, both already paid and still awaiting payout. |
| **Pending payout** | Total reward amount for referrals currently at `Reward earned`: earned, but not yet paid. |

So `Rewards earned` = paid rewards + `Pending payout`. `Pending payout` is derived from referral stages, not a stage of its own (§9.1).

ℹ️ Referrals that end without success (§7's undecided end states) count only toward `Total referrals`.

⚠️ **Decision needed:** whether the list needs filters (e.g. `In progress` / `Completed`, matching the Engagements filter pattern) or whether a single list with status badges is enough at launch.

### 5.2 My network

My network is where the professional uses their professional connections to find referral opportunities and earn rewards. It's a working view of who is in their network, who matches opportunities now, who they've referred before, what those relationships have earned, and where more earning potential is.

- **One row per connection.** The list is person-based: each connection appears once, however many opportunities they match, however many times they've been referred, and whatever they've earned. This is the key difference from My referrals, where one person can have several rows.
- **No summary figures.** The tab's counter (e.g. `My network 42`, the number of connections) carries the one network-level figure that matters. A row of summary cards would add weight without helping the main task, finding useful connections and acting on matches. The tab goes straight to search → filters → the connection table.
- **Import action:** import or upload professional connections (below).

**Empty state**

When the network is empty, the one goal is to build it. The empty state isn't a multi-step "how it works" explainer.

- **Title:** Build your network, make referrals, and earn rewards
- **Description:** Import your professional network to find potential matches. You choose who to refer, and no one is contacted automatically. You stay in control of every referral.

ℹ️ The reassurance matters: importing contacts can otherwise suggest that Verita may contact people without the professional acting.

**Import sources**

My network isn't a LinkedIn-only feature. LinkedIn is emphasized as the primary path, but the network model stays source-agnostic.

| Option | Description |
| --- | --- |
| **Get my LinkedIn network** | Bring in LinkedIn connections to get started. |
| **Upload a contact list** | Upload connections from another source using a CSV file. |

Below the two options, a secondary **Add a connection manually** link adds one contact at a time.

⚠️ **Gap:** the manual add flow (which fields it asks for, and where it opens) isn't designed yet.

**Connection table columns**

| Column | Shows | Align |
| --- | --- | --- |
| **Name** | The connection's name, with their current or most recent job title below it. | Left |
| **Matches** | Current active opportunities the connection may be worth referring to, e.g. `3 opportunities`, `1 opportunity`, `No current matches`. | Left |
| **Last activity** | The most recent referral or relationship event for this connection (§8), e.g. `Referral created`, `Applied`, `Started working`, `Reward earned`, `New match surfaced`. | Left |
| **Referrals** | The lifetime number of referral records created for this connection, e.g. `0`, `1`, `5`. Historical engagement, not a current status. | Right |
| **Earned** | Lifetime rewards already earned through referrals of this connection, e.g. `$0`, `$400`, `$1,200`. Past value: "How much has this relationship generated so far?" | Right |
| **Potential** | The rewards this connection's current matches could earn. Future value: "How much more could this connection generate now?" | Right |

The columns combine current opportunity (Matches), historical engagement (Last activity, Referrals), and financial value (Earned, Potential). They follow the product convention of text left, numbers right; numeric and money columns use consistent formatting and tabular figures.

- **Job title over email.** The professional is judging whether someone fits an opportunity, which a job title helps with and an email doesn't. Email stays available in the connection detail and as a fallback identifier.
- **Matches is the main actionable column.** When there are matches, the value is interactive and opens that person's matched opportunities.
- **No "best match".** Matches is a neutral count. My network doesn't claim a single best match unless Verita has a reliable ranking model.
- **Earned vs Potential:** Earned is past value, Potential is future value.

✅ **Resolved (2026-10-03) — no Status column:** a single status would oversimplify a connection. The same person can at once have 3 current matches, 2 earlier referrals, $800 earned, a new match, and another referral qualifying. The table shows each of those dimensions in its own column instead of forcing them into one status.

⚠️ **Decision needed:** what Potential shows when a connection has no current matches: `—` or `$0`.

**Filters and search**

- **Quick filters:** `All` · `Matches` · `New matches` · `Referred`.
  - **All:** the full network.
  - **Matches:** connections with at least one current opportunity match.
  - **New matches:** connections where a new opportunity match recently surfaced. This makes My network worth coming back to.
  - **Referred:** connections that already have referral history.

  These aren't mutually exclusive lifecycle states: a person can be both `Referred` and have `New matches`. They're different views of the same network.
- **Activity filter:** a secondary dropdown, defaulting to `All activity` (no restriction). Other values: `Referral created`, `Applied`, `Started working`, `Reward earned`, `New match surfaced`. It stays secondary because finding opportunities matters more than filtering past activity.
- **Search:** finds connections by name, job title, and email (as a fallback). Visually lightweight, so it doesn't compete with the opportunity filters.

⚠️ **Decision needed:** how recent a match must be to count as `New matches` (e.g. surfaced in the last 7 days, or not yet seen by the professional).

**Interactions**

- Clicking the row opens the connection detail.
- Clicking **Matches** opens the connection's current matched opportunities.
- From the matches view, the professional refers the person to an opportunity (§6). The referral's lifecycle is then tracked in My referrals.
- The connection stays in My network after being referred, because it may produce future referrals as new opportunities appear (§8).

⚠️ **Constraint:** LinkedIn heavily restricts access to a member's connections through its API. A CSV of the member's own LinkedIn data export may be the realistic first source. Engineering needs to confirm what's possible before design commits to a "Connect LinkedIn" flow.

⚠️ **Risk:** imported contacts are personal data about people who haven't agreed to anything with Verita. Consent, storage, retention, and whether Verita may contact them need a legal and privacy review before launch.

## 6. Ways to refer

A Referral exists only after the professional takes an explicit referral action:

- **Refer with a general referral link** to Verita. Only for people new to Verita: an existing member is already on the platform.
- **Refer someone to a specific opportunity**, from the application row's **Refer** action or from a matched connection in My network. The person can be anyone: in or outside the professional's network, new to Verita or already a member.
- **Send an introduction** on their behalf. An introduction is either to a specific opportunity or general, like the two options above.

✅ **Resolved (2026-10-02) — referral link usage limit:** a professional's referral link can be used up to 100 times within any 30-day period. The window is rolling: it counts the last 30 days at any moment, not a calendar month.

✅ **Resolved (2026-10-02) — what counts as a use:** sharing the link. Each share counts as one use, such as copying the link, sending it by email, or posting it to LinkedIn, X, or Facebook from the share modal. Someone opening the link or joining through it doesn't count.

✅ **Resolved (2026-10-02) — sharing by email to several people:** each email address counts as one use. Sending the link to three addresses at once uses three.

✅ **Confirmed in Figma (2026-10-05) — invite email preview:** once at least one address is added, **Preview invite email** shows the email the person will receive. It opens in place of the share modal's content. **Back** returns to the addresses, and **Send invite** sends from the preview too. The email opens with "Hi {first name}," (the recipient's first name). The general invite's headline reads "{Name} invited you to discover opportunities on Verita AI.", where {Name} is the signed-in professional's first name, followed by Verita's pitch and a **Discover opportunities** button.

ℹ️ The greeting names the recipient only when they're a connection. A typed address has no name, so the preview reads "Hi there,". With several recipients, each email greets its own recipient, and the preview shows the first one's.

⚠️ **Gap:** Figma only shows the general invite. The opportunity invite ("{Name} thinks you’d be a great fit for a {role} role on Verita AI.", the role's terms, and a **View opportunity** button) is draft copy pending review.

⚠️ **Decision needed:** what the professional sees once the limit is reached (e.g. the share actions disabled with a message saying when sharing is available again).

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

`Referred` → `Joined` → `Applied` → `Hired` → `Qualifying` → `Reward earned` → `Paid`

| Stage | Meaning |
| --- | --- |
| **Referred** | The professional made the referral (§6); the person hasn't acted on it yet. |
| **Joined** | The person created a Verita account. Only for people new to Verita: an existing member goes from `Referred` to `Applied` (§6). |
| **Applied** | The person applied to an opportunity. |
| **Hired** | The person's application was accepted and their contract is signed, but it hasn't started yet (`Awaiting start`, [`contract-card.md` §6.1](contract-card.md#61-contract-status-rules)). Once the contract becomes `Active`, the referral moves to `Qualifying`. |
| **Qualifying** | The referred person is working on an engagement that counts toward the referral reward (their contract is `Active`), and has started making progress toward the qualifying milestone (§9) without reaching it yet. The row shows that progress against the milestone, such as "12 of 40 hours". When the milestone is met, the referral moves to `Reward earned`. |
| **Reward earned** | The referred person met the qualifying milestone. The referral succeeded, and the reward is earned and awaiting payout. |
| **Paid** | The referral reward has been paid. |

⚠️ **Decision needed:** what happens to a referral that stops moving. Examples: the person never joins, isn't selected, or doesn't pass vetting. These need end states (e.g. `Expired`, `Not eligible`) so the list doesn't fill with stalled referrals.

⚠️ **Decision needed:** whether `Applied` refers to the referred opportunity only (for an opportunity referral) or to any opportunity. For an existing member, "any opportunity" would credit applications the referral had nothing to do with, which argues for the referred opportunity only.

## 8. My network lifecycle

A connection doesn't move through a single lifecycle status (§5.2, "no Status column"). It's imported once and stays in My network, and several things can be true of it at the same time: it can match current opportunities, have earlier referrals, have earned rewards, and have a referral in progress.

- **Imported:** the professional imported or uploaded the connection (§5.2). It's a row in My network from then on.
- **Matched:** Verita matches the connection to active opportunities. Matches come and go as opportunities open and close, so this is the `Matches` column, not a stage.
- **Referred:** each referral of the connection creates a referral record in My referrals, starting at `Referred` (§7). The connection stays in My network, and its `Referrals`, `Earned`, and `Potential` columns update.

**Activity events** — what `Last activity` and the activity filter show (§5.2):

| Event | Meaning |
| --- | --- |
| **Referral created** | The professional referred the connection (§6). |
| **Applied** | A referral of the connection reached `Applied` (§7). |
| **Started working** | A referral of the connection reached `Qualifying`: their contract is `Active` (§7). |
| **Reward earned** | A referral of the connection reached `Reward earned` (§7). |
| **New match surfaced** | Verita matched the connection to a new opportunity. |

✅ **Resolved (2026-10-03) — referred connections stay in My network:** a referred connection keeps its row in My network, with its referral history (`Referrals`, `Earned`) and the `Referred` filter, because it may produce future referrals as new opportunities appear. Each referral is also a row in My referrals. This replaces the 2026-10-01 decision that a referred connection leaves My network. A new invitee who joins Verita through a general referral link still isn't added to My network unless they're also one of the professional's imported connections.

⚠️ **Decision needed:** what happens when the professional dismisses a match.

## 9. Rewards

✅ **Resolved (2026-10-01, confirmed with the team) — when a referral succeeds:** after the referred person starts working (their contract becomes `Active`, [`contract-card.md` §6.1](contract-card.md#61-contract-status-rules)) *and* meets the qualifying milestone (§7: `Hired` → `Qualifying` → `Reward earned`). Signing up isn't enough, being hired isn't, and neither is starting work on its own. The contract that counts:

- **Opportunity referral:** a contract for the referred opportunity.
- **General referral:** any contract.

This restores the 2026-09-30 rule after a same-day change that earned the reward as soon as the contract became `Active`.

⚠️ **Decision needed:** the exact qualifying milestone (e.g. a number of hours worked or a first completed contract), and how its progress is shown on the row.

⚠️ **Copy fix needed:** the "Refer and earn" callout on Home says "Refer talented professionals and earn rewards when they join the network." That promises a reward on joining, but the reward comes only after the person starts working and meets the qualifying milestone. New copy is needed before launch.

✅ **Resolved (2026-10-01) — who gets the reward:** the professional who made the referral (`referrerId`, §10). The invited person doesn't receive a referral reward.

✅ **Resolved (2026-10-01) — reward amount by type:** every general referral pays a fixed $50. An opportunity referral pays the reward set by that opportunity.

⚠️ **Gap:** how an opportunity's reward amount gets configured (e.g. by Verita ops, or by the partner) isn't defined yet.

⚠️ **Decision needed:** how rewards are paid and whether they appear in Earnings ([`main-navigation.md` §2.4](main-navigation.md#24-earnings)). If they do, Earnings becomes the record of payment and the `Paid` stage links to it.

### 9.1 Reward flow

Referral and reward states are related but separate. `Reward earned` and `Paid` are referral lifecycle stages (§7). `Pending payout` and `Paid` are reward statuses. They run as two parallel tracks:

- **Referral lifecycle:** `Referred` → `Joined` → `Applied` → `Hired` → `Qualifying` → `Reward earned` → `Paid`
- **Reward status:** `Not earned` → `Pending payout` → `Paid`

| Reward status | Meaning |
| --- | --- |
| **Not earned** | The referral hasn't reached the qualifying milestone yet. |
| **Pending payout** | The qualifying milestone was met, and the reward is owed but not yet paid. |
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

**`Connection` fields (proposed)** — enough for the My network table (§5.2):

| Field | Description |
| --- | --- |
| `id` | Connection ID. |
| `name` | The connection's name. |
| `jobTitle` | Current or most recent job title, shown under the name. |
| `email` | Optional. Fallback identifier and search field; shown in the connection detail. |
| `source` | Where it came from: LinkedIn or a CSV upload (§5.2). |
| `lastActivity` / `lastActivityAt` | The latest activity event (§8) and when it happened. |

The table's other columns are derived, not stored on the connection: `Matches` and `Potential` from the connection's current `ReferralCandidate`s, and `Referrals` and `Earned` from the referrals whose `connectionId` points at it.

⚠️ **Gap:** `ReferralCandidate` fields, and any `Connection` fields beyond these, aren't defined yet. They depend on the import sources (§5.2) and the matching model (§3).

## 11. Open questions

- 🙋 What is the exact qualifying milestone for a reward, and how is progress shown (§9)?
- 🙋 What should the "Refer and earn" callout say now that rewards come after the person starts working (§9)?
- 🙋 Are referral rewards paid through Earnings, and does Referrals link there (§9)?
- 🙋 What end states does a stalled referral get (§7)?
- 🙋 Is Refer offered on Opportunities → Matches too (§6)?
- 🙋 What does "Send an introduction" do in practice (§6)?
- 🙋 Which LinkedIn import is technically possible, and is CSV the first source (§5.2)?
- 🙋 What consent and retention rules apply to imported contacts (§5.2)?
- 🙋 In My network, does Potential show `—` or `$0` when a connection has no current matches (§5.2)?
- 🙋 How recent must a match be to count as `New matches` (§5.2)?
- 🙋 Does a connection's `Earned` include rewards still pending payout, like the `Rewards earned` figure (§9.1), or only rewards paid (§5.2)?
- 🙋 How is a connection's `Potential` worked out when it matches several opportunities: the sum of their rewards, or the highest one (§5.2)?
- 🙋 Which referral and network events promote Referrals on Home, and in which module (§4, [`dashboard.md` §7.7](dashboard.md#77-referrals))?
- 🙋 Beyond the referral link's 100 uses per 30 days (§6), is there a limit on opportunity referrals, or on rewards per period?
- 🙋 What does the professional see once the referral link hits its limit (§6)?
- 🙋 How is an opportunity's referral reward amount configured, and by which team (§9)?
- 🙋 If two professionals refer the same person, to the same opportunity or generally, who gets the credit?
- 🙋 Is the Referrals program a launch requirement or future scope, and does My network ship with it or later ([`dashboard.md` §22](dashboard.md#22-recommended-mvp-boundary))?
