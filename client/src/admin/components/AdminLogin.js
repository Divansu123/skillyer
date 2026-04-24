import React, { useState } from "react";
import { adminLogin } from "../../services/api";

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminLogin(form);
      onLogin(res.data.admin, res.data.token);
    } catch (e) {
      setError(e.response?.data?.message || "Invalid credentials. Try admin / SkillYer2026");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">SkillYer</div>
        <div className="admin-login-sub">TruhireAI Admin Portal</div>
        <div className="admin-login-title">Admin Login</div>
        {error && (
          <div style={{ color: "var(--accent2)", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "rgba(239,68,68,0.05)", borderRadius: 8 }}>
            {error}
          </div>
        )}
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Username</label>
          <input className="form-input" placeholder="admin" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ marginBottom: 12, width: "100%", display: "block" }} />
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ marginBottom: 20, width: "100%", display: "block" }} />
          <button className="btn-primary" style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, textAlign: "center" }}>
            Demo: admin / SkillYer2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
