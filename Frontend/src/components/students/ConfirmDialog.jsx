import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger = false,
  busy = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#17324d]/30 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-[#eef8f2] text-[#147457]"}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-title" className="text-sm font-semibold text-[#17324d]">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#71838b]">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close confirmation"
            className="text-[#819098] hover:text-[#17324d] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-[#dbe4dd] px-3 py-2 text-sm font-medium text-[#58707b] hover:bg-[#f7f8f4] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60 ${danger ? "bg-red-600 hover:bg-red-700" : "bg-[#147457] hover:bg-[#105d48]"}`}
          >
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
