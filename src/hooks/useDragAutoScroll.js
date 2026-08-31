import { useEffect, useRef } from "react";

const EDGE = 90; // px from the top/bottom viewport edge that triggers scrolling
const MAX_SPEED = 22; // px per animation frame right at the edge

// Auto-scrolls the window while a native HTML5 drag is in progress and the
// cursor sits near the top/bottom edge — otherwise there's no way to drag a
// card to a category far below the fold without releasing and re-grabbing.
// Uses a capture-phase listener so it still sees dragover events even though
// the per-tile/per-grid handlers call stopPropagation() on the bubble phase.
export function useDragAutoScroll(active) {
  const clientYRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const onDragOver = (e) => {
      clientYRef.current = e.clientY;
    };
    window.addEventListener("dragover", onDragOver, true);

    let raf;
    const tick = () => {
      const y = clientYRef.current;
      if (y != null) {
        const h = window.innerHeight;
        if (y < EDGE) {
          window.scrollBy(0, -MAX_SPEED * (1 - y / EDGE));
        } else if (y > h - EDGE) {
          window.scrollBy(0, MAX_SPEED * (1 - (h - y) / EDGE));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("dragover", onDragOver, true);
      cancelAnimationFrame(raf);
      clientYRef.current = null;
    };
  }, [active]);
}
