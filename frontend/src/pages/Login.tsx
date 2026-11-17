import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.username, form.password);
      navigate(redirect);
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error;
      const fallback = err?.message || 'Login failed. Check your credentials.';
      setError(serverMsg || fallback);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="logo-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', margin: '0 auto 12px', borderRadius: 12 }}>⚡</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Sign in to your DevFix AI account
          </p>
        </div>

        {/* Redirect notice if arrived from a protected action */}
        {redirect !== '/dashboard' && (
          <div style={{
            marginBottom: 20,
            padding: '10px 14px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            borderRadius: 8,
            fontSize: '0.84rem',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 500,
          }}>
            <span>🔒</span>
            <span>Sign in to access this feature and perform diagnostics.</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="auth-error">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input id="login-username" className="form-input" type="text" placeholder="your username"
              value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="login-password" className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required />
          </div>
          <button id="login-submit" className="btn btn-primary" type="submit"
            disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}>
            {loading ? 'Signing in...' : '→ Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to={`/register${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}
