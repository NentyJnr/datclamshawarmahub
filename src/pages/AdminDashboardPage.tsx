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
  ShieldCheck,
  Download,
  Filter,
  FileSpreadsheet,
  PieChart,
  Layers,
  ArrowDownToLine,
  Store,
  RefreshCw,
  User
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Order } from '../types';

// Mock historical dataset extending across days & months for comprehensive report filtering
const MOCK_HISTORICAL_ORDERS: Order[] = [
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
    orderNumber: 'ORD-ONS-551044',
    customerId: 'cust-walkin-01',
    customerName: 'Seyi (Walk-in Counter)',
    dispatchRiderId: 'onsite-pickup',
    riderName: 'Walk-in Counter Pickup',
    deliveryLatitude: 6.4450,
    deliveryLongitude: 3.4190,
    formattedAddress: 'Datclam Kitchen Counter (Onsite Pickup)',
    subtotal: 7500,
    fixedDeliveryFee: 0,
    grandTotal: 7500,
    pickupVerificationCode: 'DAT-662',
    orderStatus: 'Delivered',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T17:25:00.000Z',
    items: [
      { id: 'i6', menuItemId: 'm2', menuItemName: 'Classic Chicken Shawarma', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
      { id: 'i6b', menuItemId: 'm5', menuItemName: 'Chilled Datclam Special Lemonade', quantity: 2, unitPrice: 1250, totalPrice: 2500 }
    ]
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-ONS-449102',
    customerId: 'cust-walkin-02',
    customerName: 'Kemi (Walk-in Counter)',
    dispatchRiderId: 'onsite-pickup',
    riderName: 'Walk-in Counter Pickup',
    deliveryLatitude: 6.4710,
    deliveryLongitude: 3.4450,
    formattedAddress: 'Datclam Kitchen Counter (Onsite Pickup)',
    subtotal: 6000,
    fixedDeliveryFee: 0,
    grandTotal: 6000,
    pickupVerificationCode: 'DAT-771',
    orderStatus: 'Delivered',
    paymentMethod: 'POSTransfer',
    paymentStatus: 'Paid',
    createdAt: '2026-10-05T16:40:00.000Z',
    items: [
      { id: 'i7', menuItemId: 'm1', menuItemName: 'Mixed Deluxe (Chicken + Beef + Cheese)', quantity: 1, unitPrice: 6000, totalPrice: 6000 }
    ]
  },
  {
    id: 'ord-106',
    orderNumber: 'ORD-331099',
    customerId: 'cust-106',
    customerName: 'Femi Alabi',
    dispatchRiderId: 'r3-uuid-003',
    riderName: 'Kazeem Ojo (FastTrack Logistics)',
    deliveryLatitude: 6.4500,
    deliveryLongitude: 3.4200,
    formattedAddress: '5 Allen Avenue, Ikeja, Lagos',
    subtotal: 12000,
    fixedDeliveryFee: 1500,
    grandTotal: 13500,
    pickupVerificationCode: 'DAT-209',
    orderStatus: 'Delivered',
    paymentMethod: 'PaystackOnline',
    paymentStatus: 'Paid',
    createdAt: '2026-09-28T14:15:00.000Z',
    items: [
      { id: 'i8', menuItemId: 'm3', menuItemName: 'Suya Beef Special Shawarma', quantity: 2, unitPrice: 6000, totalPrice: 12000 }
    ]
  },
  {
    id: 'ord-107',
    orderNumber: 'ORD-ONS-220188',
    customerId: 'cust-walkin-03',
    customerName: 'Obinna Counter Customer',
    dispatchRiderId: 'onsite-pickup',
    riderName: 'Walk-in Counter Pickup',
    deliveryLatitude: 6.4500,
    deliveryLongitude: 3.4200,
    formattedAddress: 'Datclam Kitchen Counter (Onsite Pickup)',
    subtotal: 8500,
    fixedDeliveryFee: 0,
    grandTotal: 8500,
    pickupVerificationCode: 'DAT-812',
    orderStatus: 'Delivered',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    createdAt: '2026-09-15T12:30:00.000Z',
    items: [
      { id: 'i9', menuItemId: 'm1', menuItemName: 'Mixed Deluxe (Chicken + Beef + Cheese)', quantity: 1, unitPrice: 6000, totalPrice: 6000 },
      { id: 'i10', menuItemId: 'm4', menuItemName: 'Crispy French Fries (Large)', quantity: 1, unitPrice: 2500, totalPrice: 2500 }
    ]
  }
];

