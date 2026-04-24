import React, { useState, useCallback } from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}>
    <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Confirm Action</div>
      <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>{message}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-primary btn-sm" style={{ background: "#ef4444" }} onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export const useConfirm = () => {
  const [dialog, setDialog] = useState(null);
  const confirm = useCallback((message) => new Promise((resolve) => setDialog({ message, resolve })), []);
  const handleConfirm = () => { dialog?.resolve(true); setDialog(null); };
  const handleCancel = () => { dialog?.resolve(false); setDialog(null); };
  const ConfirmComponent = dialog ? <ConfirmDialog message={dialog.message} onConfirm={handleConfirm} onCancel={handleCancel} /> : null;
  return { confirm, ConfirmComponent };
};

export default ConfirmDialog;
