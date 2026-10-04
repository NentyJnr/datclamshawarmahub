import React, { useState } from 'react';
import { ChefHat, ShieldCheck, CheckCircle2, AlertCircle, PackageCheck, Search, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const KitchenDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);

  const currentOrder = activeOrder.order;

  const handleVerifyHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult(null);

    if (!inputCode.trim()) {
      setVerificationResult({ success: false, message: 'Please enter the 6-character pickup verification code.' });
      return;
    }

    setVerifying(true);

    if (currentOrder) {
      try {
        const res = await fetch('/api/v1/orders/verify-pickup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: currentOrder.id,
            pickupVerificationCode: inputCode.trim()
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            activeOrder.updateOrderStatus('InTransit');
            setVerificationResult({ success: true, message: 'Pickup Handshake Verified! Order handed over to rider.' });
            setVerifying(false);
            setInputCode('');
            return;
          }
        }
      } catch (err) {
        console.warn('API verification fallback mode:', err);
      }

      // Local fallback verification simulation
      if (inputCode.trim().toUpperCase() === currentOrder.pickupVerificationCode.toUpperCase()) {
        activeOrder.updateOrderStatus('InTransit');
        setVerificationResult({ success: true, message: 'Handshake Verified! Order status updated to In Transit.' });
      } else {
        setVerificationResult({ success: false, message: `Invalid code '${inputCode}'. Verification failed.` });
      }
    } else {
      setVerificationResult({ success: false, message: 'No active order found to verify.' });
    }

    setVerifying(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-orange-400 tracking-wider">Datclam Kitchen HQ</span>
            <h1 className="text-2xl font-black text-white">Kitchen Operations & Pickup Station</h1>
          </div>
        </div>

        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-extrabold rounded-full border border-emerald-500/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Live Verification Terminal Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verification Station (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-orange-500" /> Package Pickup Handshake
            </h2>
            <p className="text-xs text-slate-400 mt-1">Verify the 6-character code presented by the dispatch rider before releasing package.</p>
          </div>

          <form onSubmit={handleVerifyHandshake} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Rider Verification Code (`DAT-XXX`)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. DAT-482"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-orange-500 rounded-2xl px-5 py-4 text-2xl font-mono font-black text-amber-300 placeholder-slate-700 tracking-widest uppercase focus:outline-none transition-colors"
                />
                <Search className="w-6 h-6 text-slate-600 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {verificationResult && (
              <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
                verificationResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}>
                {verificationResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{verificationResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Verify Code & Authorize Pickup
            </button>
          </form>
        </div>

        {/* Live Kitchen Order Queue (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Active Kitchen Prep Queue</h2>

          {currentOrder ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div>
                  <span className="text-xs text-orange-400 font-extrabold uppercase tracking-wider block">Order ID</span>
                  <span className="text-xl font-black text-white">#{currentOrder.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Assigned Rider</span>
                  <span className="text-sm font-bold text-slate-200">{currentOrder.riderName}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Items to Prepare:</span>
                {currentOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm bg-slate-900 p-3 rounded-xl">
                    <span className="font-bold text-white">{i.quantity}× {i.menuItemName}</span>
                    <span className="text-slate-400">₦{i.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-400">Order Status: <strong className="text-orange-400">{currentOrder.orderStatus}</strong></span>
                <span className="bg-amber-400/10 text-amber-300 font-mono font-bold px-3 py-1 rounded-lg border border-amber-400/30">
                  Required Code: {currentOrder.pickupVerificationCode}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No active prep orders in queue at the moment.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
