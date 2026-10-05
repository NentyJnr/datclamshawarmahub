import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Yes, Proceed',
  cancelText = 'Keep Order',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in">
      {/* Modal Card */}
      <div 
        className="relative bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center text-white transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border-2 border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-8 h-8 text-datclam-red animate-pulse" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight text-white">{title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-1/2 py-3 px-5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700/80 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-1/2 py-3 px-5 rounded-xl font-black text-sm bg-gradient-to-r from-datclam-red to-red-700 hover:from-red-700 hover:to-datclam-red text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
