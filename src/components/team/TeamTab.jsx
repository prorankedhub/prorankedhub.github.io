import { useState } from "react";
import "./TeamTab.css";
import SpriteImg from "../shared/SpriteImg.jsx";
import SearchListModal from "../shared/SearchListModal.jsx";
import TeamAssignModal from "./TeamAssignModal.jsx";

export default function TeamTab({ team, data, urlFor, allMonNames, onOpenMon }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQ, setPickerQ] = useState("");
  const [assignIdx, setAssignIdx] = useState(null);

  const slots = Array.from({ length: 6 }, (_, i) => team.team[i] || null);
  const query = pickerQ.trim().toLowerCase();
  const teamNames = team.team.map((m) => m.name);
  const unassigned = team.team.filter((m) => m.roles.length === 0).length;
  const coveredN = team.coverage.filter((c) => c.covered).length;

  const openPicker = () => {
    setPickerQ("");
    setPickerOpen(true);
  };

  const addAndAssign = (name) => {
    const idx = team.addToTeam(name);
    setPickerOpen(false);
    if (idx != null) setAssignIdx(idx);
  };

  return (
    <div style={{ padding: "24px 0 6px" }}>
      <div className="team-head">
        <span className="team-head__label">Your team</span>
        <span className="team-head__count">{team.team.length} / 6</span>
        <span className="team-head__spacer" />
        {team.team.length === 0 && <span className="team-head__hint">Add up to six Pokémon</span>}
        <a className="team-head__clear" onClick={team.clearTeam}>
          Clear
        </a>
      </div>

      <div className="team-grid">
        {slots.map((m, i) =>
          m ? (
            <div key={m.name} className="team-slot" role="button" tabIndex={0} title={m.name} onClick={() => setAssignIdx(i)}>
              <button
                className="team-slot__remove"
                title="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  team.removeFromTeam(m.name);
                }}
              >
                ✕
              </button>
              <SpriteImg src={urlFor(m.name)} alt={m.name} size={52} />
              <div style={{ minWidth: 0 }}>
                <div className="team-slot__name">{m.name}</div>
                <div className="team-slot__tags">
                  {m.roles.length > 0
                    ? m.roles.map((k) => (
                        <span key={k} className="team-slot__tag">
                          {k.split("|").slice(1).join("|")}
                        </span>
                      ))
                    : (
                        <span className="team-slot__hint">Tap to set role</span>
                      )}
                </div>
              </div>
            </div>
          ) : (
            <button key={i} className="team-slot-empty" onClick={openPicker}>
              <span>+</span>
              <span>Add Pokémon</span>
            </button>
          ),
        )}
      </div>

      <div className="team-cols">
        <div className="team-col">
          <div className="team-col__head">
            <h2>Role coverage</h2>
            <span style={{ flex: 1 }} />
            <span className="team-col__score">
              {coveredN} / {team.coverage.length} roles covered
            </span>
          </div>
          {unassigned > 0 && (
            <div style={{ marginBottom: 10, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: ".03em", color: "var(--muted)" }}>
              {unassigned} member{unassigned === 1 ? "" : "s"} without a role assigned — tap a member to pick which roles it runs.
            </div>
          )}
          {team.coverage.map((c) => (
            <div key={c.id} className="team-check-row">
              <span className={"team-check-row__mark " + (c.covered ? "team-check-row__mark--covered" : "team-check-row__mark--uncovered")}>
                {c.covered ? "✓" : "✕"}
              </span>
              <span className="team-check-row__label">
                {c.label}
                {c.tip && (
                  <span className="tip-wrap">
                    <span className="team-check-tip">?</span>
                    <span className="tip-pop">{c.tip}</span>
                  </span>
                )}
              </span>
              <span className="team-check-row__note">{c.covered ? c.by.join(" · ") : "Not covered"}</span>
            </div>
          ))}
          <p style={{ margin: "14px 0 0", fontSize: 12, lineHeight: 1.5, color: "var(--muted)" }}>
            Not every team needs to tick every box — plenty of great teams skip some on purpose. Treat this as a starting checklist, not a rulebook.
          </p>
        </div>

        <div className="team-col team-col--speed">
          <div className="team-col__head">
            <h2>Team speed</h2>
          </div>
          {team.speedList.length > 0 ? (
            <>
              {team.speedList.map((s) => (
                <div key={s.name} className="team-speed-row">
                  <span className="team-speed-row__name">{s.name}</span>
                  <span className="team-speed-row__base">{s.base}</span>
                  <span className="team-speed-row__spd">{s.spd}</span>
                </div>
              ))}
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: "var(--muted)", marginTop: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>
                Base · +Spe Max at level 100
              </div>
            </>
          ) : (
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--muted)", margin: "14px 0 0" }}>
              Add Pokémon to see their speed spread.
            </p>
          )}
        </div>
      </div>

      {pickerOpen && (
        <SearchListModal
          title="Add to team"
          q={pickerQ}
          onQChange={setPickerQ}
          onClose={() => setPickerOpen(false)}
          disabledLabel="on team"
          items={allMonNames
            .filter((n) => !query || n.toLowerCase().includes(query))
            .map((n) => ({ name: n, url: urlFor(n), disabled: teamNames.includes(n), onClick: () => addAndAssign(n) }))}
        />
      )}

      {assignIdx != null && team.team[assignIdx] && (
        <TeamAssignModal
          idx={assignIdx}
          member={team.team[assignIdx]}
          data={data}
          urlFor={urlFor}
          onToggle={team.toggleTeamRole}
          onClose={() => setAssignIdx(null)}
        />
      )}
    </div>
  );
}
