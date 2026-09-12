import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-serif-italic italic mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 italic mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition italic"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md italic tracking-wider uppercase disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
