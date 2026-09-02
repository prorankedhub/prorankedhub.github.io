import { useEffect, useMemo, useState } from "react";
import { useHashTab } from "./hooks/useHashTab.js";
import { useTheme } from "./hooks/useTheme.js";
import { useToast } from "./hooks/useToast.js";
import { useModal } from "./hooks/useModal.js";
import { useVr } from "./hooks/useVr.js";
import { useRoles } from "./hooks/useRoles.js";
import { useTeam } from "./hooks/useTeam.js";
import { useSpeeds } from "./hooks/useSpeeds.js";
import { useSprites } from "./hooks/useSprites.js";
import { useExport } from "./hooks/useExport.js";
import { changeCounts } from "./lib/changelog.js";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import RolesTab from "./components/roles/RolesTab.jsx";
import SpeedTab from "./components/speed/SpeedTab.jsx";
import VrTab from "./components/vr/VrTab.jsx";
import TeamTab from "./components/team/TeamTab.jsx";
import MonDetailDrawer from "./components/shared/MonDetailDrawer.jsx";
import ConfirmModal from "./components/shared/ConfirmModal.jsx";
import Toast from "./components/shared/Toast.jsx";
import EditBanner from "./components/shared/EditBanner.jsx";
import ExportDrawer from "./components/shared/ExportDrawer.jsx";
import PrintSheet from "./components/shared/PrintSheet.jsx";

export default function App() {
  const [dataModules, setDataModules] = useState(null);

  useEffect(() => {
    Promise.all([import("./data/roles-data.js"), import("./data/viability-data.js"), import("./data/sprites.js")]).then(
      ([roles, viability, sprites]) => setDataModules({ roles, viability, sprites }),
    );
  }, []);

  if (!dataModules) return null;
  return <Loaded dataModules={dataModules} />;
}

