import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROADMAPS: Record<string, {
  title: string; icon: string; color: string;
  steps: { title: string; tools: string[]; guide?: number }[]
}> = {
  springboot: {
    title: 'Become Spring Boot Ready',
    icon: '🍃', color: '#22c55e',
    steps: [
      { title: 'Install Java (JDK 21)', tools: ['JDK 21', 'JAVA_HOME env variable'], guide: 1 },
      { title: 'Install Maven', tools: ['Maven 3.9+', 'MVN_HOME env variable'], guide: 2 },
      { title: 'Install PostgreSQL / MySQL', tools: ['PostgreSQL 17 or MySQL 8'] },
      { title: 'Install IntelliJ IDEA', tools: ['Community Edition (free)'] },
      { title: 'Install Git', tools: ['Git 2.47', 'Configure user.name + user.email'], guide: 6 },
      { title: 'Create a Spring Boot project', tools: ['start.spring.io', 'Spring Web', 'Spring Data JPA'] },
      { title: 'Run and verify', tools: ['mvn spring-boot:run', 'http://localhost:8080'] },
    ]
  },
  react: {
    title: 'Become React Developer Ready',
    icon: '⚛️', color: '#38bdf8',
    steps: [
      { title: 'Install Node.js (LTS)', tools: ['Node.js 22', 'npm included'], guide: 5 },
      { title: 'Install VS Code', tools: ['VS Code + ESLint + Prettier extensions'] },
      { title: 'Install Git', tools: ['Git 2.47'], guide: 6 },
      { title: 'Create a React project', tools: ['npm create vite@latest', 'react-ts template'] },
      { title: 'Learn React fundamentals', tools: ['Components', 'useState', 'useEffect', 'props'] },
      { title: 'Add routing & API calls', tools: ['react-router-dom', 'axios'] },
    ]
  },
  fullstack: {
    title: 'Become Full Stack Ready',
    icon: '🚀', color: '#a855f7',
    steps: [
      { title: 'Install Java (JDK 21)', tools: ['JDK 21', 'JAVA_HOME'], guide: 1 },
      { title: 'Install Maven', tools: ['Maven 3.9+'], guide: 2 },
      { title: 'Install Node.js', tools: ['Node.js 22', 'npm'], guide: 5 },
      { title: 'Install PostgreSQL', tools: ['PostgreSQL 17', 'pgAdmin 4'] },
      { title: 'Install Docker', tools: ['Docker Desktop'], guide: 4 },
      { title: 'Install Git + VS Code + IntelliJ', tools: ['Git 2.47', 'Both IDEs'], guide: 6 },
      { title: 'Build backend with Spring Boot', tools: ['REST API', 'JPA', 'Security'] },
      { title: 'Build frontend with React', tools: ['Vite', 'TypeScript', 'Axios'] },
      { title: 'Connect frontend to backend', tools: ['CORS', 'JWT Auth', 'Fetch/Axios'] },
    ]
  },
};

const ROLE_OPTIONS = [
  { id: 'springboot', label: '🍃 Spring Boot Developer' },
  { id: 'react',      label: '⚛️ React Developer' },
  { id: 'fullstack',  label: '🚀 Full Stack Developer' },
];

export default function Roadmap() {
  const navigate = useNavigate();
  const savedProfile = localStorage.getItem('devfix_profile') ?? 'springboot';
  const [activeRoadmap, setActiveRoadmap] = useState(
    ROADMAPS[savedProfile] ? savedProfile : 'springboot'
  );

  // Track completed steps in localStorage
  const storageKey = `devfix_steps_${activeRoadmap}`;
  const [completed, setCompleted] = useState<Set<number>>(
    () => new Set(JSON.parse(localStorage.getItem(storageKey) ?? '[]'))
  );

  const toggleStep = (idx: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  const roadmap = ROADMAPS[activeRoadmap];
  const progress = Math.round((completed.size / roadmap.steps.length) * 100);

  return (
    <div className="container page">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>🗺️ Setup Roadmaps</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
          Follow step-by-step guides to set up your development environment.
        </p>

        {/* Roadmap selector */}
        <div className="filter-bar" style={{ marginBottom: 28 }}>
          {ROLE_OPTIONS.map(r => (
            <button key={r.id} className={`filter-btn ${activeRoadmap === r.id ? 'active' : ''}`}
              onClick={() => {
                setActiveRoadmap(r.id);
                const saved = JSON.parse(localStorage.getItem(`devfix_steps_${r.id}`) ?? '[]');
                setCompleted(new Set(saved));
              }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{roadmap.icon} {roadmap.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 2 }}>
                {completed.size} of {roadmap.steps.length} steps completed
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: roadmap.color }}>{progress}%</div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, var(--accent), ${roadmap.color})`,
              borderRadius: 999, transition: 'width 0.4s ease'
            }} />
          </div>
          {progress === 100 && (
            <div style={{ marginTop: 12, textAlign: 'center', color: '#22c55e', fontWeight: 600, fontSize: '0.9rem' }}>
              🎉 Setup Complete! You are {roadmap.title.replace('Become ', '').replace(' Ready', '')} ready!
            </div>
          )}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {roadmap.steps.map((step, idx) => {
            const done = completed.has(idx);
            return (
              <div key={idx} className="card" style={{
                border: done ? '1px solid rgba(34,197,94,0.35)' : '1px solid var(--border)',
                background: done ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all 0.2s'
              }} onClick={() => toggleStep(idx)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: done ? '2px solid #22c55e' : '2px solid var(--border)',
                    background: done ? '#22c55e' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', marginTop: 2
                  }}>
                    {done && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                    {!done && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{idx + 1}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {step.tools.map(t => (
                        <span key={t} className="meta-chip" style={{ fontSize: '0.72rem' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {step.guide && (
                    <button className="btn btn-outline"
                      style={{ padding: '4px 12px', fontSize: '0.75rem', flexShrink: 0 }}
                      onClick={e => { e.stopPropagation(); navigate(`/guide/${step.guide}`); }}>
                      📋 Guide
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="btn btn-outline"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
            onClick={() => {
              localStorage.removeItem(storageKey);
              setCompleted(new Set());
            }}>
            Reset progress
          </button>
        </div>
      </div>
    </div>
  );
}
