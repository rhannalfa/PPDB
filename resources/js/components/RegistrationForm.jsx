import React, { useState } from 'react';
import axios from 'axios';

export default function RegistrationForm({ token }) {
  const [nama, setNama] = useState('');
  const [jenjang_id, setJenjangId] = useState('');
  const [jurusan_id, setJurusanId] = useState('');
  const [alamat, setAlamat] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { nama, jenjang_id, jurusan_id, alamat };
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/pendaftaran', payload, { headers });
      alert('Pendaftaran berhasil: ' + res.data.data.no_pendaftaran);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nama</label>
        <input value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div>
        <label>Jenjang (id)</label>
        <input value={jenjang_id} onChange={(e) => setJenjangId(e.target.value)} required />
      </div>
      <div>
        <label>Jurusan (id)</label>
        <input value={jurusan_id} onChange={(e) => setJurusanId(e.target.value)} />
      </div>
      <div>
        <label>Alamat</label>
        <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} />
      </div>
      <button type="submit">Daftar</button>
    </form>
  );
}
