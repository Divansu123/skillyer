import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { ToastProvider, useToast } from "../admin/components/Toast";
import { useConfirm } from "../admin/components/ConfirmDialog";
import AdminLogin from "../admin/components/AdminLogin";
import AdminSidebar from "../admin/components/AdminSidebar";
import PostJobPage from "../admin/pages/PostJobPage";
import AddPartnerPage from "../admin/pages/AddPartnerPage";
import AddEnrollmentPage from "../admin/pages/AddEnrollmentPage";
import EditEnrollmentPage from "../admin/pages/EditEnrollmentPage";
import {
  fetchAdminStats, fetchRecentActivity,
  fetchCourses, fetchJobs, fetchEnrollments, fetchApplications,
  fetchCounselRequests, fetchCategories, fetchProviders,
  createCourse, updateCourse, deleteCourse,
  deleteJob, updateJob,
  updateCounselStatus,
  createCategory, deleteCategory, updateCategory,
  updateProvider,
  deleteEnrollment,
  updateEnrollmentStatus,
  updateApplicationStatus, deleteApplication,
} from "../services/api";

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, pages, onPage }) => {
  if (pages <= 1) return null;
  const items = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 2) items.push(i);
    else if (items[items.length - 1] !== "...") items.push("...");
  }
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: page <= 1 ? "var(--bg2)" : "white", cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: 13 }}>← Prev</button>
      {items.map((p, i) => p === "..." ? (
        <span key={"d" + i} style={{ padding: "5px 8px", color: "var(--text3)", fontSize: 13 }}>…</span>
      ) : (
        <button key={p} onClick={() => onPage(p)}
          style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: p === page ? "var(--accent)" : "white", color: p === page ? "white" : "var(--text)", cursor: "pointer", fontWeight: p === page ? 700 : 400, fontSize: 13 }}>{p}</button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page >= pages}
        style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: page >= pages ? "var(--bg2)" : "white", cursor: page >= pages ? "not-allowed" : "pointer", fontSize: 13 }}>Next →</button>
    </div>
  );
};

