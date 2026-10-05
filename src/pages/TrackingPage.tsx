import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2, Bike, ChefHat, PackageCheck, AlertCircle, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MapComponent } from '../components/MapComponent';
import { ConfirmModal } from '../components/ConfirmModal';
import { signalRService } from '../services/SignalRService';
import { OrderStatus } from '../types';
import { DatclamLogo } from '../components/DatclamLogo';

export const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { activeOrder } = useStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    signalRService.startConnection();

    signalRService.onOrderPickedUp((payload) => {
      if (activeOrder.order && (payload.orderId === activeOrder.order.id || payload.orderId === orderId)) {
        activeOrder.updateOrderStatus('InTransit');
      }
    });

    signalRService.onOrderDelivered((payload) => {
      if (activeOrder.order && (payload.orderId === activeOrder.order.id || payload.orderId === orderId)) {
        activeOrder.updateOrderStatus('Delivered');
      }
    });

    signalRService.onRiderLocationUpdated((payload) => {
      activeOrder.updateRiderLocation(payload.latitude, payload.longitude);
    });
  }, [orderId]);

  const currentOrder = activeOrder.order;

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-datclam-red mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-white mb-2">No Active Order Found</h2>
        <p className="text-slate-400 max-w-md mb-6">We couldn't locate an active order for ID: {orderId}.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-datclam-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const steps: { label: string; status: OrderStatus; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Order Placed', status: 'Preparing', icon: ChefHat },
    { label: 'Preparing Shawarma', status: 'ReadyForPickup', icon: PackageCheck },
    { label: 'Rider In Transit', status: 'InTransit', icon: Bike },
    { label: 'Delivered & Paid', status: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing': return 0;
      case 'ReadyForPickup': return 1;
      case 'InTransit': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentOrder.orderStatus);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentOrder.pickupVerificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-2 border-datclam-green/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="mb-2">
            <DatclamLogo size="sm" />
          </div>
          <h1 className="text-3xl font-black text-white">
            Order #{currentOrder.orderNumber}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Delivering to: <span className="text-slate-200 font-semibold">{currentOrder.formattedAddress}</span>
          </p>

          {currentOrder.orderStatus === 'Preparing' && (
            <button
              onClick={() => setIsConfirmCancelOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-all cursor-pointer"
              title="Cancel Order"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>

        {/* Verification Code Display */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-datclam-green rounded-2xl p-4 sm:p-6 text-center shadow-xl w-full md:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
            Pickup Handshake Code
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-widest text-amber-300 font-mono my-1">
            {currentOrder.pickupVerificationCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="text-xs text-datclam-green hover:text-emerald-300 font-bold underline transition-colors"
          >
            {copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Visual Status Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-6">Delivery Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.label}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-red-500/15 border-datclam-red text-white shadow-lg shadow-red-500/20 scale-105'
                    : isCompleted
                    ? 'bg-slate-950 border-datclam-green/50 text-datclam-green'
                    : 'bg-slate-950/50 border-slate-800 text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isCurrent ? 'bg-datclam-red text-white' : isCompleted ? 'bg-datclam-green text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">{step.label}</span>
                {isCurrent && <span className="text-[10px] text-datclam-red font-black uppercase tracking-wider animate-pulse">In Progress</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map & Live ETA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-datclam-red" /> Live Rider Route Map
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-datclam-green animate-ping inline-block" /> Live SignalR Sync
            </span>
          </div>

          <MapComponent
            customerLat={currentOrder.deliveryLatitude}
            customerLon={currentOrder.deliveryLongitude}
            riderLat={activeOrder.riderLocation?.latitude}
            riderLon={activeOrder.riderLocation?.longitude}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Assigned Dispatch Rider</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-datclam-red to-datclam-green flex items-center justify-center text-white font-black text-xl shadow-lg">
                🛵
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{currentOrder.riderName}</h4>
                <p className="text-xs text-datclam-green font-medium">Datclam Verified Rider</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Estimated ETA:</span>
                <span className="text-datclam-green font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 15 - 20 Mins
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-white font-bold">Cash On Delivery</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-datclam-green shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-300 text-sm mb-1">Handshake Instructions</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Present your 6-character code <strong className="text-amber-200">{currentOrder.pickupVerificationCode}</strong> to the rider upon arrival, and pay <strong className="text-white">₦{currentOrder.grandTotal.toLocaleString()}</strong> in cash.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        title="Cancel Active Order?"
        message="Are you sure you want to cancel this active order? The kitchen and dispatch rider will be notified immediately."
        confirmText="Yes, Cancel Order"
        cancelText="Keep My Order"
        onConfirm={() => {
          setIsConfirmCancelOpen(false);
          activeOrder.clearActiveOrder();
          navigate('/');
        }}
        onCancel={() => setIsConfirmCancelOpen(false)}
      />

    </div>
  );
};
