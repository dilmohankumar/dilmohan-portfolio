import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ACCENT } from "../../constants/theme";
import { LAYOUT_OPTIONS } from "../../constants/customSectionLayouts";
import { BUILT_IN_LABELS } from "../../constants/sectionTypes";
import SortableSectionCard from "./SortableSectionCard";

export default function PageLayoutEditor({ sections, refetch, dark, card, muted }) {
  const { csrfToken } = useAuth();

  const [items, setItems] = useState(sections);
  const [activeId, setActiveId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [missingBuiltIns, setMissingBuiltIns] = useState([]);

  // Resync from the parent's fresh aggregate only after mutations resolve —
  // this only changes reference when refetch() actually completes, never on
  // unrelated re-renders, so it can't clobber an in-flight drag.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s._id === active.id);
    const newIndex = items.findIndex((s) => s._id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    setBusy(true);
    setError(null);
    try {
      await api.patch("/sections/reorder", { order: reordered.map((s) => s._id) }, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
      setItems(sections);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveTitle = async (id, title) => {
    await api.patch(`/sections/${id}`, { title }, csrfToken);
    await refetch();
  };

  const handleToggleVisible = async (id, visible) => {
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, visible } : s)));
    try {
      await api.patch(`/sections/${id}`, { visible }, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
      setItems(sections);
    }
  };

  const handleSaveItems = async (id, rows) => {
    await api.patch(`/sections/${id}`, { items: rows }, csrfToken);
    await refetch();
  };

  const handleDelete = async (id, type, label) => {
    const message =
      type === "custom"
        ? `Delete "${label}"? This section and all its items are gone for good.`
        : `Remove "${label}" from the page? Its content isn't deleted — the underlying data stays in the database, ` +
          `and you can bring this section back later from "+ Add Section" above.`;
    if (!window.confirm(message)) return;

    setBusy(true);
    setError(null);
    try {
      await api.del(`/sections/${id}`, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleChangeLayout = async (id, layout) => {
    if (!window.confirm("Changing the layout clears this section's existing items — they'd no longer fit the new fields. Continue?")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/sections/${id}`, { layout }, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAddCustom = async (layout) => {
    setShowLayoutPicker(false);
    setBusy(true);
    setError(null);
    try {
      await api.post("/sections", { title: "New Section", layout }, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRestoreBuiltIn = async (type) => {
    setShowLayoutPicker(false);
    setBusy(true);
    setError(null);
    try {
      await api.post("/sections", { type }, csrfToken);
      await refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const openAddPicker = async () => {
    const opening = !showLayoutPicker;
    setShowLayoutPicker(opening);
    if (opening) {
      try {
        const { data } = await api.get("/sections/missing-built-ins");
        setMissingBuiltIns(data);
      } catch {
        setMissingBuiltIns([]);
      }
    }
  };

  const activeSection = items.find((s) => s._id === activeId);

  return (
    <div className={`${card} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-2 gap-3">
        <h3 className="text-lg font-bold">Page Layout</h3>
        <button
          type="button"
          onClick={openAddPicker}
          disabled={busy}
          className="text-xs px-3 py-1.5 rounded-lg font-bold text-black disabled:opacity-50 flex-shrink-0"
          style={{ backgroundColor: ACCENT }}
        >
          + Add Section
        </button>
      </div>
      <p className={`text-xs ${muted} mb-4`}>
        Drag to reorder how sections appear on the homepage. Toggle visibility, rename titles, delete any section
        (built-in or custom), or add a new one.
      </p>

      {showLayoutPicker && (
        <div className={`${dark ? "border-[#2a2a2a]" : "border-[#ddd]"} border rounded-xl p-4 mb-4 space-y-4`}>
          {missingBuiltIns.length > 0 && (
            <div>
              <p className={`text-xs uppercase tracking-wide ${muted} mb-2`}>Restore a deleted section</p>
              <div className="flex flex-wrap gap-2">
                {missingBuiltIns.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleRestoreBuiltIn(type)}
                    disabled={busy}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-[#00c896] disabled:opacity-50 ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"}`}
                  >
                    + {BUILT_IN_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            {missingBuiltIns.length > 0 && <p className={`text-xs uppercase tracking-wide ${muted} mb-2`}>Or add a new custom section</p>}
            <div className="grid sm:grid-cols-3 gap-3">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAddCustom(opt.value)}
                  disabled={busy}
                  className={`text-left rounded-lg border p-3 transition-colors hover:border-[#00c896] disabled:opacity-50 ${dark ? "border-[#2a2a2a]" : "border-[#ddd]"}`}
                >
                  <p className="text-sm font-bold mb-1">{opt.label}</p>
                  <p className={`text-xs ${muted}`}>{opt.hint}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={items.map((s) => s._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((section) => (
              <SortableSectionCard
                key={section._id}
                section={section}
                dark={dark}
                card={card}
                muted={muted}
                onSaveTitle={handleSaveTitle}
                onToggleVisible={handleToggleVisible}
                onSaveItems={handleSaveItems}
                onChangeLayout={handleChangeLayout}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeSection ? (
            <div className={`${card} border rounded-xl p-4 shadow-lg`}>
              <p className="font-bold text-sm">{activeSection.title || activeSection.type}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
