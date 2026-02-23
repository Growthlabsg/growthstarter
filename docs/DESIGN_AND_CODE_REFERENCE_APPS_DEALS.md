# Design, Colors & Pop-Up Reference for Apps & Deals Store

Use this as a **copy-paste and implementation reference** so the Apps & Deals store matches GrowthStarter’s design and uses the same **pop-up popper** (celebration modal) when opening the store or when a user launches an app.

---

## 1. Design & colours (design consistency)

### 1.1 Hex colour codes

| Use            | Light        | Dark (optional)   |
|----------------|-------------|-------------------|
| **Primary teal** | `#0F7377`   | —                 |
| **Teal light / success** | `#00A884` | —                 |
| **Dark teal (dark mode)** | —      | `#14b8a6`, `#2dd4bf` |
| **Confetti (pop)** | `#0F7377`, `#00A884`, `#FFD700`, `#FF6B6B` | same |
| **Card hover shadow (light)** | `rgba(15, 115, 119, 0.15)` | — |
| **Card hover shadow (dark)** | — | `rgba(20, 184, 166, 0.25)` |
| **Scrollbar thumb** | `rgba(15, 115, 119, 0.3)` hover `0.5` | `rgba(20, 184, 166, 0.3)` hover `0.5` |
| **Selection** | `rgba(15, 115, 119, 0.3)` | `rgba(20, 184, 166, 0.3)` |
| **Glow** | `rgba(15, 115, 119, 0.4/0.3/0.2)` | `rgba(20, 184, 166, 0.4/0.3/0.2)` |

### 1.2 CSS variables (for `globals.css`)

**Light (`:root`):**

```css
:root {
  --radius: 0.625rem;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 187 78% 26%;
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
  --gs-teal: 187 78% 26%;
  --gs-teal-light: 160 100% 33%;
  --gs-orange: 43 96% 56%;
  --gs-success: 160 100% 33%;
}
```

**Dark (`.dark`):**

```css
.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --card: 224 71% 6%;
  --card-foreground: 213 31% 91%;
  --popover: 224 71% 6%;
  --popover-foreground: 213 31% 91%;
  --primary: 168 76% 42%;
  --primary-foreground: 224 71% 4%;
  --secondary: 222 47% 11%;
  --secondary-foreground: 213 31% 91%;
  --muted: 223 47% 11%;
  --muted-foreground: 215 20% 65%;
  --accent: 216 34% 17%;
  --accent-foreground: 213 31% 91%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 213 31% 91%;
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  --ring: 168 76% 42%;
  --chart-1: 168 76% 42%;
  --chart-2: 30 80% 55%;
  --chart-3: 280 65% 60%;
  --chart-4: 340 75% 55%;
  --chart-5: 200 70% 50%;
  --sidebar-background: 224 71% 4%;
  --sidebar-foreground: 213 31% 91%;
  --sidebar-primary: 168 76% 42%;
  --sidebar-primary-foreground: 224 71% 4%;
  --sidebar-accent: 216 34% 17%;
  --sidebar-accent-foreground: 213 31% 91%;
  --sidebar-border: 216 34% 17%;
  --sidebar-ring: 168 76% 42%;
  --gs-teal: 168 76% 42%;
  --gs-teal-light: 168 84% 50%;
}
```

### 1.3 Utility classes (GrowthStarter – use in Apps & Deals)

```css
/* Primary gradient – buttons, CTAs, active nav */
.gs-gradient {
  background: linear-gradient(135deg, #0F7377 0%, #00A884 100%);
}
.dark .gs-gradient {
  background: linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%);
}

/* Gradient text – logo / headings */
.gs-gradient-text {
  background: linear-gradient(135deg, #0F7377 0%, #00A884 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark .gs-gradient-text {
  background: linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover – lift + teal shadow */
.gs-card-hover {
  transition: all 0.3s ease;
}
.gs-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(15, 115, 119, 0.15);
}
.dark .gs-card-hover:hover {
  box-shadow: 0 20px 40px -12px rgba(20, 184, 166, 0.25);
}

/* Sticky header bar */
.gs-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.dark .gs-glass {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Gradient border */
.gradient-border {
  position: relative;
  background: linear-gradient(var(--background), var(--background)) padding-box,
              linear-gradient(135deg, #0F7377 0%, #00A884 100%) border-box;
  border: 2px solid transparent;
}

/* Teal glow */
.neon-glow {
  box-shadow:
    0 0 5px rgba(15, 115, 119, 0.4),
    0 0 10px rgba(15, 115, 119, 0.3),
    0 0 15px rgba(15, 115, 119, 0.2);
}
.dark .neon-glow {
  box-shadow:
    0 0 5px rgba(20, 184, 166, 0.4),
    0 0 10px rgba(20, 184, 166, 0.3),
    0 0 15px rgba(20, 184, 166, 0.2);
}
```

