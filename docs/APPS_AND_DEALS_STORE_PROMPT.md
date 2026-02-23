# Apps & Deals Store – Detailed Build Prompt

**Purpose:** This document is a detailed prompt/specification for building the **Apps & Deals Store** for the GrowthLab platform. The store will let startups launch and list their apps (and deals) on GrowthLab. It should be developed as a **separate application** that integrates into the main GrowthLab platform—same approach as GrowthStarter—and must use **identical branding, color scheme, and UX patterns** (including a launch-success celebration similar to GrowthStarter’s goal-reached “pop”).

---

## 1. Project context

- **Product name:** Apps & Deals Store (or similar; e.g. “GrowthLab Apps”, “Apps & Deals”).
- **Role:** A dedicated storefront where startups can:
  - **Launch** their app on the GrowthLab platform.
  - **List** apps and deals (discounts, offers, bundles).
  - **Discover** other startups’ apps and deals.
- **Integration:** Built as a **separate codebase** that plugs into the main GrowthLab platform (same pattern as GrowthStarter). Shared: branding, design system, and platform navigation/SSO where applicable.
- **Reference implementation:** Use **GrowthStarter** as the single source of truth for:
  - Colors, typography, spacing, radii.
  - Component patterns (cards, modals, headers, filters).
  - Animations and celebration flows.
  - Dark mode behavior.

---

## 2. Brand & color scheme (match GrowthStarter exactly)

All colors and tokens below must be reused so the Apps & Deals store feels like the same product family as GrowthStarter.

### 2.1 Primary brand colors (hex)

- **Teal primary:** `#0F7377`
- **Teal light / success:** `#00A884`
- **Accent orange (optional):** `hsl(43 96% 56%)` (e.g. for “Deal” or “Limited time”)
- **Confetti / celebration palette:** `#0F7377`, `#00A884`, `#FFD700`, `#FF6B6B`

Use these hex values wherever design or copy references “brand teal” or “primary”.

### 2.2 CSS variables (copy into your `globals.css`)

**Light mode:**

```css
:root {
  --radius: 0.625rem;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 187 78% 26%;           /* #0F7377 equivalent */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 187 78% 26%;
  --chart-1: 187 78% 26%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 187 78% 26%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;

  /* GrowthStarter / GrowthLab theme tokens */
  --gs-teal: 187 78% 26%;
  --gs-teal-light: 160 100% 33%;
  --gs-orange: 43 96% 56%;
  --gs-success: 160 100% 33%;
}
```

**Dark mode (`.dark`):**

- Use the same structure as GrowthStarter’s `.dark` block: primary becomes `168 76% 42%`, backgrounds use `224 71% 4%` and `224 71% 6%`, borders `216 34% 17%`, and keep `--gs-teal` / `--gs-teal-light` for dark theme teal.

### 2.3 Gradients and utility classes

Implement these so UI matches GrowthStarter:

- **Primary gradient (buttons, highlights):**  
  `linear-gradient(135deg, #0F7377 0%, #00A884 100%)`
- **Dark mode gradient:**  
  `linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)`
- **Utility classes to support:**
  - `.gs-gradient` – background uses the primary gradient above.
  - `.gs-gradient-text` – same gradient as background-clip text (with `-webkit-background-clip` and `-webkit-text-fill-color: transparent`).
  - `.gs-card-hover` – `translateY(-4px)` on hover, shadow `0 20px 40px -12px rgba(15, 115, 119, 0.15)` (light); dark: `rgba(20, 184, 166, 0.25)`.
  - `.gs-glass` – light: `rgba(255,255,255,0.8)` + `backdrop-filter: blur(12px)`; dark: `rgba(15,23,42,0.85)`.
  - `.gradient-border` – border uses the same teal→emerald gradient as the primary gradient.
  - `.neon-glow` – box-shadow using `rgba(15, 115, 119, 0.4/0.3/0.2)` (and dark equivalent with teal).
  - `.text-gradient` – animated gradient text (e.g. `#0F7377` → `#00A884` → `#0F7377`).

