import React, { useState } from 'react';
import { cn } from '@src/lib/utils';

export interface NavigationMenuProps {
  activeTab?: string;
  onChange?: (tab: string) => void;
  onFabClick?: () => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeTab: controlledActiveTab,
  onChange,
  onFabClick,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState('scales');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const tabs: TabItem[] = [
    { id: 'scales', label: 'Escalas', icon: 'event_note' },
    { id: 'songs', label: 'Músicas', icon: 'grid_view' },
    { id: 'repertoire', label: 'Repertório', icon: 'queue_music' },
    { id: 'profile', label: 'Perfil', icon: 'account_circle' },
  ];

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    if (onChange) {
      onChange(tabId);
    }
  };

  const handleFabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFabClick) {
      onFabClick();
    } else {
      console.info('[NavigationMenu] FAB Clicked');
    }
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md h-[72px] z-50 transition-all duration-300">
      {/* Solid background element matching the design */}
      <div className="absolute inset-0 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-lg -z-10 pointer-events-none" />

      <div className="flex justify-between items-center px-4 h-full relative">
        {/* Left two tabs */}
        <div className="flex flex-1 justify-around">
          {tabs.slice(0, 2).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer transition-all duration-200 active:scale-95',
                  isActive 
                    ? 'text-primary font-semibold' 
                    : 'text-on-surface-variant opacity-70 hover:opacity-100'
                )}
              >
                <span 
                  className="material-symbols-outlined text-[24px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400"
                  }}
                >
                  {tab.icon}
                </span>
                <span className="text-[10px] mt-0.5 tracking-wide font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button (FAB) */}
        <div className="flex justify-center items-center w-16 h-full relative">
          <button
            onClick={handleFabClick}
            aria-label="Adicionar"
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-surface-container-lowest -translate-y-6 transition-all duration-200 active:scale-90 hover:scale-105 hover:-translate-y-7 hover:shadow-xl cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #630ed4 0%, #2170e4 100%)'
            }}
          >
            <span className="material-symbols-outlined text-[32px] select-none">
              add
            </span>
          </button>
        </div>

        {/* Right two tabs */}
        <div className="flex flex-1 justify-around">
          {tabs.slice(2).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer transition-all duration-200 active:scale-95',
                  isActive 
                    ? 'text-primary font-semibold' 
                    : 'text-on-surface-variant opacity-70 hover:opacity-100'
                )}
              >
                <span 
                  className="material-symbols-outlined text-[24px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400"
                  }}
                >
                  {tab.icon}
                </span>
                <span className="text-[10px] mt-0.5 tracking-wide font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
