import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ArrayFieldEditor from "./ArrayFieldEditor";
import { LAYOUT_OPTIONS } from "../../constants/customSectionLayouts";
import { BUILT_IN_LABELS } from "../../constants/sectionTypes";
import { ACCENT } from "../../constants/theme";

const LAYOUT_LABELS = { cards: "Custom · Cards", list: "Custom · List", links: "Custom · Links" };

const LAYOUT_FIELDS = {
  cards: [
    { key: "heading", label: "Heading" },
    { key: "description", label: "Description" },
    { key: "emoji", label: "Emoji" },
  ],
  list: [{ key: "text", label: "Text" }],
  links: [
    { key: "label", label: "Label" },
    { key: "url", label: "URL" },
  ],
};

export default function SortableSectionCard({
  section,
  dark,
  card,
  muted,
  onSaveTitle,
  onToggleVisible,
  onSaveItems,
  onChangeLayout,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id });
  const [title, setTitle] = useState(section.title || "");
  const [titleSaving, setTitleSaving] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);
  const [titleError, setTitleError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showLayoutChanger, setShowLayoutChanger] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isCustom = section.type === "custom";
  const layout = section.layout || "cards";
  const typeLabel = isCustom ? LAYOUT_LABELS[layout] : BUILT_IN_LABELS[section.type];
  const inputClass = `flex-1 min-w-0 rounded-lg border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-[#00c896] ${
    dark ? "border-[#2a2a2a]" : "border-[#ddd]"
  }`;

  const handleSaveTitle = async () => {
    setTitleSaving(true);
    setTitleError(null);
    try {
      await onSaveTitle(section._id, title.trim());
      setTitleSaved(true);
      setTimeout(() => setTitleSaved(false), 1500);
    } catch (err) {
      setTitleError(err.message);
    } finally {
      setTitleSaving(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`${card} border rounded-xl p-4`}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${section.title || typeLabel}`}
          className={`cursor-grab active:cursor-grabbing px-1 text-lg leading-none ${muted} touch-none`}
        >
          ⠿
        </button>

        <div className="flex-1 min-w-[160px]">
          <p className={`text-[10px] uppercase tracking-wide ${muted} mb-1`}>{typeLabel}</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={section.type === "hero" ? "(not shown publicly)" : "Section title"}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              disabled={titleSaving}
              className="text-xs px-3 py-1.5 rounded-lg font-bold text-black disabled:opacity-50 flex-shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              {titleSaving ? "…" : titleSaved ? "Saved" : "Save"}
            </button>
          </div>
          {titleError && <p className="text-xs text-red-500 mt-1">{titleError}</p>}
        </div>

        <label className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs ${muted}`}>Visible</span>
          <button
            type="button"
            onClick={() => onToggleVisible(section._id, !section.visible)}
            className="w-10 h-5 rounded-full relative transition-colors duration-300"
            style={{ backgroundColor: section.visible ? ACCENT : "#ccc" }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: section.visible ? "22px" : "2px" }}
            />
          </button>
        </label>

        {isCustom && (
          <>
            <button type="button" onClick={() => setExpanded((e) => !e)} className={`text-xs ${muted} hover:text-[#00c896] flex-shrink-0`}>
              {expanded ? "Hide items" : "Edit items"}
            </button>
            <button
              type="button"
              onClick={() => setShowLayoutChanger((v) => !v)}
              className={`text-xs ${muted} hover:text-[#00c896] flex-shrink-0`}
            >
              Change layout
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => onDelete(section._id, section.type, section.title || typeLabel)}
          className="text-xs text-red-500 hover:underline flex-shrink-0"
        >
          Delete
        </button>
      </div>

      {isCustom && showLayoutChanger && (
        <div className={`mt-4 border rounded-xl p-4 grid sm:grid-cols-3 gap-3 ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"}`}>
          {LAYOUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setShowLayoutChanger(false);
                onChangeLayout(section._id, opt.value);
              }}
              disabled={opt.value === layout}
              className={`text-left rounded-lg border p-3 transition-colors disabled:opacity-40 ${
                opt.value === layout ? "border-[#00c896]" : `hover:border-[#00c896] ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"}`
              }`}
            >
              <p className="text-sm font-bold mb-1">
                {opt.label}
                {opt.value === layout && " (current)"}
              </p>
              <p className={`text-xs ${muted}`}>{opt.hint}</p>
            </button>
          ))}
        </div>
      )}

      {isCustom && expanded && (
        <div className="mt-4">
          <ArrayFieldEditor
            title="Items"
            fields={LAYOUT_FIELDS[layout]}
            initialItems={section.items || []}
            onSave={(rows) => onSaveItems(section._id, rows)}
            addLabel="+ Add Item"
          />
        </div>
      )}
    </div>
  );
}
