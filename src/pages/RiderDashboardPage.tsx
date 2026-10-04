import React, { useState } from 'react';
import { Bike, Navigation, CheckCircle2, DollarSign, MapPin, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const RiderDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();
  const currentOrder = activeOrder.order;

  const [isStreamingGps, setIsStreamingGps] = useState(false);
  const [gpsSimInterval, setGpsSimInterval] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);

  const toggleGpsStreaming = () => {
    if (isStreamingGps) {
      clearInterval(gpsSimInterval);
      setIsStreamingGps(false);
    } else {
      setIsStreamingGps(true);
      // Simulate periodic GPS coordinate movement every 4 seconds
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        const newLat = (currentOrder?.deliveryLatitude || 6.4531) + step * 0.0005;
        const newLon = (currentOrder?.deliveryLongitude || 3.4244) + step * 0.0005;

        activeOrder.updateRiderLocation(newLat, newLon);

        // Call API streaming endpoint
        fetch('/api/v1/riders/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riderId: currentOrder?.dispatchRiderId || 'r1-uuid-001',
            latitude: newLat,
            longitude: newLon
          })
        }).catch((err) => console.warn('GPS API streaming fallback:', err));

      }, 4000);

      setGpsSimInterval(interval);
    }
  };

  const handleCloseTicket = () => {
    if (isStreamingGps) {
      clearInterval(gpsSimInterval);
      setIsStreamingGps(false);
    }
    activeOrder.clearActiveOrder();
    setCompleteSuccess(false);
  };

  const handleCompleteDelivery = async () => {
    if (!currentOrder) return;

    if (currentOrder.orderStatus === 'Delivered') {
      handleCloseTicket();
      return;
    }

    setCompleting(true);

    try {
      const res = await fetch('/api/v1/orders/complete-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentOrder.id,
          riderId: currentOrder.dispatchRiderId,
          cashCollectedAmount: currentOrder.grandTotal
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          activeOrder.updateOrderStatus('Delivered');
          setCompleteSuccess(true);
          setCompleting(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API completion fallback mode:', err);
    }

    // Client fallback simulation
    activeOrder.updateOrderStatus('Delivered');
    setCompleteSuccess(true);
    setCompleting(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-orange-400 tracking-wider">Datclam Dispatch Mobile Portal</span>
            <h1 className="text-2xl font-black text-white">Active Delivery Command Center</h1>
          </div>
        </div>

        {/* GPS Live Streaming Toggle */}
        <button
          onClick={toggleGpsStreaming}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all border ${
            isStreamingGps
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
          }`}
        >
          <Navigation className={`w-4 h-4 ${isStreamingGps ? 'animate-spin' : ''}`} />
          {isStreamingGps ? 'Live GPS Stream ACTIVE (Broadcasting)' : 'Start Periodic GPS Stream'}
        </button>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Order Details & Pickup Code (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-orange-400 font-extrabold uppercase tracking-wider block">Assigned Order</span>
                <span className="text-2xl font-black text-white">#{currentOrder.orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-400/10 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                  {currentOrder.orderStatus}
                </span>
                {currentOrder.orderStatus === 'Delivered' && (
                  <button
                    onClick={handleCloseTicket}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-full border border-red-500/40 transition-colors"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>

            {/* Handshake Verification Code Card */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-orange-500/40 rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Verification Code to Present at Kitchen
              </span>
              <div className="text-4xl font-mono font-black text-amber-300 tracking-widest">
                {currentOrder.pickupVerificationCode}
              </div>
              <p className="text-[11px] text-slate-400">
                Present this code to Kitchen staff to unlock package pickup & transition order to In Transit.
              </p>
            </div>

            {/* Destination Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Customer Destination</h3>
              <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-sm">{currentOrder.customerName}</span>
                  <span className="text-xs text-slate-400">{currentOrder.formattedAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Collection & Complete Delivery Action (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <DollarSign className="w-6 h-6 text-emerald-400" /> Cash Collection Handshake
            </h2>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">Exact Cash to Collect</span>
              <div className="text-4xl font-black text-emerald-400">
                ₦{currentOrder.grandTotal.toLocaleString()}
              </div>
              <span className="inline-block text-[11px] text-slate-400 font-semibold">
                Subtotal ₦{currentOrder.subtotal.toLocaleString()} + Fixed Delivery Fee ₦{currentOrder.fixedDeliveryFee.toLocaleString()}
              </span>
            </div>

            {completeSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> Delivery Completed & Cash Collected! Click below to close order ticket.
              </div>
            )}

            {currentOrder.orderStatus === 'Delivered' ? (
              <button
                onClick={handleCloseTicket}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer border-2 border-emerald-400/50"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Delivery Completed — Click to Close Order Ticket</span>
              </button>
            ) : (
              <button
                onClick={handleCompleteDelivery}
                disabled={completing}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
              >
                {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                <span>Confirm COD Cash Collection (₦{currentOrder.grandTotal.toLocaleString()})</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          No active order assigned to your rider profile at this time.
        </div>
      )}

    </div>
  );
};
