"use client";

export default function DeleteConfirmModal({ product, onConfirm, onCancel, deleting }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 id="delete-dialog-title" className="text-base font-semibold text-ink">
          Delete &quot;{product.title}&quot;?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This can&apos;t be undone. The product will be removed from this list.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
