import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
     <div className="min-h-screen animated-bg flex items-center justify-center px-4">

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="bg-gray-200 rounded-2xl px-8 py-4 mb-12 flex items-center gap-4 shadow-lg">
          <img src="/logo-skye.jpeg" alt="logo" className="h-10" />
          <h1 className="font-semibold tracking-wide text-gray-900">
            SKYE DIGIPRENEUR SCHOOL
          </h1>
        </div>

        {/* MAIN SECTION */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT BOX */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-200 rounded-3xl p-12 shadow-xl flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              PORTAL PENERIMAAN <br />
              PESERTA DIDIK BARU (PPDB)
            </h2>

            <p className="font-semibold mb-6 text-gray-800">
              SKYE DIGIPRENEUR SCHOOL
            </p>

            <p className="text-sm text-gray-700 leading-relaxed">
              Mulai perjalanan masa depanmu bersama SKYE Digipreneur School 🚀
              Kembangkan potensi, kuasai teknologi, dan bangun jiwa entrepreneur
              sejak dini. Daftar sekarang dan jadilah generasi kreatif, inovatif,
              dan siap bersaing di era digital.
            </p>
          </motion.div>

          {/* RIGHT BOX */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-center"
          >
            <img
              src="/ppdb.png"
              alt="ppdb"
              className="rounded-2xl w-full mb-6"
            />

            <Link
              to="/welcome"
              className="bg-gray-900 text-white text-center py-4 rounded-full font-semibold hover:bg-black transition w-full"
            >
              DAFTAR DI SINI
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
