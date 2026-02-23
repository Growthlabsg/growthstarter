# Community Section – Detailed Build Prompt

**Purpose:** This document is the specification for building the **Community** section of the GrowthLab platform as a **powerful, fully native** experience. The section turns GrowthLab into the default platform where anyone can create, grow, and run their own purpose-built community — while using all of GrowthLab’s existing tools (feed, events, network, analytics, messaging, jobs, funding, etc.). The Community section must be built **separately** (like GrowthStarter and Apps & Deals) and integrated into the main GrowthLab header and product. It must use the **same branding, color scheme, and UX patterns** as GrowthStarter (see `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`).

**Ultimate objective:** Explode ecosystem growth and virality — every community builder becomes an active GrowthLab advocate because they get a best-in-class community platform for free (or freemium) with zero extra tooling required.

**→ Full feature & functionality blueprint (15 modules, MVP/V1/V2 roadmap, tickets):** see **`COMMUNITY_PLATFORM_BLUEPRINT.md`** in this folder. Use that doc for dev/design/PM scope and prioritization.

---

## 1. Core vision

- **One central “Community” tab** in the top GrowthLab header (next to Network, Feed, Events, etc.).
- **Any registered user** can become a **Community Builder** and create a community in **&lt; 60 seconds**.
- **Communities can be about anything:** AI Engineers, Fintech Founders, Climate Tech, No-Code Makers, Women in Web3, Singapore Startup Founders, Indie Hackers, etc.
- **Once users join a community,** all its posts, updates, events, and announcements appear **seamlessly in the main Feed** (already built).
- **Inside every community,** builders can create **unlimited sub-groups** (mini focus groups) for hyper-targeted discussions and updates.

---

## 2. Brand & design consistency

The Community section must use the **same colour scheme and UI** as GrowthStarter and the rest of GrowthLab. No new palettes or layout systems.

- **Colour scheme:** Primary teal `#0F7377`, teal light `#00A884`; same CSS variables, `.gs-gradient`, `.gs-gradient-text`, `.gs-card-hover`, `.gs-glass`, scrollbar, selection. Use for buttons, active tabs, links, focus rings.
- **Header (Community section):** Use **the same header design** as the Network section: **floating header only** for navigation. Do **not** use a static or sticky full-width top bar inside the Community section. The only nav is the **centred floating pill** (same style as in `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` Section 2.3). The floating nav is visible from the top of Community pages and includes: nav items (e.g. Feed, Network, Community, Events), divider, theme toggle, notifications, and primary CTA “Create Community” with `gs-gradient`. Active item (e.g. Community when on a Community route): `gs-gradient text-white shadow-md`. On mobile, use only the floating FAB (e.g. bottom-right) that opens the same nav + actions in a dropdown/sheet — no top bar. This keeps the Community section visually consistent with the Network section and the design reference.
- **Cards & modals:** Same rounded corners (`rounded-xl` / `rounded-3xl`), hover lift (`gs-card-hover`), teal CTAs, overlay `bg-black/50 backdrop-blur-sm` for modals.
- **Tech stack:** Next.js (App Router), Tailwind, shadcn/ui (New York, CSS variables), Lucide, next-themes. Same as GrowthStarter/Apps & Deals/Network.
- **Design reference:** For exact class names and tokens, use `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`. Celebration pops (e.g. “Community created!”) use the same confetti and modal pattern as Apps & Deals launch pop.

---

## 3. Header & navigation (floating header design)

The Community section uses **the same header design** as the Network section: **only the floating header** (centred pill). No static top bar. Exact implementation: see `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` Section 2.3 (Floating header – full code).

### 3.1 Floating pill contents (when user is in Community)

- **Nav items** (in the pill): e.g. Feed, Network, **Community** (active when on Community routes), Events, etc. Each can be a link or dropdown trigger.
- **“Community”** can expand to a **dropdown** (on hover or click) with:
  - **Browse Directory** — Community Directory (grid/list of all communities).
  - **My Communities** — communities the user has joined or built.
  - **Create New Community** — community creation flow.
  - **Trending** — trending communities.
  - **For Builders** — help, onboarding, Community of the Month, etc.
