# Network Section – Build Prompt

**Purpose:** This document is the specification for building the **Network** section of the GrowthLab platform. In this section, **startups can exhibit their startups** and users can discover people and organizations through **directories**. The section must use the **same branding, color scheme, and UX patterns** as GrowthStarter and the Apps & Deals store (see `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`).

---

## 1. Project context

- **Product name:** Network (or “GrowthLab Network”).
- **Role:**
  - **Startup exhibit:** Startups create a profile and **exhibit** their startup so others can discover them (founders, investors, mentors, co-founders, incubators).
  - **Directories:** Browse and search across multiple directories to find the right people and organizations.
- **Integration:** Can be built as a **separate app** (like GrowthStarter / Apps & Deals) or as a section under the main GrowthLab platform. Shared: branding, design system, header/nav, and (optionally) auth.
- **Design reference:** Use **GrowthStarter** and **DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md** for colors, header, cards, modals, and floating nav.

---

## 2. Brand & design consistency (follow this colour scheme and UI)

The **entire Network section** must follow the same colour scheme and UI as GrowthStarter and the Apps & Deals store. No new palettes or layout systems.

- **Colour scheme:** Primary teal `#0F7377`, teal light `#00A884`; same CSS variables (`:root` and `.dark`), `.gs-gradient`, `.gs-gradient-text`, `.gs-card-hover`, `.gs-glass`, scrollbar, selection. Use these everywhere (buttons, active tabs, links, focus rings).
- **Header (Network only):** In the Network section use **only the floating header** for navigation. Do **not** use a static or sticky top bar; the only nav is the centred floating pill (same style as in `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` Section 2.3). The floating nav can be visible from the top of the page (e.g. `top-4`) and must include primary CTA “Exhibit your startup” or “Join directory” with `gs-gradient`.
- **Cards & modals:** Same rounded corners (`rounded-xl` / `rounded-3xl`), hover lift and teal shadow (`gs-card-hover`), teal primary CTAs, detail modals with overlay `bg-black/50 backdrop-blur-sm` and gradient accents.
- **Tech stack:** Next.js (App Router), Tailwind, shadcn/ui (New York, CSS variables), Lucide, next-themes for dark mode.

Do **not** introduce new primary colors or a different header/card style; the Network section must look and feel like one product with GrowthStarter and Apps & Deals. For exact class names and tokens, use `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`.

---

## 3. Section structure and directories

The Network section is organized into **one startup exhibit flow** and **eight directories**. Each directory has its own listing (cards/list), search, filters, and detail view.

### 3.1 Startup exhibit (startups show their startup)

- **Purpose:** Let startups **create and maintain a public profile** so they appear in the Startup Directory and can be found by investors, mentors, co-founders, incubators, etc.
- **Entry points:**
  - “Exhibit your startup” / “Add your startup” CTA in the **floating nav** or hero (Network uses only the floating header for navigation).
  - From the Startup Directory: “Exhibit your startup” when the user has no listing yet.
- **Flow:**
  - Form or multi-step wizard: startup name, tagline, description, logo/image, stage (idea / MVP / growth / etc.), industry/category, location, website, social links, **looking for** (e.g. co-founder, investment, mentor).
  - On submit: success toast + optional celebration pop (same pattern as “App launched!” in Apps & Deals). Listing appears in **Startup Directory**.
- **Profile fields (suggested):** name, tagline, shortDescription, description, logoUrl, imageUrl, stage, industry, location, website, linkedIn, twitter, foundedYear, teamSize, fundingStage, lookingFor[] (co-founder, investment, mentor, incubator), createdAt, updatedAt.

---

### 3.2 Directory list (all eight)

| # | Directory | Description | Who lists here | Key fields (suggested) |
|---|-----------|-------------|----------------|------------------------|
| 1 | **Startup Directory** | Browse startups exhibiting on the platform | Startups (via “Exhibit your startup”) | name, tagline, logo, stage, industry, location, lookingFor, teamSize |
| 2 | **Find a Co-founder** | Find or offer co-founder roles | Startups / individuals looking for co-founder or offering role | name, role (looking for / offering), skills, industry, stage, location, bio, avatar |
| 3 | **Investors** | Find investors (angels, VCs, syndicates) | Investors / funds | name, type (angel / VC / etc.), focus industries, check size, stage, location, portfolio count |
| 4 | **Mentors** | Find mentors for advice and support | Mentors | name, expertise, industries, availability, sessions, avatar, bio |
| 5 | **Incubators & Accelerators** | Programs and spaces | Programs | name, type (incubator / accelerator), focus, duration, location, application link |
| 6 | **Industry Experts** | Domain experts for hire or advice | Experts | name, domain, industries, offer (consulting / advisory), avatar, bio |
| 7 | **Teachers** | Educators and trainers for startups | Teachers / training providers | name, topics, format (workshop / course), avatar, bio |
| 8 | **Government Agencies** | Grants, schemes, regulatory support | Government / public bodies | name, type, region, focus (grants / regulation / export), link |

