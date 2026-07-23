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
  let data: Record<string, unknown> = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  const title = (typeof data.title === 'string' ? data.title : null) || 'WorshipFlow';
  const body =
    (typeof data.body === 'string' ? data.body : null) ||
    (typeof data.message === 'string' ? data.message : null) ||
    '';
  const icon = (typeof data.icon === 'string' ? data.icon : null) || '/icons/icon-192x192.png';
  const badge = (typeof data.badge === 'string' ? data.badge : null) || '/icons/icon-72x72.png';
  const notificationData = data.data || { url: typeof data.url === 'string' ? data.url : '/' };
  const tag = (typeof data.tag === 'string' ? data.tag : null) || 'worshipflow-notification';

  const options: NotificationOptions & { vibrate?: number[] } = {
    body,
    icon,
    badge,
    data: notificationData,
    vibrate: [100, 50, 100],
    tag,
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