const StatusBadge = ({ active }) => (
  <span className={`admin-badge ${active ? "green" : "orange"}`}>{active ? "Active" : "Inactive"}</span>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardSection = ({ stats }) => {
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    fetchRecentActivity().then(r => setActivity(r.data.data || [])).catch(() => setActivity([])).finally(() => setLoadingActivity(false));
  }, []);

  const actionColor = (a) => a === "Enrolled" ? "blue" : a === "Applied for Job" ? "orange" : "green";

  return (
    <div className="admin-section active">
      <div className="admin-header">
        <div className="admin-title">📊 Dashboard Overview</div>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>Live data</span>
      </div>
      <div className="admin-stat-grid">
        {[
          { num: stats.enrollments ?? "—", label: "Total Enrollments", change: "All time" },
          { num: stats.courses ?? "—", label: "Total Courses", change: "In database" },
          { num: stats.jobs ?? "—", label: "Active Jobs", change: "Live listings" },
          { num: stats.applications ?? "—", label: "CV Applications", change: "All time" },
          { num: stats.counsels ?? "—", label: "Counselling Requests", change: "All time" },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-num">{s.num}</div>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-change">{s.change}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🔥 Recent Activity</div>
        {loadingActivity ? (
          <div style={{ textAlign: "center", padding: 24, color: "var(--text3)" }}>Loading activity…</div>
        ) : activity.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: "var(--text3)", fontSize: 13 }}>No recent activity yet.</div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>User</th><th>Action</th><th>Course/Item</th><th>Time</th></tr></thead>
            <tbody>
              {activity.map((a, i) => (
                <tr key={i}>
                  <td>{a.user}</td>
                  <td><span className={`admin-badge ${actionColor(a.action)}`}>{a.action}</span></td>
                  <td>{a.item}</td>
                  <td style={{ color: "var(--text3)" }}>{a.timeAgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ─── Course Form ──────────────────────────────────────────────────────────────
const CourseForm = ({ data, onChange, providers }) => (
  <>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Course Title *</label>
        <input className="admin-input" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} /></div>
      <div><label className="admin-form-label">Provider</label>
        <select className="admin-select" value={data.provId} onChange={e => onChange({ ...data, provId: e.target.value })}>
          {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select></div>
    </div>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Category</label>
        <select className="admin-select" value={data.catId} onChange={e => onChange({ ...data, catId: e.target.value })}>
          {["tech","data","design","marketing","finance","leadership","cloud","product","business","language"].map(c => <option key={c} value={c}>{c}</option>)}
        </select></div>
      <div><label className="admin-form-label">Level</label>
        <select className="admin-select" value={data.level} onChange={e => onChange({ ...data, level: e.target.value })}>
          {["Beginner","Intermediate","Advanced"].map(l => <option key={l}>{l}</option>)}
        </select></div>
    </div>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Price (₹)</label>
        <input className="admin-input" type="number" value={data.price} onChange={e => onChange({ ...data, price: e.target.value })} /></div>
      <div><label className="admin-form-label">Original Price (₹)</label>
        <input className="admin-input" type="number" value={data.origPrice} onChange={e => onChange({ ...data, origPrice: e.target.value })} /></div>
    </div>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Duration</label>
        <input className="admin-input" value={data.duration} onChange={e => onChange({ ...data, duration: e.target.value })} /></div>
      <div><label className="admin-form-label">Rating (1–5) ★</label>
        <input className="admin-input" type="number" step="0.1" min="1" max="5" value={data.rating}
          onChange={e => onChange({ ...data, rating: e.target.value })} placeholder="e.g. 4.5" /></div>
    </div>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Students Enrolled</label>
        <input className="admin-input" value={data.students} onChange={e => onChange({ ...data, students: e.target.value })} placeholder="e.g. 12k+" /></div>
      <div><label className="admin-form-label">Emoji Icon</label>
        <input className="admin-input" value={data.emoji} maxLength={4} onChange={e => onChange({ ...data, emoji: e.target.value })} /></div>
    </div>
    <div className="admin-form-row">
      <div><label className="admin-form-label">Certificate?</label>
        <select className="admin-select" value={String(data.hasCert)} onChange={e => onChange({ ...data, hasCert: e.target.value === "true" })}>
          <option value="true">Yes</option><option value="false">No</option>
        </select></div>
      <div><label className="admin-form-label">Exp Level</label>
        <select className="admin-select" value={data.expLevel} onChange={e => onChange({ ...data, expLevel: e.target.value })}>
          {["any","fresher","mid","senior"].map(l => <option key={l}>{l}</option>)}
        </select></div>
    </div>
    <label className="admin-form-label">Tags (comma separated)</label>
    <input className="admin-input" value={Array.isArray(data.tags) ? data.tags.join(", ") : data.tags} onChange={e => onChange({ ...data, tags: e.target.value })} />
    <div style={{ display: "flex", gap: 24, marginTop: 12, flexWrap: "wrap" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
        <input type="checkbox" checked={!!data.featured} onChange={e => onChange({ ...data, featured: e.target.checked })} />
        Featured
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
        <input type="checkbox" checked={!!data.isImportant} onChange={e => onChange({ ...data, isImportant: e.target.checked })} />
        ⭐ Important (show in homepage Top Courses)
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
        <input type="checkbox" checked={data.isActive !== false} onChange={e => onChange({ ...data, isActive: e.target.checked })} />
        Active (visible in portal)
      </label>
    </div>
  </>
);

// ─── Courses Section ──────────────────────────────────────────────────────────
const CoursesSection = ({ providers }) => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const LIMIT = 10;

  const blank = { title: "", provId: providers[0]?.id || "coursera", catId: "tech", level: "Beginner", duration: "", price: 0, origPrice: 0, rating: 4.5, students: "0", hasCert: true, tags: "", emoji: "📚", featured: false, isImportant: false, isActive: true, expLevel: "any" };
  const [newCourse, setNewCourse] = useState(blank);

  const load = useCallback((p = 1) => {
    fetchCourses({ admin: "true", limit: LIMIT, page: p })
      .then(r => { setCourses(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleAdd = async () => {
    if (!newCourse.title.trim()) { toast("Course title required", "warning"); return; }
    try {
      const tags = typeof newCourse.tags === "string" ? newCourse.tags.split(",").map(t => t.trim()).filter(Boolean) : newCourse.tags;
      await createCourse({ ...newCourse, tags });
      setShowAdd(false); setNewCourse(blank); load(1);
      toast("Course added! 📚", "success");
    } catch (e) { toast(e.response?.data?.message || "Error adding course", "error"); }
  };

  const handleEditSave = async () => {
    if (!editingCourse.title.trim()) { toast("Title required", "warning"); return; }
    try {
      const { id, provider, category, createdAt, updatedAt, ...data } = editingCourse;
      if (typeof data.tags === "string") data.tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
      await updateCourse(id, data);
      setEditingCourse(null); load(page);
      toast("Course updated! ✅", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const handleToggleActive = async (c) => {
    try { await updateCourse(c.id, { isActive: !c.isActive }); load(page); toast(c.isActive ? "Course hidden from portal" : "Course is now live!", "success"); }
    catch { toast("Error", "error"); }
  };

  const handleToggleImportant = async (c) => {
    try { await updateCourse(c.id, { isImportant: !c.isImportant }); load(page); toast(c.isImportant ? "Removed from homepage" : "⭐ Added to homepage Top Courses!", "success"); }
    catch { toast("Error", "error"); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this course? Cannot be undone.");
    if (!ok) return;
    try { await deleteCourse(id); load(page); toast("Course deleted", "info"); }
    catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">📚 Manage Courses <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total)</span></div>
        <button className="btn-primary btn-sm" onClick={() => { setShowAdd(s => !s); setEditingCourse(null); }}>+ Add New Course</button>
      </div>

      {showAdd && !editingCourse && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>➕ Add New Course</div>
          <CourseForm data={newCourse} onChange={setNewCourse} providers={providers} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleAdd}>Save Course</button>
            <button className="btn-secondary btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="admin-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>✏️ Edit: {editingCourse.title}</div>
          <CourseForm data={editingCourse} onChange={setEditingCourse} providers={providers} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleEditSave}>Update Course</button>
            <button className="btn-secondary btn-sm" onClick={() => setEditingCourse(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Course</th><th>Provider</th><th>Price</th><th>Rating</th><th>⭐ Imp</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} style={{ opacity: c.isActive ? 1 : 0.5 }}>
                <td><strong>{c.emoji} {c.title}</strong><div style={{ fontSize: 11, color: "var(--text3)" }}>{c.category?.name} · {c.level}</div></td>
                <td>{c.provider?.name || c.provId}</td>
                <td>{c.price === 0 ? "Free" : `₹${c.price?.toLocaleString()}`}</td>
                <td>⭐ {c.rating}</td>
                <td>
                  <button onClick={() => handleToggleImportant(c)} title={c.isImportant ? "Remove from homepage" : "Add to homepage"}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, opacity: c.isImportant ? 1 : 0.25 }}>⭐</button>
                </td>
                <td>
                  <button onClick={() => handleToggleActive(c)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <StatusBadge active={c.isActive} />
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditingCourse({ ...c, tags: Array.isArray(c.tags) ? c.tags.join(", ") : c.tags }); setShowAdd(false); }}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>✏️</button>
                    <button onClick={() => handleDelete(c.id)}
                      style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Partners Section ─────────────────────────────────────────────────────────
const PartnersSection = ({ providers, onRefresh }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [editingPartner, setEditingPartner] = useState(null);

  const handleEditSave = async () => {
    if (!editingPartner.name.trim()) { toast("Name required", "warning"); return; }
    try {
      const { id, createdAt, updatedAt, coursesList, _count, ...data } = editingPartner;
      await updateProvider(id, data);
      setEditingPartner(null); onRefresh();
      toast("Partner updated! ✅", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const handleToggleActive = async (p) => {
    try {
      await updateProvider(p.id, { ...p, isActive: !(p.isActive !== false) });
      onRefresh();
      toast("Partner status updated", "success");
    } catch { toast("Error", "error"); }
  };

  return (
    <div className="admin-section active">
      <div className="admin-header">
        <div className="admin-title">🤝 Education Partners</div>
        <button className="btn-primary btn-sm" onClick={() => navigate("/admin/add-partner")}>+ Add Partner</button>
      </div>

      {editingPartner && (
        <div className="admin-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>✏️ Edit: {editingPartner.name}</div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Partner Name *</label>
              <input className="admin-input" value={editingPartner.name}
                onChange={e => setEditingPartner(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="admin-form-label">Logo Text (2–3 chars)</label>
              <input className="admin-input" maxLength={3} value={editingPartner.logo}
                onChange={e => setEditingPartner(p => ({ ...p, logo: e.target.value }))} /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Brand Color</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="color" value={editingPartner.color || "#6246ea"}
                  onChange={e => setEditingPartner(p => ({ ...p, color: e.target.value }))}
                  style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2 }} />
                <input className="admin-input" style={{ flex: 1, margin: 0 }} value={editingPartner.color}
                  onChange={e => setEditingPartner(p => ({ ...p, color: e.target.value }))} />
              </div></div>
            <div><label className="admin-form-label">Background Color</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="color" value={editingPartner.bg || "#f0f2f8"}
                  onChange={e => setEditingPartner(p => ({ ...p, bg: e.target.value }))}
                  style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: 8, padding: 2 }} />
                <input className="admin-input" style={{ flex: 1, margin: 0 }} value={editingPartner.bg}
                  onChange={e => setEditingPartner(p => ({ ...p, bg: e.target.value }))} />
              </div></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Rating (0–5)</label>
              <input className="admin-input" type="number" step="0.1" min="0" max="5" value={editingPartner.rating}
                onChange={e => setEditingPartner(p => ({ ...p, rating: parseFloat(e.target.value) || 0 }))} /></div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", paddingBottom: 10 }}>
                <input type="checkbox" checked={editingPartner.isActive !== false}
                  onChange={e => setEditingPartner(p => ({ ...p, isActive: e.target.checked }))} />
                Active (visible in portal)
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleEditSave}>Update Partner</button>
            <button className="btn-secondary btn-sm" onClick={() => setEditingPartner(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Partner</th><th>Courses</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {providers.map(p => (
              <tr key={p.id} style={{ opacity: p.isActive !== false ? 1 : 0.5 }}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: p.bg, color: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{p.logo}</div>
                    {p.name}
                  </div>
                </td>
                <td>{p.courses}</td>
                <td>⭐ {p.rating}</td>
                <td>
                  <button onClick={() => handleToggleActive(p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <StatusBadge active={p.isActive !== false} />
                  </button>
                </td>
                <td>
                  <button onClick={() => setEditingPartner({ ...p })}
                    style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Domains Section ──────────────────────────────────────────────────────────
const DomainsSection = ({ categories, onDelete, onRefresh }) => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const [showAdd, setShowAdd] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [newDomain, setNewDomain] = useState({ name: "", icon: "" });

  const handleSave = async () => {
    if (!newDomain.name.trim()) { toast("Domain name required", "warning"); return; }
    try {
      const { createCategory: cc } = await import("../services/api");
      await cc({ name: newDomain.name, icon: newDomain.icon || "📚" });
      setShowAdd(false); setNewDomain({ name: "", icon: "" }); onRefresh();
      toast("Skill domain added! 🏫", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const handleEditSave = async () => {
    if (!editingDomain.name.trim()) { toast("Name required", "warning"); return; }
    try {
      const { id, createdAt, updatedAt, count, courses, _count, ...data } = editingDomain;
      await updateCategory(id, data);
      setEditingDomain(null); onRefresh();
      toast("Domain updated! ✅", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const handleToggleActive = async (cat) => {
    try { await updateCategory(cat.id, { isActive: !(cat.isActive !== false) }); onRefresh(); toast("Domain status updated", "success"); }
    catch { toast("Error", "error"); }
  };

  const handleDeleteConfirm = async (id) => {
    const ok = await confirm("Delete this skill domain? This may affect courses in this category.");
    if (!ok) return;
    onDelete(id);
  };

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">🏫 Skill Domains</div>
        <button className="btn-primary btn-sm" onClick={() => { setShowAdd(s => !s); setEditingDomain(null); }}>+ Add Domain</button>
      </div>

      {showAdd && !editingDomain && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>➕ Add New Skill Domain</div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Domain Name *</label>
              <input className="admin-input" value={newDomain.name} onChange={e => setNewDomain(d => ({ ...d, name: e.target.value }))} /></div>
            <div><label className="admin-form-label">Icon Emoji</label>
              <input className="admin-input" maxLength={4} value={newDomain.icon} onChange={e => setNewDomain(d => ({ ...d, icon: e.target.value }))} /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleSave}>Save Domain</button>
            <button className="btn-secondary btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {editingDomain && (
        <div className="admin-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>✏️ Edit: {editingDomain.name}</div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Domain Name *</label>
              <input className="admin-input" value={editingDomain.name} onChange={e => setEditingDomain(d => ({ ...d, name: e.target.value }))} /></div>
            <div><label className="admin-form-label">Icon Emoji</label>
              <input className="admin-input" maxLength={4} value={editingDomain.icon} onChange={e => setEditingDomain(d => ({ ...d, icon: e.target.value }))} /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Course Count (display)</label>
              <input className="admin-input" type="number" value={editingDomain.count || 0} onChange={e => setEditingDomain(d => ({ ...d, count: parseInt(e.target.value) || 0 }))} /></div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", paddingBottom: 10 }}>
                <input type="checkbox" checked={editingDomain.isActive !== false} onChange={e => setEditingDomain(d => ({ ...d, isActive: e.target.checked }))} />
                Active (visible in portal)
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleEditSave}>Update Domain</button>
            <button className="btn-secondary btn-sm" onClick={() => setEditingDomain(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Domain</th><th>Icon</th><th>Courses</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ opacity: c.isActive !== false ? 1 : 0.5 }}>
                <td>{c.name}</td>
                <td style={{ fontSize: 20 }}>{c.icon}</td>
                <td>{c.count}</td>
                <td>
                  <button onClick={() => handleToggleActive(c)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <StatusBadge active={c.isActive !== false} />
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditingDomain({ ...c }); setShowAdd(false); }}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteConfirm(c.id)}
                      style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 12 }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Users Section ────────────────────────────────────────────────────────────
const UsersSection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const [enrollments, setEnrollments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const LIMIT = 15;

  const load = useCallback((p = 1) => {
    fetchEnrollments({ limit: LIMIT, page: p, source: 'manual' })
      .then(r => { setEnrollments(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this enrollment?");
    if (!ok) return;
    try { await deleteEnrollment(id); load(page); toast("Enrollment deleted", "info"); }
    catch { toast("Error", "error"); }
  };

  const statusBadge = (s) => {
    const map = { Active: "green", Completed: "blue", "In Progress": "orange", Pending: "orange" };
    return <span className={`admin-badge ${map[s] || "blue"}`}>{s}</span>;
  };

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase();
    return !q || (e.name || "").toLowerCase().includes(q) || (e.email || "").toLowerCase().includes(q) || (e.course?.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">👤 Enrolled Users <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total)</span></div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="admin-input"
            style={{ margin: 0, width: 220 }}
            placeholder="Search users, email, course…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="btn-primary btn-sm"
            onClick={() => navigate("/admin/add-enrollment")}
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>User</th><th>Email</th><th>Qualification</th><th>Source</th><th>Course</th><th>Provider</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="admin-avatar">{(e.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                    {e.name}
                  </div>
                </td>
                <td style={{ color: "var(--text3)" }}>{e.email}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{e.qualification || "—"}</td>
                <td>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: e.source === 'public' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                    color: e.source === 'public' ? '#6366f1' : '#10b981',
                    whiteSpace: 'nowrap',
                  }}>
                    {e.source === 'public' ? '🌐 Portal' : '✏️ Manual'}
                  </span>
                </td>
                <td>{e.course?.title}</td>
                <td>{e.course?.provider?.name}</td>
                <td style={{ color: "var(--text3)" }}>{new Date(e.createdAt).toLocaleDateString("en-IN")}</td>
                <td>{statusBadge(e.status)}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => navigate(`/admin/edit-enrollment/${e.id}`, {
                        state: {
                          name: e.name,
                          email: e.email,
                          phone: e.phone,
                          courseId: e.courseId || e.course?.id,
                          status: e.status,
                          qualification: e.qualification,
                        }
                      })}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13 }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 13 }}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 13 }}>
            No enrollments found{search ? ` for "${search}"` : ""}.
          </div>
        )}
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Jobs Section ─────────────────────────────────────────────────────────────
const JobsSection = () => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingJob, setEditingJob] = useState(null);
  const LIMIT = 10;

  const load = useCallback((p = 1) => {
    fetchJobs({ admin: "true", limit: LIMIT, page: p })
      .then(r => { setJobs(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleToggleActive = async (j) => {
    try { await updateJob(j.id, { isActive: !j.isActive }); load(page); toast(j.isActive ? "Job hidden from portal" : "Job is now live!", "success"); }
    catch { toast("Error", "error"); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this job posting?");
    if (!ok) return;
    try {
      const mod = await import("../services/api");
      await mod.deleteJob(id); load(page);
      toast("Job deleted", "info");
    } catch { toast("Error", "error"); }
  };

  const handleEditSave = async () => {
    try {
      const { id, applications, createdAt, updatedAt, ...data } = editingJob;
      if (typeof data.tags === "string") data.tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
      await updateJob(id, data);
      setEditingJob(null); load(page);
      toast("Job updated! ✅", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">💼 Job Postings <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total)</span></div>
        <button className="btn-primary btn-sm" style={{ background: "#f97316" }} onClick={() => navigate("/admin/post-job")}>+ Post New Job</button>
      </div>

      {editingJob && (
        <div className="admin-card" style={{ marginBottom: 20, borderLeft: "3px solid #f97316" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>✏️ Edit: {editingJob.title}</div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Job Title *</label>
              <input className="admin-input" value={editingJob.title} onChange={e => setEditingJob(j => ({ ...j, title: e.target.value }))} /></div>
            <div><label className="admin-form-label">Company</label>
              <input className="admin-input" value={editingJob.company} onChange={e => setEditingJob(j => ({ ...j, company: e.target.value }))} /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Category</label>
              <input className="admin-input" value={editingJob.cat} onChange={e => setEditingJob(j => ({ ...j, cat: e.target.value }))} /></div>
            <div><label className="admin-form-label">Job Type</label>
              <select className="admin-select" value={editingJob.jobType} onChange={e => setEditingJob(j => ({ ...j, jobType: e.target.value }))}>
                {["fulltime","parttime","remote","hybrid","internship","contract"].map(t => <option key={t}>{t}</option>)}
              </select></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-form-label">Location</label>
              <input className="admin-input" value={editingJob.location} onChange={e => setEditingJob(j => ({ ...j, location: e.target.value }))} /></div>
            <div><label className="admin-form-label">Salary</label>
              <input className="admin-input" value={editingJob.salary} onChange={e => setEditingJob(j => ({ ...j, salary: e.target.value }))} /></div>
          </div>
          <label className="admin-form-label">Tags (comma separated)</label>
          <input className="admin-input" value={Array.isArray(editingJob.tags) ? editingJob.tags.join(", ") : editingJob.tags}
            onChange={e => setEditingJob(j => ({ ...j, tags: e.target.value }))} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", marginTop: 12 }}>
            <input type="checkbox" checked={!!editingJob.isActive} onChange={e => setEditingJob(j => ({ ...j, isActive: e.target.checked }))} />
            Active (visible in portal)
          </label>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-primary btn-sm" onClick={handleEditSave}>Update Job</button>
            <button className="btn-secondary btn-sm" onClick={() => setEditingJob(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Location</th><th>Apps</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} style={{ opacity: j.isActive ? 1 : 0.5 }}>
                <td><strong>{j.title}</strong><div style={{ fontSize: 11, color: "var(--text3)" }}>{j.cat} · {j.expLevel}</div></td>
                <td>{j.company}</td>
                <td>{j.jobType}</td>
                <td style={{ color: "var(--text3)" }}>{j.location}</td>
                <td>{j.applications?.length ?? 0}</td>
                <td>
                  <button onClick={() => handleToggleActive(j)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <StatusBadge active={j.isActive} />
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingJob({ ...j, tags: Array.isArray(j.tags) ? j.tags.join(", ") : j.tags })}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>✏️</button>
                    <button onClick={() => handleDelete(j.id)}
                      style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && <div style={{ textAlign: "center", color: "var(--text3)", padding: "40px 0", fontSize: 14 }}>No jobs yet. Click "+ Post New Job".</div>}
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Applications Section (NEW) ───────────────────────────────────────────────
const ApplicationsSection = () => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const LIMIT = 15;
  const API_BASE = process.env.REACT_APP_API_URL || "https://skillyer-api.onrender.com/api";

  const load = useCallback((p = 1) => {
    fetchApplications({ limit: LIMIT, page: p })
      .then(r => { setApplications(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast(`Status updated to "${status}"`, "success");
    } catch { toast("Error", "error"); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this application and its CV?");
    if (!ok) return;
    try { await deleteApplication(id); load(page); toast("Application deleted", "info"); }
    catch { toast("Error", "error"); }
  };

  const statusColor = { Pending: "orange", Reviewed: "blue", Shortlisted: "green", Rejected: "orange" };

  const filtered = applications.filter(a => {
    const q = search.toLowerCase();
    return !q || (a.name || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q) || (a.job?.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">📋 Job Applications <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total)</span></div>
        <input className="admin-input" style={{ margin: 0, width: 200 }} placeholder="Search applicants…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Applicant</th><th>Email</th><th>Phone</th><th>Job</th><th>Company</th><th>Qualification</th><th>Experience</th><th>Current Org</th><th>CTC</th><th>ECTC</th><th>Notice</th><th>CV/Resume</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="admin-avatar">{(a.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      {a.message && <div style={{ fontSize: 11, color: "var(--text3)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.message}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--text3)" }}>{a.email}</td>
                <td style={{ color: "var(--text3)" }}>{a.phone || "—"}</td>
                <td><strong>{a.job?.title || "—"}</strong></td>
                <td>{a.job?.company || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.qualification || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.experience || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.currentOrg || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.currentCtc || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.expectedCtc || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{a.noticePeriod || "—"}</td>
                <td>
                  {a.cvUrl ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <a href={`${API_BASE}${a.cvUrl}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: "var(--accent)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        👁 View
                      </a>
                      <a href={`${API_BASE}${a.cvUrl}`} download={a.cvName || "resume"}
                        style={{ color: "var(--text2)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        ⬇ Download
                      </a>
                    </div>
                  ) : (
                    <span style={{ color: "var(--text3)", fontSize: 12 }}>No CV</span>
                  )}
                </td>
                <td style={{ color: "var(--text3)" }}>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <select value={a.status} onChange={e => handleStatusChange(a.id, e.target.value)}
                    style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 6px", background: "white", cursor: "pointer" }}>
                    {["Pending","Reviewed","Shortlisted","Rejected"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(a.id)}
                    style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)" }}>No applications yet.</div>}
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Course Enrollments Section (Public — from EnrollModal) ──────────────────
const CourseEnrollmentsSection = () => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const [enrollments, setEnrollments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const LIMIT = 15;

  const load = useCallback((p = 1) => {
    fetchEnrollments({ limit: LIMIT, page: p, source: 'public' })
      .then(r => { setEnrollments(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this enrollment?");
    if (!ok) return;
    try { await deleteEnrollment(id); load(page); toast("Enrollment deleted", "info"); }
    catch { toast("Error", "error"); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnrollmentStatus(id, status);
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      toast(`Status updated to "${status}"`, "success");
    } catch { toast("Error", "error"); }
  };

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase();
    return !q || (e.name || "").toLowerCase().includes(q) || (e.email || "").toLowerCase().includes(q) || (e.course?.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="admin-section active">
      {ConfirmComponent}
      <div className="admin-header">
        <div className="admin-title">🎓 Enrolled (Public) <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total — submitted via course page)</span></div>
        <input className="admin-input" style={{ margin: 0, width: 220 }} placeholder="Search name, email, course…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th><th>Email</th><th>Phone</th><th>Qualification</th><th>Course</th><th>Provider</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="admin-avatar">{(e.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                    {e.name}
                  </div>
                </td>
                <td style={{ color: "var(--text3)" }}>{e.email}</td>
                <td style={{ color: "var(--text3)" }}>{e.phone || "—"}</td>
                <td style={{ color: "var(--text3)", whiteSpace: "nowrap" }}>{e.qualification || "—"}</td>
                <td>{e.course?.title || "—"}</td>
                <td>{e.course?.provider?.name || "—"}</td>
                <td style={{ color: "var(--text3)" }}>{new Date(e.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <select value={e.status} onChange={ev => handleStatusChange(e.id, ev.target.value)}
                    style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 6px", background: "white", cursor: "pointer" }}>
                    {["Active","In Progress","Completed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(e.id)}
                    style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 13 }}>
            No public enrollments found{search ? ` for "${search}"` : ""}.
          </div>
        )}
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Counselling Section ──────────────────────────────────────────────────────
const CounselSection = () => {
  const toast = useToast();
  const [counsels, setCounsels] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const load = useCallback((p = 1) => {
    fetchCounselRequests({ limit: LIMIT, page: p })
      .then(r => { setCounsels(r.data.data); setPage(r.data.page || p); setPages(r.data.pages || 1); setTotal(r.data.total || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleStatusChange = async (id, value) => {
    try {
      await updateCounselStatus(id, value);
      setCounsels(prev => prev.map(x => x.id === id ? { ...x, status: value } : x));
      toast(`Status → "${value}"`, "success");
    } catch { toast("Error", "error"); }
  };

  return (
    <div className="admin-section active">
      <div className="admin-header">
        <div className="admin-title">🧑‍💼 Counselling Requests <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)" }}>({total} total)</span></div>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Field</th><th>Exp Level</th><th>Message</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {counsels.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td style={{ color: "var(--text3)" }}>{c.email}</td>
                <td>{c.field}</td>
                <td>{c.expLevel}</td>
                <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text3)" }}>{c.message}</td>
                <td style={{ color: "var(--text3)" }}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}
                    style={{ fontSize: 11, border: "1px solid var(--border)", borderRadius: 6, padding: "3px 6px", background: "white", cursor: "pointer" }}>
                    {["Pending","Scheduled","Completed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pages={pages} onPage={load} />
      </div>
    </div>
  );
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const toast = useToast();
  const { confirm, ConfirmComponent } = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();

  const [section, setSection] = useState(location.state?.section || "dashboard");
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (location.state?.section) {
      setSection(location.state.section);
      navigate("/admin", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => { fetchAdminStats().then(r => setStats(r.data.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (["courses","partners","domains"].includes(section)) {
      fetchCategories().then(r => setCategories(r.data.data)).catch(() => {});
      fetchProviders().then(r => setProviders(r.data.data)).catch(() => {});
    }
  }, [section]);

  const handleDeleteDomain = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(x => x.id !== id));
      toast("Domain deleted", "info");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  return (
    <div className="admin-layout">
      {ConfirmComponent}
      <AdminSidebar section={section} onSectionChange={setSection} />
      <div className="admin-content">
        {section === "dashboard"      && <DashboardSection stats={stats} />}
        {section === "courses"        && <CoursesSection providers={providers} />}
        {section === "partners"       && <PartnersSection providers={providers} onRefresh={() => fetchProviders().then(r => setProviders(r.data.data))} />}
        {section === "domains"        && <DomainsSection categories={categories} onDelete={handleDeleteDomain} onRefresh={() => fetchCategories().then(r => setCategories(r.data.data))} />}
        {section === "users"          && <UsersSection courses={[]} />}
        {section === "course_enrollments" && <CourseEnrollmentsSection />}
        {section === "jobs_admin"     && <JobsSection />}
        {section === "applications"   && <ApplicationsSection />}
        {section === "counsel_admin"  && <CounselSection />}
      </div>
    </div>
  );
};

// ─── Root AdminPage ───────────────────────────────────────────────────────────
const AdminPage = () => {
  const { isAuthenticated, login } = useAdmin();

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <AdminLogin onLogin={login} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <Routes>
        <Route path="/"                      element={<AdminDashboard />} />
        <Route path="/jobs"                  element={<AdminDashboard />} />
        <Route path="/post-job"              element={<PostJobPage />} />
        <Route path="/add-partner"           element={<AddPartnerPage />} />
        <Route path="/add-enrollment"        element={<AddEnrollmentPage />} />
        <Route path="/edit-enrollment/:id"   element={<EditEnrollmentPage />} />
      </Routes>
    </ToastProvider>
  );
};

export default AdminPage;
