# Community & Forum Platform – Feature & Functionality Blueprint

**Product:** GrowthLab Community  
**Audience:** Dev, Design, PM  
**Purpose:** Single source of truth for scope, prioritization, and tickets.  
**Design/UI reference:** `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` (same branding, teal, components).

---

## Prioritization Overview

| Phase | Timeline | Focus |
|-------|----------|--------|
| **MVP** | 6–8 weeks | Launch: create, directory, membership, feed, sub-groups, events (basic), moderation, notifications, resources, basic analytics |
| **V1** | +8 weeks | Roles, flairs/topics, @mentions, event RSVPs/recordings, full admin, mobile polish, digest emails |
| **V2** | Later | Gamification, paid features, voice rooms, advanced analytics, API, white-label |

---

## 1. Community Creation & Setup (Builder-Focused)

**Phase:** MVP (extend current flow)

| # | Feature | Acceptance criteria | Notes / code |
|---|--------|---------------------|--------------|
| 1.1 | One-click “Create Community” | Entry from header dropdown + profile; single clear CTA | ✅ Header + `/community/create` |
| 1.2 | Wizard-style creation | Steps: Name → Tagline → Description → Category + custom → Tags → Logo → Banner → Theme → Privacy | Current: single form; **TODO:** split into wizard steps |
| 1.3 | Category picker + custom | Dropdown from fixed list + “Other”/custom text | ✅ Categories in mock + custom |
| 1.4 | Logo + Banner/Cover upload | Image upload (or URL for MVP); crop/ratio guidance | Current: URL only; **TODO:** file upload |
| 1.5 | Primary color/theme picker | Optional override; must respect a11y; fallback to brand teal | ✅ `customTheme` in types; **TODO:** UI picker |
| 1.6 | Privacy settings | Public, Approval-only, Invite-only, **Secret** (hidden from directory) | ✅ Public/Approval/Invite; **TODO:** Secret + directory filter |
| 1.7 | Default templates | “Startup Founders”, “AI Builders”, “Fintech Circle”, “Hobby Community”, “Corporate Internal”, Blank | **TODO:** template selector that pre-fills name/category/guidelines |
| 1.8 | Welcome message + onboarding checklist | Rich text welcome; checklist items (e.g. “Complete profile”, “Join a sub-group”) | ✅ Welcome message; **TODO:** checklist config + UI |
| 1.9 | Custom URL slug | e.g. `growthlab.com/c/ai-founders`; editable; uniqueness validation | ✅ `slug` in model; **TODO:** slug editor in create/settings |
| 1.10 | SEO-friendly public landing | Meta title/description, OG image, clean URL for sharing | **TODO:** meta tags per community, sitemap |

**User stories (examples)**  
- As a builder I can create a community in under 2 minutes using a template.  
- As a builder I can set my community to Secret so it doesn’t appear in the directory.

---

## 2. Community Directory & Discovery

**Phase:** MVP (current) + V1 (recommendations)

| # | Feature | Acceptance criteria | Notes / code |
|---|--------|---------------------|--------------|
| 2.1 | “Community” tab + dropdown | Browse, My Communities, Create, Trending, For You | ✅ Implemented |
| 2.2 | Searchable directory | Full-text search on name, tagline, description, tags, category | ✅ Search + filters |
| 2.3 | Filters | Category, Size, Location, Activity (7d), Trending, New, Verified | ✅ Category, sort; **TODO:** Size bands, Location, Verified filter |
| 2.4 | “Recommended for you” | Based on profile, interests, past joins | **V1:** recommendation engine |
| 2.5 | Featured / Curated row | GrowthLab team can feature communities; “Community of the Month” | ✅ Featured in mock + UI |
| 2.6 | Community cards | Logo, name, tagline, member count, active (24h), Join button | ✅ `CommunityCard`; **TODO:** active-24h metric |

---

## 3. Membership Management & Access Control