- **Divider** then: theme toggle, notifications bell, **“Create Community”** CTA with `gs-gradient`.
- **Active state:** When the user is on any Community page, the “Community” pill item uses `gs-gradient text-white shadow-md`; inactive items use `text-slate-600 hover:bg-slate-100` (and dark variants).

### 3.2 Mobile

- **Floating FAB** (e.g. bottom-right) that opens a sheet/dropdown with the same options (Feed, Network, Community submenu, Events, Create Community). No separate top bar in the Community section.

---

## 4. Community creation flow (dead simple)

**Goal:** Any user can create a community in **&lt; 60 seconds**. One-click entry everywhere.

### 4.1 Entry points

- “Create Community” / “Create New Community” in the Community dropdown.
- Prominent “Create Community” button on the Community Directory page and on “My Communities” when the user has none.
- Optional: CTA in Feed or onboarding (“Start your first community”).

### 4.2 Required fields

- **Name** (text).
- **Short tagline** (one line).
- **Full description** (rich text or textarea).
- **Category** (dropdown + option for custom/free text).
- **Tags** (multi-select or free tags for discoverability).
- **Logo** (image upload, required).
- **Banner** (image upload, required).
- **Privacy:** **Public** | **Approval-required** | **Invite-only**.

### 4.3 Optional but encouraged

- **Welcome message** (shown to new members).
- **Community guidelines** (text or rich text).
- **Custom color/theme** (optional override; must still respect accessibility and fallback to brand teal).
- **Sub-groups allowed** (toggle: yes/no; default yes).

### 4.4 Post-creation

- **Instant community profile** — the new community gets a live profile page (see Section 7).
- **Admin dashboard** — builder is taken to the community’s Admin view (see Section 10) with quick actions: invite members, create first sub-group, post announcement, schedule event.
- **Success:** Toast (“Community created!”) + **celebration pop** (same as “App launched!” — confetti `#0F7377`, `#00A884`, `#FFD700`, `#FF6B6B`, overlay, modal with “Community created!”, name, “Continue” / “Go to community”).

### 4.5 Non-negotiable

- **No-code everything.** No custom code or config files. All steps are forms, toggles, and uploads.
- **&lt; 60 seconds** for minimal path (required fields only); optional fields can be added later from the admin dashboard.

---

## 5. Community directory

**Location:** Under the Community tab (Browse Directory) and optionally linked from Network or a dedicated “Communities” area.

### 5.1 Layout

- **Beautiful grid/list view** of all communities (toggle or preference).
- **Each card shows:** logo, name, tagline, member count, activity indicator (e.g. “X posts this week”), **“Join”** button (instant for public; “Request to join” for approval-required; “Invite only” with request or link for invite-only).
- **Card style:** Same as GrowthStarter — `gs-card-hover`, rounded-xl, teal primary “Join” button.

### 5.2 Filters

- **Category** (from community category field).
- **Member count** (ranges or “Growing” / “Large”).
- **Activity level** (e.g. High / Medium / Low or posts per week).
- **Location** (if communities have location).
- **Trending** (growth or engagement over last 7–14 days).
- **New** (created in last 30 days).
- **Most Active** (sort by recent activity).

### 5.3 Search & discovery

- **Powerful search** — by name, tagline, description, tags, category.
- **“Recommended for you”** row — based on user profile, interests, and existing memberships (personalized).
- **Featured / Community of the Month** — GrowthLab can feature one or more communities at the top of the directory (builder tool + admin flag).

### 5.4 Empty & edge states

- Empty directory: “No communities yet. Be the first to create one.” + CTA to Create Community.
- No search results: “No communities match your filters.” + clear filters + Create Community.

---

## 6. Feed integration (critical)

- **When a user joins any community,** that community’s content **automatically appears in the main Feed** (already implemented on GrowthLab). No duplicate feed; one Feed that aggregates:
  - Global/platform posts.
  - All communities the user has joined (and optionally sub-groups they’ve joined).
- **Feed filter (user control):**
  - **All** — everything (default).
  - **Specific Community** — filter to one community’s feed.
  - **Specific Sub-Group** — filter to one sub-group’s feed.