### 1.4 Scrollbar & selection

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(15, 115, 119, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 115, 119, 0.5);
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(20, 184, 166, 0.3);
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(20, 184, 166, 0.5);
}

::selection {
  background: rgba(15, 115, 119, 0.3);
  color: inherit;
}
.dark ::selection {
  background: rgba(20, 184, 166, 0.3);
}
```

### 1.5 Tailwind usage for consistency

- **Primary buttons / CTAs:** `className="gs-gradient text-white"` or `bg-primary text-primary-foreground`.
- **Active nav / filter chip:** `bg-[#0F7377]/10 text-[#0F7377] border border-[#0F7377]/30` (dark: `bg-teal-500/20 text-teal-400 border-teal-500/30`).
- **Focus ring:** `focus:ring-2 focus:ring-[#0F7377]/20 focus:border-[#0F7377]` or `focus:ring-teal-500`.
- **Teal accent text/icon:** `text-[#0F7377] dark:text-teal-400` or `text-teal-600 dark:text-teal-400`.
- **Stat / highlight number:** `text-teal-600 dark:text-teal-400`.

---

## 2. Header design & code (design consistency)

Use the same **structure and class names** so the Apps & Deals header feels like GrowthStarter.

### 2.1 Sticky header bar (simplified for Apps & Deals)

- **Container:** Sticky, full width, glass style, border-bottom.
- **Layout:** Logo left, nav in middle (optional), search + theme + notifications + profile + CTA right.

**Structure and classes:**

```tsx
<header
  className="sticky top-0 z-40 w-full border-b border-border gs-glass"
  role="banner"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      {/* Logo – same as GrowthStarter */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gs-gradient-text">
            GrowthLab
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block dark:text-slate-400">
            Apps & Deals
          </p>
        </div>
      </Link>

      {/* Nav – active state with teal */}
      <nav className="hidden lg:flex items-center gap-1">
        {/* Active: gs-gradient text-white; Inactive: text-slate-600 hover:bg-slate-100 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium gs-gradient text-white shadow-md"
        >
          Discover
        </Link>
        <Link
          href="/apps"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Apps & Deals
        </Link>
        {/* ... more nav items ... */}
      </nav>

      {/* Right: search, theme, notifications, profile, CTA */}
      <div className="flex items-center gap-2">
        {/* Theme toggle – same style as GrowthStarter */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          onClick={toggleTheme}
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </Button>

        {/* Notifications */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 relative"
        >
          <Bell className="h-4 w-4" />
          {/* optional unread badge */}
        </Button>

        {/* Primary CTA – Launch app */}
        <Button
          size="sm"
          className="gs-gradient hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
          onClick={onLaunchApp}
        >
          <Rocket className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Launch app</span>
        </Button>
      </div>
    </div>
  </div>
</header>
```

### 2.2 Header design rules

- **Logo block:** `w-10 h-10 gs-gradient rounded-xl` + icon; title with `gs-gradient-text`; subtitle `text-slate-500`.
- **Sticky bar:** `sticky top-0 z-40 w-full border-b border-border gs-glass`.
- **Nav pill active:** `gs-gradient text-white shadow-md`; inactive: `text-slate-600 hover:bg-slate-100` (dark: `hover:bg-slate-700`).
- **Secondary actions:** `rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700`.
- **Primary CTA:** `gs-gradient text-white ... rounded-full`.

### 2.3 Floating header – full code (GrowthStarter)

The floating nav appears **after the user scrolls down** (e.g. past 100px). It’s a centred pill bar with nav items + actions. Below: scroll logic, then desktop, tablet, and mobile variants.

**Scroll visibility (when to show floating nav):**

```tsx
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
    // Optional: set activeSection from scroll position for nav highlight
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Desktop floating nav (lg and up) – centred pill:**

```tsx
{isVisible && (
  <nav className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
      {/* Nav items – links or section buttons */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <Link
            key={item.id}
            href={item.href ?? "#"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "gs-gradient text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className={isActive ? "" : "hidden xl:inline"}>{item.label}</span>
          </Link>
        );
      })}

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-600" />

      {/* Right-side actions */}
      <button
        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="h-4 w-4 hidden dark:block" />
      </button>
      <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <button className="flex items-center gap-1.5 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all ml-1">
        <Rocket className="h-4 w-4" />
        <span className="hidden xl:inline">Launch app</span>
      </button>
    </div>
  </nav>
)}
```

**Key classes (floating bar):**

- **Outer nav:** `hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300`
- **Pill container:** `flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50`
- **Active nav item:** `gs-gradient text-white shadow-md`
- **Inactive nav item:** `text-slate-600 hover:bg-slate-100 hover:text-slate-900` (add `dark:text-slate-300 dark:hover:bg-slate-700` for dark)
- **Divider:** `w-px h-6 bg-slate-200 dark:bg-slate-600`
- **Icon buttons:** `p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700`
- **Primary CTA in pill:** `flex items-center gap-1.5 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all ml-1`

**Tablet floating nav (md to lg) – icons only:**

```tsx
{isVisible && (
  <nav className="hidden md:block lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
      {navItems.slice(0, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`p-2.5 rounded-full transition-all ${
              isActive ? "gs-gradient text-white shadow-md" : "text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
      <div className="w-px h-6 bg-slate-200" />
      <button className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <button className="flex items-center gap-1 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </nav>
)}
```

**Mobile (md and down) – FAB + dropdown menu:**

```tsx
<div className="md:hidden fixed bottom-4 right-4 z-50">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="w-14 h-14 gs-gradient text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
    aria-label="Menu"
  >
    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
  </button>

  {mobileMenuOpen && (
    <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
      <div className="p-2 max-h-[60vh] overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400" : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
        <button
          onClick={() => { onLaunchApp(); setMobileMenuOpen(false); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 gs-gradient text-white rounded-xl text-sm font-medium"
        >
          <Rocket className="h-5 w-5" />
          Launch app
        </button>
      </div>
    </div>
  )}
</div>
```

**Scroll-to-top button (when floating nav is visible):**

```tsx
{isVisible && (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-4 left-4 w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-all z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
    aria-label="Scroll to top"
  >
    <ChevronUp className="h-5 w-5" />
  </button>
)}
```

**Summary – floating header classes:**

| Element | Classes |
|--------|---------|
| **Desktop floating nav** | `fixed top-4 left-1/2 -translate-x-1/2 z-50` + `animate-in fade-in slide-in-from-top-2 duration-300` |
| **Pill bar** | `bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50` |
| **Active pill item** | `gs-gradient text-white shadow-md` |
| **Inactive pill item** | `text-slate-600 hover:bg-slate-100 hover:text-slate-900` |
| **Mobile FAB** | `w-14 h-14 gs-gradient text-white rounded-full shadow-xl` at `fixed bottom-4 right-4 z-50` |
| **Mobile menu panel** | `absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border ... animate-in slide-in-from-bottom-2 duration-200` |
| **Scroll to top** | `fixed bottom-4 left-4 w-12 h-12 bg-slate-800 text-white rounded-full shadow-xl` |

---

## 3. Pop-up popper (celebration) – implement in App Store

This is the **same pop** as in GrowthStarter: full-screen overlay + confetti + centred modal. Use it when “opening GrowthStarter” (e.g. first visit or entering the store) and/or when an app is **launched successfully**.

### 3.1 Confetti (canvas-confetti)

- **Library:** `canvas-confetti`.
- **Colours:** `['#0F7377', '#00A884', '#FFD700', '#FF6B6B']`.
- **Pattern:** Two bursts (left and right), ~3 seconds.

```ts
import confetti from "canvas-confetti";

const CONFETTI_COLORS = ["#0F7377", "#00A884", "#FFD700", "#FF6B6B"];

function runConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: CONFETTI_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
```

### 3.2 Overlay and modal – exact classes (GrowthStarter)

- **Overlay (backdrop):**  
  `fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto`
- **Inner wrapper (centre):**  
  `min-h-full flex items-center justify-center p-4`
- **Modal card:**  
  `relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500`
- **Close button (top-right):**  
  `absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors`  
  Content: `<X className="h-5 w-5 text-white" />`

### 3.3 Gradient header strip (pop content)

- **Container:**  
  `relative bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-8 text-white text-center`  
  (For “App launched!” use this; for milestone-style you can use `config.color` e.g. `from-yellow-400 to-amber-500` for 100%.)
- **Deco blobs:**  
  `absolute inset-0 overflow-hidden`  
  - `absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl`  
  - `absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl`
- **Icon circle:**  
  `w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce`  
  Icon: e.g. `<Rocket className="h-10 w-10" />` or `<Trophy className="h-10 w-10" />`
- **Title:**  
  `text-3xl font-bold mb-2`  
  e.g. “App launched!” or “Fully Funded!”
- **Subtitle:**  
  `text-white/90`  
  e.g. “Your app is now live on GrowthLab.” or “This project has reached its goal!”

### 3.4 Body section (stats + actions)

- **Content padding:**  
  `p-6`
- **Entity row (e.g. app/project):**  
  `flex items-center gap-4 mb-4`  
  - Image: `w-16 h-16 rounded-xl object-cover`  
  - Title: `font-semibold text-slate-900 dark:text-white`  
  - Subtitle: `text-sm text-slate-500 dark:text-slate-400` (e.g. “by {name}”)
- **Stats row (3 columns):**  
  `grid grid-cols-3 gap-4 mb-6`  
  - Each cell: `text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl`  
  - Value: `text-2xl font-bold text-teal-600 dark:text-teal-400`  
  - Label: `text-xs text-slate-500 dark:text-slate-400`
- **Actions row:**  
  `flex gap-3`  
  - Share: `<Button variant="outline" className="flex-1">` + icon + “Share the News” / “Share”  
  - Primary: `<Button className="flex-1 gs-gradient text-white">` “Continue Exploring” / “Continue”

### 3.5 When to show the pop in App Store

1. **On “App launched” success** – after submit of Launch app form: run confetti, show modal with “App launched!”, app name, startup name, stats (Status: Live, Users: 0, Deals: 0), Share + Continue.
2. **Optional: on first visit / opening the store** – e.g. “Welcome to Apps & Deals” with same overlay + modal styling (and optionally light confetti), then Continue.

Use the **same overlay, modal, gradient header, and body class names** as above so the pop-up popper is identical to GrowthStarter’s celebration.

---

## 4. Quick reference checklist

- [ ] **Colours:** Use `#0F7377`, `#00A884` for primary; confetti `#0F7377`, `#00A884`, `#FFD700`, `#FF6B6B`.
- [ ] **CSS variables:** Copy `:root` and `.dark` from Section 1.2 into `globals.css`.
- [ ] **Utility classes:** Implement `.gs-gradient`, `.gs-gradient-text`, `.gs-card-hover`, `.gs-glass`, scrollbar and selection from Section 1.3–1.4.
- [ ] **Header:** Sticky `gs-glass` bar; logo with `gs-gradient` + `gs-gradient-text`; nav pills with `gs-gradient` when active; CTA `gs-gradient`; same button/dropdown styles as Section 2.
- [ ] **Pop-up popper:** Same overlay and modal classes; `canvas-confetti` with same colours and pattern; gradient header strip; stats in `bg-slate-50 dark:bg-slate-800` and `text-teal-600 dark:text-teal-400`; Share (outline) + Continue (`gs-gradient`).

This gives you **design consistency** and the **same pop-up popper** behaviour as GrowthStarter in the Apps & Deals store.
