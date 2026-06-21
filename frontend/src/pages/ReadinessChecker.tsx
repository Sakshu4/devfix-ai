import { useState } from 'react';

// ── Tool definitions per role ─────────────────────────────────────────────────
const ROLE_TOOLS: Record<string, { label: string; tools: { id: string; name: string; checkCmd: string; hint: string }[] }> = {
  springboot: {
    label: '🍃 Spring Boot Developer',
    tools: [
      { id: 'jdk',        name: 'Java JDK 17+',   checkCmd: 'java -version',       hint: 'Download from https://adoptium.net' },
      { id: 'javahome',   name: 'JAVA_HOME set',   checkCmd: 'echo %JAVA_HOME%',    hint: 'Set in System Environment Variables' },
      { id: 'maven',      name: 'Maven 3.8+',      checkCmd: 'mvn -version',        hint: 'Download from https://maven.apache.org' },
      { id: 'git',        name: 'Git',             checkCmd: 'git --version',       hint: 'Download from https://git-scm.com' },
      { id: 'postgresql', name: 'PostgreSQL/MySQL', checkCmd: 'psql --version',     hint: 'Download from https://postgresql.org' },
      { id: 'intellij',   name: 'IntelliJ IDEA',   checkCmd: 'Open IntelliJ',      hint: 'Download Community at https://jetbrains.com' },
    ]
  },
  react: {
    label: '⚛️ React Developer',
    tools: [
      { id: 'node',    name: 'Node.js 18+',   checkCmd: 'node -v',         hint: 'Download LTS from https://nodejs.org' },
      { id: 'npm',     name: 'npm',           checkCmd: 'npm -v',          hint: 'Comes with Node.js installation' },
      { id: 'git',     name: 'Git',           checkCmd: 'git --version',   hint: 'Download from https://git-scm.com' },
      { id: 'vscode',  name: 'VS Code',       checkCmd: 'code --version',  hint: 'Download from https://code.visualstudio.com' },
    ]
  },
  fullstack: {
    label: '🚀 Full Stack Developer',
    tools: [
      { id: 'jdk',        name: 'Java JDK 17+',   checkCmd: 'java -version',    hint: 'Download from https://adoptium.net' },
      { id: 'javahome',   name: 'JAVA_HOME set',   checkCmd: 'echo %JAVA_HOME%', hint: 'Set in System Environment Variables' },
      { id: 'maven',      name: 'Maven 3.8+',      checkCmd: 'mvn -version',     hint: 'Download from https://maven.apache.org' },
      { id: 'node',       name: 'Node.js 18+',     checkCmd: 'node -v',          hint: 'Download LTS from https://nodejs.org' },
      { id: 'npm',        name: 'npm',             checkCmd: 'npm -v',           hint: 'Comes with Node.js' },
      { id: 'postgresql', name: 'PostgreSQL',      checkCmd: 'psql --version',   hint: 'Download from https://postgresql.org' },
      { id: 'docker',     name: 'Docker',          checkCmd: 'docker --version', hint: 'Download Docker Desktop' },
      { id: 'git',        name: 'Git',             checkCmd: 'git --version',    hint: 'Download from https://git-scm.com' },
    ]
  },
  java: {
    label: '☕ Java Developer',
    tools: [
      { id: 'jdk',      name: 'Java JDK 17+',  checkCmd: 'java -version',    hint: 'Download from https://adoptium.net' },
      { id: 'javahome', name: 'JAVA_HOME set',  checkCmd: 'echo %JAVA_HOME%', hint: 'Set in System Environment Variables' },
      { id: 'maven',    name: 'Maven 3.8+',     checkCmd: 'mvn -version',     hint: 'Download from https://maven.apache.org' },
      { id: 'git',      name: 'Git',            checkCmd: 'git --version',    hint: 'Download from https://git-scm.com' },
      { id: 'intellij', name: 'IntelliJ IDEA',  checkCmd: 'Open IntelliJ',   hint: 'Download Community at https://jetbrains.com' },
    ]
  },
};

const ROLE_OPTIONS = [
  { id: 'springboot', label: '🍃 Spring Boot' },
  { id: 'react',      label: '⚛️ React' },
  { id: 'fullstack',  label: '🚀 Full Stack' },
  { id: 'java',       label: '☕ Java' },
];

const scoreColor = (pct: number) =>
  pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

const scoreLabel = (pct: number, role: string) => {
  const labels: Record<string, string> = {
    springboot: 'Spring Boot Ready', react: 'React Ready',
    fullstack: 'Full Stack Ready', java: 'Java Ready',
  };
  if (pct === 100) return `✅ ${labels[role]}!`;
  if (pct >= 80)  return `⚡ Almost ${labels[role]}`;
  if (pct >= 50)  return `🔧 Partially ${labels[role]}`;
  return `❌ Not Yet ${labels[role]}`;
};

