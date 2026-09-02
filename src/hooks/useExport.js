import { useCallback } from "react";
import * as htmlToImage from "html-to-image";
import rolesDataRaw from "../data/roles-data.js?raw";
import viabilityDataRaw from "../data/viability-data.js?raw";
import { buildChangelog, printGroups as printGroupsLib, spliceSourceArray, serializeSections } from "../lib/changelog.js";
import { serializeViability, tierColorValue } from "../lib/vrLogic.js";
import { data as dataLib } from "../lib/rolesLogic.js";
import { shareCardHTML } from "../lib/exportCard.js";

// `?raw` imports give the literal source text of the data files, bundled at
// build time — this replaces the original's `fetch("./roles-data.js")`,
// which only worked because that file happened to also be servable as a
// static asset. Vite doesn't serve src/ files as-is in production, so the
// splice-and-copy feature needs the text baked in instead of fetched.
export function useExport({ tab, sections, pendingEdits, vr, vrDraft, inRoster, urlFor, discardAll, discardVrDraft, confirmModal, showToast }) {
  // "all" (neither "roles" nor "vr") makes buildChangelog list both scopes.
  // The drawer reviews everything staged regardless of the active tab, so the
  // preview and the copied text list have to cover both — only the exported
  // image stays tab-shaped, since the two posters are genuinely different.
  const changelog = buildChangelog("all", { sections, pendingEdits, vr, vrDraft });
  const printGroups = printGroupsLib(pendingEdits, sections, urlFor);

  const clearStaged = useCallback(() => {
    discardAll();
    discardVrDraft();
    showToast("Staged changes cleared");
  }, [discardAll, discardVrDraft, showToast]);

  const copyChangelogClick = useCallback(async () => {
    await navigator.clipboard.writeText(changelog);
    showToast("Change list copied to clipboard");
  }, [changelog, showToast]);

  const copyFileClick = useCallback(async () => {
    const serialized = serializeSections(dataLib(sections, pendingEdits, true), inRoster);
    const updated = spliceSourceArray(rolesDataRaw, "SECTIONS", serialized);
    await navigator.clipboard.writeText(updated);
    confirmModal({
      title: "roles-data.js copied",
      body: "Paste it over roles-data.js and commit. When both files are applied, clear your staged changes so they aren't applied twice.",
      confirmLabel: "Clear staged changes",
      cancelLabel: "Keep them",
      onConfirm: clearStaged,
    });
  }, [sections, pendingEdits, inRoster, confirmModal, clearStaged]);

  const copyVrFileClick = useCallback(async () => {
    if (!vrDraft) {
      showToast("No viability changes staged");
      return;
    }
    const updated = spliceSourceArray(viabilityDataRaw, "VIABILITY", serializeViability(vrDraft));
    await navigator.clipboard.writeText(updated);
    confirmModal({
      title: "viability-data.js copied",
      body: "Paste it over viability-data.js and commit. When both files are applied, clear your staged changes so they aren't applied twice.",
      confirmLabel: "Clear staged changes",
      cancelLabel: "Keep them",
      onConfirm: clearStaged,
    });
  }, [vrDraft, confirmModal, clearStaged, showToast]);

  const downloadImageClick = useCallback(async () => {
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-99999px;top:0;z-index:-1;";
    host.innerHTML = shareCardHTML({ tab, vrWorking: vrDraft || vr, vrTierColorOf: tierColorValue, pendingEdits, sections, urlFor });
    document.body.appendChild(host);
    showToast("Rendering image…");
    try {
      const imgs = [...host.querySelectorAll("img")];
      await Promise.all(
        imgs.map((img) => (img.complete && img.naturalWidth ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))),
      );
      await new Promise((r) => setTimeout(r, 120));
      // includeQueryParams is required, not cosmetic: html-to-image keeps a
      // module-level cache of fetched resources whose key drops the query
      // string by default. Every sprite here is the same proxy origin with a
      // different ?url=, so they all collapsed onto one cache entry — the
      // first export populated it, and every export after that rendered the
      // whole poster with whichever sprite resolved last.
      const dataUrl = await htmlToImage.toPng(host.firstElementChild, {
        pixelRatio: 2,
        backgroundColor: "#f1ece1",
        includeQueryParams: true,
      });
      const today = new Date();
      const dateStamp = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
      const a = document.createElement("a");
      a.download = (tab === "vr" ? `pro-viability-ranking-${dateStamp}` : `pro-role-compendium-${dateStamp}`) + ".png";
      a.href = dataUrl;
      a.click();
      showToast("Image downloaded");
    } catch {
      showToast("Couldn't render image");
    } finally {
      host.remove();
    }
  }, [tab, vr, vrDraft, pendingEdits, sections, urlFor, showToast]);

  return { changelog, printGroups, copyChangelogClick, copyFileClick, copyVrFileClick, downloadImageClick };
}
