import React, { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const currentObj = MONTHS.find((m) => m.value === selectedMonth) || MONTHS[1];

  return (
    <div className="relative">
      <section className="flex items-center justify-between w-full">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {currentObj.displayTitle}
        </h2>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low dark:hover:bg-surface-container rounded-full border border-outline-variant shadow-sm text-label-lg font-label-lg text-on-surface transition-all select-none active:scale-95 cursor-pointer"
          style={{ padding: '8px 16px' }}
        >
          <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
          <span>{currentObj.label}</span>
          <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
      </section>

      {isOpen && (
        <>
          {/* Backdrop to close the selector dropdown */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg z-50 py-2 animate-fade-in-up">
            {MONTHS.map((month) => (
              <button
                key={month.value}
                type="button"
                onClick={() => {
                  onMonthSelect(month.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-body-md hover:bg-surface-container-low transition-colors ${selectedMonth === month.value ? 'text-primary font-semibold' : 'text-on-surface'
                  }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MonthSelector;
