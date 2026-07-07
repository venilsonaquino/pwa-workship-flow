import { useState, useEffect, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  type: 'escala' | 'musica' | 'confirmacao' | 'lembrete';
  category: 'escalas' | 'musicas';
  title: string;
  message: string;
  time: string;
  dateGroup: 'Hoje' | 'Ontem';
  read: boolean;
  avatarUrl?: string;
  initials?: string;
}

const STORAGE_KEY = 'pwa_notifications';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'escala',
    category: 'escalas',
    title: 'Nova Escala',
    message: 'Você foi escalado para o Culto de Domingo (Manhã) - 27/10.',
    time: '10:45',
    dateGroup: 'Hoje',
    read: false,
  },
  {
    id: '2',
    type: 'musica',
    category: 'musicas',
    title: 'Sugestão de Música',
    message: 'Ana Souza sugeriu a música "Oceans". Clique para ouvir e avaliar.',
    time: '08:12',
    dateGroup: 'Hoje',
    read: false,
  },
  {
    id: '3',
    type: 'confirmacao',
    category: 'escalas',
    title: 'Confirmação',
    message: 'Tiago Rocha confirmou presença na escala da próxima semana.',
    time: 'Ontem, 16:40',
    dateGroup: 'Ontem',
    read: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWOohGjaJ2bp4rcmAUjCCMTCfBFQ3ZjK6ezyfEicikCo-2DrJJDBlnOHtso68VVJ3L3SxKykb3knJSW22UFe8OUiiIXwjwlY2JmaWIMvckVHJ3qmN22G3_N_7JrCUzPf00u_Z1SvGTzcfRkNoPGtCSn9M_cayBhBNHZmd88sTR7DRgTiIqSZaMMDPiFdPEYwNlG5uSZcSU8WeC6iIXKn269V_dH9gj8aCnIVguEYKJ4Cqidp__iyh49ynvETgvDh3ZLeTln4MZv30',
  },
  {
    id: '4',
    type: 'lembrete',
    category: 'escalas',
    title: 'Lembrete de Ensaio',
    message: 'Ensaio Geral amanhã às 19:30. Não esqueça de revisar o repertório!',
    time: 'Ontem, 12:00',
    dateGroup: 'Ontem',
    read: true,
    initials: 'AS',
  },
];

const getStoredNotifications = (): NotificationItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

let _notifications: NotificationItem[] = getStoredNotifications();
const _subscribers = new Set<() => void>();

function notifySubscribers() {
  _subscribers.forEach((cb) => cb());
}

export function useNotificationsStore() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((n) => n + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  const setNotifications = useCallback((newNotifications: NotificationItem[] | ((prev: NotificationItem[]) => NotificationItem[])) => {
    if (typeof newNotifications === 'function') {
      _notifications = newNotifications(_notifications);
    } else {
      _notifications = newNotifications;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_notifications));
    } catch (e) {
      console.error('Error saving notifications to localStorage:', e);
    }
    notifySubscribers();
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const unreadCount = _notifications.filter((n) => !n.read).length;

  return {
    notifications: _notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
  };
}
