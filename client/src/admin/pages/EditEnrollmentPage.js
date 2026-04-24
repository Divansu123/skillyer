import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { updateEnrollment, fetchCourses } from "../../services/api";
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

const STATUS_OPTIONS = ["Active", "In Progress", "Completed", "Pending"];

const EditEnrollmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Individual state for each field — no object spreading = no cursor loss
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("Active");
  const [qualification, setQualification] = useState("");

  // Load courses list
  useEffect(() => {
    fetchCourses({ admin: "true", limit: 200 })
      .then(r => setCourses(r.data.data || []))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  // Load existing enrollment data passed via navigate state
  useEffect(() => {
    const state = location.state;
    if (state) {
      setName(state.name || "");
      setEmail(state.email || "");
      setPhone(state.phone || "");
      setCourseId(String(state.courseId || ""));
      setStatus(state.status || "Active");
      setQualification(state.qualification || "");
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!name.trim()) { toast("Full name is required", "warning"); return; }
    if (!email.trim()) { toast("Email is required", "warning"); return; }
    if (!courseId) { toast("Please select a course", "warning"); return; }

    setLoading(true);
    try {
      await updateEnrollment(id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        courseId,
        status,
        qualification: qualification.trim(),
      });
      toast("Enrollment updated! ✅", "success");
      navigate("/admin", { state: { section: "users" } });
    } catch (e) {
      toast(e.response?.data?.message || "Failed to update enrollment", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => String(c.id) === String(courseId));

  const statusColors = {
    Active: { bg: "#dcfce7", color: "#16a34a" },
    "In Progress": { bg: "#fef3c7", color: "#d97706" },
    Completed: { bg: "#dbeafe", color: "#2563eb" },
    Pending: { bg: "#fef3c7", color: "#d97706" },
  };
  const sc = statusColors[status] || statusColors.Active;

  return (
    <div className="admin-layout">
      <AdminSidebar
        section="users"
        onSectionChange={(sec) => navigate("/admin", { state: { section: sec } })}
      />
      <div className="admin-content">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => navigate("/admin", { state: { section: "users" } })}
            style={{
              background: "none", border: "1px solid var(--border)", borderRadius: 8,
              padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "var(--text2)",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← Back to Enrolled Users
          </button>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 22, margin: 0 }}>
              ✏️ Edit Enrollment
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text3)", marginTop: 2 }}>
              Update user enrollment details and status
            </p>
          </div>
        </div>

        <div className="admin-card">
          <Row>
            <F label="Full Name *">
              <input
                className="admin-input"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </F>
            <F label="Email *">
              <input
                className="admin-input"
                type="email"
                placeholder="e.g. priya@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </F>
          </Row>

          <Row>
            <F label="Phone">
              <input
                className="admin-input"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </F>
            <F label="Course *">
              <select
                className="admin-select"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                disabled={coursesLoading}
              >
                <option value="">{coursesLoading ? "Loading courses..." : "-- Select a Course --"}</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title} ({c.provider?.name || c.provId})
                  </option>
                ))}
              </select>
            </F>
          </Row>

          <Row>
            <F label="Enrollment Status">
              <select
                className="admin-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </F>
            <F label="Qualification">
              <select
                className="admin-select"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
              >
                <option value="">-- Select Qualification --</option>
                {['10th Pass','12th Pass','Diploma','B.Tech/B.E.','B.Sc','B.Com','B.A','BCA','MCA','M.Tech/M.E.','MBA','M.Sc','Ph.D','Other'].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </F>
          </Row>

          {/* Preview */}
          {name && (
            <div style={{
              background: "var(--surface)", borderRadius: 12, padding: "14px 16px",
              marginBottom: 20, border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>
                PREVIEW
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "var(--accent)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 16, flexShrink: 0,
                }}>
                  {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>{name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    {email}{phone ? ` · ${phone}` : ""}
                  </div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: sc.bg, color: sc.color,
                }}>
                  {status}
                </span>
                {selectedCourse && (
                  <div style={{
                    background: "var(--bg)", borderRadius: 8, padding: "8px 12px",
                    border: "1px solid var(--border)", textAlign: "right",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Course</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {selectedCourse.emoji} {selectedCourse.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {selectedCourse.provider?.name} · {selectedCourse.level}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              className="btn-secondary btn-sm"
              onClick={() => navigate("/admin", { state: { section: "users" } })}
            >
              Cancel
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={handleSubmit}
              disabled={loading}
              style={{ minWidth: 160 }}
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEnrollmentPage;
