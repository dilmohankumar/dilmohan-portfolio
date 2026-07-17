import SectionLabel from "./SectionLabel";

export default function CertificationsSection({ section, content, dark, accent, card }) {
  if (!content.certifications?.length) return null;

  return (
    <section className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <div className="mt-10 space-y-4 max-w-2xl">
          {content.certifications.map((c) => (
            <div key={c} className={`${card} border rounded-xl p-4 flex items-start gap-3`}>
              <span className="text-[#00c896] text-xl mt-0.5">✦</span>
              <p className="text-sm leading-snug">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