export default function ReadinessChecker() {
  const savedProfile = localStorage.getItem('devfix_profile') ?? 'springboot';
  const [role, setRole] = useState(savedProfile in ROLE_TOOLS ? savedProfile : 'springboot');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const tools = ROLE_TOOLS[role].tools;
  const score = Math.round((checked.size / tools.length) * 100);
  const missing = tools.filter(t => !checked.has(t.id));

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleReveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRoleChange = (r: string) => {
    setRole(r);
    setChecked(new Set());
    setRevealed(new Set());
  };

  return (
    <div className="container page">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            🖥️ Environment Readiness Checker
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Check which tools are installed on your system. Tick each one after verifying in your terminal.
          </p>
        </div>

        {/* Role tabs */}
        <div className="filter-bar" style={{ marginBottom: 24 }}>
          {ROLE_OPTIONS.map(r => (
            <button key={r.id}
              className={`filter-btn ${role === r.id ? 'active' : ''}`}
              onClick={() => handleRoleChange(r.id)}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Score card */}
        <div className="card" style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.06))',
          border: '1px solid var(--border-accent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>
                {scoreLabel(score, role)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {checked.size} of {tools.length} tools confirmed installed
              </div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: scoreColor(score), lineHeight: 1 }}>
              {score}%
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', marginTop: 16 }}>
            <div style={{
              height: '100%', width: `${score}%`,
              background: `linear-gradient(90deg, ${scoreColor(score)}, ${score >= 80 ? '#86efac' : score >= 50 ? '#fcd34d' : '#fca5a5'})`,
              borderRadius: 999, transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Instruction box */}
        <div style={{
          padding: '12px 16px', background: 'rgba(59,130,246,0.07)',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8,
          fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 20
        }}>
          💡 Open your terminal (CMD / PowerShell / Terminal) and run each command below.
          If it prints a version number → tick ✓. If it says "not recognized" → follow the install hint.
        </div>

        {/* Tool checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {tools.map(tool => {
            const done = checked.has(tool.id);
            const open = revealed.has(tool.id);
            return (
              <div key={tool.id}>
                <div className="card" style={{
                  cursor: 'pointer',
                  border: done ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--border)',
                  background: done ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
                  transition: 'all 0.2s', padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Checkbox */}
                    <div onClick={() => toggle(tool.id)} style={{
                      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                      border: done ? '2px solid #22c55e' : '2px solid var(--border)',
                      background: done ? '#22c55e' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      {done && <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>}
                    </div>

                    {/* Tool name */}
                    <div style={{ flex: 1 }} onClick={() => toggle(tool.id)}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {tool.name}
                      </div>
                      {/* Command badge */}
                      <code style={{
                        fontFamily: 'JetBrains Mono', fontSize: '0.78rem',
                        background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4,
                        color: 'var(--accent)', marginTop: 4, display: 'inline-block'
                      }}>
                        {tool.checkCmd}
                      </code>
                    </div>

                    {/* Status + hint toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {done ? (
                        <span style={{ color: '#22c55e', fontSize: '0.82rem', fontWeight: 600 }}>✅ Installed</span>
                      ) : (
                        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => toggleReveal(tool.id)}>
                          {open ? 'Hide' : '📦 How to install'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Install hint (expandable) */}
                  {open && !done && (
                    <div style={{
                      marginTop: 12, padding: '10px 14px',
                      background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                      borderRadius: 6, fontSize: '0.83rem', color: 'var(--text-secondary)'
                    }}>
                      📦 {tool.hint}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Missing tools summary */}
        {missing.length > 0 && (
          <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12, color: '#f59e0b' }}>
              ⚠️ {missing.length} tool{missing.length > 1 ? 's' : ''} still needed:
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {missing.map(t => (
                <span key={t.id} className="meta-chip" style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                  {t.name}
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 12 }}>
              Use the Installation Guides to set these up step-by-step.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 12, padding: '8px 18px' }}
              onClick={() => window.location.href = '/technologies'}>
              📋 Open Installation Guides →
            </button>
          </div>
        )}

        {score === 100 && (
          <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.05)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#22c55e' }}>
              All tools installed! You are {ROLE_TOOLS[role].label.split(' ').slice(1).join(' ')} ready.
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 6 }}>
              Now follow the roadmap to start your first project.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 14 }}
              onClick={() => window.location.href = '/roadmap'}>
              🗺️ View Setup Roadmap →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
