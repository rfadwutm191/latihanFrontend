import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

export default function PaymentModal({ cart, total, user, token, onClose, onSuccess}) {
  const [bayar, setBayar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const nominalBayar = parseInt(bayar.replace(/\D/g, ''), 10) || 0;
  const kembalian = nominalBayar - total;

  const handleBayar = async () => {
    if (nominalBayar < total) {setError('Nominal pembayaran kurang!'); return; }
    setLoading(true);
    setError('');
    try {
      const payload = {
        user_id: user.id,
        shipping_address: "Kasir POS",
        items: cart.map((i) => ({ produk_id: i.produk_id, quantity: i.quantity })),
    };
    const res = await axios.post(`${BASE_URL}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess({...res.data.data, bayar: nominalBayar, kembalian });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat transaksi');
    } finally {
      setLoading(false);
    }
 };

  const quickAmounts = [
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">💳 Proses Pembayaran</h2>

        {/* Ringkasan */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2">
          {cart.map((item) => (
            <div key={item.produk_id} className="flex justify-between text-sm">
              <span>{item.nama} x{item.quantity}</span>
              <span>{formatRupiah(item.harga * item.quantity)}</span>
            </div>
          ))}

          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600"> {formatRupiah(total)} </span>
          </div>

        </div>

        {/* Input bayar */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Nominal Bayar</label>
          <input
            type="text"
            inputMode='numeric'
            placeholder="0"
            className="w-full border-2 rounded-xl px-4 py-3 text-xl font-bold focus:outline-none 
            focus:border-blue-500"
            value={bayar ? `Rp ${parseInt(bayar.replace(/\D/g, ''), 10).toLocaleString('id-ID')}` : ''}
            onChange={(e) => setBayar(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        {/* Quick Amount */}
        <div className="flex gap-2 mb-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setBayar(String(amt))}
              className="flex-1 py-2 border rounded-xl text-sm hover:bg-blue-50
              hover:border-blue-400"
            >
              {formatRupiah(amt)}
            </button>
          ))}
        </div>

        {/* Kembalian */}
        {nominalBayar >= total && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-sm text-green-600">Kembalian</p>
            <p className="text-2xl font-bold text-green-600"> {formatRupiah(kembalian)}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleBayar}
            disabled={loading || nominalBayar < total}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 disabled:opacity-40">
            {loading ? 'Memproses...' : '💳 Bayar'}
          </button>
        </div>

      </div>
    </div>
  );
}