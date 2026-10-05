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
      id: selectedRole === 'KitchenStaff' ? 'u-kitchen-001' : 'u-rider-001',
      name: selectedRole === 'KitchenStaff' ? 'Head Chef Marcus' : 'Rider Tunde Bakare',
      role: selectedRole
    };

    const mockToken = `mock-jwt-token-${Date.now()}`;
    auth.login(mockUser, mockToken);

    if (selectedRole === 'KitchenStaff') {
      navigate('/kitchen/dashboard');
    } else {
      navigate('/rider/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Staff Portal Login</h1>
          <p className="text-xs text-slate-400">Select your operational role to enter dashboard</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole('KitchenStaff')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'KitchenStaff'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" /> Kitchen Staff
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('DispatchRider')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'DispatchRider'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" /> Dispatch Rider
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder={selectedRole === 'KitchenStaff' ? 'kitchen@datclam.com' : 'rider@datclam.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            Authenticate & Access Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
            ⚡ One-Click Demo Quick Login
          </span>
          <div className="grid grid-cols-2 gap-2">
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
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all hover:scale-105 cursor-pointer"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Kitchen</span>
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
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all hover:scale-105 cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo Rider</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Protected by Role-Based Access Control (RBAC)
        </div>

      </div>
    </div>
  );
};
