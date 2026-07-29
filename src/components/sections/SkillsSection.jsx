import SectionLabel from "./SectionLabel";

export default function SkillsSection({ section, content, skillRef, skillVisible, accent }) {
  if (!content.skills?.length) return null;

  return (
    <section id="skills" ref={skillRef} className="py-20 border-t border-[color:var(--t-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="flex flex-wrap gap-3 mt-10">
          {content.skills.map((s, i) => (
            <span
              key={s}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-500 border-[color:var(--t-card-border)] hover:border-[color:var(--t-accent)] hover:text-[color:var(--t-accent)]"
              style={{
                opacity: skillVisible ? 1 : 0,
                transform: skillVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
