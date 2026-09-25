<!--
Created: Sep 25, 2026
Created by: Julio Caunedo
Last updated: Sep 25, 2026
Scope: The Offer card — the row that represents one Offer on Home's Opportunity alert ("New offer for you", product-specs/dashboard.md §7.1) and in Engagements → Offers (product-specs/engagements.md §4.1).
Purpose: Collect the Offer card's content, status model, row interaction, and closed-state treatment in one place, alongside the sibling Applications, Contract, and Match card specs.
-->

# Offer Card

**Status:** Draft for product and design alignment

**Figma reference:** `offer-card` component set in verita.ds (`Property 1`: `Default`, `Hover`).

⚠️ **Gap:** add the direct Figma node link for `offer-card` here, the way the other card specs link theirs.

## 1. What the Offer card is

The Offer card shows the professional one offer at a glance: who is offering, the proposed terms, and how long they have to respond. It is a summary. The full terms, conditions, and Accept/Decline decision live in the offer detail.

An Offer is a formal proposal of work, issued after the professional has been selected and before a Contract exists ([`engagements.md` §4](engagements.md#4-offers-and-contracting)). The card represents that object and nothing earlier or later: the application it came from has already left `Applications`, and once contracting completes, the Contract card takes over under `Contracts` ([`engagements.md` §2](engagements.md#2-engagement-views)'s "progressive destinations" note).

**Scope boundary:** `offer-card.md` owns the card's presentation and interaction. [`engagements.md` §4](engagements.md#4-offers-and-contracting) stays the source of truth for the Offer object, its filters, and its lifecycle. [`dashboard.md` §7.1](dashboard.md#71-opportunity-alert) owns the Home module that shows an offer, including its heading and visibility.

✅ **Resolved — an Offer is not a Match:** a Match is a system signal that an opportunity fits the professional, produced before they apply. An Offer is a real proposal from a partner (or Verita on its behalf) after selection. The card must never borrow Match vocabulary, such as a fit tier (`Strong match`, `Good match`), and an opportunity with an active offer is suppressed from Matches ([`engagements.md` §4](engagements.md#4-offers-and-contracting)).

## 2. Card content

Each offer row must include:

- Opportunity title and partner label.
- The proposed terms: compensation, time commitment, and duration, when defined.
- The expiration, while the offer is open.
- The offer's status, once it is anything other than awaiting a response (§3).
- A way to open the offer detail.

Required data doesn't mean every field is shown in every state. Expiration and the "View offer" button only apply while the offer is open. A closed offer shows its outcome instead (§3.2).

### 2.1 Card anatomy

The card uses the same two-zone layout as the Applications card ([`applications-card.md` §2.3](applications-card.md#23-card-anatomy)). The left zone holds identity and terms, and the right zone holds time-sensitive facts and actions. The identity block is identical across the two cards, so an opportunity looks the same as it moves from `Applications` to `Offers`.

- **Left zone (identity):** `partner-logo`, then `partner-name` (small eyebrow), `opportunity-title`, and the `terms-row` line (`compensation · engagement-terms · duration`).
- **Right zone (status and actions):** `discipline` (optional), `expiration-date`, `supporting-text`, `offer-status`, the "View offer" `button`, and the hover-revealed `actions-menu`, right-aligned.

| Element            | Behavior                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `partner-logo`     | Optional, with a neutral fallback tile. The Verita mark for Verita-partner offers.                                                                                                                         |
| `partner-name`     | Approved partner name or fallback, as a small muted eyebrow above the title.                                                                                                                              |
| `opportunity-title`      | Required. Supports multiline.                                                                                                                                                                              |
| `compensation`     | Conditional. The offer's proposed compensation, with amount, currency, and unit (§2.2). Semibold.                                                                                                         |
| `engagement-terms` | Conditional. Time commitment only, e.g. "Up to 30 hrs/week" ([`contract-card.md` §3.2](contract-card.md#32-engagement-terms)).                                                                             |
| `duration`         | Optional. Its own field, shown only when a confirmed timeframe exists, e.g. "3 months" or "Ongoing" ([`contract-card.md` §3.2.1](contract-card.md#321-duration)). Its `·` separator goes with it.         |
| `discipline`       | Optional, off by default (§2.4).                                                                                                                                                                           |
| `expiration-date`  | Shown while the offer is open and has an expiration (§2.3). Removed once the offer is closed.                                                                                                              |
| `supporting-text`  | Conditional on content. One muted line with the details of a closed offer's outcome (§3.2).                                                                                                                |
| `offer-status`     | The status badge. Omitted for an offer awaiting a response, and shown for every other status (§3).                                                                                                         |
| `button`           | "View offer", opening the offer detail. Shown while the offer is open, and removed once it's closed (§3.2).                                                                                               |
| `actions-menu`     | Revealed on hover or keyboard focus, never permanently visible. Its items depend on the status (§4.2).                                                                                                     |

✅ **Resolved (2026-09-25) — the title element is `opportunity-title`:** the title is the Opportunity's own title, not a separate offer field, so it reads the same as on the Match and Applications cards ([`applications-card.md` §2.3](applications-card.md#23-card-anatomy)). **Confirmed in Figma (2026-09-25):** the `Title` layer's placeholder in `offer-card` reads `opportunity-title`, replacing `application-title`.

✅ **Resolved (2026-09-25) — the row splits the same way as the Applications card:** both zones share the row equally, as in Figma's `offer-card` and `application-card` (`flex-1` on both zones). When the row has supporting text, the left zone keeps its natural width and the text takes the rest of the right zone, up to 2 lines. This supersedes the earlier rule that the right zone hugs its content, so the two cards stay identical as an opportunity moves from `Applications` to `Offers`.

### 2.2 Compensation: proposed terms

An offer sits between the Opportunity's advertised terms and the Contract's agreed terms. The card shows what the offer proposes, using the unit-specific formats in [`contract-card.md` §3.3.1](contract-card.md#331-compensation-display-variants), such as "$85/hour" or "$4,500/project". It must never collapse to a bare number. Omit the field when compensation isn't disclosed, rather than showing $0 ([`contract-card.md` §3.3.2](contract-card.md#332-additional-compensation-states)).

⚠️ **Decision needed:** whether an offer can propose a range. The prototype's demo offer shows "$75–95/hr". An offer is usually a specific proposal, so a range may mean the terms aren't final yet. If a range is allowed, show it exactly as proposed, the same rule the Applications card follows for advertised ranges ([`applications-card.md` §2.3.1](applications-card.md#231-compensation-advertised-range-vs-agreed-amount)).

### 2.3 Expiration

The expiration is the card's main supporting fact. An offer is available for a limited time, so the card shows when it expires instead of a relevance signal ([`engagements.md` §4](engagements.md#4-offers-and-contracting)). It renders in the destructive tone as a time-sensitive warning.

✅ **Confirmed in Figma (2026-08-30):** the card shows "Expires on [date]" in place of a match tier.

✅ **Confirmed in Figma (2026-09-25):** the `expiration-date` label in both variants now uses Inter through the `sm` text style (14px regular), replacing the earlier `Google Sans Flex` font. Code already used Inter.

⚠️ **Gap:** the label's color in Figma is still a raw hex (`#d64242`), not bound to a token. With the urgency rule below, it needs two token-bound colors: `destructive` for 5 days or fewer, and the muted supporting-text color (`foreground/muted`) otherwise.

✅ **Resolved (2026-09-25) — the expiration's color and wording follow how close the deadline is:** an open offer always shows its expiration. Days are counted in calendar days.

| Time left        | Copy                                  | Color                               |
| ---------------- | ------------------------------------- | ----------------------------------- |
| More than 5 days | "Expires on Oct 9"                    | Muted (the supporting-text color)   |
| 5 days or fewer  | "Expires in 3 days", "Expires tomorrow" | Destructive                       |
| Last day         | "Expires today"                       | Destructive                         |

The wording changes with the color, so color is never the only signal (WCAG 1.4.1). The countdown reads as urgent without the red. This supersedes the earlier open decision on the expiration format. Both treatments are in the prototype's "2 offers" Dashboard view.

⚠️ **Decision needed:** whether the last day adds the time and timezone ("Expires today at 5 PM EDT"), as [`engagements.md` §4](engagements.md#4-offers-and-contracting) asks for material deadlines. The prototype's demo offers carry a date only.

ℹ️ "Expiring soon" is an urgency treatment of this date, not an offer status. Keeping it on the date means an offer doesn't change status as the deadline approaches.

### 2.4 Discipline

Figma's `offer-card` has an optional `Discipline` label in the right zone, and the component supports it. It is off everywhere in the prototype.

⚠️ **Decision needed:** what `Discipline` represents on an offer and whether it belongs on the card at all. The Applications card leaves the same field out pending the same discussion ([`applications-card.md` §2.3](applications-card.md#23-card-anatomy)).

## 3. Status model

The card follows the Offers filters in [`engagements.md` §4.1](engagements.md#41-offer-filters): **Open** while the offer awaits a response or its Contract doesn't exist yet, **Closed** once it has ended without becoming a Contract. The filter groups outcomes, and the card shows which one applies, the same pattern as `Not moving forward` in Applications.

| Filter     | Status                        | Badge (tone)                   | Supporting text (proposed)              | Expiration | "View offer" | Menu                   |
| ---------- | ----------------------------- | ------------------------------ | --------------------------------------- | ---------- | ------------ | ---------------------- |
| **Open**   | Offer received                | None                           | None                                    | Yes        | Yes          | View details, Decline  |
| **Open**   | Accepted · Contract pending   | `Accepted · Contract pending`  | To be defined                           | No         | Yes          | None (one item)        |
| **Closed** | Declined, before expiration   | `Declined` (neutral)           | "Declined by you on {date}"             | No         | No           | None (one item)        |
| **Closed** | Declined, since expired       | `Expired` (neutral)            | "Declined by you on {date}"             | No         | No           | None (row opens nothing) |
| **Closed** | Withdrawn by partner          | `Withdrawn` (neutral)          | "Withdrawn by partner"                  | No         | No           | None (one item)        |
| **Closed** | Expired, no response          | `Expired` (neutral)            | "Expired on {date}"                     | No         | No           | None (row opens nothing) |

ℹ️ The closed rows are defined in §3.2. `Accepted · Contract pending` is the only status not in the prototype. Every closed outcome is in the "2 offers" Engagements view (account menu → "2 offers" → Engagements → Offers → `Closed`).

### 3.1 Accepted offers stay open

An accepted offer never goes to `Closed`. It stays under `Open` as `Accepted · Contract pending` until the Contract exists, then leaves `Offers` for `Contracts`. It must not disappear during that handoff. Its history belongs to the Contract from then on ([`engagements.md` §4.1](engagements.md#41-offer-filters)).

⚠️ **Gap:** no design exists for an accepted offer's row. It probably keeps the "View offer" button and adds the badge, and its supporting text needs defining.

### 3.2 Closed row treatment

✅ **Resolved (2026-09-25) — a closed offer shows its outcome like a closed application:** when an offer moves to `Closed`, its row changes the same way a withdrawn application's does ([`applications-card.md` §2.4.1](applications-card.md#241-status-matrix)):

- The status badge shows the outcome, in the same `Badge` the Applications card uses.
- The supporting text before the badge gives the details, in the same muted style.
- The expiration date is removed, because a closed offer doesn't expire.
- The "View offer" button is removed, because there is nothing left to act on. The badge moves to the button's position, ending flush with the row like an Applications card.

✅ **Resolved (2026-09-25) — each closed outcome's badge, text, and click behavior:**

| What happened                                      | Badge       | Supporting text             | Row opens the offer detail |
| -------------------------------------------------- | ----------- | --------------------------- | -------------------------- |
| Declined by you, before the offer's expiration date | `Declined`  | "Declined by you on {date}" | Yes, from the row itself. No `···` menu, since View details would be its only item. |
| Declined by you, and the expiration date has since passed | `Expired` | "Declined by you on {date}" | No (pending, below)        |
| Withdrawn by the partner                            | `Withdrawn` | "Withdrawn by partner"      | Yes, from the row itself. No `···` menu, since View details would be its only item. |
| Expired with no response                            | `Expired`   | "Expired on {date}"         | No (pending, below)        |

All badges use the neutral tone. An offer counts as expired from the day after its expiration date, because it can still be answered on its last day. A row that opens nothing has no `···` menu (View details would be its only item) and no hover tint, so it doesn't look clickable.

ℹ️ The offer detail page doesn't exist yet. In the prototype, a row that opens the detail is clickable but goes nowhere.

⚠️ **Decision needed:** whether an expired offer's row should open the detail at all. It is not clickable for now. The detail could still be useful as a record of the proposed terms, even with nothing left to act on.

⚠️ **Risk:** a declined offer that later expires shows `Expired` while its supporting text says "Declined by you". Confirm that the badge should follow the expiration rather than the professional's decision. The alternative is to keep `Declined`, since the professional acted first.

ℹ️ The expired-with-no-response row isn't in the 2026-09-25 direction for closed offers. It is kept from the earlier status table (§3) so every way an offer closes has a row.

In `Closed`, rows are grouped into `Last 15 days` and `Older` by when each offer closed, most recent first ([`engagements.md` §4.1](engagements.md#41-offer-filters)).

⚠️ **Gap:** there is no Figma design for the closed row yet. The prototype reuses the Applications card's badge and supporting-text styles.

⚠️ **Decision needed:** the default sort for `Closed`, likely the most recent outcome first, matching the open question for `Not moving forward` ([`engagements.md` §3.1](engagements.md#31-application-filters)).

## 4. Row interaction

### 4.1 Row and "View offer"

The whole row is a click target that opens the offer detail, the same model as the Applications card ([`applications-card.md` §4](applications-card.md#4-row-interaction)). Unlike that card, an open offer also has a solid "View offer" button. The button and the row open the same destination.

✅ **Resolved (2026-09-25) — a primary CTA reflects the value of the next action, not whether the card can be opened:** every card in Engagements can be opened, so being clickable isn't a reason for a button. A card gets a persistent primary CTA when both are true:

- **The professional owns the next action.** They are the one who has to do something, not Verita or the partner.
- **That action is a meaningful step toward secured work.** Acting on it moves the professional closer to a contract, or into the work itself.

| Card         | Next action and owner                                                    | Primary CTA                                      |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| Offer        | Review and decide on the proposal. Owned by the professional.            | "View offer", always, while the offer is open    |
| Contract     | Do the work. Owned by the professional.                                  | "Open work" or similar ([`contract-card.md` §3.1](contract-card.md#31-contract-card-anatomy)), suppressed while paused |
| Match        | Apply, or clear what blocks applying. Owned by the professional.         | The recommended action ([`match-card.md` §6](match-card.md#6-recommended-action)) |
| Applications | Usually a decision by Verita or the partner.                             | None ([`applications-card.md` §4](applications-card.md#4-row-interaction)) |

An offer is the strongest case. It means the professional has come most of the way through the funnel and been selected, and the decision in front of them is the one right before securing work. So "View offer" gets primary-button treatment for as long as the offer is open. The expiration date sits next to it and adds urgency without competing with it: it is text, not a second action (§2.3).

An application is a tracking object. The professional has shown interest, but the outcome is uncertain, and the next step usually belongs to Verita or the partner. When the professional does owe something, the row says so through its status and supporting text (e.g. `Action required` with "Complete your assessment") instead of every application carrying a permanent button.

A closed offer loses its CTA for the same reason (§3.2): no action is left, so there is nothing to promote.

Hovering the row tints it with the shared `--hover-row` token, like every list row ([DESIGN.md](../DESIGN.md)). Selecting the button or a menu item never also triggers the row click.

### 4.2 Actions menu

On hover or keyboard focus, the row reveals a `···` actions menu. It uses the same pattern as application rows ([`applications-card.md` §4.1](applications-card.md#41-actions-menu)).

| Item         | Behavior                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View details | Opens the offer detail, the same destination as the row. Kept as an explicit, labeled item for keyboard and screen-reader users.                               |
| Decline      | Destructive. Declines the offer and moves it to `Closed` as `Declined` (§3.2). Only shown while the offer is `Offer received`.                                   |

The `···` trigger only shows when the menu has 2 or more items ([DESIGN.md](../DESIGN.md) "Hide a `···` menu with only one item"). In practice only an `Offer received` row has a menu: every other status would leave View details as the only item, and the row itself already opens the detail.

The menu has no divider before Decline. The destructive tone already sets it apart ([DESIGN.md](../DESIGN.md) "Actions menus — no dividers unless asked").

✅ **Resolved (2026-09-24) — the `···` menu replaces Figma's × dismiss:** the earlier hover × declined the offer while looking like "hide". Declining is now an explicit, labeled menu item.

⚠️ **Gap:** Decline runs immediately, with no confirmation or undo, like Withdraw on applications. Declining is irreversible, so the product needs a confirmation step once UCL has a dialog component.

🙋 Should an accepted offer's menu offer anything beyond View details, such as withdrawing the acceptance before the Contract exists?

### 4.3 Motion

The `···` reveal matches the Applications card. At rest it takes no space. On hover or keyboard focus its slot grows to 52px (16px gap, 32px button, 4px of focus-ring room), pushing the button and expiration date left while the trigger fades in. It stays open while the menu is open. The slot is clipped rather than unmounted, so keyboard users can still reach it, and the transition is off under reduced motion.

When an offer is declined:

- **Home:** when other offers remain, the declined row fades and collapses, so the list shrinks and the rows and modules below close the gap. When it's the last offer, the whole list leaves with the shared card-dismiss exit (fade and a soft scale-down), then the module closes ([`dashboard.md` §7.1](dashboard.md#71-opportunity-alert)). Under reduced motion both are opacity only.
- **Engagements → Offers:** the same as Home: the declined row collapses while others remain, and the whole list leaves with the last one. The empty state then fades in after that exit finishes, so the two never overlap.

## 5. Where the card appears

| Surface                        | What it shows                                                                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home → Opportunity alert       | One open offer under "New offer for you" ([`dashboard.md` §7.1](dashboard.md#71-opportunity-alert)), or several under "{n} new offers for you", soonest expiration first. Offers sit in one table list, a single bordered container with one row per offer, the same as Home's "Open applications" and "Top matches for you". The module doesn't render when there is no open offer. It never shows an empty placeholder. |
| Engagements → Offers → Open    | Every open offer, in one table list like Engagements → Applications ([DESIGN.md](../DESIGN.md) "Lists of rows are one table list"). The `Offers` view-tab count is the `Open` count, so the `Open` filter shows no counter of its own ([`engagements.md` §4.1](engagements.md#41-offer-filters)). |
| Engagements → Offers → Closed  | Every closed offer, each showing its outcome (§3.2). Not counted in the view-tab total.                                                                                                             |

Both surfaces show the same Offer. Declining it on Home moves it to `Closed` in Engagements, and it stays gone from Home.

### 5.1 Empty states

Each Offers filter has its own empty state, using the shared `EmptyState` component:

| Filter     | Title              | Description                                                           |
| ---------- | ------------------ | --------------------------------------------------------------------- |
| **Open**   | No open offers     | Offers you receive will appear here for you to review.                |
| **Closed** | No closed offers   | Offers you decline, or that expire or are withdrawn, will appear here. |

ℹ️ Both are draft copy written in the voice of the other Engagements empty states, pending product and design review.

## 6. Component content model

The `OfferCard` component (`src/components/cards/offer-card/`) maps to the anatomy as follows:

| Prop                                        | Anatomy element                   | Notes                                                                                 |
| ------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `company`, `logoSrc`, `logoAlt`             | `partner-logo`                    | `company="verita"` renders the bundled Verita mark.                                   |
| `partnerName`                               | `partner-name`                    | Required.                                                                             |
| `title`                                     | `opportunity-title`                     | Required.                                                                             |
| `compensation`, `engagementTerms`, `duration` | `terms-row`                     | Each part is omitted, with its separator, when not set.                               |
| `discipline`                                | `discipline`                      | Optional.                                                                             |
| `expirationDate`                            | `expiration-date`                 | Already formatted. Pass only while the offer is open.                                  |
| `supportingText`                            | `supporting-text`                 | Omit rather than pass an empty string.                                                |
| `statusLabel`, `statusTone`                 | `offer-status`                    | Omit for `Offer received`. `statusTone` defaults to neutral.                          |
| `showCta`, `ctaLabel`, `onCtaPress`         | `button`                          | `showCta` defaults to `true`. Closed offers pass `false`. `ctaLabel` defaults to "View offer". |
| `actionsMenu`, `actionsMenuLabel`           | `actions-menu`                    | Omit `actionsMenu` to hide the trigger. The label is required whenever it's set.      |
| `rowProps`                                  | Row click target                  | Passing `onClick` makes the whole row a focusable `role="button"`.                    |

## 7. Open questions

- 🙋 Can an offer propose a compensation range, or only a single value (§2.2)?
- 🙋 Does the expiration show a time and timezone on the last day (§2.3)?
- 🙋 What does `Discipline` represent on an offer, and should it appear on the card (§2.4)?
- 🙋 How does an accepted offer look before its Contract exists, and what does its supporting text say (§3.1)?
- 🙋 Is `Canceled` a separate outcome from `Withdrawn`, and does an offer where the professional requested changes need its own `Open` status ([`engagements.md` §4.1](engagements.md#41-offer-filters))?
- 🙋 What is the default sort for `Closed` (§3.2)?
- 🙋 Should an expired offer's row open the detail (§3.2)?
- 🙋 When a declined offer later expires, does its badge change to `Expired` or stay `Declined` (§3.2)?
- 🙋 Can the professional withdraw an acceptance before the Contract exists (§4.2)?
- 🙋 What does the Decline confirmation say, and does declining ask for a reason (§4.2)?

## 8. Related docs

- [`engagements.md`](engagements.md) — the Engagements PRD. [§4](engagements.md#4-offers-and-contracting) defines the Offer object; [§4.1](engagements.md#41-offer-filters) defines the `Open` / `Closed` filters, counts, and closed-row outcomes this card renders.
- [`dashboard.md`](dashboard.md) — the Home PRD. [§7.1](dashboard.md#71-opportunity-alert) defines the Opportunity alert module and its "New offer for you" heading.
- [`applications-card.md`](applications-card.md) — the sibling card for Applications. It shares this card's identity block, two-zone layout, actions-menu pattern, and closed-state treatment.
- [`contract-card.md`](contract-card.md) — the card an offer becomes once contracting completes. The source of the compensation formats (§3.3.1) and the duration model (§3.2.1) this card uses.
- [`match-card.md`](match-card.md) — the pre-Apply card. Its fit-tier vocabulary must never appear on an Offer card (§1).
