import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });
      onLogin(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
  <div className="min-h-screen animated-bg relative px-4">

  <div className="relative z-10 flex items-center justify-center min-h-screen">

    {/* Tombol Kembali */}
    <button
      onClick={() => navigate(-1)}
      className="absolute top-6 left-6 text-white font-semibold hover:underline z-30"
    >
      ← Kembali
    </button>

    {/* WRAPPER UTAMA */}
    <div className="relative w-full max-w-sm">

      {/* CARD */}
      <div className="bg-[#9fb0ba] rounded-[30px] pt-14 pb-8 px-8 shadow-xl relative">

        <h2 className="text-center text-2xl font-semibold mb-10 tracking-wider">
          LOGIN
        </h2>

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
              className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-800 transition"
            >
              MASUK
            </button>
          </div>
        </form>

      </div>

      {/* LOGO NGAMBANG */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#b7c6cf] w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-20">
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
