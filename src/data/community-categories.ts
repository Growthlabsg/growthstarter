/**
 * Category system for Community discovery (GrowthLab).
 * Pre-defined + extensible; communities can have 2–3 categories max.
 * Slug used in URLs: /community/category/[slug]
 */

export const COMMUNITY_CATEGORY_LIST = [
  { slug: "startups", label: "Startups & Entrepreneurship" },
  { slug: "ai-ml", label: "AI / Machine Learning / Agents" },
  { slug: "fintech-web3", label: "Fintech & Web3 / Crypto" },
  { slug: "nocode", label: "No-Code / Low-Code Builders" },
  { slug: "product-growth", label: "Product & Growth" },
  { slug: "marketing-sales", label: "Marketing & Sales" },
  { slug: "design", label: "Design / UX / UI" },
  { slug: "developers", label: "Developers / Engineering" },
  { slug: "founders-leadership", label: "Founders & Leadership" },
  { slug: "climate", label: "Climate / Sustainability / Impact" },
  { slug: "remote-work", label: "Remote Work & Digital Nomads" },
  { slug: "women-in-tech", label: "Women in Tech / Diversity & Inclusion" },
  { slug: "singapore-sea", label: "Singapore / SEA Founders" },
  { slug: "funding", label: "Funding & Investors" },
  { slug: "hiring", label: "Hiring / Talent / Careers" },
  { slug: "indie-makers", label: "Indie Makers / Side Projects" },
  { slug: "health-wellness", label: "Health / Wellness / Bio" },
  { slug: "other", label: "Other" },
] as const;

export type CommunityCategorySlug = (typeof COMMUNITY_CATEGORY_LIST)[number]["slug"];
export type CommunityCategoryLabel = (typeof COMMUNITY_CATEGORY_LIST)[number]["label"];

export const CATEGORY_SLUG_TO_LABEL: Record<string, string> = Object.fromEntries(
  COMMUNITY_CATEGORY_LIST.map((c) => [c.slug, c.label])
);

export const CATEGORY_LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  COMMUNITY_CATEGORY_LIST.map((c) => [c.label, c.slug])
);

/** Labels only (for dropdowns / display). "Other" allows custom entry. */
export const COMMUNITY_CATEGORY_LABELS = COMMUNITY_CATEGORY_LIST.map((c) => c.label);

/** Max categories per community (prevents spam / dilution). */
export const MAX_COMMUNITY_CATEGORIES = 3;

/** Max interest categories a user can select during onboarding. */
export const MAX_USER_INTEREST_CATEGORIES = 5;

export function getCategoryLabel(slug: string): string {
  return CATEGORY_SLUG_TO_LABEL[slug] ?? slug;
}

export function getCategorySlug(label: string): string {
  return CATEGORY_LABEL_TO_SLUG[label] ?? label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Resolve category for display: supports legacy single category or new categories[] (use first). */
export function getPrimaryCategoryLabel(community: { category?: string; categories?: string[] }): string {
  if (community.categories?.length) {
    const first = community.categories[0];
    return typeof first === "string" && first.startsWith("slug:") ? getCategoryLabel(first.slice(5)) : (first ?? "");
  }
  return community.category ?? "Other";
}

/** Slug for primary category (for links). */
export function getPrimaryCategorySlug(community: { category?: string; categories?: string[] }): string {
  if (community.categories?.length) {
    const first = community.categories[0];
    if (typeof first === "string" && first.startsWith("slug:")) return first.slice(5);
    if (typeof first === "string") return getCategorySlug(first);
  }
  return getCategorySlug(community.category ?? "Other");
}

/** All category labels for a community (max 2 for badges on cards). */
export function getCategoryBadges(community: { category?: string; categories?: string[] }, max = 2): string[] {
  if (community.categories?.length) {
    const labels = community.categories.slice(0, max).map((c) =>
      typeof c === "string" && c.startsWith("slug:") ? getCategoryLabel(c.slice(5)) : (c ?? "")
    ).filter(Boolean);
    if (labels.length) return labels;
  }
  if (community.category) return [community.category];
  return [];
}
