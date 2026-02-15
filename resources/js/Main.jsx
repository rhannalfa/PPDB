import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { setAuthToken } from './bootstrap';

import Landing from './components/Landing';
import Welcome from './components/welcome';
import AuthForm from './components/AuthForm';
import RegistrationForm from './components/RegistrationForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/AdminDashboard';
import Nav from './components/Nav';



/* ================= LOGIN PAGE ================= */
function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  function handleLoginAndRedirect(token) {
    onLogin(token);
    navigate('/pendaftaran');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <AuthForm onLogin={handleLoginAndRedirect} />
    </div>
  );
}


/* ================= REGISTER PAGE ================= */
function RegisterPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <RegisterForm />
    </div>
  );
}


/* ================= PENDAFTARAN PAGE ================= */
function PendaftaranPage({ token }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Pendaftaran</h2>
      <RegistrationForm token={token} />
    </div>
  );
}


/* ================= APP CONTENT (NAV CONTROL HERE) ================= */
function AppContent({ token, user, handleLogin, handleLogout }) {
  const location = useLocation();

  // Halaman TANPA navbar
  const hideNavRoutes = ['/', '/welcome'];

  return (
    <>
      {!hideNavRoutes.includes(location.pathname) && (
        <Nav token={token} user={user} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/pendaftaran"
          element={
            token
              ? <PendaftaranPage token={token} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin"
          element={
            token && user?.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}


/* ================= MAIN WRAPPER ================= */
function AppWrapper() {
  const [token, setToken] = useState(() => localStorage.getItem('ppdb_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem('ppdb_token', token);

      (async () => {
        try {
          const res = await window.axios.get('/api/auth/me');
          setUser(res.data.user || null);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          setUser(null);
        }
      })();
    } else {
      setAuthToken(null);
      localStorage.removeItem('ppdb_token');
      setUser(null);
    }
  }, [token]);

  function handleLogin(t) {
    setToken(t);
  }

  function handleLogout() {
    try {
      window.axios.post('/api/auth/logout');
    } catch (e) {}
    setToken(null);
  }

  return (
    <BrowserRouter>
      <AppContent
        token={token}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}


/* ================= RENDER ================= */
createRoot(document.getElementById('app')).render(<AppWrapper />);
