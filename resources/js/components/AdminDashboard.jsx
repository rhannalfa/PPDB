import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [pendaftars, setPendaftars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.axios.get('/api/pendaftars?all=1');
        setPendaftars(res.data.data || res.data || []);
      } catch (err) {
        alert('Gagal memuat pendaftar: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function updateStatus(id, action) {
    if (!confirm(`Anda yakin ingin ${action} pendaftar ini?`)) return;

    try {
      setPendaftars((prev) => prev.map(p => p.id === id ? { ...p, status: action === 'approve' ? 'approved' : 'rejected' } : p));

      await window.axios.post(`/api/pendaftars/${id}/${action}`);

      const res = await window.axios.get(`/api/pendaftars/${id}`);
      setPendaftars((prev) => prev.map(p => p.id === id ? (res.data.data || res.data) : p));
    } catch (err) {
      alert('Gagal memperbarui status: ' + (err.response?.data?.message || err.message));
      try {
        const res = await window.axios.get('/api/pendaftars?all=1');
        setPendaftars(res.data.data || res.data || []);
      } catch (_) {}
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Pendaftar ({pendaftars.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>No</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Nama</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Jenjang</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Jurusan</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>No Pendaftaran</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendaftars.map((p, idx) => (
                <tr key={p.id}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.nama || p.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.jenjang?.nama || p.jenjang?.name || p.jenjang_name || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.jurusan?.nama || p.jurusan?.name || p.jurusan_name || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.no_pendaftaran}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.status || p.status_pendaftaran || 'pending'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>
                    <button onClick={() => updateStatus(p.id, 'approve')} disabled={(p.status || p.status_pendaftaran) === 'approved'} style={{ marginRight: 6 }}>Approve</button>
                    <button onClick={() => updateStatus(p.id, 'reject')} disabled={(p.status || p.status_pendaftaran) === 'rejected'}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
