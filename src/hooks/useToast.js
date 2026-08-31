import { useCallback, useEffect, useRef, useState } from "react";

// Bottom-banner toast, auto-dismissed after 2.4s — replaces native alert().
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { toast, showToast };
}
