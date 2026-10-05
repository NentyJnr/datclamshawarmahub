import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bike, ChefHat, Lock, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';

export const StaffLoginPage: React.FC = () => {
  const { auth } = useStore();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('KitchenStaff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUser = {
      id: selectedRole === 'KitchenStaff' ? 'u-kitchen-001' : selectedRole === 'DispatchRider' ? 'u-rider-001' : 'u-admin-001',
      name: selectedRole === 'KitchenStaff' ? 'Head Chef Marcus' : selectedRole === 'DispatchRider' ? 'Rider Tunde Bakare' : 'Store Admin Victoria',
      role: selectedRole
    };

    const mockToken = `mock-jwt-token-${Date.now()}`;
    auth.login(mockUser, mockToken);

    if (selectedRole === 'KitchenStaff') {
      navigate('/kitchen/dashboard');
    } else if (selectedRole === 'DispatchRider') {
      navigate('/rider/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FFFBF5]">
      <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-amber-950/5 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#008751]/10 border border-[#008751]/30 text-[#008751] flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Staff Portal Login</h1>
          <p className="text-xs font-semibold text-stone-500">Select your operational role to enter dashboard</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            type="button"
            onClick={() => setSelectedRole('KitchenStaff')}
            className={`py-2.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'KitchenStaff'
                ? 'bg-[#008751] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Kitchen
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('DispatchRider')}
            className={`py-2.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'DispatchRider'
                ? 'bg-[#008751] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Rider
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('Admin')}
            className={`py-2.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'Admin'
                ? 'bg-[#008751] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder={
                selectedRole === 'KitchenStaff'
                  ? 'kitchen@datclam.com'
                  : selectedRole === 'DispatchRider'
                  ? 'rider@datclam.com'
                  : 'admin@datclam.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#008751] font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#008751] font-medium transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-datclam-red to-red-600 hover:from-red-600 hover:to-datclam-red text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Authenticate & Access Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div className="pt-3 border-t border-stone-200 space-y-2.5">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block text-center">
            ⚡ One-Click Demo Quick Login
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                const mockUser = {
                  id: 'u-kitchen-001',
                  name: 'Head Chef Marcus',
                  role: 'KitchenStaff' as const
                };
                auth.login(mockUser, `mock-jwt-token-${Date.now()}`);
                navigate('/kitchen/dashboard');
              }}
              className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-amber-300 transition-all hover:scale-105 cursor-pointer"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-700" />
              <span>Kitchen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const mockUser = {
                  id: 'u-rider-001',
                  name: 'Rider Tunde Bakare',
                  role: 'DispatchRider' as const
                };
                auth.login(mockUser, `mock-jwt-token-${Date.now()}`);
                navigate('/rider/dashboard');
              }}
              className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-amber-300 transition-all hover:scale-105 cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5 text-[#008751]" />
              <span>Rider</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const mockUser = {
                  id: 'u-admin-001',
                  name: 'Store Admin Victoria',
                  role: 'Admin' as const
                };
                auth.login(mockUser, `mock-jwt-token-${Date.now()}`);
                navigate('/admin/dashboard');
              }}
              className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-amber-300 transition-all hover:scale-105 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-datclam-red" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-stone-500 font-semibold flex items-center justify-center gap-1 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" /> Protected by Role-Based Access Control (RBAC)
        </div>

      </div>
    </div>
  );
};
