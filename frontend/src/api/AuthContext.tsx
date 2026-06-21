import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './axios';

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthUser { username: string; role: string; }

interface AuthContextType {
  user:      AuthUser | null;
  token:     string | null;
  isLoading: boolean;
  login:    (username: string, password: string)                   => Promise<void>;
  register: (username: string, email: string, password: string)   => Promise<void>;
  logout:   ()                                                     => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem('devfix_token');
    const savedUser = localStorage.getItem('devfix_user');
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
    }
    setIsLoading(false);
  }, []);

  const saveSession = (tok: string, usr: AuthUser) => {
    localStorage.setItem('devfix_token', tok);
    localStorage.setItem('devfix_user', JSON.stringify(usr));
    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    setToken(tok);
    setUser(usr);
  };

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: tok, username: uname, role } = res.data;
    saveSession(tok, { username: uname, role });
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { username, email, password });
    const { token: tok, username: uname, role } = res.data;
    saveSession(tok, { username: uname, role });
  };

  const logout = () => {
    localStorage.removeItem('devfix_token');
    localStorage.removeItem('devfix_user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
