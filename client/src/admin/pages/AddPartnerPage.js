import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProvider } from "../../services/api";
import { useToast } from "../components/Toast";
import AdminSidebar from "../components/AdminSidebar";

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
    {children}
  </div>
);

const F = ({ label, children, hint }) => (
  <div>
    <label className="admin-form-label">{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{hint}</div>}
  </div>
);

const AddPartnerPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    color: "#6246ea",
    bg: "#f0f2f8",
    rating: "0",
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast("Partner name is required", "warning"); return; }
    if (!form.logo.trim()) { toast("Logo text is required", "warning"); return; }
    setLoading(true);
    try {
      const id = form.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      await createProvider({
        id,
        name: form.name.trim(),
        logo: form.logo.trim().slice(0, 3),
        color: form.color,
        bg: form.bg,
        courses: 0,
        rating: parseFloat(form.rating) || 0,
      });
      toast("Partner added successfully! 🤝", "success");
      navigate("/admin", { state: { section: "partners" } });
    } catch (e) {
      toast(e.response?.data?.message || "Failed to add partner", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar section="partners" onSectionChange={(sec) => navigate("/admin", { state: { section: sec } })} />
      <div className="admin-content">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => navigate("/admin", { state: { section: "partners" } })}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "var(--text2)" }}>
            ← Back to Partners
          </button>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 22, margin: 0 }}>🤝 Add New Partner</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Add an education provider / partner to the platform</p>
          </div>
        </div>

        <div className="admin-card">
          <Row>
            <F label="Partner Name *" hint="e.g. upGrad, BYJU's, Coursera">
              <input
                className="admin-input"
                placeholder="e.g. upGrad"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
            </F>
            <F label="Logo Text *" hint="2–3 characters shown in logo circle">
              <input
                className="admin-input"
                placeholder="UG"
                maxLength={3}
                value={form.logo}
                onChange={e => set("logo", e.target.value)}
              />
            </F>
          </Row>

          <Row>
            <F label="Brand Color" hint="Primary color used for text/borders">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => set("color", e.target.value)}
                  style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2, cursor: "pointer" }}
                />
                <input
                  className="admin-input"
                  style={{ flex: 1, margin: 0 }}
                  value={form.color}
                  onChange={e => set("color", e.target.value)}
                />
              </div>
            </F>
            <F label="Background Color" hint="Light background for the logo circle">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={form.bg}
                  onChange={e => set("bg", e.target.value)}
                  style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2, cursor: "pointer" }}
                />
                <input
                  className="admin-input"
                  style={{ flex: 1, margin: 0 }}
                  value={form.bg}
                  onChange={e => set("bg", e.target.value)}
                />
              </div>
            </F>
          </Row>

          <Row>
            <F label="Initial Rating" hint="0.0 to 5.0 — can be updated later">
              <input
                className="admin-input"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.5"
                value={form.rating}
                onChange={e => set("rating", e.target.value)}
              />
            </F>
            <div />
          </Row>

          {/* Live Preview */}
          {(form.logo || form.name) && (
            <div style={{ background: "var(--surface)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>LIVE PREVIEW</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: form.bg, color: form.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 16,
                  border: `2px solid ${form.color}22`,
                }}>
                  {form.logo || "??"}
                </div>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 16 }}>{form.name || "Partner Name"}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    ⭐ {form.rating || "0"} · 0 courses
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary btn-sm" onClick={() => navigate("/admin", { state: { section: "partners" } })}>
              Cancel
            </button>
            <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={loading} style={{ minWidth: 140 }}>
              {loading ? "Saving..." : "🤝 Add Partner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPartnerPage;
