import { useCallback, useState } from "react";

// Generic confirm dialog (title/body/confirmLabel/cancelLabel/danger/onConfirm)
// — replaces native confirm()/alert() everywhere in the app.
export function useModal() {
  const [modal, setModal] = useState(null);

  const confirmModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  return { modal, confirmModal, closeModal };
}
