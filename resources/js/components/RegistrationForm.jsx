import React, { useState, useEffect } from 'react';
const axios = window.axios;

export default function RegistrationForm({ token }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ekskulList, setEkskulList] = useState([]);
  const [jenjangs, setJenjangs] = useState([]);
  const [jurusans, setJurusans] = useState([]);

  const [formData, setFormData] = useState({
    nama: '', nik: '', nisn: '', jenis_kelamin: '', agama: '', tempat_lahir: '',
    tanggal_lahir: '', email: '', no_hp: '', asal_sekolah: '', 
    jenjang_id: '', jurusan_id: '', ekstrakurikuler_id: '',
    nama_ayah: '', nama_ibu: '', no_wa_ortu: '', email_ortu: '', 
    alamat: '', harapan: '' 
  });

  // --- 1. Load Data Master ---
  useEffect(() => {
    (async () => {
      try {
        const resJenjang = await axios.get('/api/jenjangs');
        setJenjangs(resJenjang.data.data || resJenjang.data || []);
        const resEkskul = await axios.get('/api/ekstrakurikulers');
        setEkskulList(resEkskul.data.data || resEkskul.data || []);
      } catch (err) { console.error("Gagal load data master", err); }
    })();
  }, []);

  // --- 2. Filter Jurusan (Khusus SMK) ---
  useEffect(() => {
    const selected = jenjangs.find(j => String(j.id) === String(formData.jenjang_id));
    const isSmk = selected && (String(selected.name || selected.nama || '').toLowerCase()) === 'smk';

    if (isSmk) {
      (async () => {
        try {
          const res = await axios.get('/api/jurusans');
          const list = res.data.data || res.data || [];
          setJurusans(list.filter(x => (x.jenjang || '').toLowerCase() === 'smk'));
        } catch (err) { console.error(err); }
      })();
    } else {
      setJurusans([]);
      setFormData(prev => ({ ...prev, jurusan_id: '' }));
    }
  }, [formData.jenjang_id, jenjangs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'nik' && value.length > 16) || (name === 'nisn' && value.length > 10)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. Handle Submit + Midtrans Payment ---
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Kirim data ke backend
      const response = await axios.post('/api/pendaftaran', formData, { headers });
      
      // Ambil snap_token dari response Laravel
      const snapToken = response.data.snap_token; 

      if (snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function(result) {
            alert('Pembayaran Berhasil! Silakan lanjut ke pemberkasan.');
            window.location.href = "/pemberkasan"; 
          },
          onPending: function(result) {
            alert('Selesaikan pembayaran Anda segera untuk aktivasi akun.');
            window.location.reload();
          },
          onError: function() { alert('Pembayaran gagal.'); },
          onClose: function() { alert('Segera selesaikan pembayaran untuk memproses pendaftaran.'); }
        });
      } else {
        alert('Pendaftaran Berhasil!');
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally { setLoading(false); }
  }

  // --- UI/UX STYLES ---
  const styles = {
    body: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: "sans-serif" },
    card: { backgroundColor: '#ffffff', width: '100%', maxWidth: '850px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden' },
    header: { padding: '40px', background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)', color: '#fff', textAlign: 'center' },
    content: { padding: '40px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#444' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
    footer: { padding: '20px 40px 40px', display: 'flex', justifyContent: 'space-between' },
    btnPrimary: { padding: '12px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#4a90e2', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
    btnSubmit: { padding: '12px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#2ecc71', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={{ margin: 0 }}>PPDB Online Skye</h1>
          <p>Langkah {step} dari 3: {step === 1 ? 'Data Pribadi' : step === 2 ? 'Akademik' : 'Keluarga & Bayar'}</p>
        </div>

        <div style={styles.content}>
          <form onSubmit={handleSubmit}>
            {/* STEP 1: IDENTITAS LENGKAP */}
            {step === 1 && (
              <div style={styles.formGrid}>
                <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Nama Lengkap</label>
                  <input name="nama" style={{ ...styles.input, width: '100%' }} value={formData.nama} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>NIK</label>
                  <input name="nik" type="number" style={styles.input} value={formData.nik} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>NISN</label>
                  <input name="nisn" type="number" style={styles.input} value={formData.nisn} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Jenis Kelamin</label>
                  <select name="jenis_kelamin" style={styles.input} value={formData.jenis_kelamin} onChange={handleChange} required>
                    <option value="">Pilih</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Agama</label>
                  <select name="agama" style={styles.input} value={formData.agama} onChange={handleChange} required>
                    <option value="">Pilih</option><option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Hindu">Hindu</option>
                  </select>
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Tempat Lahir</label>
                  <input name="tempat_lahir" style={styles.input} value={formData.tempat_lahir} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Tanggal Lahir</label>
                  <input name="tanggal_lahir" type="date" style={styles.input} value={formData.tanggal_lahir} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Email Siswa</label>
                  <input name="email" type="email" style={styles.input} value={formData.email} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>No. HP Siswa</label>
                  <input name="no_hp" type="number" style={styles.input} value={formData.no_hp} onChange={handleChange} required />
                </div>
              </div>
            )}

            {/* STEP 2: AKADEMIK & MINAT */}
            {step === 2 && (
              <div style={styles.formGrid}>
                <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Asal Sekolah</label>
                  <input name="asal_sekolah" style={{ ...styles.input, width: '100%' }} value={formData.asal_sekolah} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Jenjang Tujuan</label>
                  <select name="jenjang_id" style={styles.input} value={formData.jenjang_id} onChange={handleChange} required>
                    <option value="">Pilih</option>
                    {jenjangs.map(j => <option key={j.id} value={j.id}>{j.name || j.nama}</option>)}
                  </select>
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Ekstrakurikuler</label>
                  <select name="ekstrakurikuler_id" style={styles.input} value={formData.ekstrakurikuler_id} onChange={handleChange} required>
                    <option value="">Pilih</option>
                    {ekskulList.map(e => <option key={e.id} value={e.id}>{e.nama_ekskul}</option>)}
                  </select>
                </div>
                {jurusans.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Jurusan (Khusus SMK)</label>
                    <select name="jurusan_id" style={{ ...styles.input, width: '100%' }} value={formData.jurusan_id} onChange={handleChange} required>
                      <option value="">Pilih Jurusan</option>
                      {jurusans.map(j => <option key={j.id} value={j.id}>{j.name || j.nama}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: KELUARGA & HARAPAN */}
            {step === 3 && (
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label style={styles.label}>Nama Ayah</label>
                  <input name="nama_ayah" style={styles.input} value={formData.nama_ayah} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Nama Ibu</label>
                  <input name="nama_ibu" style={styles.input} value={formData.nama_ibu} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>WA Orang Tua</label>
                  <input name="no_wa_ortu" type="number" style={styles.input} value={formData.no_wa_ortu} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}><label style={styles.label}>Email Orang Tua</label>
                  <input name="email_ortu" type="email" style={styles.input} value={formData.email_ortu} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Alamat Domisili</label>
                  <textarea name="alamat" style={{ ...styles.input, width: '100%', height: '80px' }} value={formData.alamat} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Harapan Masuk Sekolah Ini</label>
                  <textarea name="harapan" style={{ ...styles.input, width: '100%', height: '60px' }} value={formData.harapan} onChange={handleChange} required />
                </div>
              </div>
            )}

            <div style={styles.footer}>
              {step > 1 && <button type="button" onClick={() => setStep(step - 1)} style={{ ...styles.btnPrimary, backgroundColor: '#666' }}>Kembali</button>}
              <div style={{ flexGrow: 1 }}></div>
              {step < 3 ? (
                <button type="button" onClick={() => setStep(step + 1)} style={styles.btnPrimary}>Lanjut</button>
              ) : (
                <button type="submit" disabled={loading} style={styles.btnSubmit}>
                  {loading ? 'Memproses...' : 'Kirim & Bayar'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}