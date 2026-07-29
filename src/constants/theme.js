export const ACCENT = "#00c896";

// Fixed palette for admin/auth pages — the public portfolio uses the per-user
// theme below instead (applied through CSS variables in buildThemeStyle).
export function getThemeClasses(dark) {
  return {
    bg: dark ? "bg-[#0d0d0d]" : "bg-[#f4f1eb]",
    text: dark ? "text-[#e8e0d0]" : "text-[#1a1a1a]",
    card: dark ? "bg-[#181818] border-[#2a2a2a]" : "bg-white border-[#e0dbd0]",
    muted: dark ? "text-[#888]" : "text-[#666]",
    navBg: dark ? "bg-[#0d0d0d]/90" : "bg-[#f4f1eb]/90",
  };
}

export const FONT_OPTIONS = [
  { value: "mono", label: "Mono", className: "font-mono" },
  { value: "sans", label: "Sans", className: "font-sans" },
  { value: "serif", label: "Serif", className: "font-serif" },
];

export const FONT_CLASSES = Object.fromEntries(FONT_OPTIONS.map((f) => [f.value, f.className]));

export const DEFAULT_THEME = {
  preset: "Classic Emerald",
  font: "mono",
  dark: { bg: "#0d0d0d", text: "#e8e0d0", card: "#181818", cardBorder: "#2a2a2a", muted: "#888888" },
  light: { bg: "#f4f1eb", text: "#1a1a1a", card: "#ffffff", cardBorder: "#e0dbd0", muted: "#666666" },
  backgroundImage: "",
  backgroundOverlay: 0.85,
};

export const THEME_PRESETS = [
  {
    name: "Classic Emerald",
    accent: "#00c896",
    dark: DEFAULT_THEME.dark,
    light: DEFAULT_THEME.light,
  },
  {
    name: "Midnight Blue",
    accent: "#4f9dff",
    dark: { bg: "#0a0e1a", text: "#dbe4f3", card: "#101728", cardBorder: "#1f2a44", muted: "#7d8aa5" },
    light: { bg: "#eef2f9", text: "#101828", card: "#ffffff", cardBorder: "#d8e0ee", muted: "#5f6b81" },
  },
  {
    name: "Royal Purple",
    accent: "#a78bfa",
    dark: { bg: "#0f0a1a", text: "#e6dff5", card: "#171027", cardBorder: "#2c2046", muted: "#8d82a8" },
    light: { bg: "#f5f2fb", text: "#1d1430", card: "#ffffff", cardBorder: "#e2daf2", muted: "#6f6588" },
  },
  {
    name: "Crimson Noir",
    accent: "#ff4d5e",
    dark: { bg: "#120a0c", text: "#f0e2e4", card: "#1d1114", cardBorder: "#3a2228", muted: "#9c8288" },
    light: { bg: "#faf1f2", text: "#26141a", card: "#ffffff", cardBorder: "#efd9dc", muted: "#8a6b70" },
  },
  {
    name: "Solar Amber",
    accent: "#f5a623",
    dark: { bg: "#12100a", text: "#f0e8d8", card: "#1d1a11", cardBorder: "#3a3320", muted: "#9c9179" },
    light: { bg: "#faf6ec", text: "#241d0f", card: "#ffffff", cardBorder: "#ede4cf", muted: "#8a7f65" },
  },
  {
    name: "Steel Mono",
    accent: "#38bdf8",
    dark: { bg: "#0b0f12", text: "#e2e8ee", card: "#141a20", cardBorder: "#263039", muted: "#8494a3" },
    light: { bg: "#f1f4f6", text: "#151b20", card: "#ffffff", cardBorder: "#dbe2e8", muted: "#647585" },
  },
];

// Classes for the public portfolio — colors come from CSS variables that
// buildThemeStyle() sets on the page root, so any hex saved in the DB works.
export const PUBLIC_THEME_CLASSES = {
  bg: "bg-[color:var(--t-bg)]",
  text: "text-[color:var(--t-text)]",
  card: "bg-[color:var(--t-card)] border-[color:var(--t-card-border)]",
  muted: "text-[color:var(--t-muted)]",
  navBg: "bg-[color:var(--t-nav-bg)]",
  border: "border-[color:var(--t-border)]",
};

export function hexToRgba(hex, alpha = 1) {
  let h = (hex || "#000000").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

// Older portfolios have no theme document — fill in defaults field by field.
export function mergeTheme(theme) {
  return {
    ...DEFAULT_THEME,
    ...(theme || {}),
    dark: { ...DEFAULT_THEME.dark, ...(theme?.dark || {}) },
    light: { ...DEFAULT_THEME.light, ...(theme?.light || {}) },
  };
}

export function buildThemeStyle(theme, accent, dark) {
  const p = dark ? theme.dark : theme.light;
  const style = {
    "--t-accent": accent,
    "--t-bg": p.bg,
    "--t-text": p.text,
    "--t-card": p.card,
    "--t-card-border": p.cardBorder,
    "--t-muted": p.muted,
    "--t-border": p.cardBorder,
    "--t-nav-bg": hexToRgba(p.bg, 0.9),
  };
  if (theme.backgroundImage) {
    const overlay = hexToRgba(p.bg, theme.backgroundOverlay ?? 0.85);
    style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url("${theme.backgroundImage}")`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundAttachment = "fixed";
  }
  return style;
}
