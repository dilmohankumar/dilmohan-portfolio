export default function SectionLabel({ children, accent }) {
  if (!children) return null;
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: accent }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}44, transparent)` }} />
    </div>
  );
}