**Phase:** MVP (core) / V1 (advanced)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 3.1 | Instant join (public) | One-click join; member count + role updated | MVP |
| 3.2 | Join request + approval workflow | Request to join; builder/admin approves or denies; optional message | MVP |
| 3.3 | Bulk invite | Email list, CSV upload, shareable link with expiry | MVP (link); V1 (CSV/email) |
| 3.4 | Role system | Owner → Admin → Moderator → Member → Guest; permissions per role | MVP (Owner/Moderator/Member); V1 (Admin, Guest) |
| 3.5 | Auto-approval rules | e.g. only verified GrowthLab users | V1 |
| 3.6 | Waitlist / Application form | Custom questions before approval | V1 |
| 3.7 | Member directory | Search & filters (role, join date, activity) | MVP (list); V1 (filters) |
| 3.8 | Kick / Ban / Suspend | Reason + duration (temp or permanent); “soft ban” (read-only) | MVP |
| 3.9 | Export member list | CSV export (privacy-compliant) | MVP |

**Data:** `CommunityMember.role`, `CommunityMember.status` (active | muted | banned | pending). Extend with `suspendedUntil`, `banReason`, `inviteLink`, `inviteExpiresAt`.

---

## 4. Discussions, Forums & Posts (Core Engagement)

**Phase:** MVP (feed + threads) / V1 (rich + flairs)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 4.1 | Main Feed per community | Chronological + optional “For You” (algorithmic) | MVP |
| 4.2 | Rich text posts | Images, videos, embeds (YouTube, X, Figma), polls, file attachments | MVP (text + images); V1 (embeds, polls) |
| 4.3 | Threaded comments | Nested replies up to 5 levels | MVP |
| 4.4 | Topics / Categories / Flairs | Builder-defined (e.g. #Idea, #Ask, #Announcement, #Showcase) | V1 |
| 4.5 | @username tagging | Autocomplete + notification to mentioned user | V1 |
| 4.6 | Post types | Discussion, Question, Announcement, Poll, Event, Resource | MVP (Discussion, Announcement); V1 (rest) |
| 4.7 | Post reactions | Like, love, insightful, celebrate, etc. | MVP (like); V1 (full set) |
| 4.8 | Searchable archive | Filters: date, author, tags, sub-group | V1 |

**Data:** Extend `CommunityPost` with `postType`, `flairId`, `parentId` (for threads), `reactions` (map), `attachments[]`, `embedUrl`.

---

## 5. Sub-Groups / Channels / Spaces

**Phase:** MVP (basic) / V1 (reorder, cross-post)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 5.1 | Unlimited sub-groups | Per community: name, description, mini-feed, members, events, resources | ✅ Structure in place |
| 5.2 | Public vs Private sub-groups | Private: join by approval or invite | MVP |
| 5.3 | Moderators per sub-group | Assign mods; permissions scoped to sub-group | MVP |
| 5.4 | Cross-post option | Post from sub-group to main feed (with approval toggle) | V1 |
| 5.5 | Drag-and-drop reorder | Sidebar order configurable by builder | V1 |

---

## 6. Events Planning & Management

**Phase:** MVP (basic) / V1 (RSVP, recordings)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 6.1 | Event creator | One-time, recurring, series; type: Webinar, Meetup, Workshop, AMA, Mixer, Hackathon | MVP (one-time, type) |
| 6.2 | Calendar integration | Google, Outlook, iCal export | V1 |
| 6.3 | RSVP + attendee list | Yes/No/Maybe; reminders | V1 |
| 6.4 | Event page | Agenda, speakers, Zoom/Meet link, recording upload | MVP (link + description); V1 (recordings) |
| 6.5 | Ticketing (paid) | Stripe integration | V2 |
| 6.6 | Post-event feedback + recording library | Optional survey; list of past recordings | V1 |

**Integration:** Use GrowthLab Events with `communityId` / `subGroupId`; same auth and calendar.

---

## 7. Resource Sharing & Knowledge Base

**Phase:** MVP

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 7.1 | Resource library | Files, links, docs; Notion/PDF embeds | MVP |
| 7.2 | Folders & categories | e.g. Templates, Playbooks, Research, Pitch Decks | MVP |
| 7.3 | Version history | For collaborative docs | V1 |
| 7.4 | “Resource of the week” | Builder can spotlight one resource | V1 |
| 7.5 | Search + tags; AI recommendations | Tag-based search; optional AI “recommended for you” | V1 |

---

## 8. Communication & Real-Time Tools

**Phase:** MVP (notifications) / V1 (digest) / V2 (chat, voice)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 8.1 | In-app notifications | New posts, mentions, join requests, event reminders | MVP |
| 8.2 | Digest emails | Daily/weekly; customizable per user & per community | V1 |
| 8.3 | Push notifications | Mobile; preferences per community | V1 |
| 8.4 | In-app chat (1:1 and group) | Use GrowthLab Chat; optional community channels | V2 |
| 8.5 | Live chat during events | In-event chat or link to existing chat | V2 |
| 8.6 | Voice rooms / Audio spaces | Clubhouse-style | V2 |

---

## 9. Moderation & Governance Tools

**Phase:** MVP

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 9.1 | Moderation queue | Approve/reject posts, comments, resources; filter by report reason | MVP |
| 9.2 | Auto-moderation rules | Keyword blocklist, spam detection, min account age | V1 |
| 9.3 | Report system | User reports → queue; escalation workflow | MVP |
| 9.4 | Member activity logs | Audit log for admin actions (kick, ban, delete) | MVP |
| 9.5 | Guidelines editor | Rich text; pinned at top of community | MVP |
| 9.6 | Pin posts / Featured carousel | Pin to top; optional “featured” carousel on home | MVP (pin); V1 (carousel) |

---

## 10. Analytics & Insights

**Phase:** MVP (basic) / V1 (full dashboard)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 10.1 | Community health dashboard | Members, growth curve, retention, DAU/WAU, engagement score | MVP |
| 10.2 | Top posts, top contributors, active sub-groups | Tables or cards | MVP |
| 10.3 | Member engagement heatmaps | Time-of-day, day-of-week | V1 |
| 10.4 | Exportable reports | CSV/PDF | MVP (CSV); V1 (PDF) |
| 10.5 | GrowthLab-level aggregate | Total communities, cross-community trends | V1 |

---

## 11. Engagement & Gamification

**Phase:** V2

| # | Feature | Acceptance criteria |
|---|--------|---------------------|
| 11.1 | Badges & reputation | e.g. “Top Contributor”, “Event Host”; builder-configurable |
| 11.2 | Leaderboards | Optional; toggleable per community |
| 11.3 | Streaks, challenges, bounties | Configurable by builder |
| 11.4 | Polls & surveys | Results visualization |
| 11.5 | AMA scheduling | Question queue, time slots |
| 11.6 | Member spotlights / intro thread | Pinned “Introduce yourself” |

---

## 12. User Experience & Accessibility

**Phase:** MVP (responsive, theme) / V1 (shortcuts, a11y)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 12.1 | Responsive, mobile-first | All key flows work on small screens | MVP |
| 12.2 | Dark/light mode | System + manual toggle; same as GrowthLab | ✅ |
| 12.3 | Sidebar navigation | Home, Feed, Sub-groups, Events, Resources, Members, Admin | MVP (tabs on profile); V1 (persistent sidebar) |
| 12.4 | Keyboard shortcuts | e.g. N = new post, / = search | V1 |
| 12.5 | WCAG 2.2 | Contrast, focus, labels, screen reader | V1 |
| 12.6 | Custom emoji & stickers | Per-community or global | V2 |

---

## 13. Integrations & Extensibility

**Phase:** MVP (native) / V1 (calendar, webhooks) / V2 (API)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 13.1 | Native GrowthLab | Feed, Network, Jobs, Funding, Events (global calendar) | MVP (Feed/Events); rest as-is |
| 13.2 | Calendar sync, Zapier/Make, Webhooks | Export events; automation | V1 |
| 13.3 | Embed community feed | Widget for external sites | V1 |
| 13.4 | SSO | Google, LinkedIn, GitHub | V1 |
| 13.5 | Public API | For advanced builders | V2 |

---

## 14. Monetization & Premium (Phase 2)

**Phase:** V2

| # | Feature | Notes |
|---|--------|--------|
| 14.1 | Paid community tiers | Monthly/yearly; Stripe |
| 14.2 | Paid events & workshops | Ticketing |
| 14.3 | Sponsored / Featured in directory | Revenue share or fee |
| 14.4 | White-label / Custom domain | e.g. community.yourbrand.com |
| 14.5 | Revenue share model | Platform fee % |

**Data:** Add `Community.monetizationTier`, `Community.stripeProductId`, `Community.customDomain`.

---

## 15. Security, Compliance & Anti-Spam

**Phase:** MVP (basics) / V1 (2FA, export)

| # | Feature | Acceptance criteria | Phase |
|---|--------|---------------------|--------|
| 15.1 | GDPR / PDPA (Singapore) | Consent, data minimization, retention policy | MVP |
| 15.2 | Data export & deletion | User and builder tools | V1 |
| 15.3 | Two-factor authentication | Optional enforcement per community | V1 |
| 15.4 | IP & device management | Optional for high-trust communities | V2 |
| 15.5 | Content ownership | Builder owns content; platform license for operation | Document in ToS; MVP |

---

## Implementation Checklist (by phase)

### MVP (6–8 weeks)

- [ ] **Creation:** Wizard steps, Secret privacy, default templates, custom slug field.
- [ ] **Directory:** Verified filter, size/location filters, active-24h on cards.
- [ ] **Membership:** Join/request flow, roles (Owner/Moderator/Member), kick/ban/suspend, invite link, member export CSV.
- [ ] **Posts:** Main feed (chronological), threaded comments (≤5 levels), post types (Discussion, Announcement), basic reactions (like).
- [ ] **Sub-groups:** Create/edit, public/private, moderators.
- [ ] **Events:** Create event (one-time, type), link from community; event page with link/description.
- [ ] **Moderation:** Queue (approve/reject), report flow, guidelines editor, pin post.
- [ ] **Notifications:** In-app (new post, join request, event reminder).
- [ ] **Resources:** Library with folders/categories, upload/link.
- [ ] **Analytics:** Basic dashboard (members, growth, top posts, top contributors).

### V1 (+8 weeks)

- [ ] **Creation:** File upload for logo/banner, theme picker, onboarding checklist.
- [ ] **Directory:** “Recommended for you” engine.
- [ ] **Membership:** Admin/Guest roles, auto-approval rules, waitlist/application form, bulk invite (CSV/email).
- [ ] **Posts:** Rich embeds, flairs/topics, @mentions, full reaction set, search archive.
- [ ] **Sub-groups:** Cross-post to main, drag-and-drop reorder.
- [ ] **Events:** RSVP, reminders, calendar export, recording library, feedback form.
- [ ] **Resources:** Version history, “Resource of the week”, search + AI recommendations.
- [ ] **Comms:** Digest emails, push preferences.
- [ ] **Moderation:** Auto-mod rules (blocklist, spam, min age).
- [ ] **Analytics:** Heatmaps, PDF export, GrowthLab aggregate.
- [ ] **UX:** Sidebar nav, keyboard shortcuts, WCAG 2.2 pass.
- [ ] **Integrations:** Calendar sync, webhooks, embed widget, SSO.

### V2

- [ ] Gamification (badges, leaderboards, streaks, AMA).
- [ ] Paid tiers, paid events, featured listing, white-label.
- [ ] In-app chat, voice rooms.
- [ ] Advanced analytics, public API.
- [ ] 2FA enforcement, IP/device management.

---

## Codebase Reference (current)

| Area | Location | Status |
|------|----------|--------|
| Types | `src/types/community.ts` | Community, Member, SubGroup, Post, FormData; extend for roles, status, flairs |
| Mock data | `src/data/mock-communities.ts` | Categories, sample communities, sub-groups, posts |
| Create flow | `src/app/community/create/page.tsx`, `create-community-form.tsx` | Single form; add wizard, templates, slug |
| Directory | `src/app/community/browse/page.tsx`, `community-card.tsx`, `directory-filters.tsx` | Search, filters, featured |
| Profile | `src/app/community/[slug]/page.tsx`, `community-profile.tsx` | Tabs: Home, Feed, Sub-groups, Members, Events, Resources, About, Admin |
| Sub-group | `src/app/community/[slug]/group/[subGroupSlug]/page.tsx` | Basic page; add mini-feed, members |
| Admin | `src/app/community/[slug]/admin/page.tsx` | Placeholder cards; add moderation queue, analytics, settings |
| Celebration | `src/components/community/community-celebration.tsx` | Confetti + modal on create |
| Design | `src/app/globals.css`, `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` | Teal, gs-gradient, gs-card-hover, gs-glass |

---

## Document history

- **v1.0** – Initial blueprint from product spec; prioritization MVP / V1 / V2; aligned to existing Community implementation.
