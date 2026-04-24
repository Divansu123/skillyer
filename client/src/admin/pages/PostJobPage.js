import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/api";
import { useToast } from "../components/Toast";
import AdminSidebar from "../components/AdminSidebar";

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
    {children}
  </div>
);

const F = ({ label, children }) => (
  <div>
    <label className="admin-form-label">{label}</label>
    {children}
  </div>
);

const PostJobPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", company: "", logo: "", logoBg: "#6246ea", logoCo: "#ffffff",
    cat: "tech", expLevel: "mid", jobType: "fulltime",
    location: "", salary: "", tags: "", badge: "", badgeType: "hot", postedAt: "Today",
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast("Job title is required", "warning"); return; }
    if (!form.company.trim()) { toast("Company name is required", "warning"); return; }
    if (!form.location.trim()) { toast("Location is required", "warning"); return; }
    if (!form.salary.trim()) { toast("Salary range is required", "warning"); return; }
    setLoading(true);
    try {
      await createJob({
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      toast("Job posted successfully! 🎉", "success");
      navigate("/admin", { state: { section: "jobs_admin" } });
    } catch (e) {
      toast(e.response?.data?.message || "Failed to post job", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar section="jobs_admin" onSectionChange={(sec) => navigate("/admin", { state: { section: sec } })} />
      <div className="admin-content">
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => navigate("/admin", { state: { section: "jobs_admin" } })}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}
        >
          ← Back to Job Posts
        </button>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 22, margin: 0 }}>
            💼 Post New Job
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text3)", marginTop: 2 }}>
            Fill in the details to publish a new job listing
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card">
        <Row>
          <F label="Job Title *">
            <input className="admin-input" placeholder="e.g. Senior React Developer" value={form.title}
              onChange={(e) => set("title", e.target.value)} />
          </F>
          <F label="Company Name *">
            <input className="admin-input" placeholder="e.g. TechCorp India" value={form.company}
              onChange={(e) => set("company", e.target.value)} />
          </F>
        </Row>
        <Row>
          <F label="Logo Text (2–3 chars)">
            <input className="admin-input" placeholder="TC" maxLength={3} value={form.logo}
              onChange={(e) => set("logo", e.target.value)} />
          </F>
          <F label="Location *">
            <input className="admin-input" placeholder="e.g. Bangalore / Remote" value={form.location}
              onChange={(e) => set("location", e.target.value)} />
          </F>
        </Row>
        <Row>
          <F label="Logo Background Color">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.logoBg} onChange={(e) => set("logoBg", e.target.value)}
                style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2, cursor: "pointer" }} />
              <input className="admin-input" style={{ flex: 1, margin: 0 }} value={form.logoBg}
                onChange={(e) => set("logoBg", e.target.value)} />
            </div>
          </F>
          <F label="Logo Text Color">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.logoCo} onChange={(e) => set("logoCo", e.target.value)}
                style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2, cursor: "pointer" }} />
              <input className="admin-input" style={{ flex: 1, margin: 0 }} value={form.logoCo}
                onChange={(e) => set("logoCo", e.target.value)} />
            </div>
          </F>
        </Row>
        <Row>
          <F label="Category *">
            <select className="admin-select" value={form.cat} onChange={(e) => set("cat", e.target.value)}>
              {[["tech","💻 Technology"],["data","📊 Data & AI"],["design","🎨 Design"],["marketing","📣 Marketing"],["finance","💰 Finance"],["product","📦 Product"],["cloud","☁️ Cloud"],["business","🏢 Business"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </F>
          <F label="Experience Level *">
            <select className="admin-select" value={form.expLevel} onChange={(e) => set("expLevel", e.target.value)}>
              <option value="fresher">Fresher (0–1 yr)</option>
              <option value="mid">Mid Level (2–5 yr)</option>
              <option value="senior">Senior (5+ yr)</option>
              <option value="any">Any Level</option>
            </select>
          </F>
        </Row>
        <Row>
          <F label="Job Type *">
            <select className="admin-select" value={form.jobType} onChange={(e) => set("jobType", e.target.value)}>
              {["fulltime","parttime","remote","hybrid","internship","contract"].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </F>
          <F label="Salary Range *">
            <input className="admin-input" placeholder="e.g. ₹8–14 LPA or $60k–90k" value={form.salary}
              onChange={(e) => set("salary", e.target.value)} />
          </F>
        </Row>
        <Row>
          <F label="Badge (optional)">
            <input className="admin-input" placeholder="e.g. Hot, New, Urgent" value={form.badge}
              onChange={(e) => set("badge", e.target.value)} />
          </F>
          <F label="Badge Type">
            <select className="admin-select" value={form.badgeType} onChange={(e) => set("badgeType", e.target.value)}>
              <option value="hot">🔥 Hot</option>
              <option value="new">✨ New</option>
              <option value="urgent">⚡ Urgent</option>
              <option value="featured">⭐ Featured</option>
            </select>
          </F>
        </Row>
        <div style={{ marginBottom: 20 }}>
          <label className="admin-form-label">Tags (comma separated)</label>
          <input className="admin-input" placeholder="React, Node.js, AWS, Remote" value={form.tags}
            onChange={(e) => set("tags", e.target.value)} />
        </div>

        {/* Live Preview - works perfectly on its own page, no layout shift */}
        {(form.logo || form.title || form.company) && (
          <div style={{ background: "var(--surface)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, fontWeight: 600 }}>LIVE PREVIEW</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: form.logoBg, color: form.logoCo, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                {form.logo || "?"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{form.title || "Job Title"}</div>
                <div style={{ color: "var(--text3)", fontSize: 12 }}>
                  {form.company || "Company"} · {form.location || "Location"} · {form.salary || "Salary"}
                </div>
              </div>
              {form.badge && (
                <span className="admin-badge orange" style={{ marginLeft: "auto" }}>{form.badge}</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn-secondary btn-sm"
            onClick={() => navigate("/admin", { state: { section: "jobs_admin" } })}>
            Cancel
          </button>
          <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={loading}
            style={{ background: "#f97316", minWidth: 140 }}>
            {loading ? "Posting..." : "🚀 Post Job"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostJobPage;
