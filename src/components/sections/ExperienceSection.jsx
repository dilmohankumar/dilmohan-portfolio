import SectionLabel from "./SectionLabel";

export default function ExperienceSection({ section, experience, accent, muted, card }) {
  if (!experience?.length) return null;

  return (
    <section className="py-20 border-t border-[color:var(--t-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {experience.map((e) => (
            <div key={e._id} className={`${card} border rounded-2xl p-6 hover:border-[color:var(--t-accent)] transition-colors group`}>
              <div className="text-4xl mb-4">{e.icon}</div>
              <h3 className="text-lg font-bold">{e.company}</h3>
              <p className={`text-sm ${muted} mb-2`}>{e.role}</p>
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${accent}22`, color: accent }}>
                {e.duration}
              </span>
              {e.achievements?.length > 0 && (
                <ul className={`mt-4 space-y-2 text-xs ${muted} leading-relaxed list-disc list-inside`}>
                  {e.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
