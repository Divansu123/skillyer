import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home', id: 'home' },
    { path: '/explore', label: 'Explore', id: 'explore' },
    { path: '/compare', label: '⚖ Compare', id: 'compare' },
    { path: '/finder', label: '🎯 Find My Course', id: 'finder', style: { color: '#ff6b35', fontWeight: 600 } },
    { path: '/jobs', label: '💼 Jobs', id: 'jobs', style: { color: '#10b981', fontWeight: 600 } },
    { path: '/tools', label: '🎛 Tools', id: 'tools', style: { color: '#6246ea', fontWeight: 600 } },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav>
      {/* LEFT: Logo */}
      <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}>
          <img src="/logo.jpeg" alt="logo" className="logo-img" />
        </div>
      </div>

      {/* CENTER: Back button */}
      <div className="nav-center">
        {location.pathname !== '/' && (
          <button className="back-btn visible" onClick={() => navigate(-1)}>← Back</button>
        )}
      </div>

      {/* RIGHT: Nav Links */}
      <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
        {links.map(link => (
          <li key={link.id}>
            <a
              href={link.path}
              onClick={e => { e.preventDefault(); navigate(link.path); setMenuOpen(false); }}
              className={isActive(link.path) ? 'active' : ''}
              style={!isActive(link.path) ? (link.style || {}) : {}}
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a href="/admin" onClick={e => { e.preventDefault(); navigate('/admin'); setMenuOpen(false); }}
            style={{ color: 'var(--text3)', fontSize: 12 }}>
            Admin 🔒
          </a>
        </li>
      </ul>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </nav>
  );
};

export default Navbar;
