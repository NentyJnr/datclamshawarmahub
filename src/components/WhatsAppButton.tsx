import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '2348143616974';
  const defaultMessage = encodeURIComponent('Hello Datclam Shawarma! I would like to make an enquiry / order.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Datclam Shawarma on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 border-2 border-white/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      title="Chat with Datclam Shawarma on WhatsApp"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg 
        className="w-7 h-7 fill-current shrink-0" 
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.288.458-1.025 3.743 3.837-1.006.443.272z"/>
      </svg>
      
      <div className="hidden sm:flex flex-col text-left pr-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-90 leading-tight">Need Help?</span>
        <span className="text-xs font-black tracking-wide leading-tight">Chat on WhatsApp</span>
      </div>

      {/* Online Status Green Indicator Badge */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-200 border-2 border-white"></span>
      </span>
    </a>
  );
};
