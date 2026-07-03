import React from 'react';
import { motion } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shared/components';

import { EventCard, CARDS_DATA } from '../constants/cardsData';

const MONTHS: MonthOption[] = [
  { value: '2023-09', label: 'Set 2023', titleMonth: 'Setembro' },
  { value: '2023-10', label: 'Out 2023', titleMonth: 'Outubro' },
  { value: '2023-11', label: 'Nov 2023', titleMonth: 'Novembro' },
  { value: '2023-12', label: 'Dez 2023', titleMonth: 'Dezembro' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, x: 20 },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

const MotionTrigger = motion(DropdownMenuTrigger);

interface MonthOption {
  value: string;
  label: string;
  titleMonth: string;
}

export interface SongDistributionProps {
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
}

export const SongDistribution: React.FC<SongDistributionProps> = ({
  selectedMonth,
  onMonthSelect,
}) => {
  const currentMonth = MONTHS.find((m) => m.value === selectedMonth) || MONTHS[1];

  return (
    <section className="flex flex-col gap-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Escalas de {currentMonth.titleMonth}
        </h3>

        {/* Month picker dropdown */}
        <DropdownMenu>
          <MotionTrigger
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-1.5 text-primary font-label-lg text-label-lg transition-all select-none cursor-pointer"
          >
            Ver tudo
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-data-[state=open]:rotate-180">
              expand_more
            </span>
          </MotionTrigger>

          <DropdownMenuContent align="end" className="w-44">
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
      </div>

      {/* Horizontal Carousel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20px' }}
        className="flex overflow-x-auto scrollbar-hide snap-x pb-2 gap-4"
      >
        {CARDS_DATA.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)' }}
            whileTap={{ scale: 0.98 }}
            className="snap-center min-w-[140px] rounded-3xl flex-shrink-0 transition-all select-none border p-5 flex flex-col gap-3 bg-surface-container-lowest text-on-surface border-outline-variant/30 custom-shadow cursor-pointer"
          >
            {/* Day & Date info */}
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
              {card.dayOfWeek} • {card.dateStr}
            </p>

            {/* Title and Song Count */}
            <div className="flex flex-col gap-1">
              <p className="font-bold text-lg leading-tight">{card.title}</p>
              <p className="text-label-sm text-on-surface-variant">
                {card.songsCount} músicas
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SongDistribution;
