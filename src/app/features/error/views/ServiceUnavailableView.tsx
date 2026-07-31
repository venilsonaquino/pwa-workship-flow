import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MaintenanceHeader } from '../components/MaintenanceHeader';
import { MaintenanceHeroGraphic } from '../components/MaintenanceHeroGraphic';
import { MaintenanceActions } from '../components/MaintenanceActions';
import { MaintenanceFooter } from '../components/MaintenanceFooter';

export const ServiceUnavailableView: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between items-center px-4 py-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <MaintenanceHeader />

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center text-center z-10 py-4">
        <MaintenanceHeroGraphic />

        <div className="space-y-3 mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Ops, Algo Desafinou por aqui
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Nosso servidor teve um imprevisto e estamos correndo para consertar, voltaremos em instantes.
          </p>
        </div>

        <MaintenanceActions onRetry={handleRetry} onGoHome={handleGoHome} />
      </main>

      <MaintenanceFooter />
    </div>
  );
};

export default ServiceUnavailableView;