---

## 4. Global Network UX (shared across directories)

### 4.0 Navigation: floating header only (no static top bar)

In the **Network section**, the only navigation UI is the **floating header** (centred pill bar). There is **no** static or sticky top bar; no full-width header that scrolls with the page.

- **Desktop/tablet:** One floating nav pill, fixed at the top centre (e.g. `fixed top-4 left-1/2 -translate-x-1/2 z-50`). Same classes as in `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md` Section 2.3: `bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50`.
- **Visibility:** The floating nav is visible as soon as the user is on a Network page (no need to scroll to show it). Optionally it can still hide on scroll-up and show on scroll-down if you want a minimal top area.
- **Contents:** Nav items (e.g. Discover, Startup Directory, Find Co-founder, Investors, Mentors, etc. or links to each directory), divider, then theme toggle, notifications, and primary CTA “Exhibit your startup” / “Join directory” with `gs-gradient`. Active item: `gs-gradient text-white shadow-md`.
- **Mobile:** Use only the floating-style FAB (e.g. bottom-right) that opens the same nav + actions in a dropdown/sheet (no top bar on mobile either).

Result: a clean Network layout with **only the floating header** for navigation; content starts near the top without a full-width header strip.

### 4.1 Navigation (within Network – directory tabs)

- **Tabs or nav pills** (below or beside the floating nav) for:  
  **Startup Directory** · **Find a Co-founder** · **Investors** · **Mentors** · **Incubators & Accelerators** · **Industry Experts** · **Teachers** · **Government Agencies**
- Active tab: `gs-gradient text-white` or `bg-[#0F7377]/10 text-[#0F7377]`; inactive: muted + hover.
- Optional: **sidebar** on large screens with the same list; on small screens, horizontal scroll or dropdown.

### 4.2 Hero / intro (per directory or shared)

- Short headline (e.g. “Discover startups”, “Find a co-founder”, “Connect with investors”).
- Subtitle explaining the directory.
- Primary CTA: “Exhibit your startup” (on Startup Directory) or “Join as [Investor/Mentor/…]” for other directories.

### 4.3 Search and filters (per directory)

- **Search:** One search input; query applies to name, description, industry, tags (directory-dependent).
- **Filters:** Relevant to the directory (e.g. Startup: stage, industry, location, “looking for”; Investors: type, check size, industry; Mentors: expertise, availability). Use teal for active filter chips: `bg-[#0F7377]/10 text-[#0F7377] border border-[#0F7377]/30`.
- **Sort:** e.g. Newest, Most relevant, A–Z (and directory-specific options like “Check size” for investors).

### 4.4 Listing (cards grid)

- **Layout:** Responsive grid (e.g. 1 col mobile, 2–3 cols desktop). Each card: image/avatar, title/name, short line (tagline / role / focus), 1–2 key metrics or tags.
- **Card style:** Same as GrowthStarter/Apps & Deals: `gs-card-hover`, rounded-xl, teal primary button (“View profile”, “Connect”, “Apply”).
- **Empty state:** “No results” or “No [startups/investors/…] yet” + CTA to exhibit or join.

### 4.5 Detail view (modal or page)

- **Trigger:** Click card or primary CTA.
- **Content:** Full description, all fields, social/website links, CTA (“Contact”, “Apply”, “Request intro”). Same modal pattern: overlay `bg-black/50 backdrop-blur-sm`, content `rounded-3xl`, teal accents.
- **Optional:** Dedicated `/network/startup/[id]`, `/network/investor/[id]`, etc. for shareable URLs.

### 4.6 Connection-accepted popper (new connection = pop)

