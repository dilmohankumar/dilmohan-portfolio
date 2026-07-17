import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useHomeContent } from "../hooks/useHomeContent";
import { ACCENT, getThemeClasses } from "../constants/theme";
import { SECTION_RENDERERS } from "../components/sections";

const DEFAULT_NAV_LINKS = [
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Skills", target: "skills" },
  { label: "Contact", target: "contact" },
];

export default function Portfolio() {
  const { username } = useParams();
  const { dark, toggleDark } = useTheme();
  const { content, projects, experience, education, sections, loading, error, notFound } = useHomeContent(username);
  const navLinks = content?.navLinks?.length ? content.navLinks : DEFAULT_NAV_LINKS;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(navLinks[0].target);
  const [typed, setTyped] = useState("");
  const [skillVisible, setSkillVisible] = useState(false);
  const skillRef = useRef(null);

  // Typewriter effect — driven by content.roles once it's loaded
  useEffect(() => {
    const words = content?.roles;
    if (!words || words.length === 0) return;

    let wi = 0, ci = 0, deleting = false;
    let timeoutId;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        setTyped(word.slice(0, ci + 1));
        ci++;
        if (ci === word.length) { deleting = true; timeoutId = setTimeout(tick, 1200); return; }
      } else {
        setTyped(word.slice(0, ci - 1));
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      timeoutId = setTimeout(tick, deleting ? 40 : 80);
    };
    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [content]);

  // Intersection observer for skills
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillVisible(true); }, { threshold: 0.2 });
    if (skillRef.current) obs.observe(skillRef.current);
    return () => obs.disconnect();
  }, [content]);

  // Active section on scroll
  useEffect(() => {
    const handler = () => {
      for (const link of navLinks) {
        const el = document.getElementById(link.target.toLowerCase());
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          setActiveSection(link.target);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [navLinks]);

  const { bg, text, card, muted, navBg } = getThemeClasses(dark);
  const accent = content?.accentColor || ACCENT;
  const logoText = content?.logoText || "DK.";

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  if (loading && !content) {
    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono`}>
        <p className={`text-sm tracking-widest uppercase ${muted}`}>Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono px-6`}>
        <div className="text-center">
          <p className="text-sm mb-4">This portfolio doesn't exist.</p>
          <Link to="/" className="text-sm hover:underline" style={{ color: ACCENT }}>
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono px-6`}>
        <p className="text-sm text-center">
          Couldn't load site content{error ? `: ${error}` : ""}. Please try again shortly.
        </p>
      </div>
    );
  }

  const sharedSectionProps = { dark, accent, muted, card };
  const orderedSections = (sections || [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={`${bg} ${text} min-h-screen font-mono transition-colors duration-500`}>
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur border-b ${dark ? "border-[#1e1e1e]" : "border-[#ddd]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-widest" style={{ color: accent }}>
            {logoText.length > 1 ? logoText.slice(0, -1) : logoText}
            {logoText.length > 1 && <span className={dark ? "text-white" : "text-black"}>{logoText.slice(-1)}</span>}
          </span>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.target}
                onClick={() => scrollTo(l.target)}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-[#00c896] ${activeSection === l.target ? "text-[#00c896]" : muted}`}
              >
                {l.label}
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
            <button onClick={toggleDark} className="w-10 h-5 rounded-full relative" style={{ backgroundColor: dark ? "#00c896" : "#ccc" }}>
              <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300" style={{ left: dark ? "22px" : "2px" }} />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`${muted} hover:text-[#00c896] p-1`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className={`md:hidden ${dark ? "bg-[#111]" : "bg-white"} border-t ${dark ? "border-[#1e1e1e]" : "border-[#eee]"} px-6 py-4 flex flex-col gap-4`}>
            {navLinks.map((l) => (
              <button key={l.target} onClick={() => scrollTo(l.target)} className={`text-left text-sm tracking-widest uppercase ${activeSection === l.target ? "text-[#00c896]" : muted}`}>{l.label}</button>
            ))}
            <AdminNavItem muted={muted} mobile onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </nav>

      {/* SECTIONS — rendered in the admin-configured order */}
      {orderedSections.map((section) => {
        const Renderer = SECTION_RENDERERS[section.type];
        if (!Renderer) return null;

        switch (section.type) {
          case "hero":
            return <Renderer key={section._id} section={section} content={content} typed={typed} scrollTo={scrollTo} {...sharedSectionProps} />;
          case "experience":
            return <Renderer key={section._id} section={section} experience={experience} {...sharedSectionProps} />;
          case "projects":
            return <Renderer key={section._id} section={section} projects={projects} {...sharedSectionProps} />;
          case "skills":
            return <Renderer key={section._id} section={section} content={content} skillRef={skillRef} skillVisible={skillVisible} {...sharedSectionProps} />;
          case "education":
            return <Renderer key={section._id} section={section} education={education} {...sharedSectionProps} />;
          case "certifications":
            return <Renderer key={section._id} section={section} content={content} {...sharedSectionProps} />;
          case "contact":
            return <Renderer key={section._id} section={section} content={content} {...sharedSectionProps} />;
          case "custom":
            return <Renderer key={section._id} section={section} {...sharedSectionProps} />;
          default:
            return null;
        }
      })}

      {/* FOOTER */}
      <footer className={`py-6 border-t text-center ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <p className={`text-xs ${muted} tracking-widest`}>© 2026 {content.name.toUpperCase()}</p>
      </footer>
    </div>
  );
}

function AdminNavItem({ muted, mobile, onNavigate }) {
  const base = `${mobile ? "text-left" : ""} text-sm tracking-widest uppercase`;
  return (
    <Link to="/admin" onClick={onNavigate} className={`${base} transition-colors hover:text-[#00c896] ${muted}`}>
      Admin
    </Link>
  );
}
