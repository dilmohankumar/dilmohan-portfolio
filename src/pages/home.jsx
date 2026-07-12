import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useHomeContent } from "../hooks/useHomeContent";
import { ACCENT, getThemeClasses } from "../constants/theme";

const NAV_LINKS = ["About", "Projects", "Skills", "Contact"];

export default function Portfolio() {
  const { dark, toggleDark } = useTheme();
  const { isAdmin } = useAuth();
  const { content, projects, experience, education, loading, error } =
    useHomeContent();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("About");
  const [typed, setTyped] = useState("");
  const [skillVisible, setSkillVisible] = useState(false);
  const skillRef = useRef(null);

  // Typewriter effect — driven by content.roles once it's loaded
  useEffect(() => {
    const words = content?.roles;
    if (!words || words.length === 0) return;

    let wi = 0,
      ci = 0,
      deleting = false;
    let timeoutId;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        setTyped(word.slice(0, ci + 1));
        ci++;
        if (ci === word.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1200);
          return;
        }
      } else {
        setTyped(word.slice(0, ci - 1));
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      timeoutId = setTimeout(tick, deleting ? 40 : 80);
    };
    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [content]);

  // Intersection observer for skills
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSkillVisible(true);
      },
      { threshold: 0.2 },
    );
    if (skillRef.current) obs.observe(skillRef.current);
    return () => obs.disconnect();
  }, [content]);

  // Active section on scroll
  useEffect(() => {
    const handler = () => {
      const sections = ["about", "projects", "skills", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          setActiveSection(id.charAt(0).toUpperCase() + id.slice(1));
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const { bg, text, card, muted, navBg } = getThemeClasses(dark);
  const accent = ACCENT;

  const scrollTo = (id) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  if (loading && !content) {
    return (
      <div
        className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono`}
      >
        <p className={`text-sm tracking-widest uppercase ${muted}`}>Loading…</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div
        className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono px-6`}
      >
        <p className="text-sm text-center">
          Couldn't load site content{error ? `: ${error}` : ""}. Please try
          again shortly.
        </p>
      </div>
    );
  }

  const [firstName, ...restName] = content.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <div
      className={`${bg} ${text} min-h-screen font-mono transition-colors duration-500`}
    >
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur border-b ${dark ? "border-[#1e1e1e]" : "border-[#ddd]"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span
            className="text-xl font-bold tracking-widest"
            style={{ color: accent }}
          >
            DK<span className={dark ? "text-white" : "text-black"}>.</span>
          </span>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-[#00c896] ${activeSection === l ? "text-[#00c896]" : muted}`}
              >
                {l}
              </button>
            ))}
            <AdminNavItem muted={muted} />
            <button
              onClick={toggleDark}
              className="ml-4 w-12 h-6 rounded-full relative transition-colors duration-300"
              style={{ backgroundColor: dark ? "#00c896" : "#ccc" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: dark ? "26px" : "2px" }}
              />
            </button>
          </div>
          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleDark}
              className="w-10 h-5 rounded-full relative"
              style={{ backgroundColor: dark ? "#00c896" : "#ccc" }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: dark ? "22px" : "2px" }}
              />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`${muted} hover:text-[#00c896] p-1`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div
            className={`md:hidden ${dark ? "bg-[#111]" : "bg-white"} border-t ${dark ? "border-[#1e1e1e]" : "border-[#eee]"} px-6 py-4 flex flex-col gap-4`}
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className={`text-left text-sm tracking-widest uppercase ${activeSection === l ? "text-[#00c896]" : muted}`}
              >
                {l}
              </button>
            ))}
            <AdminNavItem muted={muted} mobile onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="about" className="min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              {content.heroGreeting && (
                <p
                  className={`text-sm tracking-[0.3em] uppercase ${muted} mb-4`}
                >
                  {content.heroGreeting}
                </p>
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
              <p
                className={`${muted} text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed`}
              >
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
                    <p
                      className="text-sm tracking-widest"
                      style={{ color: accent }}
                    >
                      {content.avatarLabel}
                    </p>
                  )}
                  {content.avatarLocation && (
                    <p className={`text-xs ${muted} mt-1`}>
                      {content.avatarLocation}
                    </p>
                  )}
                </div>
                {/* Decorative corner */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, transparent)`,
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
                  style={{
                    background: `linear-gradient(315deg, ${accent}, transparent)`,
                  }}
                />
              </div>
              {/* Stats */}
              {content.stats?.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {content.stats.map((s) => (
                    <div
                      key={s.label}
                      className={`${card} border rounded-xl p-3 text-center`}
                    >
                      <div
                        className="text-xl font-bold"
                        style={{ color: accent }}
                      >
                        {s.value}
                      </div>
                      <div className={`text-xs ${muted} leading-tight`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <section
          className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionLabel accent={accent} muted={muted}>
              Experience
            </SectionLabel>
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {experience.map((e) => (
                <div
                  key={e._id}
                  className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-colors group`}
                >
                  <div className="text-4xl mb-4">{e.icon}</div>
                  <h3 className="text-lg font-bold">{e.company}</h3>
                  <p className={`text-sm ${muted} mb-2`}>{e.role}</p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ backgroundColor: `${accent}22`, color: accent }}
                  >
                    {e.duration}
                  </span>
                  {e.achievements?.length > 0 && (
                    <ul
                      className={`mt-4 space-y-2 text-xs ${muted} leading-relaxed list-disc list-inside`}
                    >
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
      )}

      {/* PROJECTS */}
      <section
        id="projects"
        className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel accent={accent} muted={muted}>
            Projects
          </SectionLabel>
          <div className="grid sm:grid-cols-2 gap-8 mt-10">
            {projects?.map((p) => (
              <div
                key={p._id}
                className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-all hover:-translate-y-1 duration-300 group`}
              >
                <div className="text-5xl mb-5">{p.emoji}</div>
                <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-[#00c896] transition-colors">
                  {p.name}
                </h3>
                <p className={`text-sm ${muted} mb-5 leading-relaxed`}>
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tech?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {content.skills?.length > 0 && (
        <section
          id="skills"
          ref={skillRef}
          className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionLabel accent={accent} muted={muted}>
              Skills
            </SectionLabel>
            <div className="flex flex-wrap gap-3 mt-10">
              {content.skills.map((s, i) => (
                <span
                  key={s}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-500 ${dark ? "border-[#2a2a2a] hover:border-[#00c896]" : "border-[#ddd] hover:border-[#00c896]"} hover:text-[#00c896]`}
                  style={{
                    opacity: skillVisible ? 1 : 0,
                    transform: skillVisible
                      ? "translateY(0)"
                      : "translateY(20px)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION & CERTS */}
      {(education?.length > 0 || content.certifications?.length > 0) && (
        <section
          className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {education?.length > 0 && (
                <div>
                  <SectionLabel accent={accent} muted={muted}>
                    Education
                  </SectionLabel>
                  <div className="mt-8 space-y-6">
                    {education.map((ed) => (
                      <div
                        key={ed._id}
                        className={`${card} border rounded-xl p-4 flex items-start gap-4`}
                      >
                        <div className="text-2xl">🎓</div>
                        <div>
                          <p className="font-bold text-sm">{ed.school}</p>
                          <p className={`text-xs ${muted}`}>{ed.degree}</p>
                          <p className={`text-xs ${muted} mt-0.5`}>
                            {ed.duration}
                          </p>
                          {ed.percentage && (
                            <p
                              className="text-xs mt-1 font-medium"
                              style={{ color: accent }}
                            >
                              {ed.percentage}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {content.certifications?.length > 0 && (
                <div>
                  <SectionLabel accent={accent} muted={muted}>
                    Certifications
                  </SectionLabel>
                  <div className="mt-8 space-y-4">
                    {content.certifications.map((c) => (
                      <div
                        key={c}
                        className={`${card} border rounded-xl p-4 flex items-start gap-3`}
                      >
                        <span className="text-[#00c896] text-xl mt-0.5">✦</span>
                        <p className="text-sm leading-snug">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section
        id="contact"
        className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel accent={accent} muted={muted}>
            Contact
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-4">
            Let's Work Together
          </h2>
          <p className={`${muted} mb-10 text-sm sm:text-base`}>
            Open to new opportunities and collaborations. Drop a message!
          </p>
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
              <a
                href={content.contact.github}
                target="_blank"
                rel="noreferrer"
                className={`${muted} hover:text-[#00c896] text-sm transition-colors`}
              >
                GitHub ↗
              </a>
            )}
            {content.contact?.linkedin && (
              <a
                href={content.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`${muted} hover:text-[#00c896] text-sm transition-colors`}
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`py-6 border-t text-center ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}
      >
        <p className={`text-xs ${muted} tracking-widest`}>
          © 2026 {content.name.toUpperCase()}
        </p>
      </footer>
    </div>
  );
}

function AdminNavItem({ muted, mobile, onNavigate }) {
  const base = `${mobile ? "text-left" : ""} text-sm tracking-widest uppercase`;
  return (
    <Link
      to="/admin"
      onClick={onNavigate}
      className={`${base} transition-colors hover:text-[#00c896] ${muted}`}
    >
      Admin
    </Link>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="text-xs tracking-[0.4em] uppercase font-bold"
        style={{ color: accent }}
      >
        {children}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to right, ${accent}44, transparent)`,
        }}
      />
    </div>
  );
}
