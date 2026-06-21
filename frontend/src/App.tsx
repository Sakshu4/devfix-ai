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
            <Route path="/search"       element={<SearchErrors />}     />
            <Route path="/errors/:id"   element={<ErrorDetail />}      />
            <Route path="/technologies" element={<Technologies />}     />
            <Route path="/guide/:id"    element={<InstallGuide />}     />

            {/* ── Tools (no login required) ── */}
            <Route path="/analyze"      element={<ErrorLogAnalyzer />}   />
            <Route path="/screenshot"   element={<ScreenshotAnalyzer />} />
            <Route path="/scanner"      element={<SystemScanner />}      />
            <Route path="/ai"           element={<AITroubleshooter />}   />
            <Route path="/readiness"    element={<ReadinessChecker />}   />
            <Route path="/profile"      element={<DeveloperProfile />}   />
            <Route path="/roadmap"      element={<Roadmap />}            />

            {/* ── Auth pages ── */}
            <Route path="/login"        element={<Login />}    />
            <Route path="/register"     element={<Register />} />

            {/* ── User pages ── */}
            <Route path="/dashboard"    element={<Dashboard />} />

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
