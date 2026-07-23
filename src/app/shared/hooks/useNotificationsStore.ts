import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@features/notifications/services/notificationService';
import type { Notification, NotificationType } from '@features/notifications/types';
import { useAuth } from './useAuth';

// Re-export so existing consumers keep working
export type { Notification as NotificationItem };

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_POLL_INTERVAL_MS = 30000; // 30 seconds

// ── Module-level shared state (singleton) ──────────────────────────────────────

let _notifications: Notification[] = [];
let _totalUnread = 0;
let _isLoading = false;
let _error: string | null = null;
let _activePollIntervalId: ReturnType<typeof setInterval> | null = null;

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

export function useNotificationsStore(options?: { enablePolling?: boolean; pollIntervalMs?: number }) {
  const { token, isAuthenticated } = useAuth();
  const [, forceRender] = useState(0);
  const isPollingEnabled = options?.enablePolling ?? true;
  const pollIntervalMs = options?.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

  useEffect(() => {
    const rerender = () => forceRender((count) => count + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  /**
   * Fetch notifications from backend.
   * Pass { silent: true } for background polling so skeleton loaders don't flash.
   */
  const fetchNotifications = useCallback(
    async (authToken?: string, type?: NotificationType, fetchOptions?: { silent?: boolean }) => {
      const activeToken = authToken || token || localStorage.getItem('worshipflow_token') || '';
      if (!activeToken) return;

      const isSilent = fetchOptions?.silent ?? false;

      if (!isSilent) {
        setSharedState({ isLoading: true, error: null });
      }

      try {
        const response = await notificationService.fetchAll(activeToken, type);
        setSharedState({
          notifications: response.data.notifications,
          totalUnread: response.data.totalUnread,
          isLoading: false,
          error: null,
        });
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : 'Erro ao buscar notificações';
        setSharedState({ isLoading: false, error: message });
      }
    },
    [token]
  );

  /**
   * Automatic background polling effect.
   * Runs periodically when authenticated and page is visible.
   */
  useEffect(() => {
    if (!isAuthenticated || !token || !isPollingEnabled) {
      if (_activePollIntervalId) {
        clearInterval(_activePollIntervalId);
        _activePollIntervalId = null;
      }
      return;
    }

    // Initial fetch on mount/auth
    fetchNotifications(token, undefined, { silent: _notifications.length > 0 });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications(token, undefined, { silent: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchNotifications(token, undefined, { silent: true });
      }
    }, pollIntervalMs);

    _activePollIntervalId = intervalId;

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, token, isPollingEnabled, pollIntervalMs, fetchNotifications]);

  const markAsRead = useCallback(async (authToken: string, id: string) => {
    // Optimistic update
    setSharedState({
      notifications: _notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ),
      totalUnread: Math.max(0, _totalUnread - 1),
    });

    try {
      await notificationService.markAsRead(authToken, id);
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

  const markAllAsRead = useCallback(async (authToken: string) => {
    const previousNotifications = _notifications;
    const previousUnread = _totalUnread;

    // Optimistic update
    setSharedState({
      notifications: _notifications.map((notification) => ({ ...notification, isRead: true })),
      totalUnread: 0,
    });

    try {
      await notificationService.markAllAsRead(authToken);
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
