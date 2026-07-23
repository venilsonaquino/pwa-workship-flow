/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

// Take control of all clients immediately
self.skipWaiting();
clientsClaim();

// Cleanup outdated caches and precache static assets injected by vite-plugin-pwa
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// ── Web Push Event Handler ───────────────────────────────────────────────────

self.addEventListener('push', (event: PushEvent) => {
  let data: Record<string, any> = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'WorshipFlow';
  const options: NotificationOptions & { vibrate?: number[] } = {
    body: data.body || data.message || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    data: data.data || { url: data.url || '/' },
    vibrate: [100, 50, 100],
    tag: data.tag || 'worshipflow-notification',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification Click Event Handler ─────────────────────────────────────────

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const urlToOpen = new URL(notificationData.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus open window if exists
        for (const client of clientList) {
          if ('focus' in client && client.url.startsWith(self.location.origin)) {
            client.focus();
            if ('navigate' in client && client.url !== urlToOpen) {
              (client as WindowClient).navigate(urlToOpen);
            }
            return;
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
