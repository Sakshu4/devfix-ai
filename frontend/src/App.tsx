import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }      from './api/AuthContext';
import Navbar                from './components/Navbar';
import Home                  from './pages/Home';
import SearchErrors          from './pages/SearchErrors';
import ErrorDetail           from './pages/ErrorDetail';
import Technologies          from './pages/Technologies';
import InstallGuide          from './pages/InstallGuide';
import Login                 from './pages/Login';
import Register              from './pages/Register';
import Dashboard             from './pages/Dashboard';
import DeveloperProfile      from './pages/DeveloperProfile';
import Roadmap               from './pages/Roadmap';
import ReadinessChecker      from './pages/ReadinessChecker';
import ErrorLogAnalyzer      from './pages/ErrorLogAnalyzer';
import ScreenshotAnalyzer    from './pages/ScreenshotAnalyzer';
import SystemScanner         from './pages/SystemScanner';
import AITroubleshooter      from './pages/AITroubleshooter';
import ProtectedRoute        from './components/ProtectedRoute';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* ── Public pages ── */}
            <Route path="/"             element={<Home />}             />
            <Route path="/login"        element={<Login />}    />
            <Route path="/register"     element={<Register />} />

            {/* ── Protected Features ── */}
            <Route path="/search"       element={<ProtectedRoute><SearchErrors /></ProtectedRoute>}     />
            <Route path="/errors/:id"   element={<ProtectedRoute><ErrorDetail /></ProtectedRoute>}      />
            <Route path="/technologies" element={<ProtectedRoute><Technologies /></ProtectedRoute>}     />
            <Route path="/guide/:id"    element={<ProtectedRoute><InstallGuide /></ProtectedRoute>}     />

            <Route path="/analyze"      element={<ProtectedRoute><ErrorLogAnalyzer /></ProtectedRoute>}   />
            <Route path="/screenshot"   element={<ProtectedRoute><ScreenshotAnalyzer /></ProtectedRoute>} />
            <Route path="/scanner"      element={<ProtectedRoute><SystemScanner /></ProtectedRoute>}      />
            <Route path="/ai"           element={<ProtectedRoute><AITroubleshooter /></ProtectedRoute>}   />
            <Route path="/readiness"    element={<ProtectedRoute><ReadinessChecker /></ProtectedRoute>}   />
            <Route path="/profile"      element={<ProtectedRoute><DeveloperProfile /></ProtectedRoute>}   />
            <Route path="/roadmap"      element={<ProtectedRoute><Roadmap /></ProtectedRoute>}            />

            <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* ── 404 ── */}
            <Route path="*" element={
              <div className="state-center" style={{ marginTop: 100 }}>
                <div className="state-icon">🔍</div>
                <div className="state-title">Page not found</div>
                <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</a>
              </div>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
