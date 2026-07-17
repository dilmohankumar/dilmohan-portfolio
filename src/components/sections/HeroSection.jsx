export default function HeroSection({ content, typed, scrollTo, dark, accent, muted, card }) {
  const [firstName, ...restName] = content.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <section id="about" className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            {content.heroGreeting && (
              <p className={`text-sm tracking-[0.3em] uppercase ${muted} mb-4`}>{content.heroGreeting}</p>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4">
              {firstName}
              <br />
              {lastName && <span style={{ color: accent }}>{lastName}</span>}
            </h1>
            <div className="h-8 mb-6">
              <span className="text-lg sm:text-xl" style={{ color: accent }}>
                {typed}
              </span>
              <span className="animate-pulse" style={{ color: accent }}>
                |
              </span>
            </div>
            <p className={`${muted} text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed`}>
              {content.bio}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {content.contact?.github && (
                <a
                  href={content.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold border-2 transition-all hover:scale-105"
                  style={{ borderColor: accent, color: accent }}
                >
                  GitHub →
                </a>
              )}
              {content.contact?.linkedin && (
                <a
                  href={content.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: accent, color: "#000" }}
                >
                  LinkedIn
                </a>
              )}
              <button
                onClick={() => scrollTo("Contact")}
                className={`px-6 py-3 rounded-sm text-sm tracking-widest border ${dark ? "border-[#333] hover:border-[#555]" : "border-[#ccc] hover:border-[#999]"} transition-all hover:scale-105`}
              >
                Contact Me
              </button>
            </div>
          </div>
          {/* Avatar card */}
          <div className="flex-shrink-0">
            <div
              className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl border ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"} flex items-center justify-center overflow-hidden`}
              style={{ background: dark ? "#111" : "#ece8e0" }}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{content.avatarEmoji}</div>
                {content.avatarLabel && (
                  <p className="text-sm tracking-widest" style={{ color: accent }}>
                    {content.avatarLabel}
                  </p>
                )}
                {content.avatarLocation && <p className={`text-xs ${muted} mt-1`}>{content.avatarLocation}</p>}
              </div>
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-20"
                style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
              />
              <div
                className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
                style={{ background: `linear-gradient(315deg, ${accent}, transparent)` }}
              />
            </div>
            {content.stats?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {content.stats.map((s) => (
                  <div key={s.label} className={`${card} border rounded-xl p-3 text-center`}>
                    <div className="text-xl font-bold" style={{ color: accent }}>
                      {s.value}
                    </div>
                    <div className={`text-xs ${muted} leading-tight`}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
