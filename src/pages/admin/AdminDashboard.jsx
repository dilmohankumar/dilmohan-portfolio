import { api } from "../../api/client";
import ArrayFieldEditor from "../../components/admin/ArrayFieldEditor";
import CrudListSection from "../../components/admin/CrudListSection";
import PageLayoutEditor from "../../components/admin/PageLayoutEditor";
import ScalarForm from "../../components/admin/ScalarForm";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../../constants/theme";
import { useHomeContent } from "../../hooks/useHomeContent";

const DEFAULT_NAV_LINKS = [
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Skills", target: "skills" },
  { label: "Contact", target: "contact" },
];

export default function AdminDashboard() {
  const { dark, toggleDark } = useTheme();
  const { bg, text, card, muted } = getThemeClasses(dark);
  const { email, username, csrfToken, logout } = useAuth();
  const { content, projects, experience, education, sections, loading, error, refetch } = useHomeContent();

  if (loading && !content) {
    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono`}>
        <p className={`text-sm tracking-widest uppercase ${muted}`}>Loading…</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center font-mono px-6`}>
        <p className="text-sm text-center">Couldn't load site content{error ? `: ${error}` : ""}.</p>
      </div>
    );
  }

  const patchContent = (body) => api.patch("/content", body, csrfToken).then(refetch);

  const builtInOrder = (sections || [])
    .filter((s) => s.type !== "custom")
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);

  // Content cards below mirror whatever title was set in Page Layout above, so renaming a
  // section there is reflected immediately here too — Hero is the one exception, since its
  // title isn't shown publicly and this card's heading is just a fixed admin-facing label.
  const sectionTitle = (type, fallback) => (sections || []).find((s) => s.type === type)?.title || fallback;

  const CONTENT_CARDS = {
    hero: (
      <>
        <ScalarForm
          title="Hero / About"
          fields={[
            { key: "name", label: "Full Name" },
            { key: "heroGreeting", label: "Greeting" },
            { key: "bio", label: "Bio", type: "textarea", rows: 5 },
            { key: "roles", label: "Typewriter Roles (one per line)", type: "list", rows: 3 },
            { key: "avatarEmoji", label: "Avatar Emoji" },
            { key: "avatarLabel", label: "Avatar Label" },
            { key: "avatarLocation", label: "Avatar Location" },
          ]}
          initialValues={{
            name: content.name,
            heroGreeting: content.heroGreeting || "",
            bio: content.bio,
            roles: content.roles || [],
            avatarEmoji: content.avatarEmoji || "",
            avatarLabel: content.avatarLabel || "",
            avatarLocation: content.avatarLocation || "",
          }}
          onSave={patchContent}
        />
        <ArrayFieldEditor
          title="Stats"
          fields={[
            { key: "value", label: "Value", placeholder: "9+" },
            { key: "label", label: "Label", placeholder: "Months Exp" },
          ]}
          initialItems={content.stats || []}
          onSave={(rows) => patchContent({ stats: rows })}
          addLabel="+ Add Stat"
        />
      </>
    ),
    contact: (
      <ScalarForm
        title={sectionTitle("contact", "Contact")}
        fields={[
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "github", label: "GitHub URL" },
          { key: "linkedin", label: "LinkedIn URL" },
        ]}
        initialValues={{
          email: content.contact?.email || "",
          phone: content.contact?.phone || "",
          github: content.contact?.github || "",
          linkedin: content.contact?.linkedin || "",
        }}
        onSave={(vals) => patchContent({ contact: vals })}
      />
    ),
    skills: (
      <ArrayFieldEditor
        title={sectionTitle("skills", "Skills")}
        fields={[{ key: "text", label: "Skill", placeholder: "e.g. React.js" }]}
        initialItems={(content.skills || []).map((s) => ({ text: s }))}
        onSave={(rows) => patchContent({ skills: rows.map((r) => r.text) })}
        addLabel="+ Add Skill"
      />
    ),
    certifications: (
      <ArrayFieldEditor
        title={sectionTitle("certifications", "Certifications")}
        fields={[{ key: "text", label: "Certification" }]}
        initialItems={(content.certifications || []).map((c) => ({ text: c }))}
        onSave={(rows) => patchContent({ certifications: rows.map((r) => r.text) })}
        addLabel="+ Add Certification"
      />
    ),
    projects: (
      <CrudListSection
        title={sectionTitle("projects", "Projects")}
        endpoint="/projects"
        fields={[
          { key: "name", label: "Name" },
          { key: "desc", label: "Description", type: "textarea" },
          { key: "tech", label: "Tech (comma-separated)", type: "tags" },
          { key: "emoji", label: "Emoji" },
        ]}
        items={projects || []}
        onChanged={refetch}
      />
    ),
    experience: (
      <CrudListSection
        title={sectionTitle("experience", "Experience")}
        endpoint="/experience"
        fields={[
          { key: "company", label: "Company" },
          { key: "role", label: "Role" },
          { key: "duration", label: "Duration" },
          { key: "icon", label: "Icon" },
          { key: "achievements", label: "Achievements (one per line)", type: "list" },
        ]}
        items={experience || []}
        onChanged={refetch}
      />
    ),
    education: (
      <CrudListSection
        title={sectionTitle("education", "Education")}
        endpoint="/education"
        fields={[
          { key: "school", label: "School" },
          { key: "degree", label: "Degree" },
          { key: "duration", label: "Duration" },
          { key: "percentage", label: "Percentage/Grade (optional)" },
        ]}
        items={education || []}
        onChanged={refetch}
      />
    ),
  };

  return (
    <div className={`${bg} ${text} min-h-screen font-mono transition-colors duration-500 pb-24`}>
      <header className={`border-b ${dark ? "border-[#1e1e1e]" : "border-[#ddd]"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-widest" style={{ color: ACCENT }}>
              Admin Dashboard
            </h1>
            <p className={`text-xs ${muted} mt-1`}>Signed in as {email}</p>
            {username && (
              <p className={`text-xs ${muted} mt-1`}>
                Your live portfolio:{" "}
                <a href={`/u/${username}`} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: ACCENT }}>
                  /u/{username}
                </a>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className={`text-xs ${muted} hover:text-[#00c896]`}>
              ← Back to site
            </a>
            <button
              type="button"
              onClick={toggleDark}
              className="w-12 h-6 rounded-full relative transition-colors duration-300"
              style={{ backgroundColor: dark ? ACCENT : "#ccc" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: dark ? "26px" : "2px" }}
              />
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <ScalarForm
          title="Site Appearance & Header"
          fields={[
            { key: "accentColor", label: "Accent Color", type: "color" },
            { key: "logoText", label: "Logo / Brand Text" },
          ]}
          initialValues={{
            accentColor: content.accentColor || "#00c896",
            logoText: content.logoText || "DK.",
          }}
          onSave={patchContent}
        />

        <div>
          <ArrayFieldEditor
            title="Nav Links"
            fields={[
              { key: "label", label: "Label", placeholder: "About" },
              { key: "target", label: "Target id", placeholder: "about" },
            ]}
            initialItems={content.navLinks?.length ? content.navLinks : DEFAULT_NAV_LINKS}
            onSave={(rows) => patchContent({ navLinks: rows })}
            addLabel="+ Add Link"
          />
          <p className={`text-xs ${muted} mt-2`}>
            "Target id" must match a section's anchor — currently <code>about</code> (Hero), <code>projects</code>,{" "}
            <code>skills</code>, or <code>contact</code>. Other section types don't have an anchor yet, so links to
            them won't scroll anywhere.
          </p>
        </div>

        <PageLayoutEditor sections={sections || []} refetch={refetch} dark={dark} card={card} muted={muted} />

        {builtInOrder.map((type) => (
          <div key={type} className="space-y-8">
            {CONTENT_CARDS[type]}
          </div>
        ))}
      </main>
    </div>
  );
}
