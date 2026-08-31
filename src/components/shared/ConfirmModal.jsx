import "./Overlays.css";

export default function ConfirmModal({ modal, onClose }) {
  if (!modal) return null;
  const { title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", danger, onConfirm } = modal;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__body">
          <h3 className="modal__title">{title}</h3>
          <p className="modal__text">{body}</p>
        </div>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={"modal__btn modal__btn--confirm" + (danger ? " modal__btn--danger" : "")}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
