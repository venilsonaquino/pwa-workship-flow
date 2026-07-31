import React from 'react';

export const MaintenanceHeader: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center z-10 max-w-2xl px-2 mb-4">
      <div className="flex items-center gap-2">

      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high/80 backdrop-blur-md rounded-full border border-border/50 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
          Erro 503
        </span>
      </div>
    </div>
  );
};