### 2.4 Scrollbars and selection

- Scrollbar thumb: `rgba(15, 115, 119, 0.3)` default, `0.5` on hover; dark: `rgba(20, 184, 166, 0.3/0.5)`.
- `::selection`: `background: rgba(15, 115, 119, 0.3)`; dark: `rgba(20, 184, 166, 0.3)`.

### 2.5 Tailwind usage

- Use **CSS variables** for `background`, `foreground`, `primary`, `ring`, `border`, `input`, etc. (e.g. `bg-primary`, `text-primary`, `ring-ring`, `border-border`).
- For hard-coded teal in components: `#0F7377`, `#00A884`; and Tailwind: `teal-500`, `teal-600`, `emerald-500` where they align with the palette above.
- Focus rings: `focus:ring-2 focus:ring-teal-500` (or `focus:ring-[#0F7377]/20`), `focus:border-[#0F7377]`.

---

## 3. Tech stack and design system

- **Framework:** Next.js (App Router), React 18+.
- **Styling:** Tailwind CSS; theme extended with the same `colors`, `borderRadius` (e.g. `var(--radius)`), and `fontFamily` as GrowthStarter.
- **Components:** shadcn/ui (New York style), with **baseColor: neutral** and **CSS variables: true**. Use the same aliases pattern: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, etc.
- **Icons:** Lucide React.
- **Fonts:** Same as GrowthStarter (e.g. Inter with `--font-sans` variable).
- **Dark mode:** `class`-based (e.g. `next-themes` with `attribute="class"`), supporting system preference and toggle.

Reuse the same **components.json** approach (style: new-york, tsx, tailwind config and globals path, no prefix) so that adding shadcn components feels identical to GrowthStarter.

---

## 4. Features and UX to mirror from GrowthStarter

Implement equivalent patterns for “apps” and “deals” (and “launch” instead of “fund” where relevant):

1. **Header**
   - Logo/brand (GrowthLab + “Apps & Deals” or store name).
   - Global search (with optional autocomplete and recent searches).
   - Quick filters (e.g. “Featured”, “New”, “Deals”, “Categories”).
   - Theme toggle (light/dark/system).
   - Notifications bell and dropdown.
   - User menu / auth (placeholder or integrated with GrowthLab SSO).

2. **Search and filters**
   - Search bar with clear, placeholder, and optional filters (category, price range, “Deals only”, sort).
   - Sort: Trending, Newest, Most popular, etc.
   - Filter chips or dropdowns with same teal active state: e.g. `bg-[#0F7377]/10 text-[#0F7377]`, `border-[#0F7377]/30`.

3. **Cards (app/deal cards)**
   - Same card treatment as project cards: rounded corners (`rounded-xl`/`rounded-2xl`), image on top, title, short description, key metric (e.g. “X users”, “Y% off”).
   - Hover: use `gs-card-hover` (lift + teal-tinted shadow).
   - Primary CTA button: `#0F7377` / `gs-gradient`, white text; secondary outline.
   - Badges: “New”, “Deal”, “Featured” using same badge component and teal/primary styles.

4. **Modals**
   - Detail modal for an app or deal: same layout pattern as project detail (image, title, creator, description, stats, CTA).
   - “Launch app” or “Create listing” modal: multi-step or single form, same primary buttons and form inputs (border, focus ring teal).
   - Use same overlay (e.g. `bg-black/50 backdrop-blur-sm`), same `rounded-3xl` content, same close button placement.

5. **Lists and layout**
   - Grid vs list view toggle if applicable.
   - “Load more” or pagination styled consistently (primary color for active/buttons).

6. **Notifications and toasts**
   - Same toast style (e.g. Sonner) and placement; success/error/info use primary color for success states.

7. **Keyboard shortcuts**
   - Optional: same pattern as GrowthStarter (e.g. “?” to open shortcuts dialog) for power users.

8. **Creator/startup profile**
   - If you show “Publisher” or “Startup”: avatar, name, optional verification; link or modal similar to creator profile in GrowthStarter (teal accents, same card style).

