// ── Notification Types ─────────────────────────────────────────────────────────

export type NotificationType =
  | 'MusicSuggestion'
  | 'AudioReady'
  | 'AudioError'
  | 'CifraReady'
  | 'CifraNotFound'
  | 'CifraError'
  | 'SongStatusChanged';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  referenceId: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    totalUnread: number;
    notifications: Notification[];
  };
}
