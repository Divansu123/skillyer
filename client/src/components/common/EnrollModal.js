import React, { useState } from "react";
import { createEnrollment } from "../../services/api";

const QUALIFICATIONS = [
  "10th Pass",
  "12th Pass",
  "Diploma",
  "B.Tech/B.E.",
  "B.Sc",
  "B.Com",
  "B.A",
  "BCA",
  "MCA",
  "M.Tech/M.E.",
  "MBA",
  "M.Sc",
  "Ph.D",
  "Other",
];

const EnrollModal = ({ course, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    location: "",
    preference: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.phone.trim()) {
      setError("Phone is required");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required");
      return;
    }
    if (!form.preference.trim()) {
      setError("Preference is required");
      return;
    }
    if (!form.qualification.trim()) {
      setError("Qualification is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createEnrollment({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        qualification: form.qualification,
        location: form.location.trim(),
        preference: form.preference.trim(),
        courseId: course.id,
      });
      setSuccess(true);
    } catch (e) {
      setError(
        e.response?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-box"
        style={{ maxWidth: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
            <div
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              Enrollment Submitted!
            </div>
            <p
              style={{
                color: "var(--text2)",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              We will contact you at <strong>{form.email}</strong> with course
              access details.
            </p>
            <button
              className="btn-primary"
              onClick={onClose}
              style={{ padding: "12px 32px" }}
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Course info strip */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {course.emoji || "📚"}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {course.title}
                </div>
                <div style={{ color: "var(--text3)", fontSize: 12 }}>
                  {course.provider ? course.provider.name : ""}
                  {course.level ? " · " + course.level : ""}
                  {course.price === 0
                    ? " · Free"
                    : course.price
                      ? " · Rs." + course.price
                      : ""}
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              📋 Enroll in this Course
            </div>

            {error && (
              <div
                style={{
                  color: "var(--accent2)",
                  fontSize: 13,
                  marginBottom: 14,
                  padding: "8px 12px",
                  background: "rgba(239,68,68,0.07)",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-row" style={{ marginBottom: 14 }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={set("name")}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: 20 }}>
              <div>
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
              <div>
                <label className="form-label">Qualification</label>
                <select
                  className="form-input"
                  value={form.qualification}
                  onChange={set("qualification")}
                >
                  <option value="">-- Select --</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row" style={{ marginBottom: 20 }}>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    className="form-input"
                    placeholder="City / State"
                    value={form.location}
                    onChange={set("location")}
                  />
                </div>

                <div>
                  <label className="form-label">Preference</label>
                  <select
                    className="form-input"
                    value={form.preference}
                    onChange={set("preference")}
                  >
                    <option value="">-- Select --</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? "Submitting..." : "Confirm Enrollment →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollModal;
