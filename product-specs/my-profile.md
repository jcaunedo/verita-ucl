<!--
Created: Sep 15, 2026
Created by: Julio Caunedo
Last updated: Sep 15, 2026
Scope: Verita AI professional Profile page — Profile, Experience, Preferences, Authorization, Availability, and Notifications tabs.
Purpose: Define the product, UX, and content requirements for the My Profile destination, derived from design-rationale notes on the profile's information architecture and interaction model.
-->

# My Profile PRD

**Status:** Draft for product and design alignment
**Primary users:** Independent professionals and experts across various fields and professions who use Verita to find, apply to, and get paid for project-based work opportunities.

**Related doc:** `product-specs/engagements.md` — the Engagements PRD covers the user's interactions with specific opportunities (applications, offers, contracts). This doc covers the standing representation of the expert themselves, which Engagements and matching read from but do not define.

## 1. What My Profile is

My Profile is not an account settings page and not a single long recruiting application form. It is a structured representation of an expert that Verita uses to:

- Represent the expert professionally.
- Understand their experience and qualifications.
- Improve opportunity matching.
- Determine work eligibility.
- Understand what type of work they are interested in.
- Understand when they are available.
- Establish how Verita should communicate with them.

The information architecture follows one mental model, one tab per question:

| Tab           | Primary question                | Meaning                          |
| ------------- | -------------------------------- | --------------------------------- |
| Profile       | Who are you?                     | Who you are                       |
| Experience    | What have you done?              | What you've done                  |
| Preferences   | What do you want to do?          | What you want                     |
| Authorization | Where/how can you legally work?  | Where/how you can legally work    |
| Availability  | When can you work?               | When you can work                 |
| Notifications | How should Verita contact you?   | How Verita communicates with you  |

This separation is deliberate: identity, evidence, intent, eligibility, capacity, and communication are six different concepts, and keeping them in distinct tabs removes ambiguity about where any given field belongs (§13).

> ℹ️ Each tab represents a distinct user question instead of exposing one long profile form. This framing governs every content and structure decision in this doc.

## 2. Core interaction model

### 2.1 Progressive disclosure instead of a long form

The profile does not present every field and input simultaneously. Each section behaves as a compact content module with one state machine:

**Collapsed → Add/Edit → Expanded editing → Save → Collapsed**

By default, sections remain collapsed and optimized for scanning. When the user chooses **Add**, **Set up**, or **Edit** (§5), only that section expands into an editable state. After saving, the section returns to its compact, view-only state.

Only one section should generally be edited at a time.

> ✅ **Resolved:** frames showing all sections expanded simultaneously can exist for design specifications, but must not represent normal product behavior.

This model:

- Reduces cognitive load.
- Prevents the profile from feeling like an application form.
- Makes completed information easier to scan.
- Lets users build their profile incrementally.
- Keeps long profiles manageable as more information is added.
- Creates one consistent interaction pattern across very different data types (§19).

### 2.2 Consistency without rigidity

The same **Collapsed → Add/Edit → Expanded → Save → Collapsed** behavior is reused across every tab, but exact presentation adapts to the underlying data — a repeatable work-history object, a language + proficiency pair, a file upload (resume), a communication preference (Notifications), and a structured monetary input (Compensation) all need different controls inside the same shell.

> ⚠️ **Gap:** the specific control per data type (repeatable list-and-form, single-value picker, file upload, toggle group) is not yet enumerated per section below. Confirm with design during component spec.

## 3. Section-state content strategy

Copy changes by section state rather than using one generic description everywhere.

| State | Strategy | Guidance |
| --- | --- | --- |
| Empty | Benefit-oriented | Explain the value of adding the information, framed from the expert's perspective. Avoid repeating "helps Verita…" |
| Edit | Task-oriented | State exactly what the user needs to add, select, enter, update, connect, or upload. Concise and actionable. |
| Completed | Content-first | The saved values are the primary interface. Descriptions are unnecessary by default; retain supporting copy only for context, privacy information, interpretation, trust, or the consequences of a setting. |

> ℹ️ This prevents completed profiles from becoming visually repetitive, and prevents empty states from reading as an internal justification ("helps Verita match you") rather than a user benefit.

### 3.1 Collapsed versus expanded descriptions

A related pattern applies to sections that retain descriptions in both states:

- **Collapsed = context + value** — what the information represents, why it matters, how it affects the expert's experience.
- **Expanded = task guidance** — what the user needs to provide, select, or update.

Content changes with user intent instead of repeating identical helper text in both states.

