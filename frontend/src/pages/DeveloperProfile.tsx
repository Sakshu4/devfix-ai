import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const ROLES = [
  {
    id: 'java',
    icon: '☕',
    title: 'Java Developer',
    desc: 'Core Java, OOP, Collections, JDBC',
    tools: ['JDK 21', 'IntelliJ IDEA', 'Maven', 'Git'],
    color: '#ef4444',
  },
  {
    id: 'springboot',
    icon: '🍃',
    title: 'Spring Boot Developer',
    desc: 'REST APIs, Spring Data JPA, Security',
    tools: ['JDK 21', 'Maven', 'PostgreSQL/MySQL', 'IntelliJ', 'Git', 'Postman'],
    color: '#22c55e',
  },
  {
    id: 'react',
    icon: '⚛️',
    title: 'React Developer',
    desc: 'React, TypeScript, Vite, Tailwind',
    tools: ['Node.js 22', 'npm', 'VS Code', 'Git'],
    color: '#38bdf8',
  },
  {
    id: 'fullstack',
    icon: '🚀',
    title: 'Full Stack Developer',
    desc: 'React + Spring Boot + PostgreSQL',
    tools: ['JDK 21', 'Maven', 'Node.js 22', 'PostgreSQL', 'Docker', 'Git', 'VS Code / IntelliJ'],
    color: '#a855f7',
  },
  {
    id: 'devops',
    icon: '🐳',
    title: 'DevOps / Cloud',
    desc: 'Docker, CI/CD, Linux, AWS basics',
    tools: ['Docker', 'Git', 'Linux CLI', 'VS Code'],
    color: '#f59e0b',
  },
];

export default function DeveloperProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(
    () => localStorage.getItem('devfix_profile')
  );

  const saveProfile = (roleId: string) => {
    localStorage.setItem('devfix_profile', roleId);
    setSelected(roleId);
  };

  const selectedRole = ROLES.find(r => r.id === selected);

  return (
    <div className="container page">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            👤 Developer Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Select your role — DevFix AI will show you the right tools and guides.
          </p>
          {!user && (
            <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, fontSize: '0.85rem', color: '#f59e0b' }}>
              💡 <strong>Tip:</strong> <span style={{ color: 'var(--text-secondary)' }}>Create an account to save your profile across devices.</span>
            </div>
          )}
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {ROLES.map(role => (
            <div
              key={role.id}
              className="card"
              onClick={() => saveProfile(role.id)}
              style={{
                cursor: 'pointer',
                border: selected === role.id ? `1px solid ${role.color}` : '1px solid var(--border)',
                background: selected === role.id ? `rgba(${role.id === 'java' ? '239,68,68' : role.id === 'springboot' ? '34,197,94' : role.id === 'react' ? '56,189,248' : role.id === 'fullstack' ? '168,85,247' : '245,158,11'},0.07)` : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{role.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {role.title}
                  {selected === role.id && (
                    <span style={{ fontSize: '0.7rem', background: role.color, color: '#fff', padding: '1px 8px', borderRadius: 999, fontWeight: 700 }}>
                      SELECTED
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 8 }}>{role.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {role.tools.map(t => (
                    <span key={t} className="meta-chip" style={{ fontSize: '0.72rem' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${selected === role.id ? role.color : 'var(--border)'}`,
                background: selected === role.id ? role.color : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s'
              }}>
                {selected === role.id && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Required Tools for selected role */}
        {selectedRole && (
          <div className="card" style={{ marginBottom: 24, border: '1px solid var(--border-accent)' }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{selectedRole.icon}</span> Required Tools for {selectedRole.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedRole.tools.map((tool, i) => (
                <div key={tool} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: 'var(--bg-secondary)', borderRadius: 8,
                  border: '1px solid var(--border)'
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, fontFamily: 'JetBrains Mono', flexShrink: 0
                  }}>{i + 1}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tool}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/roadmap')}
                style={{ flex: 1, justifyContent: 'center' }}>
                🗺️ View Setup Roadmap →
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/technologies')}>
                📋 Install Guides
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
