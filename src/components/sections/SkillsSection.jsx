import SectionLabel from "./SectionLabel";

export default function SkillsSection({ section, content, skillRef, skillVisible, dark, accent }) {
  if (!content.skills?.length) return null;

  return (
    <section id="skills" ref={skillRef} className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="flex flex-wrap gap-3 mt-10">
          {content.skills.map((s, i) => (
            <span
              key={s}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-500 ${dark ? "border-[#2a2a2a] hover:border-[#00c896]" : "border-[#ddd] hover:border-[#00c896]"} hover:text-[#00c896]`}
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
