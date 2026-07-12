export const ACCENT = "#00c896";

export function getThemeClasses(dark) {
  return {
    bg: dark ? "bg-[#0d0d0d]" : "bg-[#f4f1eb]",
    text: dark ? "text-[#e8e0d0]" : "text-[#1a1a1a]",
    card: dark ? "bg-[#181818] border-[#2a2a2a]" : "bg-white border-[#e0dbd0]",
    muted: dark ? "text-[#888]" : "text-[#666]",
    navBg: dark ? "bg-[#0d0d0d]/90" : "bg-[#f4f1eb]/90",
  };
}
