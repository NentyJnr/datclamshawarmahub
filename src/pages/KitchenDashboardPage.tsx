import React, { useState } from 'react';
import { 
  ChefHat, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  PackageCheck, 
  Flame, 
  Clock, 
  Plus, 
  X, 
  ShoppingBag, 
  DollarSign, 
  CreditCard, 
  User, 
  Bike, 
  Calculator,
  Store
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS } from '../constants/menuItems';
import { Order, OrderItem, PaymentMethod } from '../types';

export const KitchenDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();
  const currentOrder = activeOrder.order;
  const ordersQueue = activeOrder.ordersList.length > 0 
    ? activeOrder.ordersList 
    : (currentOrder ? [currentOrder] : []);

  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Onsite / POS Order Capture Modal State
  const [showOnsiteModal, setShowOnsiteModal] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<{ [itemId: string]: number }>({});
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [fulfillmentType, setFulfillmentType] = useState<'Takeaway' | 'Delivery'>('Takeaway');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [cashTendered, setCashTendered] = useState<string>('');

  // Item quantity controls inside POS modal
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartQuantities((prev) => {
      const current = prev[itemId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [itemId]: updated };
    });
  };

  // Calculations for POS order
  const selectedItemsList = MENU_ITEMS.filter(item => (cartQuantities[item.id] || 0) > 0);
  const subtotal = selectedItemsList.reduce((sum, item) => sum + item.price * (cartQuantities[item.id] || 0), 0);
  const deliveryFee = fulfillmentType === 'Delivery' ? 1500 : 0;
  const grandTotal = subtotal + deliveryFee;

  const tenderedAmount = parseFloat(cashTendered) || 0;
  const changeDue = tenderedAmount > grandTotal ? tenderedAmount - grandTotal : 0;

  // Submit Onsite Order
  const handleCreateOnsiteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) {
      alert('Please select at least one menu item for the order.');
      return;
    }

    const orderItems: OrderItem[] = selectedItemsList.map((item, idx) => ({
      id: `onsite-item-${Date.now()}-${idx}`,
      menuItemId: item.id,
      menuItemName: item.name,
      quantity: cartQuantities[item.id],
      unitPrice: item.price,
      totalPrice: item.price * cartQuantities[item.id]
    }));

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const randomCodeSuffix = Math.floor(100 + Math.random() * 900);

    const newOnsiteOrder: Order = {
      id: `ord-onsite-${Date.now()}`,
      orderNumber: `ORD-ONS-${randomNum}`,
      customerId: 'cust-walkin',
      customerName: customerName || 'Walk-in Customer',
      dispatchRiderId: fulfillmentType === 'Delivery' ? 'r1-uuid-001' : 'onsite-pickup',
      riderName: fulfillmentType === 'Delivery' ? 'Tunde Bakare (Datclam Express Rider)' : 'Walk-in Counter Pickup',
      deliveryLatitude: 6.4531,
      deliveryLongitude: 3.4244,
      formattedAddress: fulfillmentType === 'Delivery' ? 'Walk-in Customer Local Delivery Address' : 'Datclam Kitchen Counter (Onsite Pickup)',
      subtotal,
      fixedDeliveryFee: deliveryFee,
      grandTotal,
      pickupVerificationCode: `DAT-${randomCodeSuffix}`,
      orderStatus: 'Preparing',
      paymentMethod,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      items: orderItems
    };

    activeOrder.addOrder(newOnsiteOrder);
    setSuccessMessage(`Onsite Order #${newOnsiteOrder.orderNumber} (₦${grandTotal.toLocaleString()}) created and set to Preparing!`);

    // Reset Modal
    setShowOnsiteModal(false);
    setCartQuantities({});
    setCustomerName('Walk-in Customer');
    setCashTendered('');
  };

  const handleStartPrep = (orderId?: string) => {
    setUpdating(true);
    setTimeout(() => {
      activeOrder.updateOrderStatus('Preparing', orderId);
      setSuccessMessage('Order status updated to Preparing Shawarma.');
      setUpdating(false);
    }, 400);
  };

  const handleMarkCompleted = (orderId?: string) => {
    setUpdating(true);
    setTimeout(() => {
      activeOrder.updateOrderStatus('ReadyForPickup', orderId);
      setSuccessMessage('Shawarma preparation completed! Dispatch rider notified for pickup.');
      setUpdating(false);
    }, 400);
  };

  const handleCloseOnsiteOrder = (orderId?: string) => {
    setUpdating(true);
    setTimeout(() => {
      activeOrder.updateOrderStatus('Delivered', orderId);
      setSuccessMessage('Food handed over to walk-in customer. Onsite order closed successfully!');
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
            <h1 className="text-2xl font-black text-white">Kitchen Operations & Counter POS</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnsiteModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer border border-orange-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Create Onsite / Walk-in Order</span>
          </button>
        </div>
      </div>

      {/* Active Kitchen Prep Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Active Kitchen Prep Queue ({ordersQueue.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">Both Online (Paystack) & Onsite Counter Orders are displayed here for immediate preparation.</p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {ordersQueue.length > 0 ? (
          <div className="space-y-6">
            {ordersQueue.map((order) => {
              const isOnsiteTakeaway = order.dispatchRiderId === 'onsite-pickup' || order.riderName === 'Walk-in Counter Pickup' || order.fixedDeliveryFee === 0;

              return (
                <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  
                  {/* Order Header Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-orange-400 font-extrabold uppercase tracking-wider">Order ID</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          order.paymentMethod === 'Cash' || order.paymentMethod === 'POSTransfer'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {order.paymentMethod === 'Cash' ? '💵 Onsite Cash Paid' : order.paymentMethod === 'POSTransfer' ? '💳 Onsite POS Paid' : '✓ Paystack Online'}
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">{order.orderNumber}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Customer / Fulfillment</span>
                      <span className="text-sm font-bold text-slate-200">{order.customerName} ({order.riderName})</span>
                    </div>
                  </div>

                  {/* Items List to Prepare */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Items to Prepare:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((i) => (
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
                        <Clock className="w-3.5 h-3.5" /> {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {order.orderStatus === 'Delivered' ? (
                        <button
                          disabled
                          className="w-full sm:w-auto bg-emerald-500/20 text-emerald-300 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-emerald-500/40"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Order Handed Over & Closed</span>
                        </button>
                      ) : order.orderStatus === 'Preparing' ? (
                        isOnsiteTakeaway ? (
                          <button
                            onClick={() => handleCloseOnsiteOrder(order.id)}
                            disabled={updating}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer border-2 border-emerald-400/40"
                          >
                            <PackageCheck className="w-5 h-5" />
                            <span>Handover Package & Close Order</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkCompleted(order.id)}
                            disabled={updating}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                          >
                            <PackageCheck className="w-5 h-5" />
                            <span>Mark Preparation Completed (Notify Rider)</span>
                          </button>
                        )
                      ) : order.orderStatus === 'ReadyForPickup' ? (
                        <button
                          disabled
                          className="w-full sm:w-auto bg-emerald-500/20 text-emerald-300 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-emerald-500/40"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Preparation Complete — Awaiting Rider Pickup</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartPrep(order.id)}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-400 text-base">No Active Prep Orders in Queue</p>
            <p className="text-xs text-slate-600">Click "Create Onsite / Walk-in Order" above to place counter cash/POS orders.</p>
          </div>
        )}
      </div>

      {/* Onsite / Counter POS Order Capture Modal */}
      {showOnsiteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setShowOnsiteModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-black text-orange-400 tracking-wider">Kitchen POS Terminal</span>
              <h3 className="text-2xl font-black text-white mt-1">New Onsite Walk-in Order</h3>
              <p className="text-xs text-slate-400 mt-1">Select items, collect cash or POS payment at counter, and push directly to prep queue.</p>
            </div>

            <form onSubmit={handleCreateOnsiteOrder} className="space-y-6">
              
              {/* Step 1: Select Menu Items */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">1. Select Menu Items</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MENU_ITEMS.map((item) => {
                    const qty = cartQuantities[item.id] || 0;
                    return (
                      <div key={item.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-white text-xs">{item.name}</div>
                          <div className="text-emerald-400 font-extrabold text-xs">₦{item.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-white text-xs">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Customer & Fulfillment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Customer Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Walk-in Customer / Seyi"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fulfillment Option</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Takeaway')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        fulfillmentType === 'Takeaway' ? 'bg-orange-500 text-white' : 'text-slate-400'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" /> Takeaway (₦0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Delivery')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        fulfillmentType === 'Delivery' ? 'bg-orange-500 text-white' : 'text-slate-400'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" /> Rider (₦1,500)
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Counter Payment Selection & Cash Tendered */}
              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">3. Counter Payment Collection</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      paymentMethod === 'Cash'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-amber-400" /> Cash Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('POSTransfer')}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      paymentMethod === 'POSTransfer'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Counter POS / Card
                  </button>
                </div>

                {paymentMethod === 'Cash' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cash Tendered (₦)</label>
                      <input
                        type="number"
                        placeholder="e.g. 10000"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Change Due to Customer</label>
                      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-black text-amber-400">
                        ₦{changeDue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Totals & Submit */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-black text-white">
                  <span>Grand Total to Collect:</span>
                  <span className="text-2xl text-emerald-400">₦{grandTotal.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={selectedItemsList.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Onsite Order & Push to Prep Queue (₦{grandTotal.toLocaleString()})</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
