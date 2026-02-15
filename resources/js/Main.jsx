import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import { setAuthToken } from './bootstrap';
import Landing from './components/Landing';
import Welcome from './components/welcome';
import AuthForm from './components/AuthForm';
import RegistrationForm from './components/RegistrationForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/AdminDashboard';
import Nav from './components/Nav';

/* ================= PAYMENT PAGE (HALAMAN BARU) ================= */
function PaymentPage() {
  const { noReg } = useParams();
  const [pendaftar, setPendaftar] = useState(null);

  useEffect(() => {
    // Ambil data pendaftar berdasarkan No Pendaftaran
    window.axios.get(`/api/pendaftaran/cek/${noReg}`)
      .then(res => setPendaftar(res.data.data))
      .catch(err => console.error("Data tidak ditemukan", err));
  }, [noReg]);

  const handlePay = () => {
    if (pendaftar && pendaftar.snap_token) {
      window.snap.pay(pendaftar.snap_token, {
        onSuccess: () => window.location.reload(),
        onClose: () => alert("Selesaikan pembayaranmu nanti di halaman ini.")
      });
    }
  };

  if (!pendaftar) return <div style={{ padding: 40, textAlign: 'center' }}>Memuat data pendaftaran...</div>;

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Halo, {pendaftar.nama}</h2>
      <p>Nomor Pendaftaran: <strong>{noReg}</strong></p>
      <p>Biaya: <strong>Rp500.000</strong></p>
      
      <div style={{ marginTop: 20 }}>
        {pendaftar.status_pembayaran === 'success' ? (
          <button style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: 5 }}>
            Cetak Kartu Ujian
          </button>
        ) : (
          <button onClick={handlePay} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: 5 }}>
            Bayar Sekarang
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= LOGIN PAGE ================= */
function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  function handleLoginAndRedirect(token) {
    onLogin(token);
    navigate('/pendaftaran');
  }

  return <AuthForm onLogin={handleLoginAndRedirect} />;
}

/* ================= REGISTER PAGE ================= */
function RegisterPage() {
  return <RegisterForm />;
}

/* ================= PENDAFTARAN PAGE ================= */
function PendaftaranPage({ token }) {
  return (
    <div style={{ padding: 20 }}>
      <RegistrationForm token={token} />
    </div>
  );
}

/* ================= APP CONTENT ================= */
function AppContent({ token, user, handleLogin, handleLogout }) {
  const location = useLocation();

  // HALAMAN TANPA NAVBAR - Disesuaikan agar halaman bayar juga bisa tanpa nav
  const hideNavRoutes = ['/', '/welcome', '/login', '/register'];

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

        {/* HALAMAN PEMBAYARAN */}
        <Route path="/pembayaran/:noReg" element={<PaymentPage />} />

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