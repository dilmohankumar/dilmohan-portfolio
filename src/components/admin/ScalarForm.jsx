import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../../constants/theme";

export default function ScalarForm({ title, fields, initialValues, onSave }) {
  const { dark } = useTheme();
  const { card, muted } = getThemeClasses(dark);
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const setField = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitized = { ...values };
    fields.forEach((f) => {
      if (f.type === "list" && Array.isArray(sanitized[f.key])) {
        sanitized[f.key] = sanitized[f.key].map((s) => s.trim()).filter(Boolean);
      }
    });

    setSaving(true);
    setMessage(null);
    try {
      await onSave(sanitized);
      setValues(sanitized);
      setMessage({ type: "success", text: "Saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${card} border rounded-2xl p-6`}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className={`block text-xs uppercase tracking-wide ${muted} mb-1`}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                rows={f.rows || 4}
                value={values[f.key] ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                className={inputClass}
              />
            ) : f.type === "list" ? (
              <textarea
                rows={f.rows || 3}
                value={(values[f.key] ?? []).join("\n")}
                onChange={(e) => setField(f.key, e.target.value.split("\n"))}
                className={inputClass}
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold text-black disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {message && (
            <span className={`text-xs ${message.type === "error" ? "text-red-500" : "text-[#00c896]"}`}>{message.text}</span>
          )}
        </div>
      </form>
    </div>
  );
}
