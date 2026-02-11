import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav({ token, user, onLogout }) {
  return (
    <header style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 24px' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, background: '#FF2D20', borderRadius: 6 }} />
          <strong>PPDB SKYE</strong>
        </div>
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/">Home</Link>
          {token ? (
            <>
              <Link to="/pendaftaran">Pendaftaran</Link>
              {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
