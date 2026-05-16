import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Projects", "Skills", "Contact"];

const SKILLS = [
  "JavaScript", "React.js", "Node.js", "MongoDB", "Express.js",
  "Next.js", "Tailwind CSS", "HTML", "CSS", "Material UI",
  "Redux (RTK)", "Version Control", "Responsive Web Design",
];

const PROJECTS = [
  {
    name: "WhoisDataCenter Web Platform",
    desc: "A full-featured web platform built with Next.js, Bootstrap, and Redux. Features responsive UI, REST API integration, and efficient state management.",
    tech: ["Next.js", "Bootstrap", "Redux"],
    emoji: "🌐",
  },
  {
    name: "Whois Data Center App",
    desc: "Full-stack MERN application with Redux for state management, REST APIs, MongoDB Atlas for cloud database, and production deployment.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    emoji: "⚡",
  },
];

const EXPERIENCE = [
  {
    company: "AllHeartWeb",
    role: "Frontend & Backend Developer",
    duration: "6 Months",
    icon: "💼",
  },
  {
    company: "EunixTech",
    role: "Web Development & UI Design",
    duration: "3 Months",
    icon: "🛠️",
  },
];

const CERTS = [
  "JavaScript Programming with React, Node & MongoDB Specialization",
  "Web Development in Node.js",
  "Frontend Web Development with React",
];

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("About");
  const [typed, setTyped] = useState("");
  const [skillVisible, setSkillVisible] = useState(false);
  const skillRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const words = ["MERN Stack Developer", "React Enthusiast", "Full Stack Builder"];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        setTyped(word.slice(0, ci + 1));
        ci++;
        if (ci === word.length) { deleting = true; setTimeout(tick, 1200); return; }
      } else {
        setTyped(word.slice(0, ci - 1));
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 40 : 80);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  // Intersection observer for skills
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillVisible(true); }, { threshold: 0.2 });
    if (skillRef.current) obs.observe(skillRef.current);
    return () => obs.disconnect();
  }, []);

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

  const bg = dark ? "bg-[#0d0d0d]" : "bg-[#f4f1eb]";
  const text = dark ? "text-[#e8e0d0]" : "text-[#1a1a1a]";
  const card = dark ? "bg-[#181818] border-[#2a2a2a]" : "bg-white border-[#e0dbd0]";
  const accent = "#00c896";
  const muted = dark ? "text-[#888]" : "text-[#666]";
  const navBg = dark ? "bg-[#0d0d0d]/90" : "bg-[#f4f1eb]/90";

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className={`${bg} ${text} min-h-screen font-mono transition-colors duration-500`}>
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur border-b ${dark ? "border-[#1e1e1e]" : "border-[#ddd]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-widest" style={{ color: accent }}>
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
            <button
              onClick={() => setDark(!dark)}
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
            <button onClick={() => setDark(!dark)} className="w-10 h-5 rounded-full relative" style={{ backgroundColor: dark ? "#00c896" : "#ccc" }}>
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
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l)} className={`text-left text-sm tracking-widest uppercase ${activeSection === l ? "text-[#00c896]" : muted}`}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="about" className="min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <p className={`text-sm tracking-[0.3em] uppercase ${muted} mb-4`}>👋 Hello, World</p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4">
                Dilmohan<br />
                <span style={{ color: accent }}>Kumar</span>
              </h1>
              <div className="h-8 mb-6">
                <span className="text-lg sm:text-xl" style={{ color: accent }}>{typed}</span>
                <span className="animate-pulse" style={{ color: accent }}>|</span>
              </div>
              <p className={`${muted} text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed`}>
                Dedicated MERN stack developer crafting innovative, user-friendly web applications. Excited to join collaborative teams and continuously learn.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href="https://github.com/dilmohankumar?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold border-2 transition-all hover:scale-105"
                  style={{ borderColor: accent, color: accent }}
                >
                  GitHub →
                </a>
                <a
                  href="https://www.linkedin.com/in/dilmohan-kumar-b230b921b/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-sm text-sm tracking-widest font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: accent, color: "#000" }}
                >
                  LinkedIn
                </a>
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
              <div className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl border ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"} flex items-center justify-center overflow-hidden`} style={{ background: dark ? "#111" : "#ece8e0" }}>
                <div className="text-center">
                  <div className="text-8xl mb-4">👨‍💻</div>
                  <p className="text-sm tracking-widest" style={{ color: accent }}>MERN STACK</p>
                  <p className={`text-xs ${muted} mt-1`}>Chandigarh, India</p>
                </div>
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-20" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }} />
                <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20" style={{ background: `linear-gradient(315deg, ${accent}, transparent)` }} />
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[["9+", "Months Exp"], ["2+", "Projects"], ["5+", "Certs"]].map(([num, lab]) => (
                  <div key={lab} className={`${card} border rounded-xl p-3 text-center`}>
                    <div className="text-xl font-bold" style={{ color: accent }}>{num}</div>
                    <div className={`text-xs ${muted} leading-tight`}>{lab}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel accent={accent} muted={muted}>Experience</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {EXPERIENCE.map((e) => (
              <div key={e.company} className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-colors group`}>
                <div className="text-4xl mb-4">{e.icon}</div>
                <h3 className="text-lg font-bold">{e.company}</h3>
                <p className={`text-sm ${muted} mb-2`}>{e.role}</p>
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${accent}22`, color: accent }}>{e.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel accent={accent} muted={muted}>Projects</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-8 mt-10">
            {PROJECTS.map((p, i) => (
              <div key={i} className={`${card} border rounded-2xl p-6 hover:border-[#00c896] transition-all hover:-translate-y-1 duration-300 group`}>
                <div className="text-5xl mb-5">{p.emoji}</div>
                <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-[#00c896] transition-colors">{p.name}</h3>
                <p className={`text-sm ${muted} mb-5 leading-relaxed`}>{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${accent}15`, color: accent }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" ref={skillRef} className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel accent={accent} muted={muted}>Skills</SectionLabel>
          <div className="flex flex-wrap gap-3 mt-10">
            {SKILLS.map((s, i) => (
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

      {/* EDUCATION & CERTS */}
      <section className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <SectionLabel accent={accent} muted={muted}>Education</SectionLabel>
              <div className="mt-8 space-y-6">
                {[
                  ["Chandigarh University", "B.Tech — Computer Science", "71%"],
                  ["Shivalik Science School", "Higher Secondary (12th)", "84%"],
                  ["Shivalik Science School", "Matriculation (10th)", "83%"],
                ].map(([school, deg, pct]) => (
                  <div key={school + deg} className={`${card} border rounded-xl p-4 flex items-start gap-4`}>
                    <div className="text-2xl">🎓</div>
                    <div>
                      <p className="font-bold text-sm">{school}</p>
                      <p className={`text-xs ${muted}`}>{deg}</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: accent }}>{pct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel accent={accent} muted={muted}>Certifications</SectionLabel>
              <div className="mt-8 space-y-4">
                {CERTS.map((c) => (
                  <div key={c} className={`${card} border rounded-xl p-4 flex items-start gap-3`}>
                    <span className="text-[#00c896] text-xl mt-0.5">✦</span>
                    <p className="text-sm leading-snug">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`py-20 border-t ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel accent={accent} muted={muted}>Contact</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-4">Let's Work Together</h2>
          <p className={`${muted} mb-10 text-sm sm:text-base`}>Open to new opportunities and collaborations. Drop a message!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:kdilmohan101@gmail.com" className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm tracking-wide text-black transition-all hover:scale-105" style={{ backgroundColor: accent }}>
              📧 kdilmohan101@gmail.com
            </a>
            <a href="tel:+919218600126" className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm tracking-wide border transition-all hover:scale-105 ${dark ? "border-[#333] hover:border-[#00c896]" : "border-[#ccc] hover:border-[#00c896]"}`}>
              📞 +91 9218600126
            </a>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <a href="https://github.com/dilmohankumar?tab=repositories" target="_blank" rel="noreferrer" className={`${muted} hover:text-[#00c896] text-sm transition-colors`}>GitHub ↗</a>
            <a href="https://www.linkedin.com/in/dilmohan-kumar-b230b921b/" target="_blank" rel="noreferrer" className={`${muted} hover:text-[#00c896] text-sm transition-colors`}>LinkedIn ↗</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-6 border-t text-center ${dark ? "border-[#1a1a1a]" : "border-[#e8e4dc]"}`}>
        <p className={`text-xs ${muted} tracking-widest`}>© 2026 DILMOHAN KUMAR</p>
      </footer>
    </div>
  );
} 

function SectionLabel({ children, accent, muted }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: accent }}>{children}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}44, transparent)` }} />
    </div>
  );
}