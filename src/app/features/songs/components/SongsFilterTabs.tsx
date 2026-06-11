import { cn } from '@src/lib/utils';

export interface SongsFilterTabsProps {
  activeTab: 'sugestao' | 'ensaiando' | 'repertorio';
  onTabChange: (tab: 'sugestao' | 'ensaiando' | 'repertorio') => void;
}

export const SongsFilterTabs = ({
  activeTab,
  onTabChange,
}: SongsFilterTabsProps) => {
  const tabs = [
    { id: 'sugestao', label: 'Sugestões' },
    { id: 'ensaiando', label: 'Ensaiando' },
    { id: 'repertorio', label: 'Repertórios' },
  ] as const;

  return (
    <section 
      className="flex flex-col"
      style={{ paddingTop: '24px', paddingLeft: '20px', paddingRight: '20px' }}
    >
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-full font-label-lg whitespace-nowrap transition-all select-none cursor-pointer duration-200 active:scale-95',
                isActive
                  ? 'text-white shadow-md vivid-gradient'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'
              )}
              style={{
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SongsFilterTabs;
