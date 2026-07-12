import { useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, getThemeClasses } from "../../constants/theme";

function toDraft(item, fields) {
  const d = {};
  fields.forEach((f) => {
    const v = item?.[f.key];
    if (f.type === "tags") d[f.key] = (v || []).join(", ");
    else if (f.type === "list") d[f.key] = (v || []).join("\n");
    else d[f.key] = v ?? "";
  });
  return d;
}

function fromDraft(draft, fields) {
  const payload = {};
  fields.forEach((f) => {
    const raw = draft[f.key] ?? "";
    if (f.type === "tags") payload[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "list") payload[f.key] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    else payload[f.key] = raw.trim();
  });
  return payload;
}

export default function CrudListSection({ title, endpoint, fields, items, onChanged }) {
  const { dark } = useTheme();
  const { card, muted } = getThemeClasses(dark);
  const { csrfToken } = useAuth();

  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft(toDraft({}, fields));
    setError(null);
  };
  const startEdit = (item) => {
    setEditingId(item._id);
    setCreating(false);
    setDraft(toDraft(item, fields));
    setError(null);
  };
  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(null);
    setError(null);
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = fromDraft(draft, fields);
      if (creating) await api.post(endpoint, payload, csrfToken);
      else await api.patch(`${endpoint}/${editingId}`, payload, csrfToken);
      cancel();
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      await api.del(`${endpoint}/${id}`, csrfToken);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`${card} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {!creating && (
          <button
            type="button"
            onClick={startCreate}
            className="text-xs px-3 py-1.5 rounded-lg font-bold text-black"
            style={{ backgroundColor: ACCENT }}
          >
            + Add
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className={`border rounded-xl p-4 ${dark ? "border-[#2a2a2a]" : "border-[#eee]"}`}>
            {editingId === item._id ? (
              <DraftForm fields={fields} draft={draft} setDraft={setDraft} dark={dark} onSave={save} onCancel={cancel} busy={busy} error={error} />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm space-y-1 min-w-0">
                  {fields.map((f, i) => (
                    <p key={f.key} className={i === 0 ? "font-bold" : `text-xs ${muted} break-words`}>
                      {Array.isArray(item[f.key]) ? item[f.key].join(f.type === "list" ? " • " : ", ") : item[f.key]}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button type="button" onClick={() => startEdit(item)} className="text-xs hover:underline" style={{ color: ACCENT }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(item._id)} className="text-xs text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {creating && (
          <div className={`border rounded-xl p-4 ${dark ? "border-[#2a2a2a]" : "border-[#eee]"}`}>
            <DraftForm fields={fields} draft={draft} setDraft={setDraft} dark={dark} onSave={save} onCancel={cancel} busy={busy} error={error} />
          </div>
        )}

        {items.length === 0 && !creating && <p className={`text-xs ${muted}`}>Nothing here yet.</p>}
      </div>
    </div>
  );
}

function DraftForm({ fields, draft, setDraft, dark, onSave, onCancel, busy, error }) {
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className={`block text-xs uppercase tracking-wide mb-1 ${dark ? "text-[#888]" : "text-[#666]"}`}>{f.label}</label>
          {f.type === "list" || f.type === "textarea" ? (
            <textarea
              rows={f.type === "list" ? 4 : 3}
              value={draft[f.key] ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              className={inputClass}
            />
          ) : (
            <input
              type="text"
              value={draft[f.key] ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              className={inputClass}
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="px-4 py-1.5 rounded-lg text-xs font-bold text-black disabled:opacity-50"
          style={{ backgroundColor: ACCENT }}
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="text-xs hover:underline">
          Cancel
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