---

   ## 5. “Launch success” celebration (like GrowthStarter’s goal-reached pop)

   When a startup **successfully launches their app** (or a major milestone, e.g. “First 100 users”), show a **full-screen celebration** that matches GrowthStarter’s milestone celebration.

   ### 5.1 Behavior

   - **Trigger:** On “App launched” success (or configurable milestones, e.g. 100 installs, first deal claimed).
   - **Full-screen overlay:** `fixed inset-0 z-[100]`, `bg-black/50 backdrop-blur-sm`, `animate-in fade-in duration-300`.
   - **Center modal:** `max-w-md`, `bg-white dark:bg-slate-900`, `rounded-3xl`, `shadow-2xl`, `animate-in zoom-in-95 duration-500`.
   - **Close:** X button top-right; clicking overlay or “Continue” dismisses.

   ### 5.2 Confetti

   - Use **canvas-confetti** (same library as GrowthStarter).
   - **Colors:** `['#0F7377', '#00A884', '#FFD700', '#FF6B6B']`.
   - **Pattern:** e.g. two bursts from left and right (`origin: { x: 0 }` and `origin: { x: 1 }`, `angle: 60` and `120`, `spread: 55`), `particleCount: 3` per frame, run for ~3 seconds (requestAnimationFrame loop).

   ### 5.3 Modal content (adapt from milestone)

   - **Header strip:** Gradient background (e.g. `from-emerald-500 to-teal-500` for “Launched!”). Optional soft blobs (`bg-white/10 rounded-full blur-xl`).
   - **Icon:** Large circular icon (e.g. Rocket or Trophy) in `bg-white/20`, `animate-bounce`.
   - **Title:** e.g. “App launched!” or “You’re live!” (bold, large).
   - **Subtitle:** Short line like “Your app is now live on GrowthLab.”
   - **Body:** App icon, name, and “by [Startup name]”.
   - **Stats row:** 3 small stat cards (e.g. “Live”, “0 users”, “Deals: 0”) in `bg-slate-50 dark:bg-slate-800`, `rounded-xl`, teal for key number (`text-teal-600 dark:text-teal-400`).
   - **Actions:** “Share” (outline) and “Continue” (solid `gs-gradient` / primary). Same button component and sizing as GrowthStarter.

   Implement a **hook** similar to `useMilestoneTracker`: e.g. `useLaunchCelebration(appId, launchSuccess)` that sets “show celebration” when launch (or milestone) is achieved, and a `LaunchCelebration` component that receives app + onClose + onShare.

---

## 6. Copy and naming

- **Product:** “Apps & Deals” (or “GrowthLab Apps & Deals”) for the store.
- **Actions:** “Launch app”, “List deal”, “View app”, “Get deal”.
- **Empty states:** Friendly, on-brand copy (e.g. “No apps yet” / “Launch your first app”).
- **Toasts:** “App listed successfully”, “Deal published”, etc., with success styling (primary/teal).

Where the main platform is named “GrowthLab”, keep “GrowthStarter” only as the crowdfunding product name; the store should feel like “GrowthLab – Apps & Deals” or similar.

---

## 7. Integration with GrowthLab platform

- **Navigation:** The Apps & Deals store should be reachable from the main GrowthLab nav (e.g. “Apps & Deals” or “Store” link), same way GrowthStarter is a section.
- **Auth:** If GrowthLab has SSO or a shared auth layer, use it for “Launch app” and “My apps/deals”; otherwise keep auth placeholder-ready.
- **URL structure:** Decide base path (e.g. `/apps`, `/store`, or subdomain) so the main platform can link to it consistently.

---

## 9. Functionality requirements (from previous Apps & Deals implementation)

The following features **must all be implemented** in the new Apps & Deals store. They come from the previous implementation; the new build should keep every capability below and only change UI/UX to match GrowthStarter branding (Section 2).

### 9.1 Data models (types)

