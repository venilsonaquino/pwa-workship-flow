import React from 'react';
import { motion } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shared/components';

export interface EventCard {
  id: string;
  dayOfWeek: string;
  dateStr: string;
  title: string;
  songsCount: number;
  avatars: string[];
  extraAvatarsCount?: number;
  isActive?: boolean;
}

export const CARDS_DATA: EventCard[] = [
  {
    id: '1',
    dayOfWeek: 'DOM',
    dateStr: '08 Out',
    title: 'Culto Manhã',
    songsCount: 4,
    isActive: true,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASmRq5dvksI_1fkhttqANKJtjIQ6cbdR3SjN0jI9GkwtYawkNXzIvPOQoXaYl4dRTaEVX1j8aBKdfhvQa_96XZfFpSOQY-QoktK3JbChzV3Ug_tC3NRtCjW7JYq5C7M2jkPsaQCTphTDVOi05o5Qtf2_H5mtgSbng9ehvSijuF8I6fo4dSFRAVSChTTQFi1VVHGrGfh_CuHGiKI5WDOeaM06Bj3BUsLotBetX8koCqRXjz_PpardnMmWSi4fxsE0Jj7W1jhgN6b18',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyc0Fuu4RuLNAi7nEjcBO1hKsWksf78zQcOk8AyqX3vm7NAvrAZKl_PpyHc_GZuYZDBh-VaAunDQiCmgQDZ5bQg38l4BXx6hMUb_mzQH6g6xVH-pFS9Tsk0oOeiMiCjC50fljv-LmO10iWvh3p3_rJr9Wf7LqBqpxp2kOt7CATUL-Z2APtR-MNH46GVwp8g_n2b1bw-NMFYWDYDhuD_4QIX5Fh0fq_CO-cCeBqukefBbDg1vlVzciKYJziDAM2n7B-O4KCdrLaEk',
    ],
    extraAvatarsCount: 2,
  },
  {
    id: '2',
    dayOfWeek: 'QUA',
    dateStr: '11 Out',
    title: 'Ensaio Geral',
    songsCount: 3,
    isActive: false,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9_rnKrNQuJgGCv2xHE2gM_4gyNJn-mRH4rewbrEwhv0fOfMEqiIqdFxoLGByrXbpR_jpghhWTV7tTo15ngK2lU0nYJXfIWYUGAg9Cbr64Y5srbm7j2gmbePnhPvzd6bw3s9c44AyVdqJsm5f38Mr6faSchqNDyIGGoviVVGHfBocn8t-WZ9OO_KzJCaDIiJFzjNTVpPLSGB6rlFr3TeegE4kgTW2b34xGtfqD8CZvqnxdsYCk0tSEDMYzE6qvaA5iL3zX_ORm2zQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfQyfgPhtGlrPvQkRxHyDUtvwtamFvnJabFY85MImEjdIWsUlevmDyu3sKObipN0nY5eMNSg39H7szAgYmN9f_09duSeq4VYudUQj9l5gPW2Fjbtnf7vQUO_feLf1kGCOOqNxI7zPjj44YIB47erhxrcxv0KwODLLRdvlWJT_zRBDBYe6EJF2DUUFtSNAt0g9xvIrYO0MITOQ_iIQAIz52WFJCEtQGdnCRqgxwK8LoG1Z6c6j1wfx-32bAvLKkr2Pyi6YWZVosXFY',
    ],
  },
  {
    id: '3',
    dayOfWeek: 'DOM',
    dateStr: '15 Out',
    title: 'Culto Tarde',
    songsCount: 5,
    isActive: false,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbHu_6E7Jk51uOTMZJrqYtJDnHqqwxeI4SuqL6GPSc3siAjiOWWJiP1i1R5aRtKM2e5p-3K3HducraBQg3eywMhqNW5gMeGfNwkN_C0sdamzRyDT1DHjCc-4hpdjBQtBNMWh1_V5wuHw_MV5tp5U9FXTnySHEizaLKQFAv9G7ToKC4rF3znOE9RGxQhJy__rW38HXPQ2gEfCLO0XE1DOMUhdtkj5LUAc8PGpk523vHJ_9uoeLqyY946jBC9MDyTnoSymq49V3f64',
    ],
    extraAvatarsCount: 5,
  },
  {
    id: '4',
    dayOfWeek: 'DOM',
    dateStr: '22 Out',
    title: 'Culto Noite',
    songsCount: 4,
    isActive: false,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASmRq5dvksI_1fkhttqANKJtjIQ6cbdR3SjN0jI9GkwtYawkNXzIvPOQoXaYl4dRTaEVX1j8aBKdfhvQa_96XZfFpSOQY-QoktK3JbChzV3Ug_tC3NRtCjW7JYq5C7M2jkPsaQCTphTDVOi05o5Qtf2_H5mtgSbng9ehvSijuF8I6fo4dSFRAVSChTTQFi1VVHGrGfh_CuHGiKI5WDOeaM06Bj3BUsLotBetX8koCqRXjz_PpardnMmWSi4fxsE0Jj7W1jhgN6b18',
    ],
    extraAvatarsCount: 3,
  },
];

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
