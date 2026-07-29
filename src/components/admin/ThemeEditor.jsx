import { useRef, useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, FONT_OPTIONS, THEME_PRESETS, getThemeClasses, hexToRgba, mergeTheme } from "../../constants/theme";

const PALETTE_FIELDS = [
  { key: "bg", label: "Background" },
  { key: "text", label: "Text" },
  { key: "card", label: "Card" },
  { key: "cardBorder", label: "Card Border" },
  { key: "muted", label: "Muted Text" },
];

export default function ThemeEditor({ content, onSave }) {
  const { dark } = useTheme();
  const { card, muted } = getThemeClasses(dark);
  const { csrfToken } = useAuth();
  const fileInputRef = useRef(null);

  const [accent, setAccent] = useState(content.accentColor || ACCENT);
  const [theme, setTheme] = useState(() => mergeTheme(content.theme));
  const [mode, setMode] = useState("dark");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;
  const chipBorder = dark ? "border-[#2a2a2a]" : "border-[#ddd]";

  const applyPreset = (preset) => {
    setAccent(preset.accent);
    setTheme((t) => ({ ...t, preset: preset.name, dark: { ...preset.dark }, light: { ...preset.light } }));
  };

  const setPaletteField = (key, value) =>
    setTheme((t) => ({ ...t, preset: "custom", [mode]: { ...t[mode], [key]: value } }));

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.upload("/uploads", fd, csrfToken);
      setTheme((t) => ({ ...t, backgroundImage: res.data.url }));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await onSave({ accentColor: accent, theme });
      setMessage({ type: "success", text: "Saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const palette = theme[mode];
  const overlay = hexToRgba(palette.bg, theme.backgroundOverlay ?? 0.85);

  return (
    <div className={`${card} border rounded-2xl p-6`}>
      <h3 className="text-lg font-bold mb-1">Theme & Appearance</h3>
      <p className={`text-xs ${muted} mb-5`}>
        Pick a preset or customize every color, the font and a background image for your public portfolio.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Presets */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${muted} mb-2`}>Presets</label>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                  theme.preset === p.name ? "border-[#00c896]" : `${chipBorder} hover:border-[#00c896]`
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center" style={{ backgroundColor: p.dark.bg }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accent }} />
                </span>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Accent + Font */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs uppercase tracking-wide ${muted} mb-1`}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-10 h-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer"
              />
              <input type="text" value={accent} onChange={(e) => setAccent(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={`block text-xs uppercase tracking-wide ${muted} mb-1`}>Font</label>
            <div className="flex gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setTheme((t) => ({ ...t, font: f.value }))}
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${f.className} transition-colors ${
                    theme.font === f.value ? "border-[#00c896] text-[#00c896]" : `${chipBorder} hover:border-[#00c896]`
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Palette editor */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className={`text-xs uppercase tracking-wide ${muted}`}>Colors</label>
            <div className="flex gap-1 ml-auto">
              {["dark", "light"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-lg border text-xs capitalize transition-colors ${
                    mode === m ? "border-[#00c896] text-[#00c896]" : `${chipBorder} hover:border-[#00c896]`
                  }`}
                >
                  {m} mode
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PALETTE_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={`block text-[10px] uppercase tracking-wide ${muted} mb-1`}>{f.label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={palette[f.key]}
                    onChange={(e) => setPaletteField(f.key, e.target.value)}
                    className="w-8 h-8 flex-shrink-0 rounded-lg border-0 bg-transparent p-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={palette[f.key]}
                    onChange={(e) => setPaletteField(f.key, e.target.value)}
                    className={`${inputClass} px-2 py-1.5 text-xs`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background image */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${muted} mb-2`}>Background Image (optional)</label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className={`text-xs px-3 py-2 rounded-lg border transition-colors hover:border-[#00c896] disabled:opacity-50 ${chipBorder}`}
            >
              {uploading ? "Uploading…" : "Upload Image"}
            </button>
            <input
              type="text"
              value={theme.backgroundImage}
              onChange={(e) => setTheme((t) => ({ ...t, backgroundImage: e.target.value.trim() }))}
              placeholder="…or paste an image URL"
              className={`${inputClass} flex-1 min-w-[200px]`}
            />
            {theme.backgroundImage && (
              <button
                type="button"
                onClick={() => setTheme((t) => ({ ...t, backgroundImage: "" }))}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          {theme.backgroundImage && (
            <div className="mt-3 flex items-center gap-4">
              <span className={`text-xs ${muted} whitespace-nowrap`}>Dim overlay</span>
              <input
                type="range"
                min="0"
                max="0.95"
                step="0.05"
                value={theme.backgroundOverlay ?? 0.85}
                onChange={(e) => setTheme((t) => ({ ...t, backgroundOverlay: Number(e.target.value) }))}
                className="flex-1 accent-[#00c896]"
              />
              <span className={`text-xs ${muted} w-10 text-right`}>{Math.round((theme.backgroundOverlay ?? 0.85) * 100)}%</span>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${muted} mb-2`}>Preview ({mode} mode)</label>
          <div
            className="rounded-xl border overflow-hidden p-5"
            style={{
              backgroundColor: palette.bg,
              borderColor: palette.cardBorder,
              color: palette.text,
              ...(theme.backgroundImage
                ? {
                    backgroundImage: `linear-gradient(${overlay}, ${overlay}), url("${theme.backgroundImage}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}),
            }}
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: palette.muted }}>
              Hi, my name is
            </p>
            <p className="text-xl font-bold mb-3">
              Your <span style={{ color: accent }}>Name</span>
            </p>
            <div
              className="rounded-lg border p-3 inline-block"
              style={{ backgroundColor: palette.card, borderColor: palette.cardBorder }}
            >
              <span className="text-sm font-bold" style={{ color: accent }}>
                Card
              </span>
              <span className="text-xs ml-2" style={{ color: palette.muted }}>
                muted text
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold text-black disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {saving ? "Saving…" : "Save Theme"}
          </button>
          {message && (
            <span className={`text-xs ${message.type === "error" ? "text-red-500" : "text-[#00c896]"}`}>{message.text}</span>
          )}
        </div>
      </form>
    </div>
  );
}
