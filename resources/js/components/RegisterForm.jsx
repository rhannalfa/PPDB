import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⭐ AUTO HIDE ERROR
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ⭐ AUTO REDIRECT SUCCESS
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleRegister(e) {
    e.preventDefault();

    setError("");

    // ⭐ VALIDASI WAJIB ISI
    if (!name || !email || !password || !passwordConfirmation) {
      setError("Semua field wajib diisi");
      return;
    }

    // ⭐ VALIDASI PASSWORD CONFIRM
    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      await window.axios.get("/sanctum/csrf-cookie");

      await window.axios.post("/api/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Registrasi berhasil");

    } catch (err) {

      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        const first = Object.values(errors).flat()[0];
        setError(first || "Validasi gagal");
      } else {
        setError(err.response?.data?.message || "Register gagal");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="min-h-screen animated-bg relative">

    <div className="relative z-50 min-h-screen flex items-center justify-center px-4">

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white font-semibold hover:underline"
      >
        ← Kembali
      </button>

      <div className="relative w-full max-w-sm">

        <div className="bg-[#9fb0ba] rounded-[30px] pt-14 pb-8 px-8 shadow-xl relative">

          <h2 className="text-center text-lg font-semibold mb-6 tracking-wide">
            REGISTER
          </h2>

          {/* ⭐ ERROR NOTIF */}
          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {/* ⭐ SUCCESS NOTIF */}
          {success && (
            <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg animate-fadeIn">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="block mb-1 text-black text-sm">NAMA</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full bg-gray-700 text-white text-sm font-semibold hover:bg-gray-900 transition flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Memproses...
                  </>
                ) : (
                  "DAFTAR"
                )}
              </button>
            </div>

          </form>
        </div>

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#b7c6cf] w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
          <img src="/skye-nobg.png" alt="logo" className="w-10" />
        </div>

      </div>
    </div>
  </div>
);
}
