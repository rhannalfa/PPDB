import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PaymentPage = () => {
    const { noReg } = useParams(); // Mengambil no_pendaftaran dari URL
    const [pendaftar, setPendaftar] = useState(null);

    useEffect(() => {
        // Ambil data dari Laravel berdasarkan no_pendaftaran
        window.axios.get(`/api/pendaftaran/cek/${noReg}`)
            .then(res => setPendaftar(res.data.data))
            .catch(err => console.error("Data tidak ditemukan", err));
    }, [noReg]);

    const handlePay = () => {
        if (pendaftar && pendaftar.snap_token) {
            window.snap.pay(pendaftar.snap_token, {
                onSuccess: () => window.location.reload(),
                onClose: () => alert("Jangan lupa selesaikan pembayaranmu untuk SKYE DIGIPRENEUR!")
            });
        }
    };

    if (!pendaftar) return <div className="p-10 text-center">Memuat data...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Halo, {pendaftar.nama}!</h2>
                <p className="text-gray-600 mb-6">Selesaikan pembayaran untuk mengaktifkan akun pendaftaranmu.</p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                    <p className="text-sm text-blue-600 font-semibold">Detail Tagihan:</p>
                    <p className="text-lg font-bold">Rp500.000</p>
                    <p className="text-xs text-gray-500 mt-1 italic">*Pembayaran via BRI atau bank lain (BTN via ATM Bersama)</p>
                </div>

                {pendaftar.status_pembayaran === 'success' ? (
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                        Cetak Kartu Ujian
                    </button>
                ) : (
                    <button 
                        onClick={handlePay}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition"
                    >
                        Bayar Sekarang
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;