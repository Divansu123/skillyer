import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEnrollment, fetchCourses } from "../../services/api";
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

const AddEnrollmentPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [qualification, setQualification] = useState("");

  useEffect(() => {
    fetchCourses({ admin: "true", limit: 200 })
      .then(r => setCourses(r.data.data || []))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) { toast("Full name is required", "warning"); return; }
    if (!email.trim()) { toast("Email is required", "warning"); return; }
    if (!courseId) { toast("Please select a course", "warning"); return; }

    setLoading(true);
    try {
      await createEnrollment({ name: name.trim(), email: email.trim(), phone: phone.trim(), courseId, qualification: qualification.trim(), source: 'manual' });
      toast("User enrolled successfully! ✅", "success");
      navigate("/admin", { state: { section: "users" } });
    } catch (e) {
      toast(e.response?.data?.message || "Failed to enroll user", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => String(c.id) === String(courseId));

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
              👤 Add Enrolled User
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text3)", marginTop: 2 }}>
              Manually enroll a user into a course
            </p>
          </div>
        </div>

        <div className="admin-card">
          <Row>
            <F label="Full Name *" hint="User ka poora naam">
              <input
                className="admin-input"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </F>
            <F label="Email *" hint="Contact email address">
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
            <F label="Phone" hint="Optional — with country code">
              <input
                className="admin-input"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </F>
            <F label="Qualification" hint="Highest education qualification">
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

          <Row>
            <F label="Select Course *" hint="Course jisme enroll karna hai">
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
            <div />
          </Row>

          {/* Preview */}
          {(name || selectedCourse) && (
            <div style={{
              background: "var(--surface)", borderRadius: 12, padding: "14px 16px",
              marginBottom: 20, border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>
                ENROLLMENT PREVIEW
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "var(--accent)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 16,
                }}>
                  {name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                </div>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>
                    {name || "User Name"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    {email || "email@example.com"}
                    {phone ? ` · ${phone}` : ""}
                  </div>
                </div>
                {selectedCourse && (
                  <div style={{
                    marginLeft: "auto", background: "var(--bg)", borderRadius: 8, padding: "8px 12px",
                    border: "1px solid var(--border)", textAlign: "right",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Enrolling in</div>
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
              disabled={loading || coursesLoading}
              style={{ minWidth: 160 }}
            >
              {loading ? "Enrolling..." : "✅ Enroll User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEnrollmentPage;
