import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackingPage } from './pages/TrackingPage';
import { StaffLoginPage } from './pages/StaffLoginPage';
import { KitchenDashboardPage } from './pages/KitchenDashboardPage';
import { RiderDashboardPage } from './pages/RiderDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between bg-[#FFFBF5] text-stone-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track/:orderId" element={<TrackingPage />} />
            <Route path="/staff/login" element={<StaffLoginPage />} />
            <Route path="/kitchen/dashboard" element={<KitchenDashboardPage />} />
            <Route path="/rider/dashboard" element={<RiderDashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
};

export default App;
