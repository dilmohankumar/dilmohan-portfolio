import SectionLabel from "./SectionLabel";

export default function ContactSection({ section, content, dark, accent, muted }) {
  return (
    <section id="contact" className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-4">Let's Work Together</h2>
        <p className={`${muted} mb-10 text-sm sm:text-base`}>Open to new opportunities and collaborations. Drop a message!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {content.contact?.email && (
            <a
              href={`mailto:${content.contact.email}`}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm tracking-wide text-black transition-all hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              📧 {content.contact.email}
            </a>
          )}
          {content.contact?.phone && (
            <a
              href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm tracking-wide border transition-all hover:scale-105 ${dark ? "border-[#333] hover:border-[#00c896]" : "border-[#ccc] hover:border-[#00c896]"}`}
            >
              📞 {content.contact.phone}
            </a>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-8">
          {content.contact?.github && (
            <a href={content.contact.github} target="_blank" rel="noreferrer" className={`${muted} hover:text-[#00c896] text-sm transition-colors`}>
              GitHub ↗
            </a>
          )}
          {content.contact?.linkedin && (
            <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className={`${muted} hover:text-[#00c896] text-sm transition-colors`}>
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