Whenever **someone accepts the user’s connection request**, show a **celebration pop** (same style as the “App launched!” popper in Apps & Deals and the milestone pop in GrowthStarter). This reinforces the moment and keeps the Network section on-brand.

**Trigger:** When the current user receives an “connection accepted” event (e.g. from real-time, polling, or after a page refresh that loads new accepted connections).

**Behaviour:**

1. **Confetti:** Use `canvas-confetti` with the same palette: `['#0F7377', '#00A884', '#FFD700', '#FF6B6B']`. Same pattern: two bursts from left and right, ~3 seconds (see `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`).
2. **Overlay:** Full-screen, `fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto`.
3. **Modal:** Centred, `max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500`.
4. **Close button:** Top-right, `absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full`; white X icon. Clicking overlay or “Continue” also closes.

**Modal content:**

- **Header strip:** Same gradient as other poppers: `bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-8 text-white text-center`. Optional soft blobs (`bg-white/10 rounded-full blur-xl`). Icon (e.g. `UserPlus` or `Handshake`) in `w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce`.
- **Title:** e.g. **“Connection accepted!”**
- **Subtitle / message:** **“This person has accepted your connection request.”** (Or: “[Name] has accepted your connection request.” if the accepter’s name is shown.)
- **Body (optional):** Row with avatar and name of the person who accepted, e.g. “You’re now connected with [Name].”
- **Stats (optional):** One small stat like “Connections: 12” in `bg-slate-50 dark:bg-slate-800 rounded-xl` with value in `text-teal-600 dark:text-teal-400`.
- **Actions:**  
  - **“View profile”** (outline) – opens their profile or detail modal.  
  - **“Continue”** (primary) – `gs-gradient text-white`, closes the pop.

**Hook / state:** e.g. `useConnectionAcceptedPop()` that exposes `{ show, data, trigger, close }`. Payload can include `{ connectionId, acceptedByName, acceptedByAvatar, acceptedById }`. When the app learns a connection was accepted (real-time or after fetch), call `trigger(payload)` so the popper appears once per new acceptance (track by `connectionId` or similar so the same acceptance doesn’t pop again).

**Summary:** Same colours, same confetti, same overlay and modal layout as the Apps & Deals launch pop and GrowthStarter milestone pop. Only the copy and optional “View profile” action change. Implement this so every new connection acceptance in the Network section shows this popper.

---

## 5. Data models (suggested)

Use these as a starting point; adjust to your backend.

### 5.1 Startup (exhibit / Startup Directory)

```ts
interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  logoUrl?: string;
  imageUrl?: string;
  stage: 'idea' | 'mvp' | 'growth' | 'scale';
  industry: string;
  location: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  foundedYear?: number;
  teamSize?: string;
  fundingStage?: string;
  lookingFor: ('co-founder' | 'investment' | 'mentor' | 'incubator')[];
  createdAt: string;
  updatedAt: string;
  ownerId?: string; // if auth
}
```

### 5.2 Co-founder (Find a Co-founder)

```ts
interface CoFounderProfile {
  id: string;
  name: string;
  avatar?: string;
  role: 'looking' | 'offering'; // looking for co-founder / offering co-founder role
  skills: string[];
  industry: string;
  stage: string;
  location: string;
  bio: string;
  startupId?: string; // if linked to exhibited startup
  createdAt: string;
}
```

### 5.3 Investor

```ts
interface InvestorProfile {
  id: string;
  name: string;
  avatar?: string;
  type: 'angel' | 'vc' | 'syndicate' | 'other';
  focusIndustries: string[];
  checkSizeMin?: number;
  checkSizeMax?: number;
  stage: string[];
  location: string;
  bio: string;
  portfolioCount?: number;
  website?: string;
  linkedIn?: string;
  createdAt: string;
}
```

### 5.4 Mentor

```ts
interface MentorProfile {
  id: string;
  name: string;
  avatar?: string;
  expertise: string[];
  industries: string[];
  availability: string;
  sessions?: string; // e.g. "1:1, group"
  bio: string;
  linkedIn?: string;
  createdAt: string;
}
```

### 5.5 Incubator / Accelerator

```ts
interface IncubatorAcceleratorProfile {
  id: string;
  name: string;
  logoUrl?: string;
  type: 'incubator' | 'accelerator';
  focus: string[];
  duration?: string;
  location: string;
  description: string;
  applicationUrl?: string;
  website?: string;
  createdAt: string;
}
```

