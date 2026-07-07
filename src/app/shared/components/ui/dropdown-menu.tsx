import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@src/lib/utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className={cn("relative inline-block text-left", className)}>{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');
  const { isOpen, setIsOpen, triggerRef } = context;

  const handleRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };

  return (
    <button
      ref={handleRef}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={className}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }
>(({ className, align = 'end', children, ...props }, ref) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu');
  const { isOpen, setIsOpen, triggerRef } = context;
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isOpen) return null;

  const handleRef = (node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const alignClass =
    align === 'start'
      ? 'left-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'right-0';

  return (
    <div
      ref={handleRef}
      className={cn(
        'absolute top-full mt-2 w-48 z-50 animate-fade-in-up focus:outline-none dropdown-menu-custom-content',
        alignClass,
        className
      )}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, onClick, children, active, ...props }, ref) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuItem must be used within a DropdownMenu');
  const { setIsOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    setIsOpen(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(
        'dropdown-item-custom',
        active && 'active',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export default DropdownMenu;
