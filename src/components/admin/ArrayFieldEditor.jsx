import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../../constants/theme";

function emptyRow(fields) {
  return fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
}

export default function ArrayFieldEditor({ title, fields, initialItems, onSave, addLabel = "+ Add" }) {
  const { dark } = useTheme();
  const { card, muted } = getThemeClasses(dark);
  const [rows, setRows] = useState(initialItems.length ? initialItems : [emptyRow(fields)]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const updateRow = (idx, key, value) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  const addRow = () => setRows((prev) => [...prev, emptyRow(fields)]);
  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const cleaned = rows
      .map((r) => fields.reduce((acc, f) => ({ ...acc, [f.key]: (r[f.key] || "").trim() }), {}))
      .filter((r) => fields.every((f) => r[f.key]));
    try {
      await onSave(cleaned);
      setRows(cleaned.length ? cleaned : [emptyRow(fields)]);
      setMessage({ type: "success", text: "Saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;

  return (
    <div className={`${card} border rounded-2xl p-6`}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-2">
            {fields.map((f) => (
              <input
                key={f.key}
                type="text"
                value={row[f.key] ?? ""}
                placeholder={f.placeholder || f.label}
                onChange={(e) => updateRow(idx, f.key, e.target.value)}
                className={inputClass}
              />
            ))}
            <button type="button" onClick={() => removeRow(idx)} className="text-xs text-red-500 hover:underline px-2">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={addRow}
          className={`text-xs px-3 py-1.5 rounded-lg border ${dark ? "border-[#2a2a2a] hover:border-[#00c896]" : "border-[#ddd] hover:border-[#00c896]"}`}
        >
          {addLabel}
        </button>
        <button
          type="button"
          onClick={handleSave}
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
      <p className={`text-xs ${muted} mt-3`}>Blank rows are dropped automatically when you save.</p>
    </div>
  );
}