## 4. Required versus optional information

Required status is driven by product necessity, not by a desire to maximize profile completeness.

Information is generally **required** when Verita cannot otherwise reliably:

- Represent the expert.
- Match them to work.
- Determine eligibility.
- Determine practical availability.

Supporting evidence and enrichment generally stay **optional**.

> ⚠️ **Decision needed:** the exact required/optional designation per field (§7–§12) is not yet finalized. This doc states the governing principle; a full required-field list needs product sign-off before implementation.

The interface must visually distinguish required information without making optional sections feel unimportant — optional sections still communicate their value through benefit-oriented empty states (§3).

## 5. Action terminology

Actions reflect what the user is actually doing rather than forcing every section into the same vocabulary:

- **Add** — for creating repeatable content: work experience, education, certifications, publications, awards, projects.
- **Edit** — for changing existing information. Once a section contains information, its primary action generally becomes Edit.
- **Set up** (or similarly contextual language) — where the user is configuring something rather than adding an object (e.g. timezone is **set**, not **added**).

## 6. Profile completion philosophy

Profile completion supports progressive enrichment rather than requiring users to complete everything upfront. Three broad levels of information:

| Level | Definition |
| --- | --- |
| Foundational | Required for Verita to establish identity and core opportunity eligibility. |
| Matching | Materially improves recommendations and opportunity fit. |
| Enrichment | Strengthens credibility and provides additional professional evidence. |

> ⚠️ **Decision needed:** whether a global completion percentage/indicator exists at all, and if so, how foundational/matching/enrichment sections are weighted. Not every section should contribute equally — an incomplete Awards or Publications section must not read as making the profile "unusable."

## 7. Profile tab

**Purpose:** Who the expert is. Establishes professional identity and foundational personal information. Stays focused on identity — not work history, legal eligibility, or work preferences, which live in their own tabs.

### 7.1 Core areas

- Profile image.
- Name.
- Professional headline.
- About you / professional summary.
- Current location.
- Languages.
- Professional links / additional profiles.
- Other foundational identity information required by Verita.

> ⚠️ **Gap:** "other foundational identity information required by Verita" is not itemized. Confirm the complete field list with product/compliance before implementation.

### 7.2 Professional headline

A concise professional positioning statement, not another job-title field. Quickly communicates the expert's professional focus or specialization by combining discipline, expertise, domain, and positioning — distinct from a formal role/title.

### 7.3 About you

Free-text space for professional context that cannot be expressed through structured fields: expertise, the type of problems the expert works on, background, relevant strengths or specializations.

> ✅ **Resolved:** the collapsed empty state must communicate the value of introducing their expertise, not simply instruct "write a bio."

### 7.4 Current location

Belongs under Profile because it describes the person's current professional context, not eligibility (eligibility lives under Authorization, §10).

- Collapsed state describes the information rather than phrasing it as a question (e.g. not "Where are you currently located?" — that question belongs in the edit state).
- Display favors recognizable, human-readable locations (**City, State**) over abbreviated or system-oriented formatting.

### 7.5 Languages

Part of the expert's professional identity and can influence opportunity fit.

- Use a single overall proficiency per language rather than separate Speaking/Reading/Writing/Comprehension fields — that granularity adds complexity without clear matching value today.
- Recommended proficiency taxonomy: **Native or bilingual, Fluent, Professional working proficiency, Conversational, Basic.**
- The language is the repeatable object; proficiency is an attribute of it.

> ⚠️ **Decision needed:** confirm the five-level taxonomy above with product/matching before implementation — this is a recommendation, not yet confirmed.

### 7.6 Professional links / additional profiles

Not limited to a single interpretation like "portfolio." Captures additional professional profiles and work that demonstrate expertise, experience, or contributions — GitHub, portfolio, personal website, Google Scholar, Dribbble, or other relevant professional profiles.

> ℹ️ Modeled as a flexible link object (label + URL), not a fixed set of per-platform fields — see §14, "avoid redundant fields," and §15 on designing across professions.

## 8. Experience tab

**Purpose:** What the expert has done, and evidence of their expertise. Kept separate from Profile so identity information doesn't get buried beneath professional history, since Experience can become significantly more detailed and repeatable.

