import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-deep-bg flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500 font-serif">
           ﷺ
        </div>
      </div>
      <p className="mt-4 text-gold-200 font-serif text-lg animate-pulse">Al-Nur Al-Khafi</p>
    </div>
  );
};

export default LoadingOverlay;