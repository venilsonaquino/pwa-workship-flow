import React from 'react';

export interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
}) => {
  return (
    <header className="dark:bg-inverse-surface border-outline-variant dark:border-outline flex justify-between items-center w-full px-5 h-16 sticky top-0 z-40 bg-transparent">
      <div className="flex items-center w-full relative h-full">
        {showBackButton && (
          <button
            onClick={onBack}
            className="absolute left-0 p-2 hover:bg-surface-variant/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
        )}
        <h1 className="mx-auto text-headline-md font-headline-md text-on-surface">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default PageHeader;
