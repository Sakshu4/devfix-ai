import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="navbar" onClick={() => setToolsOpen(false)}>
      <div className="navbar-inner">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <div className="logo-icon">⚡</div>
          <span>DevFix <span style={{ color: 'var(--accent)' }}>AI</span></span>
        </NavLink>

        {/* Nav Links */}
        <div className="navbar-links">
          <NavLink to="/"             className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/search"       className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Search</NavLink>
          <NavLink to="/technologies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Technologies</NavLink>
          <NavLink to="/roadmap"      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Roadmap</NavLink>
          <NavLink to="/profile"      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Profile</NavLink>

          {/* Tools dropdown */}
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className={`nav-link`}
              onClick={() => setToolsOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              🛠️ Tools
              <span style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: 1 }}>{toolsOpen ? '▲' : '▼'}</span>
            </button>
            {toolsOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 8, minWidth: 200,
                boxShadow: 'var(--shadow-card)', zIndex: 100, marginTop: 4
              }}>
                {[
                  { path: '/analyze',    icon: '🔬', label: 'Error Log Analyzer' },
                  { path: '/screenshot', icon: '📸', label: 'Screenshot OCR' },
                  { path: '/scanner',    icon: '🖥️', label: 'System Scanner' },
                  { path: '/ai',         icon: '🤖', label: 'AI Troubleshooter' },
                  { path: '/readiness',  icon: '✅', label: 'Readiness Checker' },
                ].map(item => (
                  <button key={item.path}
                    onClick={() => { navigate(item.path); setToolsOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 12px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderRadius: 7, color: 'var(--text-secondary)',
                      fontSize: '0.87rem', textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auth section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <NavLink to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {user.username[0].toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem' }}>{user.username}</span>
              </NavLink>
              <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}
                style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className="btn btn-outline" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>Login</NavLink>
              <NavLink to="/register" className="btn btn-primary" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
