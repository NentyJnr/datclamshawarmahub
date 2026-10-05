import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Search, 
  CheckCircle2, 
  Flame, 
  Bike, 
  X, 
  Calendar,
  Printer,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Order } from '../types';

// Mock historical daily orders dataset for current day
const MOCK_TODAY_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-882190',
    customerId: 'cust-101',
    customerName: 'Chidi Okonkwo',
    dispatchRiderId: 'r1-uuid-001',
    riderName: 'Tunde Bakare (Datclam Express)',
    deliveryLatitude: 6.4531,
    deliveryLongitude: 3.4244,
    formattedAddress: 'Block 4, Flat 2, Admiralty Way, Lekki Phase 1, Lagos',
    subtotal: 11000,
    fixedDeliveryFee: 1500,
    grandTotal: 12500,
    pickupVerificationCode: 'DAT-482',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T19:40:00.000Z',
    items: [
      { id: 'i1', menuItemId: 'm1', menuItemName: 'Mixed Deluxe (Chicken + Beef + Cheese)', quantity: 1, unitPrice: 6000, totalPrice: 6000 },
      { id: 'i2', menuItemId: 'm2', menuItemName: 'Classic Chicken Shawarma', quantity: 1, unitPrice: 5000, totalPrice: 5000 }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-774129',
    customerId: 'cust-102',
    customerName: 'Amina Bello',
    dispatchRiderId: 'r2-uuid-002',
    riderName: 'Emeka Nwosu (Speedy Courier)',
    deliveryLatitude: 6.4321,
    deliveryLongitude: 3.4112,
    formattedAddress: 'Plot 12, Victoria Island Crescent, Lagos',
    subtotal: 18000,
    fixedDeliveryFee: 1500,
    grandTotal: 19500,
    pickupVerificationCode: 'DAT-914',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T18:55:00.000Z',
    items: [
      { id: 'i3', menuItemId: 'm3', menuItemName: 'Suya Beef Special Shawarma', quantity: 3, unitPrice: 6000, totalPrice: 18000 }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-662301',
    customerId: 'cust-103',
    customerName: 'Babatunde Adeleke',
    dispatchRiderId: 'r1-uuid-001',
    riderName: 'Tunde Bakare (Datclam Express)',
    deliveryLatitude: 6.4600,
    deliveryLongitude: 3.4300,
    formattedAddress: '15 Freedom Way, Ikate Elegushi, Lekki',
    subtotal: 9500,
    fixedDeliveryFee: 1500,
    grandTotal: 11000,
    pickupVerificationCode: 'DAT-103',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T18:10:00.000Z',
    items: [
      { id: 'i4', menuItemId: 'm1', menuItemName: 'Mixed Deluxe (Chicken + Beef + Cheese)', quantity: 1, unitPrice: 6000, totalPrice: 6000 },
      { id: 'i5', menuItemId: 'm4', menuItemName: 'Monster Double-Sausage Shawarma', quantity: 1, unitPrice: 3500, totalPrice: 3500 }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-551044',
    customerId: 'cust-104',
    customerName: 'Nneka Ezewu',
    dispatchRiderId: 'r3-uuid-003',
    riderName: 'Kazeem Ojo (FastTrack Logistics)',
    deliveryLatitude: 6.4450,
    deliveryLongitude: 3.4190,
    formattedAddress: '22 Bourdillon Road, Ikoyi, Lagos',
    subtotal: 15000,
    fixedDeliveryFee: 1500,
    grandTotal: 16500,
    pickupVerificationCode: 'DAT-662',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T17:25:00.000Z',
    items: [
      { id: 'i6', menuItemId: 'm2', menuItemName: 'Classic Chicken Shawarma', quantity: 3, unitPrice: 5000, totalPrice: 15000 }
    ]
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-449102',
    customerId: 'cust-105',
    customerName: 'David Oladipo',
    dispatchRiderId: 'r2-uuid-002',
    riderName: 'Emeka Nwosu (Speedy Courier)',
    deliveryLatitude: 6.4710,
    deliveryLongitude: 3.4450,
    formattedAddress: '8 Chevron Drive, Lekki, Lagos',
    subtotal: 8500,
    fixedDeliveryFee: 1500,
    grandTotal: 10000,
    pickupVerificationCode: 'DAT-771',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T16:40:00.000Z',
    items: [
      { id: 'i7', menuItemId: 'm1', menuItemName: 'Mixed Deluxe (Chicken + Beef + Cheese)', quantity: 1, unitPrice: 6000, totalPrice: 6000 },
      { id: 'i8', menuItemId: 'm5', menuItemName: 'Chilled Zobo Drink (50cl)', quantity: 2, unitPrice: 1250, totalPrice: 2500 }
    ]
  }
];

export const AdminDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();
  const currentActiveOrder = activeOrder.order;
  const storeOrdersList = activeOrder.ordersList || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Combine store orders (including onsite orders) with mock historical list for today's view
  const allTodayOrders = useMemo(() => {
    let list = [...MOCK_TODAY_ORDERS];
    
    // Merge store orders list
    storeOrdersList.forEach((storeOrd) => {
      const existingIdx = list.findIndex(o => o.id === storeOrd.id || o.orderNumber === storeOrd.orderNumber);
      if (existingIdx >= 0) {
        list[existingIdx] = storeOrd;
      } else {
        list = [storeOrd, ...list];
      }
    });

    if (currentActiveOrder) {
      const existingIdx = list.findIndex(o => o.id === currentActiveOrder.id || o.orderNumber === currentActiveOrder.orderNumber);
      if (existingIdx >= 0) {
        list[existingIdx] = currentActiveOrder;
      } else {
        list = [currentActiveOrder, ...list];
      }
    }
    return list;
  }, [currentActiveOrder, storeOrdersList]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return allTodayOrders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pickupVerificationCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allTodayOrders, searchTerm, selectedStatus]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    return allTodayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [allTodayOrders]);

  const totalFoodSales = useMemo(() => {
    return allTodayOrders.reduce((sum, o) => sum + o.subtotal, 0);
  }, [allTodayOrders]);

  const totalDeliveryFees = useMemo(() => {
    return allTodayOrders.reduce((sum, o) => sum + o.fixedDeliveryFee, 0);
  }, [allTodayOrders]);

  const totalOrdersCount = allTodayOrders.length;

  const statusCounts = useMemo(() => {
    return {
      Preparing: allTodayOrders.filter(o => o.orderStatus === 'Preparing').length,
      ReadyForPickup: allTodayOrders.filter(o => o.orderStatus === 'ReadyForPickup').length,
      InTransit: allTodayOrders.filter(o => o.orderStatus === 'InTransit').length,
      Delivered: allTodayOrders.filter(o => o.orderStatus === 'Delivered').length,
    };
  }, [allTodayOrders]);

  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-orange-400 tracking-wider">Datclam Staff Portal</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Executive Admin View
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Daily Sales & Orders Executive Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue Today</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 
              <span>Food: ₦{totalFoodSales.toLocaleString()} • Delivery: ₦{totalDeliveryFees.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Total Orders Count */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders Today</span>
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{totalOrdersCount} <span className="text-sm text-slate-400 font-normal">Orders</span></div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Paid Online via Paystack
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">₦{avgOrderValue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-1">Per completed customer ticket</p>
          </div>
        </div>

        {/* Operational Pipeline Status */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Pipeline Status</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> Prep:</span>
              <span className="text-white font-black">{statusCounts.Preparing}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-amber-400 flex items-center gap-1"><Bike className="w-3 h-3" /> Transit:</span>
              <span className="text-white font-black">{statusCounts.InTransit}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Table Filter & Search Controls Header */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" /> Today's Order Register & Financial Ledger
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real-time status tracking and financial amounts for all orders processed today.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, customer, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
              {['All', 'Preparing', 'ReadyForPickup', 'InTransit', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all ${
                    selectedStatus === st
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ReadyForPickup' ? 'Ready' : st === 'InTransit' ? 'In Transit' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-4">Order ID & Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Items Summary</th>
                <th className="py-4 px-4">Assigned Rider</th>
                <th className="py-4 px-4">Code</th>
                <th className="py-4 px-4 text-right">Amount (₦)</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors group">
                      
                      {/* Order Number & Time */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-amber-300">{order.orderNumber}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" /> {orderDate}
                        </div>
                      </td>

                      {/* Customer Name & Address */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">{order.formattedAddress}</div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-300 font-medium">
                          {order.items.map((i) => (
                            <span key={i.id} className="block">
                              {i.quantity}× {i.menuItemName}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Rider */}
                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Bike className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{order.riderName}</span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-4 px-4 font-mono font-bold text-xs text-amber-400">
                        {order.pickupVerificationCode}
                      </td>

                      {/* Grand Total */}
                      <td className="py-4 px-4 text-right font-black text-emerald-400 text-base">
                        ₦{order.grandTotal.toLocaleString()}
                        <span className="block text-[10px] text-slate-400 font-semibold">
                          {order.paymentMethod === 'Cash' ? '💵 Cash (Onsite)' : order.paymentMethod === 'POSTransfer' ? '💳 POS (Onsite)' : '✓ Paystack Online'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : order.orderStatus === 'Preparing'
                            ? 'bg-orange-500/10 text-orange-300 border-orange-500/30 animate-pulse'
                            : order.orderStatus === 'ReadyForPickup'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {order.orderStatus === 'Preparing' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                          {order.orderStatus === 'InTransit' && <Bike className="w-3.5 h-3.5 text-blue-400" />}
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* View Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForModal(order)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 ml-auto border border-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No orders found matching search query or selected status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Detailed Order Breakdown Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">Order Detail Audit</span>
              <h3 className="text-2xl font-black text-white font-mono mt-1">#{selectedOrderForModal.orderNumber}</h3>
              <p className="text-xs text-slate-400 mt-1">Placed on {new Date(selectedOrderForModal.createdAt).toLocaleString()}</p>
            </div>

            {/* Customer & Delivery details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Customer</span>
                <span className="font-bold text-white text-sm block mt-0.5">{selectedOrderForModal.customerName}</span>
                <span className="text-slate-400 text-[11px]">{selectedOrderForModal.formattedAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Dispatch Rider</span>
                <span className="font-bold text-white text-sm block mt-0.5">{selectedOrderForModal.riderName}</span>
                <span className="text-amber-400 font-mono text-[11px]">Verification Code: {selectedOrderForModal.pickupVerificationCode}</span>
              </div>
            </div>

            {/* Itemized breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ordered Items</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrderForModal.items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-white">{i.quantity}× {i.menuItemName}</span>
                    <span className="font-black text-emerald-400">₦{i.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Food Subtotal:</span>
                <span className="font-bold text-slate-200">₦{selectedOrderForModal.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Delivery Fee:</span>
                <span className="font-bold text-slate-200">₦{selectedOrderForModal.fixedDeliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Grand Total Paid (Paystack):</span>
                <span className="text-emerald-400">₦{selectedOrderForModal.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Order Receipt
              </button>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
