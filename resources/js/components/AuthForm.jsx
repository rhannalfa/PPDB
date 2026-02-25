import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // ⭐ AUTO HIDE SUCCESS
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onLogin(success);
      }, 1200); 
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      setSuccess(res.data.token); 

    } catch (err) {

      const message = err.response?.data?.message?.toLowerCase() || "";

      if (message.includes("email")) {
        setError("Email tidak ditemukan");
      } else if (message.includes("password")) {
        setError("Password salah");
      } else {
        setError("Login gagal, coba lagi");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="min-h-screen animated-bg relative px-4">
  <div className="relative z-10 flex items-center justify-center min-h-screen">

    <button
      onClick={() => navigate(-1)}
      className="absolute top-6 left-6 text-white font-semibold hover:underline z-30"
    >
      ← Kembali
    </button>

    <div className="relative w-full max-w-sm">

      <div className="bg-[#9fb0ba] rounded-[30px] pt-14 pb-8 px-8 shadow-xl relative">

        <h2 className="text-center text-2xl font-semibold mb-10 tracking-wider">
          LOGIN
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
            ✅ Login berhasil...
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 tracking-wide text-black">
              EMAIL:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 tracking-wide text-black">
              PASSWORD:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Memproses...
                </>
              ) : (
                "MASUK"
              )}
            </button>
          </div>

        </form>

      </div>

      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#b7c6cf] w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-20">
        <img src="/skye-nobg.png" alt="logo" className="w-10" />
      </div>

    </div>
  </div>
</div>
);
}