> ✅ **Resolved — tab named Experience, not Resume:** Resume is a single artifact (a document); Experience is the underlying professional record. The tab holds Work Experience, Featured Projects, Education, Skills, Certifications, Publications, and Awards — calling the whole tab "Resume" would make those objects feel like parts of a file rather than first-class profile data. Experience also scales better across professions: not every expert is best represented by a traditional résumé — a researcher may rely more on publications, an engineer on projects and GitHub, a consultant on engagements. Resume is an input; Experience is the product model. The resume itself still lives inside Experience (§8.2), as one of the strongest sources of professional context, not as the tab's namesake.

### 8.1 Information hierarchy

**Resume → Work experience → Featured projects → Education → Skills → Certifications → Publications → Awards**

The order moves from primary evidence toward supporting qualifications:

- **Primary professional evidence:** Resume, Work experience — fastest overall understanding of a career.
- **Applied evidence:** Featured projects — practical application and outcomes.
- **Qualifications:** Education, Skills, Certifications — structured evidence of capability.
- **Supporting recognition:** Publications, Awards — further establish expertise without dominating the hierarchy.

### 8.2 Resume

Placed near the top — provides broad professional context quickly and may support profile completion or future extraction workflows. Complements structured experience; does not replace it.

> ⚠️ **Gap:** accepted file format(s) not yet confirmed. If only PDF is accepted, the format guidance must be integrated naturally into the upload experience (e.g. inline with the dropzone), not left as isolated, context-free copy like "PDF only."

### 8.3 Work experience

Structured employment history. Each experience is a repeatable object — added, viewed, and edited independently; the page must not display multiple editable employment forms simultaneously (§2.1).

Saved experience prioritizes scanability — role, organization, dates, and relevant contribution/context should be understandable at a glance.

### 8.4 Featured projects

Evidence that may not map cleanly to traditional employment — valuable for consultants, founders, freelancers, researchers, designers, engineers, and experts whose strongest work spans organizations or engagements. Kept separate from Work experience so all professional evidence isn't forced into a job-history model.

### 8.5 Education

Uses recognizable recruiting conventions without collecting unnecessary data: institution, degree, field of study/major, dates. **Degree** and **Major/Field of study** are distinct labels because they represent different concepts.

> ✅ **Resolved:** GPA is collected only if Verita has an actual matching, qualification, or client requirement for it — otherwise it's unnecessary disclosure and form complexity.

### 8.6 Skills

Structured matching signals — not a long freeform résumé keyword list. Primary value: opportunity relevance, search, matching, understanding areas of expertise. The experience itself remains the stronger evidence of capability; skills are a signal layer on top of it.

### 8.7 Certifications

Structured professional credentials that may matter for particular industries or opportunities. Positioned after Skills — they supplement expertise rather than define the entire professional identity.

Typical fields: certification name, issuing organization, issue date, expiration where applicable, credential URL or identifier where relevant. The issuer field must clearly communicate the awarding organization.

### 8.8 Publications

Demonstrates expertise, research, thought leadership, or professional contribution. Must work across disciplines and publication types, not assume academic papers only — articles, research papers, books, research publications, other published professional work.

Fields: **Name/Title** and **Source** (distinguishing the work itself from where it was published). Optional enrichment, not a foundational profile requirement.

### 8.9 Awards

Evidence of professional recognition. Belongs under Experience, not Profile, because awards describe achievements, not identity. Optional, positioned after stronger evidence (history, projects, education, skills, credentials).

## 9. Preferences tab

**Purpose:** What type of work the expert wants.

> ✅ **Resolved:** the nav label is **Preferences**, not **Work Preferences** — the Profile context already establishes these are professional preferences, so "Work" is redundant in the tab name.

### 9.1 Opportunity / project interests

What the expert is interested in doing — not a generic list of job titles. Can describe types of projects, types of roles, areas of expertise they want to apply, problems they're interested in solving, industries or domains, and preferred engagement characteristics.

Answers **"What kind of work are you interested in?"** rather than reproducing résumé data — past experience and future interest are not necessarily the same thing.

### 9.2 Compensation expectations

Named directly as **Compensation expectations**, not hidden under vague terminology like "Engagement preferences" — this better matches the user's mental model. Purpose: establish economic alignment before unnecessary recruiting activity occurs.

> ⚠️ **Gap:** the compensation data model must accommodate multiple engagement models (salaried, hourly/contract rate, project-based, etc.) rather than assuming salaried employment. Exact structure not yet defined.

### 9.3 Preferences remain flexible

Preference information should improve matching without unnecessarily excluding opportunities. Where possible, the system distinguishes hard constraints from softer preferences — a stated preference is a signal about desired work, not always an absolute eligibility condition.

