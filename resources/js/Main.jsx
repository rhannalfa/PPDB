import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { setAuthToken } from './bootstrap';
import Nav from './components/Nav';
import AuthForm from './components/AuthForm';
import RegistrationForm from './components/RegistrationForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/AdminDashboard';

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Selamat datang di PPDB SKYE</h1>
      <p>Gunakan navigasi untuk masuk atau mendaftar.</p>
    </div>
  );
}

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

function RegisterPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <RegisterForm />
    </div>
  );
}

function PendaftaranPage({ token }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Pendaftaran</h2>
      <RegistrationForm token={token} />
    </div>
  );
}

function AppWrapper() {
  const [token, setToken] = useState(() => localStorage.getItem('ppdb_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem('ppdb_token', token);

      // fetch current user
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
    // attempt server logout
    try {
      window.axios.post('/api/auth/logout');
    } catch (e) {}
    setToken(null);
  }

  return (
    <BrowserRouter>
      <Nav token={token} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pendaftaran" element={token ? <PendaftaranPage token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('app')).render(<AppWrapper />);
