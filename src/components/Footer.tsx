import React from 'react';
import { Link } from 'react-router-dom';
import { DatclamLogo } from './DatclamLogo';
import { ShieldCheck, MapPin, Clock, Phone, Globe, Award, Bike } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-amber-100/40 via-amber-50 to-orange-100/30 border-t-4 border-datclam-green text-stone-700 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        
        {/* Column 1: Brand Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <DatclamLogo size="lg" variant="raw" />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Freshy • Yummy • Tasty Shawarmas crafted by <strong className="text-stone-900">Shawarma Hub by Datclam</strong> with real-time GPS delivery tracking and security pickup verification.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-amber-200/90 px-3.5 py-2 rounded-full text-xs font-bold text-amber-900 shadow-sm">
            <Award className="w-4 h-4 text-emerald-600" /> Premium Quality Guaranteed
          </div>
        </div>

        {/* Column 2: Store Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-datclam-red" /> Store Location & Contact
          </h4>
          <div className="space-y-3 text-sm text-stone-700">
            <div>
              <p className="font-bold text-stone-900 text-base">Datclam Supermarket HQ</p>
              <p className="text-xs text-stone-500 mt-0.5">Commercial Hub, Lagos, Nigeria</p>
            </div>
            <div className="pt-1 space-y-2">
              <a 
                href="tel:08143616974" 
                className="flex items-center gap-2 text-stone-900 hover:text-datclam-red font-extrabold transition-colors group"
              >
                <Phone className="w-4 h-4 text-datclam-green shrink-0 group-hover:scale-110 transition-transform" />
                <span>08143616974</span>
              </a>
              <a 
                href="https://www.datclamsupermarket.com" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-stone-700 hover:text-datclam-red font-semibold text-xs transition-colors group"
              >
                <Globe className="w-4 h-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
                <span>www.datclamsupermarket.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Column 3: Opening Hours */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-datclam-green" /> Operating Hours
          </h4>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/90 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">Mon - Sun</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" /> Open Now
              </span>
            </div>
            <p className="text-emerald-700 font-black text-lg">08:00 AM - 10:00 PM</p>
            <p className="text-xs text-stone-500 font-medium">Freshly grilled wraps served all day</p>
          </div>
        </div>

        {/* Column 4: Pickup Security & Staff Login */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security Handshake
          </h4>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/90 text-xs text-stone-700 leading-relaxed shadow-sm space-y-3">
            <p className="font-semibold text-stone-800">
              "Cryptographic 6-character pickup code ensures 100% accurate order verification at store pickup."
            </p>
            <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
              <span className="text-[11px] text-amber-800 font-bold">⚡ Anti-Fraud System</span>
              <Link 
                to="/staff/login" 
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-950 hover:text-datclam-red bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg border border-amber-300 transition-colors shadow-sm"
              >
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                <span>Staff Portal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-amber-200/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
        <p>&copy; {new Date().getFullYear()} <strong className="text-stone-800">Shawarma Hub by Datclam</strong>. All rights reserved.</p>
        <div className="flex items-center gap-4 text-stone-600 font-semibold">
          <Link 
            to="/staff/login" 
            className="hover:text-datclam-red transition-colors flex items-center gap-1 font-bold text-amber-900"
          >
            <Bike className="w-3.5 h-3.5 text-emerald-600 inline-block" />
            <span>Staff Portal</span>
          </Link>
          <span>•</span>
          <span>www.datclamsupermarket.com</span>
          <span>•</span>
          <a href="tel:08143616974" className="hover:text-datclam-red transition-colors">08143616974</a>
        </div>
      </div>
    </footer>
  );
};
