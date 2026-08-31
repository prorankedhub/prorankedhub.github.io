// Rendered off-screen (display:none via #printChanges in global.css) and
// only shown by @media print, when the user hits window.print() from the
// export drawer. Sprite <img> tags use data-purl (never src) so they never
// trigger a fetch outside of an actual print — beforeprint (wired in
// PrintSheet's own effect) swaps it into src right before the browser prints.
import { useEffect } from "react";

const printDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function PrintSheet({ groups, summary }) {
  useEffect(() => {
    const onBeforePrint = () => {
      document.querySelectorAll("#printChanges img[data-purl]").forEach((img) => {
        const u = img.getAttribute("data-purl") || "";
        if (u.startsWith("http") && img.getAttribute("src") !== u) img.src = u;
      });
    };
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  return (
    <div id="printChanges">
      <div className="masthead">
        <p className="kicker">Pokémon Revolution Online · PRO OU</p>
        <h1>Role Compendium — Suggested Changes</h1>
        <div className="meta">
          <span>{printDate}</span>
          <span>{summary}</span>
        </div>
        <div className="legend">
          <span>
            <i className="dot add" />
            Added
          </span>
          <span>
            <i className="dot remove" />
            Removed
          </span>
          <span>
            <i className="dot edit" />
            Note changed
          </span>
        </div>
      </div>
      {groups.map((grp) => (
        <div key={grp.title}>
          <h2>{grp.title}</h2>
          <div className="secrule" />
          {grp.roles.map((role) => (
            <div key={role.name}>
              <h3>{role.name}</h3>
              <div className="print-tiles">
                {role.mons.map((mon) => (
                  <div key={mon.name} className={"print-tile " + mon.signClass}>
                    <span className="badge">{mon.sign}</span>
                    <img data-purl={mon.url} alt={mon.name} />
                    <span className="nm">{mon.name}</span>
                    {mon.note && <span className="nt">{mon.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