function Loaded({ dataModules }) {
  const { roles: rolesData, viability, sprites } = dataModules;
  const { tab, setTab, editMode } = useHashTab();
  const { theme, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const { modal, confirmModal, closeModal } = useModal();
  const [selected, setSelected] = useState(null);
  const [activeVrTarget, setActiveVrTarget] = useState(null); // used to jump the VR tab to a tier from the drawer
  const [exportOpen, setExportOpen] = useState(false);

  const vr = useVr(viability.VIABILITY, editMode, showToast);
  const roleState = useRoles(rolesData.SECTIONS, editMode, vr.canonicalize, showToast);
  // allMonNames already tracks the VR draft while editing (see useVr.js), so
  // a brand-new mon added mid-edit gets a sprite/speed instead of sitting on
  // the placeholder until published.
  const speedState = useSpeeds(vr.allMonNames);
  const spriteParseOpts = useMemo(
    () => ({ spriteFormSuffixes: sprites.FORM_SUFFIXES, spriteNoSplit: sprites.NO_SPLIT_HYPHEN }),
    [sprites],
  );
  const spriteState = useSprites(vr.allMonNames, spriteParseOpts);
  const team = useTeam(speedState.speeds, showToast);

  const exportApi = useExport({
    tab,
    sections: rolesData.SECTIONS,
    pendingEdits: roleState.pendingEdits,
    vr: vr.vr,
    vrDraft: vr.vrDraft,
    inRoster: vr.inRoster,
    urlFor: spriteState.urlFor,
    discardAll: roleState.discardAll,
    discardVrDraft: vr.discardDraft,
    confirmModal,
    showToast,
  });

  const c = changeCounts(roleState.pendingEdits);
  const scopedPending = tab === "vr" ? vr.changeCount : roleState.pendingEdits.length;
  const pendingLabel = scopedPending === 0 ? "No changes yet" : `${scopedPending} pending change${scopedPending === 1 ? "" : "s"}`;
  // Exporting roles-data.js is worthwhile even with zero role edits: cutting
  // a mon from Viability Ranking already prunes it out of every role on
  // export (see useExport.js), so that alone is a reason to re-copy the file.
  const canExport = tab === "vr" ? vr.changeCount > 0 : roleState.pendingEdits.length > 0 || vr.dirty;
  const printSummary =
    tab === "vr"
      ? vr.changeCount === 0
        ? "Nothing staged yet."
        : `${vr.changeCount} tier change${vr.changeCount === 1 ? "" : "s"}`
      : scopedPending === 0
        ? vr.dirty
          ? "No role edits — but Viability Ranking changed, so this export will reflect that."
          : "Nothing staged yet."
        : `${c.add} added · ${c.remove} removed · ${c.note} note ${c.note === 1 ? "change" : "changes"}`;

  const openMon = (name) => setSelected(name);
  const closeDetail = () => setSelected(null);

  const goToTier = (tierIdx) => {
    setSelected(null);
    setTab("vr");
    setActiveVrTarget(tierIdx);
  };
  const goToSpeed = () => {
    setSelected(null);
    setTab("speed");
  };

  const discardActive = () => {
    if (tab === "vr") {
      if (!vr.changeCount) return;
      confirmModal({
        title: "Discard tier changes?",
        body: `This clears all ${vr.changeCount} staged viability change(s). It can't be undone.`,
        confirmLabel: "Discard",
        danger: true,
        onConfirm: () => {
          vr.discardDraft();
          showToast("Viability changes discarded");
        },
      });
      return;
    }
    const n = roleState.pendingEdits.length;
    if (!n) return;
    confirmModal({
      title: "Discard role changes?",
      body: `This clears all ${n} staged compendium change(s). It can't be undone.`,
      confirmLabel: "Discard",
      danger: true,
      onConfirm: () => {
        roleState.discardAll();
        showToast("Role changes discarded");
      },
    });
  };

  const exitEdit = () => {
    window.location.href = location.pathname + location.hash;
  };

  const enterEdit = (fromTab) => {
    window.location.href = location.pathname + "?edit=1#" + (fromTab === "vr" ? "vr" : "roles");
  };

  const cleanSections = roleState.data;
  const editBarShown = editMode && (tab === "roles" || tab === "vr");

  return (
    <div id="appShell" style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", fontFamily: "'Space Grotesk', system-ui, sans-serif", paddingBottom: editBarShown ? 96 : 40 }}>
      <datalist id="mon-names">
        {vr.allMonNames.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      {editBarShown && (
        <EditBanner tab={tab} scopedPending={scopedPending} canExport={canExport} onDiscard={discardActive} onExport={() => setExportOpen(true)} onExit={exitEdit} />
      )}

      <Header tab={tab} onTabChange={setTab} theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "4px 40px 0" }}>
        {tab === "roles" && (
          <RolesTab sections={rolesData.SECTIONS} roles={roleState} editMode={editMode} vr={vr} urlFor={spriteState.urlFor} onOpenMon={openMon} />
        )}
        {tab === "speed" && (
          <SpeedTab speeds={speedState.speeds} speedBusy={speedState.busy} inRoster={vr.inRoster} urlFor={spriteState.urlFor} onOpenMon={openMon} />
        )}
        {tab === "vr" && (
          <VrTabWithTarget vr={vr} editMode={editMode} urlFor={spriteState.urlFor} onOpenMon={openMon} jumpTo={activeVrTarget} onJumped={() => setActiveVrTarget(null)} />
        )}
        {tab === "team" && (
          <TeamTab team={team} data={cleanSections} urlFor={spriteState.urlFor} allMonNames={vr.allMonNames} onOpenMon={openMon} />
        )}
      </main>

      <Footer tab={tab} editMode={editMode} onEnterEdit={enterEdit} />

      {selected && (
        <MonDetailDrawer
          name={selected}
          onClose={closeDetail}
          data={cleanSections}
          pendingEdits={roleState.pendingEdits}
          vr={vr.vr}
          speeds={speedState.speeds}
          urlFor={spriteState.urlFor}
          editMode={editMode}
          roles={roleState}
          onGoToTier={goToTier}
          onGoToSpeed={goToSpeed}
        />
      )}

      <ExportDrawer open={exportOpen} onClose={() => setExportOpen(false)} tab={tab} pendingLabel={pendingLabel} printSummary={printSummary} exportApi={exportApi} />

      <ConfirmModal modal={modal} onClose={closeModal} />
      <Toast message={toast} />

      <PrintSheet groups={exportApi.printGroups} summary={printSummary} />
    </div>
  );
}

// Scrolls the VR tab to a specific tier once it mounts (used when jumping in
// from the mon detail drawer's "Tier" stat).
function VrTabWithTarget({ jumpTo, onJumped, ...props }) {
  useEffect(() => {
    if (jumpTo == null) return;
    const el = document.getElementById("vrt-" + jumpTo);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 66;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    onJumped();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpTo]);
  return <VrTab {...props} />;
}