- **AppOrDeal:** union type `"app" | "deal"`.
- **Publisher:** `id`, `name`, optional `avatar`, optional `verified`.
- **App:**
  - `id`, `type: "app"`, `name`, `description`, `imageUrl`, `publisher`
  - `usersCount`, `dealsCount`, `category`
  - `badges`: array of `"New"` | `"Featured"`
  - `createdAt`
  - Optional (for future/crowdfunding): `fundingGoal`, `fundingRaised`, `backersCount`, `daysLeft`
- **Deal:**
  - `id`, `type: "deal"`, `title`, `description`, `imageUrl`
  - `appId`, `appName`, `publisher`
  - `discount` (e.g. `"50% off"`, `"Free trial"`), `category`
  - `badges`: array of `"Deal"` | `"Limited time"`
  - `createdAt`
- **Listing:** type alias for `App | Deal` (unified list of apps and deals).

### 9.2 Main store page

- **Hero / discover block:** Title (e.g. “Discover”), subtitle (e.g. “Apps and deals from startups on GrowthLab”), and a primary **“Launch app”** button (opens launch modal).
- **Search and filters (Section 9.3)** above the grid.
- **Filtered listing logic:**
  - Combined list: apps + deals (from mock or API).
  - **Search (query):** filter by app `name`, deal `title`, `description`, or `publisher.name` (case-insensitive).
  - **Sort options:** “Trending” (default), “Newest” (by `createdAt` desc), “Most popular” (by `usersCount` for apps, deals can use same or secondary sort).
  - **Deals only:** when on, show only items with `type === "deal"`.
- **Grid:** Responsive grid (e.g. 1 col mobile, 2 sm, 3 lg) of **app/deal cards** (Section 9.5). Each card click opens the **detail modal**.
- **Empty state:** When filtered list is empty, show a message (e.g. “No apps yet” / “Launch your first app or try different filters”) and a CTA button to open the **Launch app** modal.

### 9.3 Search and filters component

- **Search input:** Single text field, placeholder e.g. “Search apps and deals…”. Value is controlled; onChange updates the main page query state.
- **Sort controls:** At least three options: **Trending**, **Newest**, **Most popular**. Active option uses the **teal active state** (e.g. `bg-[#0F7377]/10 text-[#0F7377]`); inactive use muted + hover.
- **“Deals only” toggle/button:** When active, only deals are shown; same teal active state when on. Label e.g. “Deals only” with optional icon (e.g. SlidersHorizontal).

### 9.4 Header

- **Sticky header** with glass-style background (`gs-glass` or equivalent), full-width, border-bottom.
- **Branding:** Logo/link to home; product name (e.g. “GrowthLab”) and tagline (e.g. “Build. Connect. Scale.”).
- **Main navigation (desktop):** Links for at least: Home, Connect, Launch, Fund, Grow, **Apps & Deals**, Community, Profile. **Apps & Deals** (or current store route) has active state (e.g. teal background + text).
- **Right side:**
  - **Search:** Expandable or always-visible search (e.g. “Search apps, SaaS, AI tools, deals…”). Can be inline or open a search panel; must integrate with store search/filters or global search when on store.
  - **Theme toggle:** Light / dark (next-themes or equivalent).
  - **Notifications:** Bell icon; dropdown (e.g. “No new notifications” or list when implemented).
  - **Profile menu:** User icon; dropdown with at least: **My Launches** (e.g. `/apps/my-launches`), **Browse Apps** (e.g. `/apps`), **Sign out**.
- **Mobile:** Hamburger menu that reveals the same nav links and active state for Apps & Deals.

### 9.5 App / Deal card component

- **Layout:** Card with image on top (aspect-video), then content, then footer with CTA.
- **Image:** `imageUrl`, fill/cover; alt from app `name` or deal `title`.
- **Badges (over image):** Render `item.badges`. For app: “New”, “Featured”. For deal: “Deal”, “Limited time”. Use a **“deal” badge variant** (e.g. amber/orange tint) for deal badges and default/primary for app badges (styled with **teal** in new UI).
- **Title:** App `name` or deal `title` (line-clamp 1).
- **Description:** `item.description` (line-clamp 2).
- **Meta line:** For **app:** show e.g. “X users” (Users icon) + “ · ” + publisher name. For **deal:** show discount (e.g. “50% off”) in teal + “ · ” + publisher name.
- **Footer CTA:** Single primary button: “View app” for app, “Get deal” for deal. On click: open **detail modal** (stop propagation so card click also opens detail).
- **Interactions:** Whole card clickable to open detail modal; hover uses **gs-card-hover** (lift + shadow). Primary button uses **gs-gradient** (teal).

