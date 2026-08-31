import { useEffect, useRef, useState } from "react";

// Highlights the nearest section in a rail nav as the page scrolls, and
// exposes a smooth-scroll-to helper for clicking a rail entry. `ids` are the
// section keys; the DOM anchor is expected at `id={prefix + id}`.
export function useScrollSpy(ids, prefix) {
  const [active, setActive] = useState(ids[0]);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY + 96;
      let cur = idsRef.current[0];
      let best = -Infinity;
      for (const id of idsRef.current) {
        const el = document.getElementById(prefix + id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y && top > best) {
          best = top;
          cur = id;
        }
      }
      if (cur != null) setActive((prev) => (prev !== cur ? cur : prev));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefix]);

  const scrollTo = (id) => {
    const el = document.getElementById(prefix + id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 66;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
  };

  return { active, setActive, scrollTo };
}
