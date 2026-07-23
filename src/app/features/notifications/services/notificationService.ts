import type { NotificationsResponse, NotificationType } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildAuthHeaders = (token: string): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const notificationService = {
  async fetchAll(token: string, type?: NotificationType): Promise<NotificationsResponse> {
    const url = type
      ? `${BASE_URL}/notifications?type=${type}`
      : `${BASE_URL}/notifications`;

    const response = await fetch(url, {
      method: 'GET',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar notificações (HTTP ${response.status})`);
    }

    return response.json() as Promise<NotificationsResponse>;
  },

  async markAsRead(token: string, id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao marcar notificação como lida (HTTP ${response.status})`);
    }
  },

  async markAllAsRead(token: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao marcar todas as notificações como lidas (HTTP ${response.status})`);
    }
  },
};

export default notificationService;