> ⚠️ **Decision needed:** how hard constraints vs. soft preferences are modeled and surfaced to matching is not yet defined.

## 10. Authorization tab

**Purpose:** Where and under what conditions the expert is legally authorized to work.

> ✅ **Resolved:** the nav label is **Authorization**, not **Work Authorization** — the Profile context makes the shorter label sufficient.

Kept separate from Profile because it carries regulatory/recruiting information with a different purpose and sensitivity than identity.

### 10.1 Work authorization model

Uses conventional recruiting language. Core questions:

- Is the expert authorized to work in the relevant country?
- Do they currently require sponsorship?
- Will they require sponsorship in the future?

Completed-state copy summarizes the answer naturally rather than displaying raw form responses — e.g. "is authorized to work in the United States and does not require sponsorship now or in the future."

> ✅ **Resolved:** authorization must not be conflated with citizenship. Citizenship must not be collected as a proxy for authorization when work authorization is the actual business requirement.

### 10.2 Demographic information

Race/ethnicity and similar demographic data are fundamentally different from work authorization. If collected for compliance or reporting purposes, they must:

- Be clearly separated from eligibility decisions.
- Explain why the information is collected.
- Include appropriate voluntary / prefer-not-to-answer mechanisms where applicable.
- Avoid implying that demographic information affects matching.

> ⚠️ **Decision needed:** whether demographic data is collected at all in v1, and if so, under what compliance basis and UI separation from the Authorization questions above.

## 11. Availability tab

**Purpose:** When the expert can realistically take on work.

Availability gets its own tab because it is operational and changes more frequently than core Profile or Experience information, and separating it avoids mixing scheduling constraints with professional preferences (§9).

### 11.1 Availability status

Whether the expert is currently open to opportunities, and when they could begin. Must be understandable at a glance in the collapsed state.

### 11.2 Typical schedule

"Typical schedule" (not a rigid commitment) represents recurring availability — especially relevant to contract, project-based, part-time, or globally distributed work. May include: days available, typical working hours, hours per week or capacity where required. The model must avoid making preferences unnecessarily rigid.

### 11.3 Timezone

Placed within or directly alongside Typical schedule, since working hours can't be interpreted correctly without it — not treated as an isolated top-level concept.

> ✅ **Resolved:** timezone is something the user **sets** (§5), not something they "add." The interface should infer a useful default where appropriate but allow explicit correction.

### 11.4 Profile availability vs. Contract availability

