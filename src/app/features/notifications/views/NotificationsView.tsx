import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Button, Card } from '@shared/components';
import { toast } from 'sonner';
import { useNotificationsStore } from '@shared/hooks';
import type { NotificationItem } from '@shared/hooks';

interface NotificationsViewProps {
  onBack: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const { notifications, markAsRead } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Escalas' | 'Músicas'>('Todas');

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const handleActionClick = (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    handleNotificationClick(item.id);
    if (item.type === 'escala') {
      toast.success('Abrindo detalhes da escala do Culto de Domingo...');
    } else if (item.type === 'musica') {
      toast.success('Reproduzindo e avaliando a música sugerida...');
    }
  };

  const handleSettingsClick = () => {
    toast.info('Configurações de notificações em breve.');
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'Todas') return true;
    if (activeFilter === 'Escalas') return item.category === 'escalas';
    if (activeFilter === 'Músicas') return item.category === 'musicas';
    return true;
  });

  const todayNotifications = filteredNotifications.filter(n => n.dateGroup === 'Hoje');
  const yesterdayNotifications = filteredNotifications.filter(n => n.dateGroup === 'Ontem');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="flex flex-col w-full bg-background text-on-background pb-32">
      <PageHeader
        title="Notificações"
        onBack={onBack}
        rightAction={
          <Button
            onClick={handleSettingsClick}
            variant="ghost"
            size="sm"
            iconOnly
            className="text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Configurações"
          >
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </Button>
        }
      />

      <main className="max-w-[1200px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Fast Filters */}
        <section className="flex items-center justify-between py-2 border-b border-divider/30 gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {(['Todas', 'Escalas', 'Músicas'] as const).map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-sans text-[14px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-60 gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline">notifications_off</span>
            <p className="text-[16px] font-medium font-sans">Nenhuma notificação por aqui</p>
            <p className="text-[12px] font-sans">Você está em dia com todas as novidades.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Timeline: Hoje */}
            {todayNotifications.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-primary uppercase tracking-wider font-sans">Hoje</span>
                  <div className="h-[1px] flex-grow bg-divider/30"></div>
                </div>
                <div className="grid gap-3">
                  {todayNotifications.map(item => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      onCardClick={handleNotificationClick}
                      onActionClick={handleActionClick}
                      variants={itemVariants}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Timeline: Ontem */}
            {yesterdayNotifications.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider font-sans">Ontem</span>
                  <div className="h-[1px] flex-grow bg-divider/30"></div>
                </div>
                <div className="grid gap-3">
                  {yesterdayNotifications.map(item => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      onCardClick={handleNotificationClick}
                      onActionClick={handleActionClick}
                      variants={itemVariants}
                    />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

interface NotificationCardProps {
  item: NotificationItem;
  onCardClick: (id: string) => void;
  onActionClick: (e: React.MouseEvent, item: NotificationItem) => void;
  variants: import('framer-motion').Variants;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onCardClick,
  onActionClick,
  variants,
}) => {
  return (
    <motion.div variants={variants}>
      <Card
        onClick={() => onCardClick(item.id)}
        className={`relative p-5 rounded-2xl flex gap-4 transition-all hover:shadow-md cursor-pointer active:scale-[0.99] select-none border-outline-variant/10 ${
          item.read
            ? 'bg-surface-container-lowest opacity-85'
            : 'bg-surface-container-low border-l-4 border-l-primary'
        }`}
      >
        {/* Icon / Avatar Container */}
        <div className="shrink-0 flex items-center justify-center">
          {item.type === 'confirmacao' && item.avatarUrl ? (
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center overflow-hidden border border-border/20"
                style={{ backgroundImage: `url('${item.avatarUrl}')` }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>
          ) : item.type === 'lembrete' && item.initials ? (
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[14px] font-sans">
              {item.initials}
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              item.type === 'escala' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-highest text-primary'
            }`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.type === 'escala' ? 'event_note' : 'music_note'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className={`font-sans text-[14px] font-bold ${item.read ? 'text-on-surface/80' : 'text-on-surface'}`}>
              {item.title}
            </h3>
            <span className="text-[12px] font-medium text-on-surface-variant whitespace-nowrap">
              {item.time}
            </span>
          </div>
          <p className={`font-sans text-[13px] leading-relaxed mb-3 ${item.read ? 'text-on-surface-variant/80' : 'text-on-surface-variant'}`}>
            {item.message}
          </p>

          {/* Conditional Action Buttons */}
          {item.type === 'escala' && (
            <div>
              <Button
                onClick={(e) => onActionClick(e, item)}
                variant="outline"
                size="sm"
                className="font-sans font-bold w-full sm:w-auto text-center"
              >
                Ver Detalhes
              </Button>
            </div>
          )}
          {item.type === 'musica' && (
            <div>
              <Button
                onClick={(e) => onActionClick(e, item)}
                variant="primary"
                size="sm"
                leftIcon={<span className="material-symbols-outlined text-[16px]">play_arrow</span>}
                className="font-sans font-bold w-full sm:w-auto text-center"
              >
                Ouvir e Avaliar
              </Button>
            </div>
          )}
        </div>

        {/* Unread badge indicator */}
        {!item.read && (
          <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </Card>
    </motion.div>
  );
};

export default NotificationsView;