- **Posting permission:**
  - Users can **post directly to the community** (main feed) or to **any sub-group they belong to**.
  - Option to cross-post to main community + sub-group where relevant (product decision).
- **Implementation note:** Community and sub-group posts must be stored with clear `communityId` and optional `subGroupId` so the main Feed can filter and merge correctly. Same auth and identity as the rest of GrowthLab.

---

## 7. Community profile page (public & private views)

**URL pattern:** e.g. `/community/[slug]` or `/community/[id]`.

### 7.1 Public view (anyone or members-only depending on privacy)

- **Hero:** Banner image + logo overlay + community name + tagline.
- **Stats bar:** Members count, Posts this week, Upcoming events (count or next event).
- **Tabs:**
  - **Home** — pinned posts + recent activity (snippet).
  - **Feed** — full posts & updates (paginated).
  - **Sub-Groups** — list of sub-groups with member count, join CTA.
  - **Members** — member list (optional: show only if member or public).
  - **Events** — events hosted in/for this community (from GrowthLab Events).
  - **Resources** — custom pages, resource library, links.
  - **About** — full description, guidelines, welcome message, category/tags.
- **Primary CTA:** “Join” (or “Request to join” / “Invite only” based on privacy).
- **Design:** Same layout patterns as GrowthStarter project/community pages; teal accents, same card and button styles.

### 7.2 Private view (members only)

- Same tabs; “Members” and some admin-only areas visible as per role.
- Members see “Leave community” and notification preferences.

### 7.3 Builder / admin view

- **Extra “Admin” tab** (or dashboard link) for builders and moderators.
- **Full controls:** See Section 10 (Builder tools). Admin tab includes: moderation queue, member approval, create/edit sub-groups, analytics link, settings (privacy, guidelines, theme, featured posts), invite links, referral.

---

## 8. Sub-groups (mini focus groups)

- **Builders or moderators** can create **unlimited sub-groups** inside the main community (e.g. “AI Agents”, “Seed Funding”, “Hiring”).
- **Each sub-group has:**
  - **Name, short description, optional image.**
  - **Mini-feed** — posts only for that sub-group.
  - **Member list** — who’s in the sub-group (join/leave).
  - **Events** — events scoped to the sub-group (using GrowthLab Events).
  - **Pinned resources** — links or custom content.
- **Join flow:** From the community profile, user clicks “Join” on a sub-group; membership can be automatic (if already in community) or require approval (configurable per sub-group).
- **Posting:** Users can post to the sub-group feed; optionally show in main community feed as “Posted in [Sub-group]” for visibility.
- **Perfect for:** Focused discussions and updates without spamming the whole community.

### 8.1 Sub-group profile / page

- **URL:** e.g. `/community/[slug]/group/[subGroupSlug]`.
- **Content:** Same structure as main community but scoped: hero (optional), feed, members, events, resources, about.
- **Admin:** Builder/moderator can edit sub-group, pin posts, manage members.

---

## 9. Full platform resource access for communities

Builders and members **automatically** get to use everything GrowthLab already offers. No separate signup; same auth.

- **Events** — Create and host events (webinars, meetups, workshops) using the existing GrowthLab event system; events can be scoped to a community or sub-group.
- **Chat & messaging** — Use GrowthLab Chat and direct messaging; optional community-wide or sub-group channels if the product supports it.
- **Jobs board** — Access and post to Jobs (with optional “Posted in [Community]”).
- **Funding & investors** — Access Funding opportunities, Investor database (Network section).
- **Polls, AMAs, challenges** — Run inside the community or sub-group (use existing or new lightweight tools).
- **Analytics** — Community-level analytics dashboard (growth, engagement, retention); see Section 10.
- **Custom pages & resource library** — Builders can add custom pages and a resource library (links, files, or embedded content) inside the community.

**Implementation:** Community and sub-group IDs are passed or scoped when calling existing GrowthLab APIs (events, jobs, messaging) so that “Create event” from a community creates an event tied to that community.

---