### 9.6 Detail modal (app or deal)

- **Trigger:** Opening a card or “View app” / “Get deal” from the card.
- **Content:**
  - **Image:** Full-width top, rounded top corners; badges overlaid (same badge variants as card).
  - **Title:** App name or deal title (large). If deal, subtitle: “from [appName]”.
  - **Byline:** “by [publisher.name]” with optional verified checkmark (teal).
  - **Description:** Full `item.description`.
  - **Stats block:** For **app:** e.g. “X users”, “Y deals” (icons + teal accent). For **deal:** discount (icon + teal).
  - **Actions:** “Close” (outline) and primary “View app” / “Get deal” (gs-gradient + optional ExternalLink icon).
- **Overlay:** Same as GrowthStarter modals (e.g. `bg-black/50 backdrop-blur-sm`). Close on overlay click and via Close button.

### 9.7 Launch app modal (create listing)

- **Trigger:** “Launch app” button in header/hero and in empty state.
- **Form fields (required):**
  - **App name** (required): text input, placeholder e.g. “e.g. GrowthMetrics”.
  - **Short description:** text input, placeholder e.g. “What does your app do?”.
- **Actions:** “Cancel” (outline, closes modal) and “Launch app” (submit, gs-gradient). Submit shows loading state (e.g. “Launching…” disabled).
- **On submit:** Validate (at least name non-empty); then simulate or call API; on success:
  1. Close modal and reset form.
  2. Call **onSuccess(appId)** (e.g. with new app id).
  3. Parent shows **toast** (e.g. “App listed successfully”) and triggers **launch celebration** (Section 9.8).

### 9.8 Launch celebration (post-launch “pop”)

- **Trigger:** After a successful “Launch app” submit (and optionally on milestones like “First 100 users”).
- **Hook:** `useLaunchCelebration()` returning: `show`, `data`, `trigger(payload)`, `close`. Payload type: `{ appId, appName, startupName, usersCount, dealsCount }`.
- **Confetti:** Use **canvas-confetti**. Same colors as GrowthStarter: `['#0F7377', '#00A884', '#FFD700', '#FF6B6B']`. Pattern: two bursts from left and right, ~3s duration (requestAnimationFrame loop).
- **Overlay:** Full-screen, `z-[100]`, `bg-black/50 backdrop-blur-sm`, click to close (and “Continue” button).
- **Modal content (z above overlay):**
  - **Header strip:** Gradient (e.g. `from-emerald-500 to-teal-500`), rounded top. Decorative blobs; centered icon (Rocket) in `bg-white/20`, animate-bounce. Title: “App launched!”. Subtitle: “Your app is now live on GrowthLab.”
  - **Body:** Row with app icon/placeholder, **appName**, “by **startupName**”.
  - **Stats row:** Three small stat blocks: **Status** (e.g. “Live”), **Users** (e.g. 0), **Deals** (e.g. 0). Values in teal.
  - **Actions:** “Share” (outline; e.g. copy link and show toast “Share link copied!”) and “Continue” (primary/gs-gradient, closes celebration).
- Ensure this matches the **look and feel** of GrowthStarter’s milestone celebration (Section 5), with teal branding.

### 9.9 Toasts

- **Library:** e.g. Sonner; position e.g. bottom-right; border/style consistent with theme.
- **Messages:** “App listed successfully” after launch; “Share link copied!” when user clicks Share in launch celebration. Use success styling (primary/teal where applicable).

### 9.10 Footer (optional but recommended)

- **Content:** GrowthLab branding (name + tagline). Nav links: Home, Connect, Launch, Fund, Grow, Apps & Deals, Community, Events, Announcements. Copyright line.
- **Styling:** Border-top, background card; links use **teal** (or primary) on hover in the new UI, not blue.