### 5.6 Industry Expert

```ts
interface IndustryExpertProfile {
  id: string;
  name: string;
  avatar?: string;
  domain: string;
  industries: string[];
  offer: string; // e.g. "Consulting", "Advisory"
  bio: string;
  website?: string;
  createdAt: string;
}
```

### 5.7 Teacher

```ts
interface TeacherProfile {
  id: string;
  name: string;
  avatar?: string;
  topics: string[];
  format: string[]; // e.g. "Workshop", "Course"
  bio: string;
  website?: string;
  createdAt: string;
}
```

### 5.8 Government Agency

```ts
interface GovernmentAgencyProfile {
  id: string;
  name: string;
  logoUrl?: string;
  type: string; // e.g. "Grant body", "Regulator"
  region: string;
  focus: string[];
  description: string;
  link?: string;
  createdAt: string;
}
```

---

## 6. Pages / routes (suggested)

- `/network` – Landing or default to Startup Directory.
- `/network/startups` – Startup Directory.
- `/network/cofounders` – Find a Co-founder.
- `/network/investors` – Investors.
- `/network/mentors` – Mentors.
- `/network/incubators-accelerators` – Incubators & Accelerators.
- `/network/industry-experts` – Industry Experts.
- `/network/teachers` – Teachers.
- `/network/government` – Government Agencies.
- `/network/startups/exhibit` or `/network/exhibit` – Form to exhibit startup.
- `/network/startup/[id]`, `/network/investor/[id]`, etc. – Optional detail pages for sharing.

---

## 7. Copy and CTAs

- **Section title:** “Network” or “GrowthLab Network”.
- **Startup exhibit:** “Exhibit your startup”, “Add your startup”, “Get discovered”.
- **Directories:** “Startup Directory”, “Find a Co-founder”, “Investors”, “Mentors”, “Incubators & Accelerators”, “Industry Experts”, “Teachers”, “Government Agencies”.
- **Actions:** “View profile”, “Connect”, “Apply”, “Request intro”, “Join directory”, “Add listing”.
- **Empty states:** “No startups yet. Be the first to exhibit.” (and similar per directory).
- **Connection-accepted popper:** Title: “Connection accepted!”. Message: “This person has accepted your connection request.” (or “[Name] has accepted your connection request.”). Buttons: “View profile” (outline), “Continue” (primary).

---

## 8. Summary checklist

- [ ] **Colour scheme & UI:** Follow the same colours and UI as GrowthStarter/Apps & Deals everywhere (see Section 2 and `DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md`).
- [ ] **Branding:** Same colors (#0F7377, #00A884), CSS variables, .gs-gradient, .gs-card-hover, .gs-glass.
- [ ] **Navigation:** **Floating header only** in the Network section (no static/sticky top bar). One centred floating pill for nav + theme + notifications + “Exhibit your startup” CTA; mobile: FAB + dropdown only. See Section 4.0.
- [ ] **Startup exhibit:** Form/wizard, success + optional celebration pop, listing appears in Startup Directory.
- [ ] **Eight directories:** Startup Directory, Find a Co-founder, Investors, Mentors, Incubators & Accelerators, Industry Experts, Teachers, Government Agencies.
- [ ] **Navigation:** Tabs or nav for all directories; active state teal.
- [ ] **Per directory:** Search, filters, sort, card grid, detail modal (or page).
- [ ] **Connection-accepted popper:** When a new connection is accepted, show the celebration pop with confetti (same colours), overlay, and modal; title “Connection accepted!”, message “This person has accepted your connection request.” (or “[Name] has accepted…”); actions “View profile” + “Continue” (gs-gradient). Same layout/classes as Apps & Deals launch pop.
- [ ] **Data models:** Define profiles for each directory (startup, co-founder, investor, mentor, incubator/accelerator, industry expert, teacher, government agency).
- [ ] **Routes:** /network, /network/startups, /network/cofounders, /network/investors, etc., plus exhibit and optional detail pages.
- [ ] **Integration:** Link from main GrowthLab nav (e.g. “Network”); optional auth for “Exhibit” and “Join directory”.

Use this document as the single source of truth for the **Network** section: same colour scheme and UI as GrowthStarter and Apps & Deals, startup exhibit, all eight directories, and the **connection-accepted popper** on every new acceptance.
