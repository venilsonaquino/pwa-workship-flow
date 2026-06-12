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
      className="flex flex-col pt-6"
    >
      <div className="flex gap-2 justify-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-full font-label-lg whitespace-nowrap transition-all select-none cursor-pointer duration-200 active:scale-95 py-1.5 px-3.5',
                isActive
                  ? 'text-white shadow-md vivid-gradient'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'
              )}
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
