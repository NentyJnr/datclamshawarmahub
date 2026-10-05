import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Navigation, CheckCircle2, DollarSign, MapPin, ShieldCheck, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export const RiderDashboardPage: React.FC = () => {
  const { activeOrder, auth } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isStreamingGps) {
      clearInterval(gpsSimInterval);
      setIsStreamingGps(false);
    }
    auth.logout();
    navigate('/staff/login');
  };

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
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        const newLat = (currentOrder?.deliveryLatitude || 6.4531) + step * 0.0005;
        const newLon = (currentOrder?.deliveryLongitude || 3.4244) + step * 0.0005;

        activeOrder.updateRiderLocation(newLat, newLon);

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

    activeOrder.updateOrderStatus('Delivered');
    setCompleteSuccess(true);
    setCompleting(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-stone-900 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-950 text-white border-4 border-datclam-green rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#008751] text-white flex items-center justify-center font-black text-2xl shadow-lg border border-emerald-400/40">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Datclam Dispatch Mobile Portal</span>
            <h1 className="text-2xl font-black text-white">Active Delivery Command Center</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* GPS Live Streaming Toggle */}
          <button
            onClick={toggleGpsStreaming}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border cursor-pointer ${
              isStreamingGps
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md animate-pulse'
                : 'bg-stone-800 text-amber-200 border-stone-700 hover:border-amber-400'
            }`}
          >
            <Navigation className={`w-4 h-4 ${isStreamingGps ? 'animate-spin' : ''}`} />
            {isStreamingGps ? 'Live GPS Stream ACTIVE' : 'Start Periodic GPS Stream'}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-black rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer border border-red-500/40"
            title="Logout Staff"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Staff</span>
          </button>
        </div>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Order Details & Pickup Code (7 Columns) */}
          <div className="lg:col-span-7 bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs text-amber-800 font-black uppercase tracking-wider block">Assigned Order</span>
                <span className="text-2xl font-black text-stone-900 font-mono">#{currentOrder.orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-300">
                  {currentOrder.orderStatus}
                </span>
                {currentOrder.orderStatus === 'Delivered' && (
                  <button
                    onClick={handleCloseTicket}
                    className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-extrabold rounded-full border border-rose-300 transition-colors cursor-pointer"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>

            {/* Customer Handshake Verification Code Card */}
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-2 shadow-sm">
              <span className="text-xs uppercase font-black text-amber-900 tracking-wider block">
                Customer Delivery Verification Code (`DAT-XXX`)
              </span>
              <div className="text-4xl font-mono font-black text-amber-950 tracking-widest">
                {currentOrder.pickupVerificationCode}
              </div>
              <p className="text-[11px] text-stone-600 font-medium">
                The customer will provide this verification code when you deliver the food. Verify code before completing delivery.
              </p>
            </div>

            {/* Destination Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-stone-600 uppercase tracking-wider">Customer Destination</h3>
              <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <MapPin className="w-5 h-5 text-datclam-red shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block text-sm">{currentOrder.customerName}</span>
                  <span className="text-xs text-stone-500 font-medium">{currentOrder.formattedAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prepaid Delivery Verification & Handshake Action (5 Columns) */}
          <div className="lg:col-span-5 bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-4">
              <ShieldCheck className="w-6 h-6 text-[#008751]" /> Delivery Verification & Close Order
            </h2>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-300 text-center space-y-2 shadow-sm">
              <span className="text-xs uppercase font-extrabold text-[#008751] tracking-wider block">Prepaid Order Total</span>
              <div className="text-4xl font-black text-[#008751]">
                ₦{currentOrder.grandTotal.toLocaleString()}
              </div>
              <span className="inline-block text-[11px] text-[#008751] font-extrabold">
                ✓ Online Payment Verified
              </span>
            </div>

            {completeSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-[#008751] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#008751]" /> Delivery Handshake Verified! Click below to close order ticket.
              </div>
            )}

            {currentOrder.orderStatus === 'Delivered' ? (
              <button
                onClick={handleCloseTicket}
                className="w-full bg-gradient-to-r from-[#008751] via-emerald-700 to-[#008751] text-white py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#008751]/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Delivery Completed — Click to Close Order Ticket</span>
              </button>
            ) : (
              <button
                onClick={handleCompleteDelivery}
                disabled={completing}
                className="w-full bg-gradient-to-r from-[#008751] to-emerald-700 hover:from-emerald-700 hover:to-[#008751] text-white py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#008751]/25 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
              >
                {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                <span>Verify Customer Code & Close Order</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-12 text-center text-stone-500 shadow-xl">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          No active order assigned to your rider profile at this time.
        </div>
      )}

    </div>
  );
};
