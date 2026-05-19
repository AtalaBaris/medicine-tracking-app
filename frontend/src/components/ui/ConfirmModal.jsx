export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "İptal",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-error text-on-error hover:bg-error/90"
      : "bg-primary-container text-on-primary hover:scale-[1.02]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-gutter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Kapat"
      />
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/30 p-lg animate-in">
        <div className="flex items-start gap-md mb-md">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              variant === "danger" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
            }`}
          >
            <span className="material-symbols-outlined">
              {variant === "danger" ? "delete_forever" : "help"}
            </span>
          </div>
          <div>
            <h2 id="confirm-modal-title" className="font-headline-md text-headline-md text-on-surface">
              {title}
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-xs">{message}</p>
          </div>
        </div>
        <div className="flex gap-sm justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-lg py-sm rounded-xl font-body-sm text-on-surface bg-surface-container hover:bg-surface-variant transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-lg py-sm rounded-xl font-label-caps text-label-caps transition-all disabled:opacity-50 ${confirmCls}`}
          >
            {loading ? "İşleniyor..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
