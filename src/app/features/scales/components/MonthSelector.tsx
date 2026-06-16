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
  titleLine1: string;
  titleLine2: string;
}

const MONTHS: MonthOption[] = [
  { value: '2023-09', label: 'Set 2023', titleLine1: 'Escalas de', titleLine2: 'Setembro' },
  { value: '2023-10', label: 'Out 2023', titleLine1: 'Escalas de', titleLine2: 'Outubro' },
  { value: '2023-11', label: 'Nov 2023', titleLine1: 'Escalas de', titleLine2: 'Novembro' },
  { value: '2023-12', label: 'Dez 2023', titleLine1: 'Escalas de', titleLine2: 'Dezembro' },
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthSelect,
}) => {
  const currentObj = MONTHS.find((m) => m.value === selectedMonth) || MONTHS[1];
  const [monthLabel, yearLabel] = currentObj.label.split(' ');

  return (
    <div className="relative">
      <section className="flex items-center justify-between w-full">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            {currentObj.titleLine1}<br />{currentObj.titleLine2}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="group flex items-center gap-3 bg-surface-container-lowest hover:bg-surface-container-low dark:hover:bg-surface-container px-5 py-3 rounded-3xl border border-outline-variant shadow-sm text-label-lg font-label-lg text-on-surface transition-all select-none active:scale-95 cursor-pointer"
            style={{ padding: "6px 28px" }}
          >
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <div className="flex flex-col items-start" >
              <span className="text-on-surface">{monthLabel}</span>
              <span className="text-on-surface-variant text-[10px]">{yearLabel}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-data-[state=open]:rotate-180">
              expand_more
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {MONTHS.map((month) => (
              <DropdownMenuItem
                key={month.value}
                onClick={() => onMonthSelect(month.value)}
                active={selectedMonth === month.value}
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
