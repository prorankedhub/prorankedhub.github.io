import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  EDIT_STORAGE_KEY,
  addMon as addMonLib,
  copyToRole as copyToRoleLib,
  currentNote as currentNoteLib,
  data as dataLib,
  isPendingAddFor as isPendingAddForLib,
  moveMon as moveMonLib,
  removeMon as removeMonLib,
  roleHasMon as roleHasMonLib,
  setMonNote as setMonNoteLib,
  undoRemove as undoRemoveLib,
} from "../lib/rolesLogic.js";

// `sections` is the confirmed role data (data/roles-data.js). `pendingEdits`
// (persisted under EDIT_STORAGE_KEY) is the add/remove/note diff staged in
// edit mode — never written back to sections directly, only merged in by
// `data()` for display/export.
export function useRoles(sections, editMode, canonicalize, showToast) {
  const [pendingEdits, setPendingEdits, clearPendingEdits] = useLocalStorage(EDIT_STORAGE_KEY, []);

  const data = useMemo(() => dataLib(sections, pendingEdits, editMode), [sections, pendingEdits, editMode]);

  const roleHasMon = useCallback(
    (sectionId, roleName, name) => roleHasMonLib(sections, pendingEdits, sectionId, roleName, name),
    [sections, pendingEdits],
  );
  const isPendingAddFor = useCallback(
    (sectionId, roleName, name) => isPendingAddForLib(pendingEdits, sectionId, roleName, name),
    [pendingEdits],
  );
  const currentNote = useCallback(
    (sectionId, roleName, name) => currentNoteLib(sections, pendingEdits, sectionId, roleName, name),
    [sections, pendingEdits],
  );

  const addMon = useCallback(
    (sectionId, roleName, name, note) => {
      const { pendingEdits: next, toast } = addMonLib(sections, pendingEdits, sectionId, roleName, name, note, canonicalize);
      setPendingEdits(next);
      if (toast) showToast(toast);
    },
    [sections, pendingEdits, canonicalize, setPendingEdits, showToast],
  );

  const removeMon = useCallback(
    (sectionId, roleName, name, isPendingAdd) => {
      setPendingEdits(removeMonLib(pendingEdits, sectionId, roleName, name, isPendingAdd));
    },
    [pendingEdits, setPendingEdits],
  );

  const undoRemove = useCallback(
    (sectionId, roleName, name) => {
      setPendingEdits(undoRemoveLib(pendingEdits, sectionId, roleName, name));
    },
    [pendingEdits, setPendingEdits],
  );

  const moveMon = useCallback(
    (src, name, note, isPendingAdd, dst) => {
      const { pendingEdits: next, toast } = moveMonLib(sections, pendingEdits, src, name, note, isPendingAdd, dst, canonicalize);
      setPendingEdits(next);
      if (toast) showToast(toast);
    },
    [sections, pendingEdits, canonicalize, setPendingEdits, showToast],
  );

  const copyToRole = useCallback(
    (name, note, dst) => {
      const { pendingEdits: next, toast } = copyToRoleLib(sections, pendingEdits, name, note, dst, canonicalize);
      setPendingEdits(next);
      if (toast) showToast(toast);
    },
    [sections, pendingEdits, canonicalize, setPendingEdits, showToast],
  );

  const setMonNote = useCallback(
    (sectionId, roleName, name, note) => {
      setPendingEdits(setMonNoteLib(sections, pendingEdits, sectionId, roleName, name, note));
    },
    [sections, pendingEdits, setPendingEdits],
  );

  const discardAll = useCallback(() => clearPendingEdits(), [clearPendingEdits]);

  return {
    pendingEdits,
    data,
    roleHasMon,
    isPendingAddFor,
    currentNote,
    addMon,
    removeMon,
    undoRemove,
    moveMon,
    copyToRole,
    setMonNote,
    discardAll,
  };
}
