import React from 'react';
import { usePWAInstall } from '@shared/hooks/usePWAInstall';
import { Button } from '../ui/button';

export const PWAInstallPrompt: React.FC = () => {
  const { showPrompt, isIOS, install, dismiss } = usePWAInstall();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full rounded-t-xl rounded-b-none border-t border-x border-b-0 border-border bg-surface p-6 z-[500] animate-slide-up-mobile flex flex-col gap-4 box-border dark:bg-[#16161e]/85 dark:backdrop-blur-md md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[90%] md:max-w-[460px] md:rounded-xl md:border-b md:animate-slide-up">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 min-w-[48px] rounded-lg bg-gradient-to-br from-[hsl(258,90%,60%)] to-[hsl(180,70%,45%)] flex items-center justify-center shadow-[0_4px_12px_rgba(170,59,255,0.3)]">
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <h3 className="m-0 text-lg font-bold text-on-background">Instalar Aplicativo</h3>
          <p className="m-0 text-sm text-placeholder leading-[1.45]">
            Instale o <strong>Worship Flow</strong> na sua tela inicial para uma experiência rápida, offline e nativa.
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="flex flex-col gap-2 p-4 bg-surface-variant rounded-lg border border-dashed border-border">
          <div className="flex items-center gap-2 text-sm text-on-surface text-left leading-5">
            <span className="inline-flex items-center justify-center bg-surface border border-border rounded-md w-8 h-8 min-w-[32px] text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M12 11V3M9 6l3-3 3 3" />
              </svg>
            </span>
            <span>1. Toque no botão de <strong>Compartilhar</strong> na barra de navegação do Safari.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface text-left leading-5">
            <span className="inline-flex items-center justify-center bg-surface border border-border rounded-md w-8 h-8 min-w-[32px] text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            <span>2. Role a lista e selecione <strong>Adicionar à Tela de Início</strong>.</span>
          </div>
          <div className="flex gap-2 justify-end mt-1 max-sm:flex-col max-sm:w-full [&>button]:max-sm:w-full">
            <Button variant="secondary" size="sm" onClick={dismiss}>
              Entendi
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 justify-end mt-1 max-sm:flex-col max-sm:w-full [&>button]:max-sm:w-full">
          <Button variant="secondary" size="sm" onClick={dismiss}>
            Mais tarde
          </Button>
          <Button variant="primary" size="sm" onClick={install}>
            Instalar
          </Button>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
