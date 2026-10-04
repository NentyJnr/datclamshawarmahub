import React from 'react';
import logoImg from '../assets/logo.png';

interface DatclamLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'light' | 'dark' | 'raw' | 'badge';
}

export const DatclamLogo: React.FC<DatclamLogoProps> = ({ 
  size = 'md', 
  className = '',
  variant = 'badge' 
}) => {
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2.5 sm:gap-3 bg-stone-50 border-2 border-amber-400 rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 shadow-lg ${className}`}>
        {/* Inner Rounded Logo Badge */}
        <div className="bg-white px-2 py-0.5 rounded-full border border-emerald-200/80 shadow-sm flex items-center justify-center shrink-0">
          <img 
            src={logoImg} 
            alt="Datclam Groceries Logo" 
            className="h-7 sm:h-9 w-auto object-contain"
          />
        </div>
        {/* Official Shawarma Hub Text */}
        <span className="text-datclam-red font-black text-xs sm:text-sm md:text-base tracking-wide uppercase pr-1.5 select-none whitespace-nowrap">
          OFFICIAL SHAWARMA HUB
        </span>
      </div>
    );
  }

  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  const containerClasses = variant === 'raw' 
    ? ''
    : 'bg-white px-2 py-1 rounded-full shadow-md border border-emerald-100 flex items-center justify-center';

  return (
    <div className={`inline-flex items-center shrink-0 ${containerClasses} ${className}`}>
      <img 
        src={logoImg} 
        alt="Datclam Groceries Logo" 
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-105`}
      />
    </div>
  );
};


