import SectionLabel from "./SectionLabel";

function CardsLayout({ items, muted, card }) {
  return (
    <div className="grid sm:grid-cols-2 gap-8 mt-10">
      {items.map((item, i) => (
        <div key={i} className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-all hover:-translate-y-1 duration-300`}>
          {item.emoji && <div className="text-5xl mb-5">{item.emoji}</div>}
          {item.heading && <h3 className="text-base sm:text-lg font-bold mb-3">{item.heading}</h3>}
          {item.description && <p className={`text-sm ${muted} leading-relaxed`}>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

function ListLayout({ items, accent, card }) {
  return (
    <div className="mt-10 space-y-4 max-w-2xl">
      {items.map((item, i) => (
        <div key={i} className={`${card} border rounded-xl p-4 flex items-start gap-3`}>
          <span className="text-xl mt-0.5" style={{ color: accent }}>
            ✦
          </span>
          <p className="text-sm leading-snug">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function LinksLayout({ items, accent, dark }) {
  return (
    <div className="flex flex-wrap gap-4 mt-10">
      {items.map((item, i) =>
        item.url ? (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`px-6 py-3 rounded-sm text-sm tracking-widest font-bold border-2 transition-all hover:scale-105`}
            style={{ borderColor: accent, color: accent }}
          >
            {item.label || item.url}
          </a>
        ) : (
          <span
            key={i}
            className={`px-6 py-3 rounded-sm text-sm tracking-widest border ${dark ? "border-[#333]" : "border-[#ccc]"}`}
          >
            {item.label}
          </span>
        )
      )}
    </div>
  );
}

export default function CustomSection({ section, dark, accent, muted, card }) {
  if (!section.items?.length) return null;

  const layout = section.layout || "cards";

  return (
    <section className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionLabel accent={accent}>{section.title}</SectionLabel>
        {layout === "list" && <ListLayout items={section.items} accent={accent} card={card} />}
        {layout === "links" && <LinksLayout items={section.items} accent={accent} dark={dark} />}
        {layout === "cards" && <CardsLayout items={section.items} accent={accent} muted={muted} card={card} />}
      </div>
    </section>
  );
}
