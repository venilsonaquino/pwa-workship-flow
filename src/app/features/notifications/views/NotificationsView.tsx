import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Button, Card } from '@shared/components';
import { useNotificationsStore, useWebPush } from '@shared/hooks';
import { useAuth } from '@shared/hooks/useAuth';
import type { Notification, NotificationType } from '../types';

// ── Types ──────────────────────────────────────────────────────────────────────

interface NotificationsViewProps {
  onBack: () => void;
  onSongNavigate?: (songId: string) => void;
}

type FilterTab = 'Todas' | 'Músicas' | 'Cifras' | 'Status';

// ── Constants ──────────────────────────────────────────────────────────────────

const FILTER_TABS: FilterTab[] = ['Todas', 'Músicas', 'Cifras', 'Status'];


const TYPE_TO_FILTER: Record<NotificationType, FilterTab> = {
  MusicSuggestion: 'Músicas',
  AudioReady: 'Músicas',
  AudioError: 'Músicas',
  CifraReady: 'Cifras',
  CifraNotFound: 'Cifras',
  CifraError: 'Cifras',
  SongStatusChanged: 'Status',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function classifyDateGroup(createdAt: string): 'Hoje' | 'Ontem' | 'Anteriores' {
  const notificationDate = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (dateA: Date, dateB: Date) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  if (isSameDay(notificationDate, today)) return 'Hoje';
  if (isSameDay(notificationDate, yesterday)) return 'Ontem';
  return 'Anteriores';
}

function formatTime(createdAt: string): string {
  return new Date(createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTypeIcon(type: NotificationType): { icon: string; colorClass: string } {
  switch (type) {
    case 'AudioReady':
    case 'CifraReady':
      return { icon: 'check_circle', colorClass: 'bg-[#1a4a2e] text-[#4ade80]' };
    case 'AudioError':
    case 'CifraError':
      return { icon: 'error', colorClass: 'bg-[#4a1a1a] text-error' };
    case 'CifraNotFound':
      return { icon: 'warning', colorClass: 'bg-[#4a3a1a] text-[#fbbf24]' };
    case 'MusicSuggestion':
      return { icon: 'music_note', colorClass: 'bg-primary-fixed text-on-primary-fixed' };
    case 'SongStatusChanged':
      return { icon: 'sync', colorClass: 'bg-surface-container-highest text-primary' };
    default:
      return { icon: 'notifications', colorClass: 'bg-surface-container-highest text-on-surface-variant' };
  }
}

// ── Animation variants ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

// ── Main View ──────────────────────────────────────────────────────────────────

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack, onSongNavigate }) => {
  const { token } = useAuth();
  const { notifications, totalUnread, isLoading, error, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationsStore();
  const { isSupported: isPushSupported, isSubscribed: isPushSubscribed, permission: pushPermission, isLoading: isPushLoading, subscribe: subscribePush } =
    useWebPush();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todas');

  const loadNotifications = useCallback(() => {
    if (!token) return;
    fetchNotifications(token);
  }, [token, fetchNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleCardClick = async (notification: Notification) => {
    if (!token) return;
    if (!notification.isRead) {
      await markAsRead(token, notification.id);
    }
  };

  const handleSongNavigate = (event: React.MouseEvent, notification: Notification) => {
    event.stopPropagation();
    if (!token) return;
    if (!notification.isRead) {
      markAsRead(token, notification.id);
    }
    if (notification.referenceId) {
      onSongNavigate?.(notification.referenceId);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    await markAllAsRead(token);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'Todas') return true;
    return TYPE_TO_FILTER[notification.type] === activeFilter;
  });

  const todayNotifications = filteredNotifications.filter(
    (notification) => classifyDateGroup(notification.createdAt) === 'Hoje'
  );
  const yesterdayNotifications = filteredNotifications.filter(
    (notification) => classifyDateGroup(notification.createdAt) === 'Ontem'
  );
  const olderNotifications = filteredNotifications.filter(
    (notification) => classifyDateGroup(notification.createdAt) === 'Anteriores'
  );

  return (
    <div className="flex flex-col w-full bg-background text-on-background pb-32">
      <PageHeader
        title="Notificações"
        onBack={onBack}
        rightAction={
          totalUnread > 0 ? (
            <Button
              onClick={handleMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-surface-container-high transition-colors text-[12px] font-semibold font-sans"
              aria-label="Marcar todas como lidas"
            >
              Marcar todas
            </Button>
          ) : undefined
        }
      />

      <main className="max-w-[1200px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Web Push Banner */}
        {isPushSupported && !isPushSubscribed && pushPermission !== 'denied' && (
          <Card className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </div>
              <div>
                <h4 className="font-sans text-[14px] font-bold text-on-surface">Notificações no Celular</h4>
                <p className="font-sans text-[12px] text-on-surface-variant">
                  Receba avisos instantâneos quando seus áudios ou cifras ficarem prontos.
                </p>
              </div>
            </div>
            <Button
              onClick={() => subscribePush()}
              isLoading={isPushLoading}
              variant="primary"
              size="sm"
              className="shrink-0 font-sans font-semibold text-[13px] w-full sm:w-auto"
            >
              Ativar Notificações
            </Button>
          </Card>
        )}

        {/* Filter Tabs */}
        <section className="flex flex-col">
          <div className="relative flex w-full border-b border-outline-variant/20">
            {FILTER_TABS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 text-center font-label-lg whitespace-nowrap select-none cursor-pointer py-3 transition-colors duration-200 focus:outline-none active:scale-[0.98] ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
            <div
              className="absolute bottom-0 h-0.5 bg-primary"
              style={{
                width: `${100 / FILTER_TABS.length}%`,
                left: 0,
                transform: `translateX(${FILTER_TABS.indexOf(activeFilter) * 100}%)`,
                transition: 'transform 200ms ease-in-out',
              }}
            />
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="h-[88px] rounded-2xl bg-surface-container animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
            <span className="material-symbols-outlined text-[48px] text-error/60">wifi_off</span>
            <p className="text-[15px] font-medium font-sans text-on-surface/70">{error}</p>
            <Button onClick={loadNotifications} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-60 gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline">notifications_off</span>
            <p className="text-[16px] font-medium font-sans">Nenhuma notificação por aqui</p>
            <p className="text-[12px] font-sans">Você está em dia com todas as novidades.</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && filteredNotifications.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            <NotificationGroup label="Hoje" labelColorClass="text-primary" notifications={todayNotifications} onCardClick={handleCardClick} onSongNavigate={handleSongNavigate} />
            <NotificationGroup label="Ontem" labelColorClass="text-on-surface-variant/80" notifications={yesterdayNotifications} onCardClick={handleCardClick} onSongNavigate={handleSongNavigate} />
            <NotificationGroup label="Anteriores" labelColorClass="text-on-surface-variant/60" notifications={olderNotifications} onCardClick={handleCardClick} onSongNavigate={handleSongNavigate} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

// ── Notification Group ─────────────────────────────────────────────────────────

interface NotificationGroupProps {
  label: string;
  labelColorClass: string;
  notifications: Notification[];
  onCardClick: (notification: Notification) => void;
  onSongNavigate: (event: React.MouseEvent, notification: Notification) => void;
}

const NotificationGroup: React.FC<NotificationGroupProps> = ({
  label,
  labelColorClass,
  notifications,
  onCardClick,
  onSongNavigate,
}) => {
  if (notifications.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className={`text-[12px] font-bold uppercase tracking-wider font-sans ${labelColorClass}`}>
          {label}
        </span>
        <div className="h-[1px] flex-grow bg-divider/30" />
      </div>
      <div className="grid gap-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onCardClick={onCardClick}
            onSongNavigate={onSongNavigate}
            variants={itemVariants}
          />
        ))}
      </div>
    </section>
  );
};

// ── Notification Card ──────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: Notification;
  onCardClick: (notification: Notification) => void;
  onSongNavigate: (event: React.MouseEvent, notification: Notification) => void;
  variants: import('framer-motion').Variants;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onCardClick, onSongNavigate, variants }) => {
  const { icon, colorClass } = getTypeIcon(notification.type);
  const isUnread = !notification.isRead;

  return (
    <motion.div variants={variants}>
      <Card
        onClick={() => onCardClick(notification)}
        className={`relative p-5 rounded-2xl flex gap-4 transition-all hover:shadow-md cursor-pointer active:scale-[0.99] select-none border-outline-variant/10 ${
          isUnread
            ? 'bg-surface-container-low border-l-4 border-l-primary'
            : 'bg-surface-container-lowest opacity-85'
        }`}
      >
        {/* Type Icon */}
        <div className="shrink-0 flex items-center justify-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3
              className={`font-sans text-[14px] font-bold ${
                isUnread ? 'text-on-surface' : 'text-on-surface/80'
              }`}
            >
              {notification.title}
            </h3>
            <span className="text-[12px] font-medium text-on-surface-variant whitespace-nowrap">
              {formatTime(notification.createdAt)}
            </span>
          </div>
          <p
            className={`font-sans text-[13px] leading-relaxed ${
              isUnread ? 'text-on-surface-variant' : 'text-on-surface-variant/80'
            }`}
          >
            {notification.message}
          </p>

          {/* Navigate link — only for notifications with a referenceId */}
          {notification.referenceId && (
            <button
              onClick={(event) => onSongNavigate(event, notification)}
              className="mt-2 self-start flex items-center gap-1 text-[11px] font-semibold text-primary font-sans hover:underline active:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              Ver música
            </button>
          )}
        </div>

        {/* Unread dot */}
        {isUnread && (
          <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </Card>
    </motion.div>
  );
};

export default NotificationsView;
