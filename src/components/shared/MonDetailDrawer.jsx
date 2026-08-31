import { useEffect, useState } from "react";
import "./MonDetailDrawer.css";
import SpriteImg from "./SpriteImg.jsx";
import { monName, monNote, monRoleMap } from "../../lib/rolesLogic.js";

// "Every role this Pokémon fills" — read-only browsing, or (in edit mode) a
// toggle list to add/remove it from roles directly, with per-role note
// editing. Resets its local search/note-editing state whenever a different
// mon opens, mirroring the original openMon() reset.
export default function MonDetailDrawer({
  name,
  onClose,
  data,
  pendingEdits,
  vr,
  speeds,
  urlFor,
  editMode,
  roles,
  onGoToTier,
  onGoToSpeed,
}) {
  const [q, setQ] = useState("");
  const [noteKey, setNoteKey] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    setQ("");
    setNoteKey(null);
    setNoteDraft("");
  }, [name]);

  if (!name) return null;

  const map = monRoleMap(data);
  const m = map[name] || {};
  const groups = data
    .filter((s) => m[s.id])
    .map((s) => ({
      title: m[s.id].title.toUpperCase(),
      roles: m[s.id].roles.map((x) => (x.note ? `${x.role} · ${x.note}` : x.role)),
    }));
  const roleCount = groups.reduce((n, g) => n + g.roles.length, 0);

  const vrTier = (vr.find((t) => t.mons.includes(name)) || {}).tier || null;
  const baseSpd = speeds[name];
  const stats = [];
  if (vrTier) {
    stats.push({
      k: "Tier",
      v: vrTier,
      onClick: () => onGoToTier(vr.findIndex((t) => t.mons.includes(name))),
    });
  }
  if (baseSpd != null) stats.push({ k: "Base Spe", v: String(baseSpd), onClick: onGoToSpeed });
  stats.push({ k: "Roles", v: String(roleCount), onClick: null });

  const dq = q.trim().toLowerCase();
  let editGroups = [];
  if (editMode) {
    editGroups = data
      .map((sec) => {
        const secRoles = sec.roles
          .filter((r) => !dq || r.name.toLowerCase().includes(dq) || sec.title.toLowerCase().includes(dq))
          .map((r) => {
            const entry = r.mons.find((mm) => monName(mm) === name);
            const on = !!entry;
            const note = entry ? monNote(entry) : "";
            const key = sec.id + "|" + r.name;
            return { key, sectionId: sec.id, roleName: r.name, label: r.name, on, note };
          });
        return { title: sec.title.toUpperCase(), roles: secRoles };
      })
      .filter((g) => g.roles.length);
  }

  const stagedNote =
    pendingEdits.length === 0
      ? ""
      : `${pendingEdits.length} role change${pendingEdits.length === 1 ? "" : "s"} staged`;

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <div className="drawer">
        <div className="drawer__head">
          <SpriteImg src={urlFor(name)} alt={name} size={44} />
          <h2 className="drawer__head-name">{name}</h2>
          <button className="drawer__close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="drawer__stats">
          {stats.map((s) => (
            <div
              key={s.k}
              className={"drawer__stat" + (s.onClick ? " drawer__stat--clickable" : "")}
              onClick={s.onClick || undefined}
            >
              <span className="drawer__stat-k">{s.k}</span>
              <span className="drawer__stat-v">{s.v}</span>
            </div>
          ))}
        </div>

        {editMode ? (
          <>
            <div className="drawer__search">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a role" spellCheck={false} />
            </div>
            {editGroups.map((g) => (
              <div key={g.title}>
                <div className="drawer__group-title">{g.title}</div>
                {g.roles.map((r) => (
                  <div key={r.key}>
                    <div className="drawer__row">
                      <button
                        className="drawer__row-btn"
                        onClick={() => {
                          if (r.on) roles.removeMon(r.sectionId, r.roleName, name, roles.isPendingAddFor(r.sectionId, r.roleName, name));
                          else roles.addMon(r.sectionId, r.roleName, name, "");
                        }}
                      >
                        <span className={"drawer__row-mark" + (r.on ? " drawer__row-mark--on" : "")}>{r.on ? "✓" : "+"}</span>
                        {r.label}
                      </button>
                      <button
                        className="drawer__row-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteKey(r.key);
                          setNoteDraft(r.note);
                        }}
                      >
                        ✎
                      </button>
                    </div>
                    {noteKey === r.key && (
                      <div className="drawer__note-form">
                        <input
                          autoFocus
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Note"
                          spellCheck={false}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              roles.setMonNote(r.sectionId, r.roleName, name, noteDraft);
                              setNoteKey(null);
                            }
                            if (e.key === "Escape") setNoteKey(null);
                          }}
                        />
                        <button
                          onClick={() => {
                            roles.setMonNote(r.sectionId, r.roleName, name, noteDraft);
                            setNoteKey(null);
                          }}
                        >
                          Save
                        </button>
                        <button onClick={() => setNoteKey(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            {stagedNote && <div className="drawer__staged">{stagedNote}</div>}
          </>
        ) : (
          groups.map((g) => (
            <div key={g.title}>
              <div className="drawer__group-title">{g.title}</div>
              {g.roles.map((r) => (
                <div key={r} className="drawer__role">
                  {r}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
