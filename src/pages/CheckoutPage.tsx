import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Bike, ShoppingBag, ShieldCheck, ArrowLeft, Loader2, AlertCircle, Plus, Minus, Trash2, X, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AvailableRider } from '../types';
import { DatclamLogo } from '../components/DatclamLogo';
import { ConfirmModal } from '../components/ConfirmModal';

export const CheckoutPage: React.FC = () => {
  const { cart, activeOrder } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(6.4531);
  const [longitude, setLongitude] = useState<number>(3.4244);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [availableRiders, setAvailableRiders] = useState<AvailableRider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  const [loadingRiders, setLoadingRiders] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    fetchAvailableRiders(latitude, longitude);
  }, [latitude, longitude]);

  const fetchAvailableRiders = async (lat: number, lon: number) => {
    setLoadingRiders(true);
    try {
      const res = await fetch(`/api/v1/orders/available-riders?latitude=${lat}&longitude=${lon}&radiusKm=15`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setAvailableRiders(json.data);
          setSelectedRiderId(json.data[0].riderId);
          setLoadingRiders(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API call fallback mode active:', e);
    }

    const mockRiders: AvailableRider[] = [
      {
        riderId: 'r1-uuid-001',
        userId: 'u-rider-1',
        riderName: 'Tunde Bakare (Datclam Express Rider)',
        phoneNumber: '+2348031234567',
        currentLatitude: 6.5200,
        currentLongitude: 3.3750,
        distanceToStoreKm: 1.2,
        storeToCustomerKm: 4.5,
        totalTripDistanceKm: 5.7,
        estimatedTimeToStoreMinutes: 5,
        estimatedTimeToCustomerMinutes: 15,
        totalEtaMinutes: 20,
        isCalculationFallback: true
      },
      {
        riderId: 'r2-uuid-002',
        userId: 'u-rider-2',
        riderName: 'Emeka Nwosu (Speedy Datclam Rider)',
        phoneNumber: '+2348099876543',
        currentLatitude: 6.5150,
        currentLongitude: 3.3800,
        distanceToStoreKm: 2.1,
        storeToCustomerKm: 4.5,
        totalTripDistanceKm: 6.6,
        estimatedTimeToStoreMinutes: 8,
        estimatedTimeToCustomerMinutes: 15,
        totalEtaMinutes: 23,
        isCalculationFallback: true
      }
    ];

    setAvailableRiders(mockRiders);
    setSelectedRiderId(mockRiders[0].riderId);
    setLoadingRiders(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setAddress(`GPS Position: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setErrorMessage('Unable to fetch GPS position automatically. Please enter your address.');
        setIsLocating(false);
      }
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      setErrorMessage('Please complete all contact & delivery fields.');
      return;
    }

    if (!selectedRiderId) {
      setErrorMessage('Please select an available dispatch rider.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerId: '00000000-0000-0000-0000-000000000001',
      riderId: selectedRiderId,
      deliveryLatitude: latitude,
      deliveryLongitude: longitude,
      formattedAddress: address,
      items: cart.items.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity
      }))
    };

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          activeOrder.setActiveOrder(json.data);
          cart.clearCart();
          navigate(`/track/${json.data.id}`);
          return;
        }
      }
    } catch (err) {
      console.warn('API error, executing client order simulation:', err);
    }

    const selectedRiderObj = availableRiders.find((r) => r.riderId === selectedRiderId);
    const mockCode = `DAT-${Math.floor(100 + Math.random() * 900)}`;
    const mockOrderId = `ord-${Date.now()}`;

    const newOrder = {
      id: mockOrderId,
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: 'guest-customer-id',
      customerName,
      dispatchRiderId: selectedRiderId,
      riderName: selectedRiderObj?.riderName || 'Datclam Rider',
      deliveryLatitude: latitude,
      deliveryLongitude: longitude,
      formattedAddress: address,
      subtotal: cart.getSubtotal(),
      fixedDeliveryFee: cart.fixedDeliveryFee,
      grandTotal: cart.getGrandTotal(),
      pickupVerificationCode: mockCode,
      orderStatus: 'Preparing' as const,
      paymentMethod: 'PaystackOnline' as const,
      paymentStatus: 'Pending' as const,
      createdAt: new Date().toISOString(),
      items: cart.items.map((i) => ({
        id: `item-${i.menuItem.id}`,
        menuItemId: i.menuItem.id,
        menuItemName: i.menuItem.name,
        quantity: i.quantity,
        unitPrice: i.menuItem.price,
        totalPrice: i.menuItem.price * i.quantity
      }))
    };

    activeOrder.setActiveOrder(newOrder);
    setIsSubmitting(false);
    navigate('/payment');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-6 border border-slate-800">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 max-w-md mb-8">Add delicious Shawarmas to proceed with guest checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-datclam-red hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg"
        >
          Browse Shawarma Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="mb-2">
            <DatclamLogo size="sm" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Guest Order Checkout</h1>
          <p className="text-slate-400 text-sm">No account needed. Instant delivery straight to your doorstep.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-extrabold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Paystack Online Checkout
        </span>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-datclam-red text-white text-xs flex items-center justify-center font-black">1</span>
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Okon"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-datclam-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number (For Delivery Handshake)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0814 361 6974"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-datclam-green transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-datclam-red text-white text-xs flex items-center justify-center font-black">2</span>
                Delivery Location
              </h2>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="text-xs font-bold text-datclam-green hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                {isLocating ? 'Locating...' : 'Use My Location'}
              </button>
            </div>

            {locationSuccess && (
              <div className="mb-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> GPS Coordinates updated successfully!
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Delivery Address</label>
              <textarea
                required
                rows={3}
                placeholder="Enter street address, building number, or landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-datclam-green transition-colors"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-datclam-red text-white text-xs flex items-center justify-center font-black">3</span>
              Select Nearby Dispatch Rider
            </h2>
            <p className="text-xs text-slate-400 mb-4">Calculated using store route distance math. Delivery fee remains fixed.</p>

            {loadingRiders ? (
              <div className="py-6 text-center text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-datclam-red" /> Computing rider distances...
              </div>
            ) : (
              <div className="space-y-3">
                {availableRiders.map((rider) => (
                  <label
                    key={rider.riderId}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedRiderId === rider.riderId
                        ? 'bg-emerald-500/10 border-datclam-green text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="riderSelection"
                          value={rider.riderId}
                          checked={selectedRiderId === rider.riderId}
                          onChange={() => setSelectedRiderId(rider.riderId)}
                          className="accent-datclam-green w-4 h-4"
                        />
                        <div>
                          <span className="font-bold text-white block text-sm">{rider.riderName}</span>
                          <span className="text-xs text-slate-500">Distance: {rider.totalTripDistanceKm} km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-datclam-green font-extrabold text-sm block">~{rider.totalEtaMinutes} Mins ETA</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Ready for Pickup</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Order Summary (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
              <button
                type="button"
                onClick={() => setIsConfirmCancelOpen(true)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cancel Draft Order"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-slate-800/60">
              {cart.items.map((item) => (
                <div key={item.menuItem.id} className="pt-3 first:pt-0 flex flex-col gap-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-white block text-sm">{item.menuItem.name}</span>
                      <span className="text-xs text-slate-400">₦{item.menuItem.price.toLocaleString()} each</span>
                    </div>
                    <span className="font-extrabold text-slate-100 shrink-0">
                      ₦{(item.menuItem.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity & Remove Item Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => cart.updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-white text-xs px-1 min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => cart.updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => cart.removeFromCart(item.menuItem.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                      title="Remove item from cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal</span>
                <span>₦{cart.getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Delivery Fee</span>
                <span>₦{cart.fixedDeliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-lg border-t border-slate-800 pt-3">
                <span>Grand Total</span>
                <span className="text-datclam-green">₦{cart.getGrandTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-datclam-red to-red-700 hover:from-red-700 hover:to-datclam-red text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Preparing Payment Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Confirm Order (Pay ₦{cart.getGrandTotal().toLocaleString()})
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        title="Cancel Draft Order?"
        message="Are you sure you want to cancel this draft order? This will remove all selected items from your cart and return you to the menu."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Items"
        onConfirm={() => {
          setIsConfirmCancelOpen(false);
          cart.clearCart();
          navigate('/');
        }}
        onCancel={() => setIsConfirmCancelOpen(false)}
      />

    </div>
  );
};
