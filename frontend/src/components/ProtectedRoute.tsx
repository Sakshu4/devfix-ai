import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="state-center"><div className="spinner" /></div>;
  }

  if (!user) {
    const target = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${target}`} replace />;
  }

  return <>{children}</>;
}
