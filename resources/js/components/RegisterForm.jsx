import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await window.axios.get("/sanctum/csrf-cookie");

      await window.axios.post("/api/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Registrasi berhasil. Silakan login.");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        const first = Object.values(errors).flat()[0];
        alert(first || "Validasi gagal");
      } else {
        alert(err.response?.data?.message || "Register gagal");
      }
    }
  }

  return (
  <div className="min-h-screen animated-bg relative">

    {/* LAYER KONTEN DI ATAS BACKGROUND */}
    <div className="relative z-50 min-h-screen flex items-center justify-center px-4">

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white font-semibold hover:underline"
      >
        ← Kembali
      </button>

      <div className="relative w-full max-w-sm">

        {/* CARD */}
        <div className="bg-[#9fb0ba] rounded-[30px] pt-14 pb-8 px-8 shadow-xl relative">

          <h2 className="text-center text-lg font-semibold mb-6 tracking-wide">
            REGISTER
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="block mb-1 text-black text-sm">NAMA</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-black text-sm">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gray-700 text-white text-sm font-semibold hover:bg-gray-900 transition"
              >
                DAFTAR
              </button>
            </div>

          </form>
        </div>

        {/* LOGO */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#b7c6cf] w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
          <img
            src="/skye-nobg.png"
            alt="logo"
            className="w-10"
          />
        </div>

      </div>
    </div>
  </div>
);
}
