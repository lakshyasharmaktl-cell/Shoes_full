import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = (msg) => addToast(msg, "success");
  const showError = (msg) => addToast(msg, "error");
  const showInfo = (msg) => addToast(msg, "info");

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl bg-white transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-200 ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-950"
                : toast.type === "error"
                ? "border-rose-200 text-rose-950"
                : "border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <FiCheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              )}
              {toast.type === "error" && (
                <FiAlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />
              )}
              {toast.type === "info" && (
                <FiInfo className="text-slate-700 w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium italic">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
