import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">

      <div className="glass-card p-14 text-center max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-6">
          SELAMAT DATANG
        </h2>

        <img
          src="/logo-skye.jpeg"
          alt="logo"
          className="mx-auto h-24 mb-6"
        />

        <p className="text-gray-800 mb-8">
          Ikuti tahapan proses pendaftaran dengan teliti dan sesuai dengan data kamu ya! 🌟
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/login" className="glow-button-outline">
            LOGIN
          </Link>

          <Link to="/register" className="glow-button-outline">
            REGISTER
          </Link>
        </div>
      </div>

    </div>
  );
}
