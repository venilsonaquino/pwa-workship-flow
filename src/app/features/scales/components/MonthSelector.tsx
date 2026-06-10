import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shared/components';

export interface MonthSelectorProps {
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
}

export interface MonthOption {
  value: string;
  label: string;
  displayTitle: string;
}

const MONTHS: MonthOption[] = [
  { value: '2023-09', label: 'Set 2023', displayTitle: 'Escalas de Setembro' },
  { value: '2023-10', label: 'Out 2023', displayTitle: 'Escalas de Outubro' },
  { value: '2023-11', label: 'Nov 2023', displayTitle: 'Escalas de Novembro' },
  { value: '2023-12', label: 'Dez 2023', displayTitle: 'Escalas de Dezembro' },
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthSelect,
}) => {
  const currentObj = MONTHS.find((m) => m.value === selectedMonth) || MONTHS[1];

  return (
    <div className="relative">
      <section className="flex items-center justify-between w-full">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {currentObj.displayTitle}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="group flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low dark:hover:bg-surface-container rounded-full border border-outline-variant shadow-sm text-label-lg font-label-lg text-on-surface transition-all select-none active:scale-95 cursor-pointer"
            style={{ padding: '8px 16px' }}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <span>{currentObj.label}</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-data-[state=open]:rotate-180">
              expand_more
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {MONTHS.map((month) => (
              <DropdownMenuItem
                key={month.value}
                onClick={() => onMonthSelect(month.value)}
                className={
                  selectedMonth === month.value
                    ? 'bg-primary/10 text-primary font-semibold text-center hover:bg-primary/15'
                    : 'text-on-surface/80 hover:text-on-surface text-center'
                }
              >
                {month.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
};

export default MonthSelector;
