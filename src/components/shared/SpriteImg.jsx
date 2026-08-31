import { useEffect, useState } from "react";
import { PLACEHOLDER_SPRITE_URL } from "../../lib/spriteResolve.js";

const MAX_RETRIES = 4;

// Retries a failed sprite load up to 4 times with linear backoff (450ms ×
// attempt), then falls back to the placeholder — mirrors the original
// pump()'s retry/placeholder-on-404 behavior. The DOM-reuse workaround pump()
// needed (React recycling an <img> across tab switches) doesn't apply here:
// a real React `key` on the tile already forces a fresh mount per mon.
export default function SpriteImg({ src, alt, size = 50, className, onClick }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  const finalSrc = failed || !src ? PLACEHOLDER_SPRITE_URL : attempt === 0 ? src : `${src}?r=${attempt}`;

  const handleError = () => {
    if (failed) return;
    if (attempt + 1 >= MAX_RETRIES) {
      setFailed(true);
      return;
    }
    const next = attempt + 1;
    setTimeout(() => setAttempt(next), 450 * next);
  };

  return (
    <img
      src={finalSrc}
      alt={alt}
      draggable={false}
      onError={handleError}
      onClick={onClick}
      className={className}
      style={{ width: size, height: size, objectFit: "contain", imageRendering: "pixelated" }}
    />
  );
}
