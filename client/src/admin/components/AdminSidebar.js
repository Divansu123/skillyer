import React from "react";
import { useAdmin } from "../../context/AdminContext";

const navItems = [
  { id: "dashboard",    label: "Dashboard",      icon: "📊" },
  { id: "courses",      label: "Courses",         icon: "📚" },
  { id: "partners",     label: "Partners",        icon: "🤝" },
  { id: "domains",      label: "Skill Domains",   icon: "🏫" },
  { id: "users",        label: "Enrolled Users",  icon: "👤" },
  { id: "jobs_admin",   label: "Job Posts",       icon: "💼" },
  { id: "applications", label: "Applications",    icon: "📋" },
  { id: "counsel_admin",label: "Counselling",     icon: "🧑‍💼" },
];

const AdminSidebar = ({ section, onSectionChange }) => {
  const { logout } = useAdmin();
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-text">SkillYer Admin</div>
        <div className="admin-logo-sub">TruhireAI Portal</div>
      </div>
      {navItems.map(n => (
        <div
          key={n.id}
          className={`admin-nav-item${section === n.id ? " active" : ""}`}
          onClick={() => onSectionChange(n.id)}
        >
          <span className="admin-nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}
      <div className="admin-nav-item" onClick={logout} style={{ marginTop: "auto" }}>
        <span className="admin-nav-icon">🚪</span>Logout
      </div>
    </div>
  );
};

export default AdminSidebar;
