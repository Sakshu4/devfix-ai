import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import SearchErrors from './pages/SearchErrors';
import ErrorDetail  from './pages/ErrorDetail';
import Technologies from './pages/Technologies';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<Home />}         />
          <Route path="/search"       element={<SearchErrors />} />
          <Route path="/errors/:id"   element={<ErrorDetail />}  />
          <Route path="/technologies" element={<Technologies />} />
          {/* 404 fallback */}
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
  );
}
