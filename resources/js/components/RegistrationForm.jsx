import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const axios = window.axios;

export default function RegistrationForm({ token }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0 = pilih jenjang
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [ekskulList, setEkskulList] = useState([]);
  const [jenjangs, setJenjangs] = useState([]);
  const [jurusans, setJurusans] = useState([]);

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    nisn: "",
    jenis_kelamin: "",
    agama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    asal_sekolah: "",
    jenjang_id: "",
    jurusan_id: "",
    ekstrakurikuler_id: "",
    nama_ayah: "",
    nama_ibu: "",
    no_wa_ortu: "",
    email_ortu: "",
  });

  // AUTO HIDE ERROR
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // LOAD MASTER DATA
  useEffect(() => {
    (async () => {
      try {
        const resJenjang = await axios.get("/api/jenjangs");
        setJenjangs(resJenjang.data.data || resJenjang.data || []);

        const resEkskul = await axios.get("/api/ekstrakurikulers");
        setEkskulList(resEkskul.data.data || resEkskul.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // FILTER JURUSAN SMK
  useEffect(() => {
    const selected = jenjangs.find(
      (j) => String(j.id) === String(formData.jenjang_id)
    );

    const isSmk =
      selected && String(selected.name || selected.nama || "").toLowerCase() === "smk";

    if (isSmk) {
      (async () => {
        try {
          const res = await axios.get("/api/jurusans");
          const list = res.data.data || res.data || [];
          setJurusans(
            list.filter(
              (x) => String(x.jenjang || "").toLowerCase() === "smk"
            )
          );
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      setJurusans([]);
      setFormData((prev) => ({ ...prev, jurusan_id: "" }));
    }
  }, [formData.jenjang_id, jenjangs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // VALIDASI PER STEP
  const validateStep = () => {
    if (step === 1) {
      if (
        !formData.nama ||
        !formData.nik ||
        !formData.nisn ||
        !formData.asal_sekolah ||
        !formData.tempat_lahir ||
        !formData.tanggal_lahir ||
        !formData.agama ||
        !formData.jenis_kelamin
      ) {
        setError("Semua field data diri wajib diisi");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.ekstrakurikuler_id) {
        setError("Pilih ekstrakurikuler terlebih dahulu");
        return false;
      }
    }

    if (step === 3) {
      if (
        !formData.nama_ayah ||
        !formData.nama_ibu ||
        !formData.no_wa_ortu ||
        !formData.email_ortu
      ) {
        setError("Data orang tua wajib diisi lengkap");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.post("/api/pendaftaran", formData, headers);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 relative">

      {step > 0 && (
        <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white font-semibold hover:underline"
      >
        ← Kembali
      </button>
      )}

      <div className="bg-[#9fb0ba] w-full max-w-md rounded-[30px] p-8 shadow-xl max-h-[85vh] overflow-y-auto">

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 0 */}
        {step === 0 && (
          <>
            <h2 className="text-center font-semibold mb-6">
              PILIH JENJANG PENDAFTARAN
            </h2>

            <div className="flex flex-col gap-4">
              {jenjangs.map((j) => (
                <button
                  key={j.id}
                  onClick={() => {
                    setFormData({ ...formData, jenjang_id: j.id });
                    setStep(1);
                  }}
                  className="bg-gray-700 text-white py-3 rounded-full font-semibold hover:bg-gray-900"
                >
                  {j.name || j.nama}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 1 DATA DIRI */}
        {step === 1 && (
          <>
            <h2 className="text-center font-semibold mb-6">
              FORMULIR DATA DIRI <br /> 1/3
            </h2>

            <FormInput label="NAMA LENGKAP" name="nama" value={formData.nama} onChange={handleChange} />
            <FormInput label="NIK CALON SISWA" name="nik" value={formData.nik} onChange={handleChange} />
            <FormInput label="NISN CALON SISWA" name="nisn" value={formData.nisn} onChange={handleChange} />
            <FormInput label="ASAL SEKOLAH" name="asal_sekolah" value={formData.asal_sekolah} onChange={handleChange} />
            <FormInput label="TEMPAT LAHIR" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} />

            <div className="mb-4">
              <label className="block text-sm mb-1">TANGGAL LAHIR</label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-gray-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">AGAMA</label>
              <select
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-gray-200"
              >
                <option value="">Pilih Agama</option>
                <option>Islam</option>
                <option>Kristen</option>
                <option>Katolik</option>
                <option>Hindu</option>
                <option>Buddha</option>
                <option>Konghucu</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">JENIS KELAMIN</label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-gray-200"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={nextStep} className="btn-dark">
                LANJUT
              </button>
            </div>
          </>
        )}

        {/* STEP 2 AKADEMIK */}
        {step === 2 && (
          <>
            <h2 className="text-center font-semibold mb-6">
              FORMULIR AKADEMIK <br /> 2/3
            </h2>

            <select
              name="ekstrakurikuler_id"
              value={formData.ekstrakurikuler_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-gray-200 mb-4"
            >
              <option value="">Pilih Ekstrakurikuler</option>
              {ekskulList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nama || e.nama_ekskul}
                </option>
              ))}
            </select>

            {jurusans.length > 0 && (
              <select
                name="jurusan_id"
                value={formData.jurusan_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-gray-200"
              >
                <option value="">Pilih Jurusan</option>
                {jurusans.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name || j.nama}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end mt-4">
              <button onClick={nextStep} className="btn-dark">
                LANJUT
              </button>
            </div>
          </>
        )}

        {/* STEP 3 ORANG TUA */}
        {step === 3 && (
          <>
            <h2 className="text-center font-semibold mb-6">
              FORMULIR ORANG TUA <br /> 3/3
            </h2>

            <FormInput label="NAMA AYAH" name="nama_ayah" value={formData.nama_ayah} onChange={handleChange} />
            <FormInput label="NAMA IBU" name="nama_ibu" value={formData.nama_ibu} onChange={handleChange} />
            <FormInput label="NO. HP ORANG TUA" name="no_wa_ortu" value={formData.no_wa_ortu} onChange={handleChange} />
            <FormInput label="EMAIL ORANG TUA" name="email_ortu" value={formData.email_ortu} onChange={handleChange} />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-dark"
              >
                {loading ? "Menyimpan..." : "SIMPAN"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
      />
    </div>
  );
}
