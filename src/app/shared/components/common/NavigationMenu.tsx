import React, { useState } from 'react';
import { cn } from '@src/lib/utils';

export interface NavigationMenuProps {
  activeTab?: string;
  onChange?: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeTab: controlledActiveTab,
  onChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState('scales');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const tabs: TabItem[] = [
    { id: 'scales', label: 'Escalas', icon: 'event_note' },
    { id: 'songs', label: 'Músicas', icon: 'music_note' },
    { id: 'ranking', label: 'Ranking', icon: 'leaderboard' },
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

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md h-[72px] z-50 transition-all duration-300">
      {/* Solid background element matching the design */}
      <div className="absolute inset-0 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-lg -z-10 pointer-events-none" />

      <div className="flex justify-around items-center px-4 h-full relative">
        {tabs.map((tab) => {
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
    </nav>
  );
};

export default NavigationMenu;
