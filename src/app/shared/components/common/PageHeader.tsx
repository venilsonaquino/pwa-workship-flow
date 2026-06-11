import React from 'react';
import Button from '@shared/components/ui/button';

export interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  rightAction,
  children,
}) => {
  return (
    <header
      className="sticky top-0 z-[200] w-full h-16 bg-background flex items-center justify-between transition-colors duration-250"
    >
      <div className="flex items-center w-full relative h-full">
        {children ? (
          children
        ) : (
          <>
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                iconOnly
                className="absolute left-0 text-primary"
                aria-label="Voltar"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </Button>
            )}
            <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold text-primary whitespace-nowrap">
              {title}
            </h1>
            {rightAction && (
              <div className="absolute right-0 flex items-center">
                {rightAction}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
