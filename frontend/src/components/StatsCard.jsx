import React from 'react';

export default function StatsCard({ label, value, delta }) {
  return (
    <div className="relative group overflow-hidden p-4 h-24 rounded-2xl bg-[#810000] shadow-md flex justify-between items-center transition-all duration-300 hover:bg-[#CE1212] transform hover:scale-105 hover:shadow-lg">
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full shimmer-layer" />
      </div>

      <div className="space-y-0.5 z-10">
        <p className="text-[#EEEBDD] text-sm font-medium">{label}</p>
        <p className="font-bold text-lg md:text-2xl text-white">{value}</p>
      </div>

      {delta && (
        <span className="text-[0.7rem] font-medium bg-white/20 text-white rounded-full px-2 py-0.5 z-10">
          {delta}
        </span>
      )}

      {/* Shimmer CSS */}
      <style>{`
        .shimmer-layer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          height: 100%;
          width: 150%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmerMove 2.5s ease-in-out infinite;
        }

        @keyframes shimmerMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
