import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchErrors } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { TechError } from '../types';

// ── API Key management ────────────────────────────────────────────────────────
const STORAGE_KEY = 'devfix_gemini_key';

function getApiKey(): string { return localStorage.getItem(STORAGE_KEY) ?? ''; }
function saveApiKey(key: string) { localStorage.setItem(STORAGE_KEY, key); }

// ── System prompt for Gemini ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DevFix AI, an expert developer environment troubleshooter.
You specialize in Java, Spring Boot, Maven, Node.js, npm, Docker, Git, and PostgreSQL errors.
When a user gives you an error:
1. Identify the root cause in 1-2 sentences
2. Give numbered fix steps (be specific and practical)
3. Mention the OS if the fix differs between Windows/Linux/Mac
4. Keep the response concise — max 300 words
Format with clear sections: **Root Cause**, **Fix Steps**, **Prevention Tip**`;

export default function AITroubleshooter() {
  const navigate = useNavigate();

  const [apiKey,    setApiKey]    = useState(getApiKey());
  const [showKey,   setShowKey]   = useState(!getApiKey());
  const [query,     setQuery]     = useState('');
  const [aiAnswer,  setAiAnswer]  = useState('');
  const [kbResults, setKbResults] = useState<TechError[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [done,      setDone]      = useState(false);

  const EXAMPLE_ERRORS = [
    "JAVA_HOME is not set and no 'java' command could be found",
    "Port 8080 was already in use",
    "Cannot connect to the Docker daemon",
    "npm ERR! Cannot find module 'react'",
    "BUILD FAILURE: No qualifying bean of type found",
    "git push rejected: updates were rejected",
  ];

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey(apiKey.trim());
    setShowKey(false);
  };

  const analyze = async () => {
    if (!query.trim()) return;
    if (!apiKey) { setShowKey(true); return; }

    setLoading(true); setError(''); setAiAnswer(''); setKbResults([]); setDone(false);

    try {
      // ── Run KB search + Gemini in parallel ───────────────────────────────
      const [, kbRes] = await Promise.all([
        // Gemini AI answer
        (async () => {
          const genAI = new GoogleGenerativeAI(apiKey);
          // Try gemini-2.0-flash first, fall back to gemini-pro
          let model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          try {
            const result = await model.generateContent(
              `${SYSTEM_PROMPT}\n\nDeveloper's error:\n${query}`
            );
            setAiAnswer(result.response.text());
          } catch {
            // Fallback to gemini-pro (universally available)
            model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(
              `${SYSTEM_PROMPT}\n\nDeveloper's error:\n${query}`
            );
            setAiAnswer(result.response.text());
          }
        })(),

        // Knowledge base search
        searchErrors(query.slice(0, 80)).catch(() => [] as TechError[]),
      ]);

      setKbResults(kbRes.slice(0, 4));
      setDone(true);

    } catch (err: any) {
      if (err?.message?.includes('API_KEY') || err?.message?.includes('API key')) {
        setError('Invalid Gemini API key. Please check and re-enter.');
        setShowKey(true);
      } else {
        setError(err?.message ?? 'AI request failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format AI markdown-like text to JSX
  const formatAIResponse = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, marginTop: 12, marginBottom: 4, color: 'var(--accent)' }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{line}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 4 }} />;
      return <div key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 4 }}>{line}</div>;
    });
  };

  return (
    <div className="container page">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>🤖 AI Troubleshooter</h1>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))',
              color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)'
            }}>Powered by Gemini</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Describe your error — Gemini AI diagnoses it AND searches the knowledge base simultaneously.
          </p>
        </div>

        {/* API Key setup */}
        {showKey && (
          <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔑 Gemini API Key Required
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
              Get your free key at{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}>aistudio.google.com/apikey</a>
              {' '}— it's free, no credit card.
              Your key is stored only in your browser (localStorage).
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                className="form-input"
                placeholder="AIza..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={handleSave} style={{ flexShrink: 0 }}>
                Save Key
              </button>
            </div>
            {getApiKey() && (
              <button className="btn btn-outline" style={{ marginTop: 8, fontSize: '0.8rem', padding: '4px 12px' }}
                onClick={() => setShowKey(false)}>
                Cancel — use saved key
              </button>
            )}
          </div>
        )}

        {/* API key indicator */}
        {!showKey && apiKey && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>✅ Gemini API key saved</span>
            <button className="btn btn-outline" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              onClick={() => setShowKey(true)}>
              Change key
            </button>
          </div>
        )}

        {/* Examples */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Try an example:</div>
          <div className="filter-bar">
            {EXAMPLE_ERRORS.map(ex => (
              <button key={ex} className="filter-btn"
                style={{ fontSize: '0.78rem' }}
                onClick={() => { setQuery(ex); setDone(false); setAiAnswer(''); setKbResults([]); }}>
                {ex.slice(0, 40)}{ex.length > 40 ? '…' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <textarea
          value={query}
          onChange={e => { setQuery(e.target.value); setDone(false); }}
          placeholder="Paste your error message or describe the problem...\n\nExample: java.lang.NullPointerException at UserService.java:42"
          style={{
            width: '100%', minHeight: 130,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
            fontFamily: 'inherit', fontSize: '0.92rem',
            color: 'var(--text-primary)', resize: 'vertical', outline: 'none',
            lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 12
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button className="btn btn-primary" onClick={analyze}
            disabled={loading || !query.trim()}
            style={{ padding: '12px 28px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #7c3aed, var(--accent))' }}>
            {loading ? '🤖 Analyzing...' : '🤖 AI Diagnose'}
          </button>
          {query && (
            <button className="btn btn-outline" onClick={() => { setQuery(''); setAiAnswer(''); setKbResults([]); setDone(false); }}>
              Clear
            </button>
          )}
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

        {/* Loading */}
        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: 32, marginBottom: 20 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8, animation: 'spin 1s linear infinite', display: 'inline-block' }}>🤖</div>
            <div style={{ fontWeight: 600 }}>Gemini is analyzing your error...</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Also searching knowledge base</div>
          </div>
        )}

        {/* AI Answer */}
        {done && aiAnswer && (
          <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <span style={{ fontWeight: 700 }}>Gemini AI Diagnosis</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>gemini-2.0-flash / gemini-pro</span>
            </div>
            <div style={{ lineHeight: 1.7 }}>
              {formatAIResponse(aiAnswer)}
            </div>
          </div>
        )}

        {/* KB Results */}
        {done && kbResults.length > 0 && (
          <div>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                📚 Related fixes in Knowledge Base
              </h2>
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
          </div>
        )}
      </div>
    </div>
  );
}
