import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { getAllErrors, getAllTechnologies } from '../api/devfix';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ errors: 0, technologies: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getAllErrors().then(e => setStats(s => ({ ...s, errors: e.length })));
    getAllTechnologies().then(t => setStats(s => ({ ...s, technologies: t.length })));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container page">
      {/* ── Welcome Header ── */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))',
        border: '1px solid var(--border-accent)',
        marginBottom: 28, padding: '32px 28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0
          }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Welcome back, {user.username}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
              Role: <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{user.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        {[
          { icon: '🐛', value: stats.errors,       label: 'Errors in Knowledge Base', color: 'var(--severity-high)' },
          { icon: '🔧', value: stats.technologies,  label: 'Technologies Covered',    color: 'var(--accent)' },
          { icon: '📋', value: stats.technologies,  label: 'Install Guides Available', color: '#22c55e' },
        ].map(s => (
          <div className="card" key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <h2 className="section-title" style={{ marginBottom: 16 }}>Quick Actions</h2>
      <div className="grid grid-2" style={{ marginBottom: 40 }}>
        {[
          { icon: '🔍', title: 'Search Errors',          desc: 'Find fixes for any developer error',          path: '/search',        btn: 'Search Now',   primary: true },
          { icon: '📋', title: 'View Installation Guides',desc: 'Step-by-step setup for Java, Maven, Docker', path: '/technologies',  btn: 'View Guides',  primary: false },
          { icon: '🗺️', title: 'Setup Roadmaps',          desc: 'Follow guided paths to become dev-ready',    path: '/roadmap',       btn: 'View Roadmaps',primary: false },
          { icon: '👤', title: 'Developer Profile',       desc: 'Tell us your role and get a custom toolset', path: '/profile',       btn: 'Set Profile',  primary: false },
        ].map(a => (
          <div className="card" key={a.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{a.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{a.desc}</p>
            </div>
            <button
              className={`btn ${a.primary ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => navigate(a.path)}
              style={{ alignSelf: 'flex-start', padding: '7px 16px', fontSize: '0.85rem' }}
            >
              {a.btn} →
            </button>
          </div>
        ))}
      </div>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ borderColor: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Sign out</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>You will be redirected to the home page.</div>
        </div>
        <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}
          style={{ borderColor: 'rgba(239,68,68,0.4)', color: 'var(--severity-high)' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
