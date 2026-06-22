import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askGemini, type GeminiError } from '../api/gemini';
import { searchErrors } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { TechError } from '../types';

const EXAMPLE_ERRORS = [
  "JAVA_HOME is not set and no 'java' command could be found",
  "Port 8080 was already in use",
  "Cannot connect to the Docker daemon",
  "npm ERR! Cannot find module 'react'",
  "BUILD FAILURE: No qualifying bean of type found",
  "git push rejected: updates were rejected",
];

export default function AITroubleshooter() {
  const navigate = useNavigate();

  const [query,     setQuery]     = useState('');
  const [aiAnswer,  setAiAnswer]  = useState('');
  const [kbResults, setKbResults] = useState<TechError[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [done,      setDone]      = useState(false);

  const analyze = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setAiAnswer('');
    setKbResults([]);
    setDone(false);

    try {
      // Run AI + KB search in parallel
      const [aiText, kbRes] = await Promise.all([
        askGemini(query),
        searchErrors(query.slice(0, 80)).catch(() => [] as TechError[]),
      ]);

      setAiAnswer(aiText);
      setKbResults(kbRes.slice(0, 4));
      setDone(true);

    } catch (err) {
      const e = err as GeminiError;
      setError(e?.message ?? 'AI request failed. Please try again.');
      console.error('[DevFix AI] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render AI markdown-style text to JSX
  const formatAIResponse = (text: string) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, (_m, g) => `<strong>${g}</strong>`);
      if (/^\*\*(.+)\*\*$/.test(line.trim())) {
        return (
          <div key={i} style={{ fontWeight: 700, marginTop: 14, marginBottom: 4, color: 'var(--accent)' }}>
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      if (/^\d+\./.test(line)) {
        return (
          <div key={i} style={{ paddingLeft: 16, marginBottom: 5, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {line}
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return (
        <div
          key={i}
          style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 4 }}
          dangerouslySetInnerHTML={{ __html: bold }}
        />
      );
    });

  return (
    <div className="container page">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>🤖 AI Troubleshooter</h1>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))',
              color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)',
            }}>
              Powered by OpenRouter
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Paste your error — the AI diagnoses it and searches the knowledge base simultaneously.
          </p>
        </div>

        {/* Example errors */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Try an example:</div>
          <div className="filter-bar">
            {EXAMPLE_ERRORS.map(ex => (
              <button key={ex} className="filter-btn" style={{ fontSize: '0.78rem' }}
                onClick={() => { setQuery(ex); setDone(false); setAiAnswer(''); setKbResults([]); }}>
                {ex.slice(0, 42)}{ex.length > 42 ? '…' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <textarea
          value={query}
          onChange={e => { setQuery(e.target.value); setDone(false); }}
          placeholder={"Paste your error message or describe the problem...\n\nExample: java.lang.NullPointerException at UserService.java:42"}
          style={{
            width: '100%', minHeight: 130,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
            fontFamily: 'inherit', fontSize: '0.92rem',
            color: 'var(--text-primary)', resize: 'vertical', outline: 'none',
            lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 12,
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={analyze}
            disabled={loading || !query.trim()}
            style={{ padding: '12px 28px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #7c3aed, var(--accent))' }}>
            {loading ? '🤖 Analyzing...' : '🤖 AI Diagnose'}
          </button>
          {query && (
            <button className="btn btn-outline"
              onClick={() => { setQuery(''); setAiAnswer(''); setKbResults([]); setDone(false); setError(''); }}>
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && <div className="auth-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

        {/* Loading */}
        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: 36, marginBottom: 20 }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🤖</div>
            <div style={{ fontWeight: 600 }}>The AI is analyzing your error...</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              Also searching knowledge base simultaneously
            </div>
          </div>
        )}

        {/* AI Answer */}
        {done && aiAnswer && (
          <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <span style={{ fontWeight: 700 }}>AI Diagnosis</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Powered by OpenRouter
              </span>
            </div>
            <div style={{ lineHeight: 1.75 }}>
              {formatAIResponse(aiAnswer)}
            </div>
          </div>
        )}

        {/* KB Results */}
        {done && kbResults.length > 0 && (
          <div>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>📚 Related fixes in Knowledge Base</h2>
              <span className="section-count">{kbResults.length} found</span>
            </div>
            <div className="grid grid-2">
              {kbResults.map(err => (
                <ErrorCard key={err.id} error={err} onClick={() => navigate(`/errors/${err.id}`)} />
              ))}
            </div>
          </div>
        )}

        {done && !aiAnswer && kbResults.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>No results found</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 6 }}>
              Try rephrasing your error message.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