### 9.11 Badge variants

- **Default / primary:** For “New”, “Featured” — use **teal** (e.g. `bg-[#0F7377]/10 text-[#0F7377]`), not blue.
- **Deal:** For “Deal”, “Limited time” — use amber/orange tint (e.g. `bg-amber-500/15 text-amber-700 dark:text-amber-300`) so deals are visually distinct.
- **Success:** Optional; e.g. green for “Verified” or success states.

### 9.12 Layout and global wiring

- **Root layout:** Header (sticky), main content (children), Toaster (Sonner). Optional: Footer below main.
- **Metadata:** Title e.g. “GrowthLab – Apps & Deals”; description for discover and launch of apps/deals.
- **Theme:** ThemeProvider (class-based, system default), same as GrowthStarter.

### 9.13 Routes / links (for integration)

- **Store home:** e.g. `/` or `/apps` (where the main grid and filters live).
- **My Launches:** e.g. `/apps/my-launches` (linked from header profile menu; can be placeholder).
- **Browse Apps:** e.g. `/apps` (from profile menu).
- Header nav links (Connect, Launch, Fund, Grow, Community, Profile) can point to main GrowthLab routes when integrated.

---

## 10. Summary checklist for the build

**Branding & UI (Sections 2–5)**  
- [ ] Use exact **color codes** and **CSS variables** from Section 2 (teal primary, no blue for primary actions).
- [ ] Reuse **gradients**, **utility classes** (gs-gradient, gs-card-hover, gs-glass, etc.), **scrollbar**, and **selection** from GrowthStarter.
- [ ] Same **stack**: Next.js (App Router), Tailwind, shadcn (New York, neutral, CSS vars), Lucide, next-themes.
- [ ] Dark mode and **animations** (slide-up, zoom-in, hover lift) aligned with GrowthStarter.

**Functionality (Section 9 – all required)**  
- [ ] **Data models:** App, Deal, Publisher, Listing types with all fields listed in 9.1.
- [ ] **Store page:** Discover hero + “Launch app” CTA, search/filters (query, sort: Trending/Newest/Most popular, Deals only), filtered grid, empty state.
- [ ] **Header:** Sticky, glass, GrowthLab nav (Home, Connect, Launch, Fund, Grow, Apps & Deals, Community, Profile), search, theme toggle, notifications, profile menu (My Launches, Browse Apps, Sign out), mobile menu.
- [ ] **Search/filters:** Search input, sort options with teal active state, “Deals only” toggle.
- [ ] **App/Deal cards:** Image, badges (New/Featured/Deal/Limited time), title, description, metric (users or discount), publisher, “View app” / “Get deal”, gs-card-hover, gs-gradient CTA.
- [ ] **Detail modal:** Image, badges, title (“from [app]” for deals), byline + verified, description, stats (users/deals or discount), Close + View app / Get deal.
- [ ] **Launch modal:** App name (required), Short description, Cancel + Launch app, loading state, onSuccess → toast + trigger celebration.
- [ ] **Launch celebration:** useLaunchCelebration hook, confetti (teal palette), overlay, modal (gradient header, “App launched!”, app name + startup, stats: Status/Users/Deals, Share + Continue), toast on Share.
- [ ] **Toasts:** “App listed successfully”, “Share link copied!” (Sonner, bottom-right).
- [ ] **Badge variants:** Teal for New/Featured, amber for Deal/Limited time.
- [ ] **Footer (optional):** GrowthLab links; teal hover.
- [ ] **Routes:** Store home (`/` or `/apps`), My Launches (`/apps/my-launches`), header nav links ready for GrowthLab.

**Integration**  
- [ ] Ready to **integrate** under GrowthLab navigation and (optionally) auth.

Use this document as the single source of truth for **branding**, **behavior**, and **functionality** when building the Apps & Deals store so it has full feature parity with the previous implementation and one cohesive GrowthLab experience alongside GrowthStarter.