> ✅ **Resolved:** Profile availability (§11.2's Typical schedule) and Contract availability are **separate data objects**, not one object read in two contexts.

An active contract may require the expert to submit their planned availability or allocated hours at the beginning of each week. This is a distinct object from Typical schedule, not a contract-scoped view of the same data:

| | Profile availability (§11.2) | Contract availability |
| --- | --- | --- |
| What it represents | General working schedule | Specific weekly commitment |
| Cadence | Configured once, updated as needed | Submitted for each applicable week |
| Used for | Matching | Planning an active engagement |
| Belongs to | `Profile` | `Contract` |

Keeping them separate matters because they answer different questions at different moments: Typical schedule is a standing signal used before any work exists, to help match the expert to opportunities in the first place. Contract availability is a recurring commitment tied to work that already exists, used by Verita/the client to plan the coming week — it has no bearing on matching and shouldn't be conflated with it. A change to one must not silently overwrite the other.

The recurring "submit weekly availability" task this produces is defined as a **Recurring** task type in [`product-specs/next-steps-card.md` §3.1](next-steps-card.md#31-task-generation-model), generated per active contract on a weekly cadence, distinct from any one-time confirmation of Typical schedule (§11.2).

## 12. Notifications tab

**Purpose:** How Verita communicates with the expert. Separated from Profile because these are communication settings, not professional information.

### 12.1 Notification categories

- Opportunity recommendations.
- Application updates.
- Assessment activity.
- Interview updates.
- Offers.
- Secured-work updates.
- Messages.
- Account/security notifications.
- Product or platform updates where appropriate.

> ⚠️ **Gap:** exact category list and default on/off state per category not yet confirmed. Prioritize events that materially affect the expert's relationship with opportunities.

### 12.2 Channel-specific communication

When SMS is available, descriptions can include the actual destination number already associated with the profile (e.g. "Receive SMS updates at +1 …") so users aren't asked to re-enter contact information they've already given.

> ✅ **Resolved:** Profile remains the source of truth for personal contact information (phone number lives under Profile, §7); Notifications only controls how those channels are used. This avoids duplicating phone-number management across multiple settings — see §14.

## 13. Cross-tab information architecture principles

The tab structure deliberately separates six different concepts — identity, evidence, intent, eligibility, capacity, and communication — per the table in §1. This creates clearer boundaries and reduces ambiguity about where any given piece of information belongs.

## 14. Avoid redundant fields

A field has one primary source of truth:

- Phone number belongs to Profile/contact data; Notifications only references it (§12.2).
- Timezone supports availability/scheduling (§11.3) rather than being collected repeatedly elsewhere.
- Resume complements Work Experience (§8.2) rather than creating a second, competing experience model.
- Professional links use one flexible object model (§7.6) rather than separate dedicated fields per external platform.

## 15. Design for multiple professions

Verita represents industry experts broadly, not one specific profession. The profile model must not assume everyone is a software engineer, designer, academic, or traditional full-time employee — fields and copy must work across business, technical, scientific, medical, creative, and operational expertise.

Broad object models are preferred over profession-specific terminology unless the underlying field is explicitly domain-specific. Examples already reflected in this doc: **Additional profiles** (§7.6), **Publications** (§8.8), **Featured projects** (§8.4).

## 16. Matching without exposing matching mechanics

Profile information exists partly to improve matching, but user-facing copy must not repeatedly reference Verita's internal processes. Copy should emphasize outcomes: more relevant opportunities, better representation of expertise, stronger professional credibility, opportunities aligned with interests, work aligned with availability.

> ℹ️ This governs the empty-state copy strategy in §3 — benefit framed from the expert's perspective, not "helps Verita match you."

## 17. Scanability over form density

The completed Profile should feel like a professional record, not a settings form. Users should be able to quickly scan identity, experience, expertise, preferences, eligibility, and availability. Inputs are temporary interaction states; saved information is the product — the reason every section returns to a compact read-only state after saving (§2.1).

## 18. Entities

Entities owned by this doc's scope:

- `Profile` (identity: image, name, headline, about, location, languages, links)
- `WorkExperience`
- `FeaturedProject`
- `Education`
- `Skill`
- `Certification`
- `Publication`
- `Award`
- `Resume`
- `Preference` (opportunity/project interests, compensation expectations)
- `WorkAuthorization`
- `DemographicInfo`
- `Availability` (status, typical schedule, timezone) — profile-level only; see §11.4 for why `ContractAvailability` is a separate object owned by `Contract` (`engagements.md`), not by `Profile`.
- `NotificationSetting`

```text
User
├── Profile
│   └── Language[]
│   └── ProfessionalLink[]
├── Experience
│   ├── Resume
│   ├── WorkExperience[]
│   ├── FeaturedProject[]
│   ├── Education[]
│   ├── Skill[]
│   ├── Certification[]
│   ├── Publication[]
│   └── Award[]
├── Preferences
│   ├── OpportunityInterest[]
│   └── CompensationExpectation
├── WorkAuthorization
│   └── DemographicInfo (optional, compliance-scoped)
├── Availability
│   └── Timezone
└── NotificationSetting[]
```

> ℹ️ This tree is scoped to My Profile. `Application`, `Offer`, `Contract`, `Assessment`, and `TalentNetworkMembership` are owned by `product-specs/engagements.md` and read from `Profile`/`Experience`/`Preferences` for matching rather than duplicating those fields.

## 19. Guiding principle

The Profile should progressively build a high-quality representation of the expert without making profile creation feel like completing a long recruiting application.

Every section must justify its presence through at least one of:

- Represent the expert better.
- Match them to more relevant work.
- Establish eligibility or availability.
- Enable the relationship between Verita and the expert.

Information that does not meaningfully support one of these outcomes should be questioned before being added to the profile.

## 20. Open questions

- 🙋 What is the complete field list for "other foundational identity information required by Verita" (§7.1)?
- 🙋 Is the five-level language proficiency taxonomy (§7.5) confirmed with matching/product?
- 🙋 What resume file format(s) are accepted, and does resume content feed any extraction workflow (§8.2)?
- 🙋 What is the compensation expectations data model across engagement types (§9.2)?
- 🙋 How are hard constraints vs. soft preferences modeled and exposed to matching (§9.3)?
- 🙋 Is demographic information collected in v1, and under what compliance basis (§10.2)?
- 🙋 What is the full notification category list and default state per category (§12.1)?
- 🙋 Does a global profile-completion indicator exist, and if so, how are Foundational/Matching/Enrichment sections weighted (§6)?
</content>
</invoke>
