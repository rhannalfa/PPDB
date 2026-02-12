import React, { useState, useEffect } from 'react';
// Menggunakan shared window.axios dari bootstrap.js
const axios = window.axios;

export default function RegistrationForm({ token }) {
  const [nama, setNama] = useState('');
  const [jenjang_id, setJenjangId] = useState('');
  const [jurusan_id, setJurusanId] = useState('');
  const [alamat, setAlamat] = useState('');

  const [jenjangs, setJenjangs] = useState([]);
  const [jurusans, setJurusans] = useState([]);
  const [fallbackJenjangs, setFallbackJenjangs] = useState(false);

  // useEffect 1: Load Jenjangs dengan Token Header
  useEffect(() => {
    (async () => {
      try {
        // Konfigurasi Header untuk Authorization
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get('/api/jenjangs', config);
        
        const list = res.data.data || res.data || [];
        
        if (!list || list.length === 0) {
          // Fallback jika data di server kosong
          setJenjangs([
            { id: 'SMP', name: 'SMP', fallback: true },
            { id: 'SMK', name: 'SMK', fallback: true },
          ]);
          setFallbackJenjangs(true);
        } else {
          setJenjangs(list.map(j => ({ id: j.id, name: j.name })));
          setFallbackJenjangs(false);
        }
      } catch (err) {
        console.error('Gagal memuat jenjangs', err);
        // Tetap gunakan fallback jika API error (401/403/500)
        setJenjangs([
          { id: 'SMP', name: 'SMP', fallback: true },
          { id: 'SMK', name: 'SMK', fallback: true },
        ]);
        setFallbackJenjangs(true);
      }
    })();
  }, [token]); // Menambahkan token sebagai dependency

  // useEffect 2: Logic Filter Jurusan (Tetap sama)
  useEffect(() => {
    const selected = jenjangs.find(j => String(j.id) === String(jenjang_id));
    const isSmk = selected && String((selected.name || '').toLowerCase()) === 'smk' || String(jenjang_id).toLowerCase() === 'smk';

    console.log('RegistrationForm: selected jenjang', { jenjang_id, selected, isSmk, fallbackJenjangs });

    if (isSmk) {
      (async () => {
        try {
          if (fallbackJenjangs) {
            setJurusans([
              { id: '1-fallback', name: 'Pengembangan Perangkat Lunak dan Game' },
              { id: '2-fallback', name: 'Bisnis Retail' },
            ]);
            return;
          }

          const res = await axios.get('/api/jurusans');
          const list = res.data.data || res.data || [];
          const filtered = list.filter(x => (x.jenjang || '').toLowerCase() === 'smk');
          setJurusans(filtered);
        } catch (err) {
          console.error('Gagal memuat jurusans', err);
          setJurusans([
            { id: '1-fallback', name: 'Pengembangan Perangkat Lunak dan Game' },
            { id: '2-fallback', name: 'Bisnis Retail' },
          ]);
        }
      })();
    } else {
      setJurusans([]);
      setJurusanId('');
    }
  }, [jenjang_id, jenjangs, fallbackJenjangs]);

  // Handle Submit (Tetap sama)
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let payloadJenjangId = jenjang_id;

      if (fallbackJenjangs) {
        try {
          const res = await axios.get('/api/jenjangs');
          const live = res.data.data || res.data || [];
          const match = live.find(j => String(j.name).toLowerCase() === String(jenjang_id).toLowerCase());
          if (match) {
            payloadJenjangId = match.id;
          } else {
            alert('Data jenjang belum tersedia di server. Jalankan seeder (JenjangSeeder).');
            return;
          }
        } catch (err) {
          alert('Gagal mengambil data jenjang dari server. Silakan seed database.');
          return;
        }
      }

      const payload = { nama, jenjang_id: payloadJenjangId, jurusan_id: jurusan_id || null, alamat };
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/pendaftaran', payload, { headers });
      
      alert('Pendaftaran berhasil: ' + (res.data.data?.no_pendaftaran || res.data.no_pendaftaran));
      
      setNama('');
      setJenjangId('');
      setJurusanId('');
      setAlamat('');
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
        <label>Jenjang</label>
        <select value={jenjang_id} onChange={(e) => setJenjangId(e.target.value)} required>
          <option value="">-- Pilih Jenjang --</option>
          {jenjangs.map(j => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </select>
        {fallbackJenjangs && (
          <div style={{ color: '#b45309', marginTop: 6 }}>Menampilkan opsi default — seed database untuk data resmi.</div>
        )}
      </div>

      {jurusans.length > 0 && (
        <div>
          <label>Jurusan</label>
          <select value={jurusan_id} onChange={(e) => setJurusanId(e.target.value)} required>
            <option value="">-- Pilih Jurusan --</option>
            {jurusans.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Alamat</label>
        <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} />
      </div>
      <button type="submit">Daftar</button>
    </form>
  );
}