## 10. Builder tools & moderation (to make it irresistible)

### 10.1 Moderation suite

- **Approve members/posts** — For approval-required communities: queue of pending members and (if enabled) pending posts.
- **Mute / ban** — Mute or ban members; remove posts; block from sub-groups.
- **Featured posts** — Pin posts to Home or Feed; feature in directory or “Community of the Month” (if GrowthLab supports it).
- **Roles:** Builder (owner), Moderator (assignable), Member. Permissions: who can create sub-groups, approve members, delete posts, etc.

### 10.2 Analytics & export

- **Community analytics dashboard:** Growth (members over time), engagement (posts, replies, reactions), retention (DAU/WAU, stickiness).
- **Export:** Export member list (with privacy controls), post activity, or event list (CSV or similar) for builders.

### 10.3 Monetization path (future)

- **Paid tiers** — Option to add “Premium Community” plan later (e.g. paid membership, gated sub-groups). Design data model and roles so a “premium” flag or tier can be added without a full rewrite.
- **Verified badge** — Option for GrowthLab to mark a community as “Verified” (badge on card and profile). Field: `verified: boolean`; only GrowthLab admin can set.

### 10.4 Invite & growth

- **Invite links** — Builder can generate invite links (for invite-only or to pre-approve).
- **Referral system** — Track who invited whom; optional rewards or leaderboard for builders.
- **Embeddable widgets** — Optional: small widget (e.g. “Join us on GrowthLab”) for external sites; links to community join page.

---

## 11. User experience extras (to drive virality)

- **“My Communities”** — Dedicated section in user profile (and in Community dropdown) listing joined and built communities; quick access to each.
- **Notifications:**
  - New posts (from communities/sub-groups the user follows).
  - Event invites (events in their communities).
  - Join requests (for builders: pending approvals).
  - Sub-group activity (optional: new posts in sub-groups they’re in).
- **Mobile-first** — Layout and touch targets work on all devices; same design language as desktop.
- **Onboarding tour for new builders** — First-time builder sees a short tour: “Welcome! Here’s how to grow your community in 5 minutes…” (invite members, create a sub-group, post an announcement, schedule an event). Dismissible; optional “Skip” or “Remind later.”
- **Community of the Month** — GrowthLab can feature one community in the directory (hero or top row); configurable by admin; badge or label on card.

---

## 12. Success metrics (what to track)

Implement analytics and dashboards so the business can measure:

- **Number of communities created** (target: e.g. 500+ in first 3 months).
- **Total community members** (and members per community).
- **Active communities** (e.g. at least one post or event in last 30 days).
- **% of platform users who join at least one community.**
- **Feed engagement from community content** (views, likes, comments on community posts in main Feed).
- **Events hosted inside communities** (count, attendance).
- **Retention & NPS of community builders** (e.g. builders who create a second community or still active after 90 days).

Store events (community_created, member_joined, post_created, event_created, etc.) for analytics and product iteration.

---

## 13. Non-negotiables

- **Extremely easy for non-technical builders** — No-code everything: forms, toggles, uploads, dropdowns. No custom code or config.
- **Feels native to GrowthLab** — Same design language (teal, gradients, cards, modals), same authentication, same header. Community is a first-class section, not a bolt-on.
- **Scalable and performant from day one** — Pagination, indexing (search), and efficient queries for directory and feeds; consider caching for directory and trending.
- **Strong moderation & safety tools from launch** — Approve/remove members, moderate posts, mute/ban, report flow, and clear guidelines in the product from day one.

---

## 14. Data models (suggested)

Use these as a starting point; adjust to your backend.

### 14.1 Community

- `id`, `slug`, `name`, `tagline`, `description`, `category`, `tags[]`, `logoUrl`, `bannerUrl`
- `privacy`: `'public' | 'approval' | 'invite-only'`
- `welcomeMessage`, `guidelines`, `customTheme` (optional), `subGroupsAllowed`: boolean
- `ownerId`, `createdAt`, `updatedAt`
- `memberCount`, `postCountThisWeek` (or derived), `verified`: boolean (GrowthLab-set)

### 14.2 CommunityMember

