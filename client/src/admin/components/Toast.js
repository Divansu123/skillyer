import React, { useState, useCallback } from "react";

export const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  const colors = {
    success: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
    error: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.success;
          return (
            <div key={t.id} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.10)", animation: "slideInToast 0.3s ease", color: c.text, fontSize: 14, fontWeight: 500 }}>
              <span style={{ fontSize: 16 }}>{icons[t.type]}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: c.text, opacity: 0.6, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideInToast { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
