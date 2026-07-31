import React from 'react';

interface MaintenanceActionsProps {
  onRetry: () => void;
  onGoHome: () => void;
}

export const MaintenanceActions: React.FC<MaintenanceActionsProps> = ({
  onRetry,
  onGoHome,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm mb-6">
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3.5 px-6 bg-primary hover:bg-primary-variant text-on-primary font-semibold rounded-2xl shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">
          refresh
        </span>
        Tentar Novamente
      </button>

      <button
        type="button"
        onClick={onGoHome}
        className="w-full py-3.5 px-6 bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface font-semibold rounded-2xl border border-border/60 hover:border-border transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
      >
        Voltar ao Início
      </button>
    </div>
  );
};
