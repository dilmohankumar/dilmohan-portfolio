import SectionLabel from "./SectionLabel";

export default function ProjectsSection({ section, projects, dark, accent, muted, card }) {
  if (!projects?.length) return null;

  return (
    <section id="projects" className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-8 mt-10">
          {projects.map((p) => (
            <div
              key={p._id}
              className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-all hover:-translate-y-1 duration-300 group`}
            >
              <div className="text-5xl mb-5">{p.emoji}</div>
              <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-[#00c896] transition-colors">{p.name}</h3>
              <p className={`text-sm ${muted} mb-5 leading-relaxed`}>{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tech?.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${accent}15`, color: accent }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
