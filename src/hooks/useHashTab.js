import { useCallback, useState } from "react";

// "team" is deliberately excluded: Team Builder isn't launched yet, so it
// has no tab button and isn't reachable via #team either. The feature stays
// in the codebase (App.jsx still has the route) — this is a display switch,
// not a removal.
const TABS = ["roles", "speed", "vr"];

function tabFromHash(hash) {
  for (const id of TABS) {
    if (new RegExp(`(^|[#&])${id}($|&)`).test(hash)) return id;
  }
  return "roles";
}

// Edit mode is a hidden gate: only ?edit=1 (or #edit) turns it on, no UI
// toggle exists for it.
function editModeFromLocation() {
  return new URLSearchParams(location.search).get("edit") === "1" || /(^|[#&])edit(=1)?($|&)/.test(location.hash);
}

export function useHashTab() {
  const [tab, setTabState] = useState(() => tabFromHash(location.hash));
  const [editMode] = useState(editModeFromLocation);

  const setTab = useCallback((id) => {
    setTabState(id);
    history.replaceState(null, "", location.pathname + location.search + "#" + id);
  }, []);

  return { tab, setTab, editMode };
}
