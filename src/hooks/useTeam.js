import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  TEAM_KEY,
  addToTeam as addToTeamLib,
  normTeam,
  removeFromTeam as removeFromTeamLib,
  teamCoverage as teamCoverageLib,
  teamSpeedList as teamSpeedListLib,
  toggleTeamRole as toggleTeamRoleLib,
} from "../lib/teamLogic.js";
import { speedAt } from "../lib/speedCalc.js";

export function useTeam(speedsAll, showToast) {
  const [rawTeam, setRawTeam, clearTeamStorage] = useLocalStorage(TEAM_KEY, []);
  const team = useMemo(() => normTeam(rawTeam), [rawTeam]);

  const addToTeam = useCallback(
    (name) => {
      const { team: next, toast, openAssignIdx } = addToTeamLib(team, name);
      setRawTeam(next);
      if (toast) showToast(toast);
      return openAssignIdx;
    },
    [team, setRawTeam, showToast],
  );

  const removeFromTeam = useCallback((name) => setRawTeam(removeFromTeamLib(team, name)), [team, setRawTeam]);

  const toggleTeamRole = useCallback((idx, key) => setRawTeam(toggleTeamRoleLib(team, idx, key)), [team, setRawTeam]);

  const clearTeam = useCallback(() => clearTeamStorage(), [clearTeamStorage]);

  const coverage = useMemo(() => teamCoverageLib(team, speedsAll), [team, speedsAll]);
  const speedList = useMemo(() => teamSpeedListLib(team, speedsAll, speedAt), [team, speedsAll]);

  return { team, addToTeam, removeFromTeam, toggleTeamRole, clearTeam, coverage, speedList };
}
