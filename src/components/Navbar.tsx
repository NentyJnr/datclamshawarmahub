import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, Compass } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DatclamLogo } from './DatclamLogo';
import navbarBgImg from '../assets/navbar-bg.png';

export const Navbar: React.FC<{ onNavigateHome?: () => void; onNavigateMenu?: () => void }> = ({
  onNavigateHome,
}) => {
  const { cart, auth, activeOrder } = useStore();
  const navigate = useNavigate();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b-4 border-datclam-green relative overflow-hidden"
    >
      {/* Subtle warm ambient gradient line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-datclam-red to-datclam-green" />

      {/* Main Navbar Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => onNavigateHome && onNavigateHome()}
          className="flex items-center group transition-transform hover:scale-105 shrink-0"
        >
          <DatclamLogo variant="badge" />
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 font-semibold text-stone-800">

          {/* THE DATCLAM ADVANTAGE Pill Link */}
          <button
            onClick={() => {
              if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  const el = document.getElementById('datclam-advantage');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                const el = document.getElementById('datclam-advantage');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden md:inline-flex items-center gap-2 text-xs font-black uppercase text-amber-800 tracking-widest bg-amber-100/90 hover:bg-amber-200/90 px-5 py-2.5 rounded-full border border-amber-300 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span>THE DATCLAM ADVANTAGE</span>
          </button>

          {/* How it works Navigation Button */}
          <button
            onClick={() => {
              if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-black uppercase text-amber-800 tracking-widest bg-amber-100/90 hover:bg-amber-200/90 px-5 py-2.5 rounded-full border border-amber-300 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span>HOW IT WORKS</span>
          </button>

          {activeOrder.order && (
            <Link 
              to={`/track/${activeOrder.order.id}`}
              className="text-amber-900 font-extrabold flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 border border-amber-300 text-xs shadow-sm transition-all hover:bg-amber-200 animate-pulse"
            >
              <Compass className="w-4 h-4 text-amber-600 shrink-0" /> 
              <span>Active Order #{activeOrder.order.orderNumber}</span>
            </Link>
          )}

          {/* Cart Button (Invisible until customer picks an item and adds to cart) */}
          {cartCount > 0 && (
            <Link
              to="/checkout"
              className="relative bg-gradient-to-r from-datclam-red to-red-600 hover:from-red-600 hover:to-datclam-red text-white px-5 py-2.5 sm:py-3 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-red-600/20 border border-red-500/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">Cart</span>
              <span className="bg-white text-datclam-red text-xs px-2.5 py-1 rounded-full font-black shadow-sm">
                ₦{cart.getSubtotal().toLocaleString()}
              </span>
              <span className="absolute -top-2 -right-2 bg-datclam-green text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                {cartCount}
              </span>
            </Link>
          )}

          {auth.user && (
            <button
              onClick={() => {
                auth.logout();
                navigate('/staff/login');
              }}
              className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 hover:bg-rose-50 hover:text-rose-600 text-stone-700 transition-all shadow-sm"
              title="Logout Staff"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