export const AdminDashboardPage: React.FC = () => {
  const { activeOrder } = useStore();
  const currentActiveOrder = activeOrder.order;
  const storeOrdersList = activeOrder.ordersList || [];

  // Active Admin Sub-Navbar Tab State ('orders' | 'reports')
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'reports'>('orders');

  // Shared Modal State
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Tab 1: Orders Filter & Search State
  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<string>('All');

  // Tab 2: Reports Filter State
  const [reportDateFilter, setReportDateFilter] = useState<string>(''); // YYYY-MM-DD
  const [reportMonthFilter, setReportMonthFilter] = useState<string>('All');
  const [reportRiderFilter, setReportRiderFilter] = useState<string>('All');
  const [reportPaymentFilter, setReportPaymentFilter] = useState<string>('All');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('All');
  const [reportSearchTerm, setReportSearchTerm] = useState<string>('');

  // Combined Dataset: Master List of All Orders
  const allMasterOrders = useMemo(() => {
    let list = [...MOCK_HISTORICAL_ORDERS];

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

  // Orders Tab Filtered Dataset
  const tabOrdersList = useMemo(() => {
    return allMasterOrders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
        order.riderName.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
        order.pickupVerificationCode.toLowerCase().includes(ordersSearchTerm.toLowerCase());

      const matchesStatus = ordersStatusFilter === 'All' || order.orderStatus === ordersStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allMasterOrders, ordersSearchTerm, ordersStatusFilter]);

  // Today's Key Metrics for Orders Tab
  const todayRevenue = useMemo(() => {
    return allMasterOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [allMasterOrders]);

  const todayFoodSales = useMemo(() => {
    return allMasterOrders.reduce((sum, o) => sum + o.subtotal, 0);
  }, [allMasterOrders]);

  const todayDeliveryFees = useMemo(() => {
    return allMasterOrders.reduce((sum, o) => sum + o.fixedDeliveryFee, 0);
  }, [allMasterOrders]);

  const todayOrdersCount = allMasterOrders.length;
  const avgOrderValueToday = todayOrdersCount > 0 ? Math.round(todayRevenue / todayOrdersCount) : 0;

  const statusCounts = useMemo(() => {
    return {
      Preparing: allMasterOrders.filter(o => o.orderStatus === 'Preparing').length,
      ReadyForPickup: allMasterOrders.filter(o => o.orderStatus === 'ReadyForPickup').length,
      InTransit: allMasterOrders.filter(o => o.orderStatus === 'InTransit').length,
      Delivered: allMasterOrders.filter(o => o.orderStatus === 'Delivered').length,
    };
  }, [allMasterOrders]);

  // Tab 2: Reports Filtered Dataset
  const filteredReportOrders = useMemo(() => {
    return allMasterOrders.filter((order) => {
      // Date filter check
      if (reportDateFilter) {
        const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (orderDateStr !== reportDateFilter) return false;
      }

      // Month filter check
      if (reportMonthFilter !== 'All') {
        const orderMonth = new Date(order.createdAt).getMonth() + 1; // 1 - 12
        if (orderMonth !== parseInt(reportMonthFilter, 10)) return false;
      }

      // Rider filter check
      if (reportRiderFilter !== 'All') {
        if (reportRiderFilter === 'Walk-in Counter Pickup') {
          if (order.dispatchRiderId !== 'onsite-pickup' && order.riderName !== 'Walk-in Counter Pickup') return false;
        } else {
          if (order.riderName !== reportRiderFilter) return false;
        }
      }

      // Payment method check
      if (reportPaymentFilter !== 'All') {
        if (order.paymentMethod !== reportPaymentFilter) return false;
      }

      // Status check
      if (reportStatusFilter !== 'All') {
        if (order.orderStatus !== reportStatusFilter) return false;
      }

      // Search term check
      if (reportSearchTerm) {
        const term = reportSearchTerm.toLowerCase();
        const matches = 
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.riderName.toLowerCase().includes(term) ||
          order.pickupVerificationCode.toLowerCase().includes(term);
        if (!matches) return false;
      }

      return true;
    });
  }, [allMasterOrders, reportDateFilter, reportMonthFilter, reportRiderFilter, reportPaymentFilter, reportStatusFilter, reportSearchTerm]);

  // Report Aggregate Financial Metrics
  const reportTotalRevenue = useMemo(() => {
    return filteredReportOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [filteredReportOrders]);

  const reportTotalFoodSales = useMemo(() => {
    return filteredReportOrders.reduce((sum, o) => sum + o.subtotal, 0);
  }, [filteredReportOrders]);

  const reportTotalDeliveryFees = useMemo(() => {
    return filteredReportOrders.reduce((sum, o) => sum + o.fixedDeliveryFee, 0);
  }, [filteredReportOrders]);

  const reportOnlinePaystackRevenue = useMemo(() => {
    return filteredReportOrders.filter(o => o.paymentMethod === 'PaystackOnline').reduce((sum, o) => sum + o.grandTotal, 0);
  }, [filteredReportOrders]);

  const reportOnsiteCashRevenue = useMemo(() => {
    return filteredReportOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  }, [filteredReportOrders]);

  const reportOnsitePosRevenue = useMemo(() => {
    return filteredReportOrders.filter(o => o.paymentMethod === 'POSTransfer').reduce((sum, o) => sum + o.grandTotal, 0);
  }, [filteredReportOrders]);

  const reportAvgOrderValue = filteredReportOrders.length > 0 ? Math.round(reportTotalRevenue / filteredReportOrders.length) : 0;

  // Export Filtered Report to CSV
  const handleExportCSV = () => {
    if (filteredReportOrders.length === 0) {
      alert('No data available to export based on current filters.');
      return;
    }

    const headers = ['Order Number', 'Date & Time', 'Customer Name', 'Fulfillment / Address', 'Assigned Rider', 'Payment Method', 'Payment Status', 'Food Subtotal (NGN)', 'Delivery Fee (NGN)', 'Grand Total (NGN)', 'Order Status'];

    const rows = filteredReportOrders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerName}"`,
      `"${o.formattedAddress}"`,
      `"${o.riderName}"`,
      `"${o.paymentMethod === 'Cash' ? 'Cash (Onsite)' : o.paymentMethod === 'POSTransfer' ? 'POS (Onsite)' : 'Paystack Online'}"`,
      `"${o.paymentStatus}"`,
      o.subtotal,
      o.fixedDeliveryFee,
      o.grandTotal,
      `"${o.orderStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Datclam_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-stone-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner Executive Header */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-datclam-green flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#008751] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#008751]/30 border border-emerald-400/40">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Datclam Staff Portal</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#008751]/30 text-emerald-300 border border-[#008751]/50">
                Executive Admin View
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Datclam Shawarma Executive Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-stone-900/90 px-4 py-2.5 rounded-2xl border border-stone-700 text-xs font-bold text-amber-200 shadow-md">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
      </div>

      {/* Sub-Navbar Navigation Bar (Orders vs Report Options) */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-2 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-[#008751] text-white shadow-lg shadow-[#008751]/30 scale-[1.02]'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Register</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'reports'
                ? 'bg-[#008751] text-white shadow-lg shadow-[#008751]/30 scale-[1.02]'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Analytics & Reports</span>
          </button>

        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-stone-500 pr-2">
          <ShieldCheck className="w-4 h-4 text-[#008751]" />
          <span>Admin Controls Active</span>
        </div>
      </div>

      {/* TAB 1: ORDERS REGISTER VIEW */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Revenue */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-500 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Total Revenue Today</span>
                <div className="p-2.5 rounded-xl bg-emerald-100 text-[#008751] border border-emerald-300">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-stone-900">₦{todayRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-stone-500 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#008751]" /> 
                  <span>Food: ₦{todayFoodSales.toLocaleString()} • Delivery: ₦{todayDeliveryFees.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-3 relative overflow-hidden group hover:border-amber-500 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Total Orders Today</span>
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-stone-900">{todayOrdersCount} <span className="text-sm text-stone-500 font-normal">Orders</span></div>
                <p className="text-[11px] text-[#008751] mt-1 flex items-center gap-1 font-extrabold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Online & Counter Verified
                </p>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-3 relative overflow-hidden group hover:border-amber-500 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Average Order Value</span>
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-stone-900">₦{avgOrderValueToday.toLocaleString()}</div>
                <p className="text-[11px] text-stone-500 font-medium mt-1">Per completed customer ticket</p>
              </div>
            </div>

            {/* Live Operational Status */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-500 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Live Pipeline Status</span>
                <div className="p-2.5 rounded-xl bg-emerald-100 text-[#008751] border border-emerald-300">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="text-amber-800 flex items-center gap-1"><Flame className="w-3 h-3 text-datclam-red" /> Prep:</span>
                  <span className="text-stone-900 font-black">{statusCounts.Preparing}</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="text-amber-800 flex items-center gap-1"><Bike className="w-3 h-3 text-[#008751]" /> Transit:</span>
                  <span className="text-stone-900 font-black">{statusCounts.InTransit}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Orders Data Table Card */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Table Controls Header */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-datclam-red" /> Live Daily Order Register & Sales Ledger
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-1">Real-time status tracking and financial amounts for all orders processed today.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search order #, customer..."
                    value={ordersSearchTerm}
                    onChange={(e) => setOrdersSearchTerm(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#008751] transition-colors"
                  />
                  {ordersSearchTerm && (
                    <button 
                      onClick={() => setOrdersSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-full sm:w-auto overflow-x-auto">
                  {['All', 'Preparing', 'ReadyForPickup', 'InTransit', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrdersStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                        ordersStatusFilter === st
                          ? 'bg-[#008751] text-white shadow'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {st === 'ReadyForPickup' ? 'Ready' : st === 'InTransit' ? 'In Transit' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-[11px] uppercase font-black text-stone-500 tracking-wider bg-stone-50/80">
                    <th className="py-3.5 px-4 rounded-l-xl">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items Summary</th>
                    <th className="py-3.5 px-4">Assigned Rider</th>
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4 text-right">Amount (₦)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/80 text-sm">
                  {tabOrdersList.length > 0 ? (
                    tabOrdersList.map((order) => {
                      const orderDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <tr key={order.id} className="hover:bg-amber-50/60 transition-colors group">
                          
                          {/* Order Number & Time */}
                          <td className="py-4 px-4">
                            <div className="font-mono font-bold text-amber-900">{order.orderNumber}</div>
                            <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-stone-400" /> {orderDate}
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-stone-900">{order.customerName}</div>
                            <div className="text-xs text-stone-500 truncate max-w-[180px]">{order.formattedAddress}</div>
                          </td>

                          {/* Items Summary */}
                          <td className="py-4 px-4">
                            <div className="text-xs text-stone-700 font-medium">
                              {order.items.map((i) => (
                                <span key={i.id} className="block">
                                  {i.quantity}× {i.menuItemName}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Rider */}
                          <td className="py-4 px-4">
                            <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                              <Bike className="w-3.5 h-3.5 text-[#008751] shrink-0" />
                              <span className="truncate max-w-[140px]">{order.riderName}</span>
                            </div>
                          </td>

                          {/* Code */}
                          <td className="py-4 px-4 font-mono font-black text-xs text-amber-800">
                            {order.pickupVerificationCode}
                          </td>

                          {/* Grand Total */}
                          <td className="py-4 px-4 text-right font-black text-[#008751] text-base">
                            ₦{order.grandTotal.toLocaleString()}
                            <span className="block text-[10px] text-stone-500 font-bold">
                              {order.paymentMethod === 'Cash' ? '💵 Cash (Onsite)' : order.paymentMethod === 'POSTransfer' ? '💳 POS (Onsite)' : '✓ Paystack Online'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-[#008751] border-emerald-300'
                                : order.orderStatus === 'Preparing'
                                ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                                : order.orderStatus === 'ReadyForPickup'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}>
                              {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5 text-[#008751]" />}
                              {order.orderStatus === 'Preparing' && <Flame className="w-3.5 h-3.5 text-datclam-red" />}
                              {order.orderStatus === 'InTransit' && <Bike className="w-3.5 h-3.5 text-blue-600" />}
                              {order.orderStatus}
                            </span>
                          </td>

                          {/* View Action */}
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderForModal(order)}
                              className="px-3.5 py-1.5 bg-stone-100 hover:bg-[#008751] text-stone-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 ml-auto border border-stone-300 cursor-pointer shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400">
                        No orders found matching search or status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: REPORTS & ANALYTICS VIEW */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Advanced Report Filter Panel */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-datclam-red" /> Report Custom Filter Controls
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-1">Filter financial sales reports by specific date, month, dispatch rider, mode of payment, or status.</p>
              </div>

              {/* Action Buttons: Export CSV & Print PDF */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto bg-[#008751] hover:bg-[#007043] text-white px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#008751]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV / Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Report PDF</span>
                </button>
              </div>
            </div>

            {/* Filter Input Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Date Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Specific Date</label>
                <input
                  type="date"
                  value={reportDateFilter}
                  onChange={(e) => setReportDateFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#008751]"
                />
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Month</label>
                <select
                  value={reportMonthFilter}
                  onChange={(e) => setReportMonthFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#008751]"
                >
                  <option value="All">All Months</option>
                  <option value="10">October 2026</option>
                  <option value="9">September 2026</option>
                  <option value="8">August 2026</option>
                </select>
              </div>

              {/* Rider Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Dispatch Rider</label>
                <select
                  value={reportRiderFilter}
                  onChange={(e) => setReportRiderFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#008751]"
                >
                  <option value="All">All Riders & Counter</option>
                  <option value="Tunde Bakare (Datclam Express)">Tunde Bakare (Datclam Express)</option>
                  <option value="Emeka Nwosu (Speedy Courier)">Emeka Nwosu (Speedy Courier)</option>
                  <option value="Kazeem Ojo (FastTrack Logistics)">Kazeem Ojo (FastTrack)</option>
                  <option value="Walk-in Counter Pickup">Walk-in Counter Pickup</option>
                </select>
              </div>

              {/* Mode of Payment Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Mode of Payment</label>
                <select
                  value={reportPaymentFilter}
                  onChange={(e) => setReportPaymentFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#008751]"
                >
                  <option value="All">All Payment Modes</option>
                  <option value="PaystackOnline">Paystack Online</option>
                  <option value="Cash">Cash (Counter Onsite)</option>
                  <option value="POSTransfer">POS Transfer (Counter)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Order Status</label>
                <select
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#008751]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Delivered">Delivered / Completed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="ReadyForPickup">Ready For Pickup</option>
                  <option value="InTransit">In Transit</option>
                </select>
              </div>

            </div>

            {/* Reset Filters Quick Button */}
            {(reportDateFilter || reportMonthFilter !== 'All' || reportRiderFilter !== 'All' || reportPaymentFilter !== 'All' || reportStatusFilter !== 'All') && (
              <div className="flex justify-end pt-2 border-t border-stone-200">
                <button
                  onClick={() => {
                    setReportDateFilter('');
                    setReportMonthFilter('All');
                    setReportRiderFilter('All');
                    setReportPaymentFilter('All');
                    setReportStatusFilter('All');
                    setReportSearchTerm('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
                </button>
              </div>
            )}

          </div>

          {/* Filtered Financial Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Filtered Revenue</span>
              <div className="text-3xl font-black text-[#008751]">₦{reportTotalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-stone-500">Food: ₦{reportTotalFoodSales.toLocaleString()} • Delivery: ₦{reportTotalDeliveryFees.toLocaleString()}</p>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Filtered Order Count</span>
              <div className="text-3xl font-black text-stone-900">{filteredReportOrders.length} <span className="text-sm font-normal text-stone-500">Orders</span></div>
              <p className="text-[11px] text-amber-800 font-bold">Avg Value: ₦{reportAvgOrderValue.toLocaleString()}</p>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Paystack Online Revenue</span>
              <div className="text-3xl font-black text-emerald-600">₦{reportOnlinePaystackRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-stone-500">100% Online Payment Verified</p>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Counter Cash & POS Sales</span>
              <div className="text-3xl font-black text-amber-900">₦{(reportOnsiteCashRevenue + reportOnsitePosRevenue).toLocaleString()}</div>
              <p className="text-[11px] text-stone-500">Cash: ₦{reportOnsiteCashRevenue.toLocaleString()} • POS: ₦{reportOnsitePosRevenue.toLocaleString()}</p>
            </div>

          </div>

          {/* Filtered Report Table Card */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#008751]" /> Filtered Sales Report Register ({filteredReportOrders.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Showing itemized result set ready for audit, review, or CSV download.</p>
              </div>

              <span className="text-xs font-bold text-[#008751] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                {filteredReportOrders.length} Record(s) Matches Filter
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-[11px] uppercase font-black text-stone-500 tracking-wider bg-stone-50/80">
                    <th className="py-3.5 px-4 rounded-l-xl">Date & Order #</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Assigned Rider / Counter</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Grand Total (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/80 text-sm">
                  {filteredReportOrders.length > 0 ? (
                    filteredReportOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50/60 transition-colors">
                        
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-amber-900">{order.orderNumber}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-stone-900">{order.customerName}</div>
                          <div className="text-xs text-stone-500 truncate max-w-[180px]">{order.formattedAddress}</div>
                        </td>

                        <td className="py-4 px-4 text-xs font-bold text-stone-700">
                          {order.riderName}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                            order.paymentMethod === 'Cash' || order.paymentMethod === 'POSTransfer'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-[#008751] border-emerald-300'
                          }`}>
                            {order.paymentMethod === 'Cash' ? '💵 Cash (Onsite)' : order.paymentMethod === 'POSTransfer' ? '💳 POS (Onsite)' : '✓ Paystack Online'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-[#008751] border border-emerald-300">
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right font-black text-[#008751] text-base">
                          ₦{order.grandTotal.toLocaleString()}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        No orders match the selected report filter parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Detailed Order View Modal (Shared Across Tabs) */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-200 pb-4">
              <span className="text-xs uppercase font-black text-[#008751] tracking-wider">Order Detail Audit</span>
              <h3 className="text-2xl font-black text-amber-900 font-mono mt-1">#{selectedOrderForModal.orderNumber}</h3>
              <p className="text-xs text-stone-500 mt-1">Placed on {new Date(selectedOrderForModal.createdAt).toLocaleString()}</p>
            </div>

            {/* Customer & Delivery details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <div>
                <span className="text-stone-500 block uppercase font-bold text-[10px]">Customer</span>
                <span className="font-bold text-stone-900 text-sm block mt-0.5">{selectedOrderForModal.customerName}</span>
                <span className="text-stone-500 text-[11px]">{selectedOrderForModal.formattedAddress}</span>
              </div>
              <div>
                <span className="text-stone-500 block uppercase font-bold text-[10px]">Fulfillment / Rider</span>
                <span className="font-bold text-stone-900 text-sm block mt-0.5">{selectedOrderForModal.riderName}</span>
                <span className="text-amber-800 font-mono text-[11px]">Code: {selectedOrderForModal.pickupVerificationCode}</span>
              </div>
            </div>

            {/* Itemized breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider block">Ordered Items</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrderForModal.items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-800">{i.quantity}× {i.menuItemName}</span>
                    <span className="font-black text-[#008751]">₦{i.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Food Subtotal:</span>
                <span className="font-bold text-stone-800">₦{selectedOrderForModal.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Fixed Delivery Fee:</span>
                <span className="font-bold text-stone-800">₦{selectedOrderForModal.fixedDeliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total Paid ({selectedOrderForModal.paymentMethod}):</span>
                <span className="text-[#008751]">₦{selectedOrderForModal.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Order Receipt
              </button>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="flex-1 bg-[#008751] hover:bg-[#007043] text-white py-3 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
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
