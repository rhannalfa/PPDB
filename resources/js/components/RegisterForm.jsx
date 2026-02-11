import React, { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    try {
      // Get CSRF cookie for Sanctum
      await window.axios.get('/sanctum/csrf-cookie');

      const res = await window.axios.post('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert('Registrasi berhasil. Silakan login.');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        const first = Object.values(errors).flat()[0];
        alert(first || 'Validasi gagal');
      } else {
        alert(err.response?.data?.message || 'Register gagal');
      }
    }
  }

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 420 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Nama</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Confirm Password</label>
        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
