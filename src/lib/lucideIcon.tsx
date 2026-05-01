import { icons, type LucideProps } from "lucide-react";

/**
 * Render any lucide-react icon by its PascalCase name.
 * Falls back to a neutral icon if the name is unknown.
 */
export const LucideIcon = ({
  name,
  fallback = "Sparkles",
  ...props
}: { name?: string | null; fallback?: string } & LucideProps) => {
  const key = (name && (icons as any)[name]) ? name! : fallback;
  const Cmp = (icons as any)[key] ?? (icons as any).Sparkles;
  return <Cmp {...props} />;
};

// Curated list shown in admin selectors.
export const ICON_OPTIONS = [
  "Award", "Leaf", "ShieldCheck", "Rocket", "Heart",
  "Target", "Compass", "Sparkles", "Globe", "Sprout",
  "TreePine", "Sun", "Droplet", "HandHeart", "Users",
  "Star", "Trophy", "Lightbulb", "Eye", "Flag",
] as const;