- `id`, `communityId`, `userId`, `role`: `'builder' | 'moderator' | 'member'`
- `joinedAt`, `status`: `'active' | 'muted' | 'banned'`
- Pending: `status`: `'pending'` for approval-required

### 14.3 SubGroup

- `id`, `communityId`, `slug`, `name`, `description`, `imageUrl` (optional)
- `createdBy`, `createdAt`, `updatedAt`
- Member list: `SubGroupMember` (userId, subGroupId, joinedAt)

### 14.4 CommunityPost

- `id`, `communityId`, `subGroupId` (optional), `authorId`, `content`, `pinned`, `createdAt`, `updatedAt`
- Feed aggregation uses `communityId` (+ optional `subGroupId`) to merge into main Feed.

### 14.5 Events

- Use existing GrowthLab Event model with `communityId` and optional `subGroupId` for scoping.

---

## 15. Routes (suggested)

- `/community` — Redirect to directory or “My Communities.”
- `/community/browse` or `/community/directory` — Community Directory (grid/list, filters, search).
- `/community/create` — Create Community flow (multi-step or single form).
- `/community/my` — My Communities (joined + built).
- `/community/trending` — Trending communities.
- `/community/builders` — For Builders (help, onboarding, Community of the Month).
- `/community/[slug]` — Community profile (public/private view; tabs: Home, Feed, Sub-Groups, Members, Events, Resources, About, Admin).
- `/community/[slug]/group/[subGroupSlug]` — Sub-group page.
- `/community/[slug]/admin` — Builder dashboard (or tab inside profile).
- `/community/[slug]/settings` — Community settings (builder only).

---

## 16. Summary checklist

- [ ] **Branding:** Same colours (#0F7377, #00A884), CSS variables, .gs-gradient, .gs-card-hover, .gs-glass.
- [ ] **Header:** Use **the same header design as the Network section: floating header only** (no static top bar). Centred floating pill with nav items (Feed, Network, Community with dropdown, Events), theme toggle, notifications, “Create Community” CTA; Community dropdown: Browse Directory | My Communities | Create New Community | Trending | For Builders. Mobile: floating FAB + sheet only. See Section 3 and `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` Section 2.3.
- [ ] **Creation flow:** &lt; 60 seconds; required: name, tagline, description, category, tags, logo, banner, privacy; optional: welcome message, guidelines, theme, sub-groups allowed; post-creation: instant profile + admin dashboard; celebration pop on success.
- [ ] **Directory:** Grid/list, filters (category, member count, activity, location, trending, new, most active), search, “Recommended for you,” Community of the Month; card: logo, name, tagline, members, Join (instant / request / invite-only).
- [ ] **Community profile:** Hero (banner + logo), stats, tabs (Home, Feed, Sub-Groups, Members, Events, Resources, About), Admin tab for builders; public/private/member views.
- [ ] **Feed integration:** Joined communities’ content in main Feed; filter by All / Community / Sub-Group; post to community or sub-group.
- [ ] **Sub-groups:** Unlimited per community; mini-feed, members, events, pinned resources; join from community page; builder/moderator can create and manage.
- [ ] **Platform access:** Events, Chat, Jobs, Funding/Investors, polls/AMAs/challenges, analytics, custom pages & resource library — all using existing GrowthLab tools, scoped by community/sub-group where needed.
- [ ] **Builder tools:** Moderation (approve, mute, ban, featured posts), analytics dashboard, export; invite links, referral; optional verified badge and Premium Community later.
- [ ] **UX:** My Communities in profile and dropdown; notifications (posts, event invites, join requests, sub-group activity); mobile-first; onboarding tour for builders; Community of the Month in directory.
- [ ] **Metrics:** Track communities created, total members, active communities, % users in ≥1 community, feed engagement from community content, events in communities, builder retention/NPS.
- [ ] **Non-negotiables:** No-code for builders; native GrowthLab look and auth; scalable/performant; strong moderation and safety from launch.

Use this document as the single source of truth for building the **Community** section so it integrates natively with GrowthLab, uses the same colour theme and UI, and delivers a best-in-class, viral community product.
