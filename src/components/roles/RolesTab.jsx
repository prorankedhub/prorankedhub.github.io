import { useEffect, useMemo, useState } from "react";
import "../shared/SectionLayout.css";
import "./RolesTab.css";
import { CategoryTopbarNav, CategoryRail } from "./CategoryNav.jsx";
import RoleBlock from "./RoleBlock.jsx";
import CopyToModal from "./CopyToModal.jsx";
import SearchBox from "../shared/SearchBox.jsx";
import SearchListModal from "../shared/SearchListModal.jsx";
import AddSectionModal from "./AddSectionModal.jsx";
import AddRoleModal from "./AddRoleModal.jsx";
import { useScrollSpy } from "../../hooks/useScrollSpy.js";
import { useDragAutoScroll } from "../../hooks/useDragAutoScroll.js";
import { monName, monNote } from "../../lib/rolesLogic.js";

export default function RolesTab({ sections, roles, editMode, vr, urlFor, onOpenMon }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null); // { sectionId, roleName, name, isPendingAdd }
  const [noteDraft, setNoteDraft] = useState("");
  const [addingKey, setAddingKey] = useState(null);
  const [addName, setAddName] = useState("");
  const [addNote, setAddNote] = useState("");
  const [dragKey, setDragKey] = useState(null);
  const [dropKey, setDropKey] = useState(null);
  const [dragPayload, setDragPayload] = useState(null); // { sectionId, roleName, name, note, isPendingAdd }
  const [copyPicker, setCopyPicker] = useState(null); // { name, note, fromSection, fromRole }
  const [namePickerFor, setNamePickerFor] = useState(null); // roleKey, while choosing who to add
  const [namePickerQ, setNamePickerQ] = useState("");
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addRoleFor, setAddRoleFor] = useState(null); // sectionId, while creating a role in it
  useDragAutoScroll(!!dragKey);

  // Base sections + any staged this session — the source both the category
  // nav (always shows every category) and the content view (filtered by
  // search) build from.
  const allSections = useMemo(() => {
    const newSections = editMode
      ? roles.pendingEdits.filter((e) => e.type === "addSection").map((e) => ({ id: e.sectionId, title: e.title, tag: e.tag, roles: [] }))
      : [];
    return [...sections, ...newSections];
  }, [sections, roles.pendingEdits, editMode]);

  const spy = useScrollSpy(
    allSections.map((s) => s.id),
    "sec-",
  );

  // Delete/Backspace removes the selected card, Escape closes the copy
  // picker or deselects — only while editing, and never while typing.
  useEffect(() => {
    if (!editMode) return;
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
      if (!typing && (e.key === "Delete" || e.key === "Backspace")) {
        if (sel) {
          removeSelected();
          e.preventDefault();
        }
        return;
      }
      if (e.key === "Escape") {
        if (copyPicker) setCopyPicker(null);
        else if (sel) {
          setSel(null);
          setNoteDraft("");
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, sel, copyPicker]);

  const query = q.trim().toLowerCase();

  const view = useMemo(() => {
    let totalShown = 0;
    const built = allSections.map((s, i) => {
      let secHasMatch = false;
      const newRoles = editMode
        ? roles.pendingEdits.filter((e) => e.type === "addRole" && e.sectionId === s.id).map((e) => ({ name: e.roleName, move: e.move, mons: [] }))
        : [];
      const roleBlocks = [...s.roles, ...newRoles].map((r) => {
        const removeSet = editMode
          ? new Set(roles.pendingEdits.filter((e) => e.type === "remove" && e.sectionId === s.id && e.roleName === r.name).map((e) => e.name))
          : new Set();
        const noteMap = {};
        if (editMode) {
          roles.pendingEdits
            .filter((e) => e.type === "note" && e.sectionId === s.id && e.roleName === r.name)
            .forEach((e) => {
              noteMap[e.name] = e.note;
            });
        }
        const adds = editMode ? roles.pendingEdits.filter((e) => e.type === "add" && e.sectionId === s.id && e.roleName === r.name) : [];

        const build = (name, dispNote, status, isPendingAdd) => {
          const dim = query && !name.toLowerCase().includes(query);
          if (!dim && status !== "removed") totalShown++;
          if (!dim) secHasMatch = true;
          return { name, note: dispNote, status, dim, isPendingAdd, url: urlFor(name) };
        };

        const mons = [];
        for (const entry of r.mons) {
          const name = monName(entry);
          const baseNote = monNote(entry);
          if (!vr.inRoster(name)) continue;
          const removed = removeSet.has(name);
          const hasNote = name in noteMap && noteMap[name] !== baseNote;
          const dispNote = name in noteMap ? noteMap[name] : baseNote;
          const status = removed ? "removed" : hasNote ? "edited" : "base";
          mons.push(build(name, dispNote, status, false));
        }
        for (const e of adds) {
          if (!vr.inRoster(e.name)) continue;
          mons.push(build(e.name, e.note || "", "added", true));
        }
        mons.sort((a, b) => vr.byVr(a.name, b.name));

        return { role: r, mons };
      });
      return { section: s, num: String(i + 1).padStart(2, "0"), roleBlocks, hasMatch: secHasMatch };
    });
    return { sections: built.filter((s) => !query || s.hasMatch), totalShown };
  }, [allSections, roles.pendingEdits, editMode, query, vr, urlFor]);

  const cats = allSections.map((s, i) => ({ id: s.id, num: String(i + 1).padStart(2, "0"), title: s.title }));
  const totalMons = vr.rank.size;
  const statLine = query ? `${view.totalShown} found` : `${totalMons} Pokémon`;

  const handleDragStartTile = (sectionId, roleName, name, note, isPendingAdd, key) => {
    setDragPayload({ sectionId, roleName, name, note, isPendingAdd });
    setDragKey(key);
  };
  const handleDragEndTile = () => {
    setDragPayload(null);
    setDragKey(null);
    setDropKey(null);
  };
  const handleDropRole = (sectionId, roleName, copy) => {
    const d = dragPayload;
    setDragPayload(null);
    setDragKey(null);
    setDropKey(null);
    if (!d) return;
    const dst = { sectionId, roleName };
    if (copy) roles.copyToRole(d.name, d.note, dst);
    else roles.moveMon({ sectionId: d.sectionId, roleName: d.roleName }, d.name, d.note, d.isPendingAdd, dst);
    if (sel && sel.sectionId === d.sectionId && sel.roleName === d.roleName && sel.name === d.name && !copy) {
      setSel(null);
      setNoteDraft("");
    }
  };

  const handleTileClick = (sectionId, roleName, name, isPendingAdd, status) => {
    if (!editMode) {
      onOpenMon(name);
      return;
    }
    if (status === "removed") {
      roles.undoRemove(sectionId, roleName, name);
      return;
    }
    if (sel && sel.sectionId === sectionId && sel.roleName === roleName && sel.name === name) {
      setSel(null);
      setNoteDraft("");
      return;
    }
    setSel({ sectionId, roleName, name, isPendingAdd });
    setNoteDraft(roles.currentNote(sectionId, roleName, name));
    setAddingKey(null);
  };

  const handleCornerClick = (sectionId, roleName, name, isPendingAdd, status) => {
    if (status === "removed") roles.undoRemove(sectionId, roleName, name);
    else roles.removeMon(sectionId, roleName, name, isPendingAdd);
  };

  const saveNote = () => {
    if (!sel) return;
    roles.setMonNote(sel.sectionId, sel.roleName, sel.name, noteDraft);
  };

  const removeSelected = () => {
    if (!sel) return;
    roles.removeMon(sel.sectionId, sel.roleName, sel.name, sel.isPendingAdd);
    setSel(null);
    setNoteDraft("");
  };

  if (!sections.length) {
    return (
      <div className="roles-skeleton">
        <div className="roles-skeleton__title" />
        <div className="roles-skeleton__row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="roles-skeleton__tile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-row">
          <CategoryTopbarNav cats={cats} activeCat={spy.active} onSelect={spy.scrollTo} editMode={editMode} onAddSection={() => setAddSectionOpen(true)} />
          <SearchBox value={q} onChange={setQ} statLine={statLine} />
        </div>
      </div>

      {editMode && (
        <div className="edit-legend">
          <div className="edit-legend__inner">
            <span className="edit-legend__title">You're editing</span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--added" />Added
            </span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--removed" />Removed
            </span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--note" />Note changed
            </span>
            <span className="edit-legend__spacer" />
            <span className="edit-legend__hint">Click to select · drag to move (Alt = copy) · "Copy to…" duplicates · Del removes</span>
          </div>
        </div>
      )}

      <div className="roles-wrap">
        <CategoryRail cats={cats} activeCat={spy.active} onSelect={spy.scrollTo} editMode={editMode} onAddSection={() => setAddSectionOpen(true)} />
        <div className="roles-content">
          {view.sections.map((s) => (
            <section key={s.section.id} id={"sec-" + s.section.id} style={{ padding: "30px 0 6px", scrollMarginTop: 68 }}>
              <div className="sec-head">
                <span className="sec-num">{s.num}</span>
                <h2>{s.section.title}</h2>
              </div>
              {s.roleBlocks.map(({ role, mons }) => (
                <RoleBlock
                  key={role.name}
                  section={s.section}
                  role={role}
                  mons={mons}
                  editMode={editMode}
                  dragKey={dragKey}
                  dropKey={dropKey}
                  onDragStartTile={handleDragStartTile}
                  onDragEndTile={handleDragEndTile}
                  onDropRole={handleDropRole}
                  onTileClick={handleTileClick}
                  onCornerClick={handleCornerClick}
                  sel={sel}
                  noteDraft={noteDraft}
                  onNoteDraftChange={setNoteDraft}
                  onSaveNote={saveNote}
                  onOpenCopyPicker={() => sel && setCopyPicker({ name: sel.name, note: roles.currentNote(sel.sectionId, sel.roleName, sel.name), fromSection: sel.sectionId, fromRole: sel.roleName })}
                  onRemoveSelected={removeSelected}
                  onDeselect={() => {
                    setSel(null);
                    setNoteDraft("");
                  }}
                  isAdding={editMode && addingKey === s.section.id + "|" + role.name}
                  addName={addName}
                  addNote={addNote}
                  onAddNoteChange={setAddNote}
                  onAddConfirm={(sectionId, roleName) => {
                    roles.addMon(sectionId, roleName, addName, addNote);
                    setAddName("");
                    setAddNote("");
                    setAddingKey(null);
                  }}
                  onAddCancel={() => {
                    setAddingKey(null);
                    setAddName("");
                    setAddNote("");
                  }}
                  onAddOpen={(roleKey) => {
                    setNamePickerFor(roleKey);
                    setNamePickerQ("");
                  }}
                  onAddChangeName={(roleKey) => {
                    setAddingKey(null);
                    setNamePickerFor(roleKey);
                    setNamePickerQ("");
                  }}
                />
              ))}
              {editMode && (
                <button type="button" className="role-block__add-role" onClick={() => setAddRoleFor(s.section.id)}>
                  + New role in {s.section.title}
                </button>
              )}
            </section>
          ))}

          {query && view.sections.length === 0 && (
            <div className="roles-empty">
              <p className="roles-empty__title">Nothing found</p>
              <p className="roles-empty__sub">No Pokémon matches "{q}"</p>
            </div>
          )}
        </div>
      </div>

      {copyPicker && (
        <CopyToModal
          copyPicker={copyPicker}
          sections={sections}
          onClose={() => setCopyPicker(null)}
          onPick={(sectionId, roleName) => {
            roles.copyToRole(copyPicker.name, copyPicker.note, { sectionId, roleName });
            setCopyPicker(null);
          }}
          roleHasMon={roles.roleHasMon}
        />
      )}

      {namePickerFor &&
        (() => {
          const sepAt = namePickerFor.indexOf("|");
          const pickerSectionId = namePickerFor.slice(0, sepAt);
          const pickerRoleName = namePickerFor.slice(sepAt + 1);
          const pq = namePickerQ.trim().toLowerCase();
          return (
            <SearchListModal
              title={`Add to ${pickerRoleName}`}
              q={namePickerQ}
              onQChange={setNamePickerQ}
              onClose={() => setNamePickerFor(null)}
              disabledLabel="already here"
              items={vr.allMonNames
                .filter((n) => !pq || n.toLowerCase().includes(pq))
                .map((n) => ({
                  name: n,
                  url: urlFor(n),
                  disabled: roles.roleHasMon(pickerSectionId, pickerRoleName, n),
                  onClick: () => {
                    setAddName(n);
                    setAddNote("");
                    setAddingKey(namePickerFor);
                    setNamePickerFor(null);
                  },
                }))}
            />
          );
        })()}

      {addSectionOpen && (
        <AddSectionModal
          onAdd={(title) => roles.addSection(title)}
          onClose={() => setAddSectionOpen(false)}
        />
      )}

      {addRoleFor &&
        (() => {
          const sectionTitle =
            sections.find((s) => s.id === addRoleFor)?.title ||
            roles.pendingEdits.find((e) => e.type === "addSection" && e.sectionId === addRoleFor)?.title ||
            addRoleFor;
          return (
            <AddRoleModal
              sectionTitle={sectionTitle}
              onAdd={(name, move) => roles.addRole(addRoleFor, name, move)}
              onClose={() => setAddRoleFor(null)}
            />
          );
        })()}
    </>
  );
}
