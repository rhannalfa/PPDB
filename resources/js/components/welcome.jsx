import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-bg relative px-4">

      {/* Wrapper layer */}
      <div className="relative z-10 min-h-screen">

        {/* Tombol Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white font-semibold hover:underline z-30"
        >
          ← Kembali
        </button>

        {/* Center Content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-[#9fb0ba] rounded-[40px] p-16 text-center max-w-4xl w-full shadow-xl">
            <h2 className="text-4xl font-bold mb-6">
              SELAMAT DATANG
            </h2>

            <img
              src="/skye-nobg.png"
              alt="logo"
              className="mx-auto h-24 mb-6"
            />

            <p className="text-gray-800 mb-10 text-lg leading-relaxed">
              Ikuti tahapan proses pendaftaran dengan teliti dan sesuai dengan data kamu ya! 🌟
            </p>

            <div className="flex justify-center gap-8 flex-wrap">
              <Link to="/login" className="glow-button-outline">
                LOGIN
              </Link>

              <Link to="/register" className="glow-button-outline">
                REGISTER
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
