import React, { useState } from 'react';
import { ChefHat, ShieldCheck, CheckCircle2, AlertCircle, PackageCheck, Flame, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export const KitchenDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();
  const currentOrder = activeOrder.order;

  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStartPrep = () => {
    setUpdating(true);
    setTimeout(() => {
      activeOrder.updateOrderStatus('Preparing');
      setSuccessMessage('Order status updated to Preparing Shawarma.');
      setUpdating(false);
    }, 400);
  };

  const handleMarkCompleted = () => {
    setUpdating(true);
    setTimeout(() => {
      activeOrder.updateOrderStatus('ReadyForPickup');
      setSuccessMessage('Shawarma preparation completed! Dispatch rider notified for pickup.');
      setUpdating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-orange-400 tracking-wider">Datclam Kitchen HQ</span>
            <h1 className="text-2xl font-black text-white">Kitchen Operations & Prep Station</h1>
          </div>
        </div>

        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-extrabold rounded-full border border-emerald-500/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Paid Online via Paystack
        </span>
      </div>

      {/* Active Kitchen Prep Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Active Kitchen Prep Queue
            </h2>
            <p className="text-xs text-slate-400 mt-1">Orders in queue have completed online payment and are cleared for instant preparation.</p>
          </div>
          {currentOrder && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
              Payment Verified
            </span>
          )}
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {currentOrder ? (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Order Header Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-orange-400 font-extrabold uppercase tracking-wider block">Order ID</span>
                <span className="text-2xl sm:text-3xl font-black text-white">#{currentOrder.orderNumber}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Assigned Dispatch Rider</span>
                <span className="text-sm font-bold text-slate-200">{currentOrder.riderName}</span>
              </div>
            </div>

            {/* Items List to Prepare */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Items to Prepare:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-sm bg-slate-900 p-4 rounded-2xl border border-slate-800/80">
                    <span className="font-bold text-white">{i.quantity}× {i.menuItemName}</span>
                    <span className="text-emerald-400 font-extrabold text-sm">₦{i.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Current Status:</span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {currentOrder.orderStatus}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentOrder.orderStatus === 'Preparing' ? (
                  <button
                    onClick={handleMarkCompleted}
                    disabled={updating}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <PackageCheck className="w-5 h-5" />
                    <span>Mark Preparation Completed (Notify Rider)</span>
                  </button>
                ) : currentOrder.orderStatus === 'ReadyForPickup' ? (
                  <button
                    disabled
                    className="w-full sm:w-auto bg-emerald-500/20 text-emerald-300 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-emerald-500/40"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Preparation Complete — Awaiting Rider Pickup</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartPrep}
                    disabled={updating}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <ChefHat className="w-5 h-5" />
                    <span>Start Preparing Shawarma</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-400 text-base">No Active Prep Orders in Queue</p>
            <p className="text-xs text-slate-600">New customer orders will appear here automatically upon online payment.</p>
          </div>
        )}
      </div>

    </div>
  );
};
