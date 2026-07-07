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

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <section className="flex flex-col">
      <div className="relative flex w-full border-b border-outline-variant/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 text-center font-label-lg whitespace-nowrap select-none cursor-pointer py-3 transition-colors duration-200 focus:outline-none active:scale-[0.98]',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              {tab.label}
            </button>
          );
        })}
        <div
          className="absolute bottom-0 h-0.5 bg-primary"
          style={{
            width: `${100 / tabs.length}%`,
            left: 0,
            transform: `translateX(${activeIndex * 100}%)`,
            transition: 'transform 200ms ease-in-out',
          }}
        />
      </div>
    </section>
  );
};

export default SongsFilterTabs;
