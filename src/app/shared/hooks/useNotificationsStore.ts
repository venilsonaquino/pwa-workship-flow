import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@features/notifications/services/notificationService';
import type { Notification, NotificationType } from '@features/notifications/types';

// Re-export so existing consumers keep working
export type { Notification as NotificationItem };

// ── Module-level shared state (singleton) ──────────────────────────────────────

let _notifications: Notification[] = [];
let _totalUnread = 0;
let _isLoading = false;
let _error: string | null = null;

const _subscribers = new Set<() => void>();

function notifySubscribers() {
  _subscribers.forEach((callback) => callback());
}

function setSharedState(patch: {
  notifications?: Notification[];
  totalUnread?: number;
  isLoading?: boolean;
  error?: string | null;
}) {
  if (patch.notifications !== undefined) _notifications = patch.notifications;
  if (patch.totalUnread !== undefined) _totalUnread = patch.totalUnread;
  if (patch.isLoading !== undefined) _isLoading = patch.isLoading;
  if (patch.error !== undefined) _error = patch.error;
  notifySubscribers();
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useNotificationsStore() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((count) => count + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  const fetchNotifications = useCallback(async (token: string, type?: NotificationType) => {
    setSharedState({ isLoading: true, error: null });
    try {
      const response = await notificationService.fetchAll(token, type);
      setSharedState({
        notifications: response.data.notifications,
        totalUnread: response.data.totalUnread,
        isLoading: false,
      });
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro desconhecido';
      setSharedState({ isLoading: false, error: message });
    }
  }, []);

  const markAsRead = useCallback(async (token: string, id: string) => {
    // Optimistic update
    setSharedState({
      notifications: _notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ),
      totalUnread: Math.max(0, _totalUnread - 1),
    });

    try {
      await notificationService.markAsRead(token, id);
    } catch {
      // Rollback on failure
      setSharedState({
        notifications: _notifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: false } : notification
        ),
        totalUnread: _totalUnread + 1,
      });
    }
  }, []);

  const markAllAsRead = useCallback(async (token: string) => {
    const previousNotifications = _notifications;
    const previousUnread = _totalUnread;

    // Optimistic update
    setSharedState({
      notifications: _notifications.map((notification) => ({ ...notification, isRead: true })),
      totalUnread: 0,
    });

    try {
      await notificationService.markAllAsRead(token);
    } catch {
      // Rollback on failure
      setSharedState({
        notifications: previousNotifications,
        totalUnread: previousUnread,
      });
    }
  }, []);

  return {
    notifications: _notifications,
    totalUnread: _totalUnread,
    unreadCount: _totalUnread,
    isLoading: _isLoading,
    error: _error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
