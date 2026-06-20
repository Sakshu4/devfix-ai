import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="logo-icon">⚡</div>
          <span>DevFix <span style={{ color: 'var(--accent)' }}>AI</span></span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/"            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/search"      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Search Errors</NavLink>
          <NavLink to="/technologies"className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Technologies</NavLink>
        </div>
      </div>
    </nav>
  );
}
