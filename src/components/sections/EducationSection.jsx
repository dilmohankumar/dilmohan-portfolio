import SectionLabel from "./SectionLabel";

export default function EducationSection({ section, education, accent, muted, card }) {
  if (!education?.length) return null;

  return (
    <section className="py-20 border-t border-[color:var(--t-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="mt-10 space-y-6 max-w-2xl">
          {education.map((ed) => (
            <div key={ed._id} className={`${card} border rounded-xl p-4 flex items-start gap-4`}>
              <div className="text-2xl">🎓</div>
              <div>
                <p className="font-bold text-sm">{ed.school}</p>
                <p className={`text-xs ${muted}`}>{ed.degree}</p>
                <p className={`text-xs ${muted} mt-0.5`}>{ed.duration}</p>
                {ed.percentage && (
                  <p className="text-xs mt-1 font-medium" style={{ color: accent }}>
                    {ed.percentage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
