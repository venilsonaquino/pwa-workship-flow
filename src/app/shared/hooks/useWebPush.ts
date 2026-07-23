import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { pushService } from '@features/notifications/services/pushService';
import { urlBase64ToUint8Array } from '@src/lib/utils';
import { toast } from 'sonner';

export type WebPushPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

async function getSWRegistration(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker não é suportado neste navegador.');
  }

  // 1. Return active registration if exists
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length > 0) {
    return registrations[0];
  }

  // 2. Wait for navigator.serviceWorker.ready
  try {
    const readyReg = await navigator.serviceWorker.ready;
    if (readyReg) return readyReg;
  } catch {
    // Fallback
  }

  const singleReg = await navigator.serviceWorker.getRegistration();
  if (singleReg) return singleReg;

  throw new Error('Service Worker ainda não está ativo. Por favor, recarregue a página.');
}

export function useWebPush() {
  const { token, isAuthenticated } = useAuth();
  const [permission, setPermission] = useState<WebPushPermissionState>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission as WebPushPermissionState;
  });
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  const checkSubscription = useCallback(async () => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission as WebPushPermissionState);

    try {
      const registration = await getSWRegistration();
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch {
      setIsSubscribed(false);
    }
  }, [isSupported]);

  useEffect(() => {
    queueMicrotask(() => {
      void checkSubscription();
    });
  }, [checkSubscription, isAuthenticated]);

  /**
   * Request permission & subscribe device to Web Push
   */
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      const msg = 'Notificações Web Push não são suportadas neste navegador.';
      setError(msg);
      toast.error(msg);
      return false;
    }

    const authToken = token || localStorage.getItem('worshipflow_token') || '';

    setIsLoading(true);
    setError(null);

    try {
      // 1. Request Browser Permission
      const reqPermission = await Notification.requestPermission();
      setPermission(reqPermission as WebPushPermissionState);

      if (reqPermission !== 'granted') {
        throw new Error('Permissão de notificação foi negada no navegador.');
      }

      // 2. Fetch VAPID Public Key from Backend
      const vapidResponse = await pushService.getVapidPublicKey(authToken);

      const responseObj = vapidResponse as unknown as Record<string, unknown>;
      const rawPublicKey =
        typeof vapidResponse === 'string'
          ? vapidResponse
          : (responseObj?.publicKey as string) ||
            ((responseObj?.data as Record<string, unknown>)?.publicKey as string);

      if (!rawPublicKey || typeof rawPublicKey !== 'string') {
        throw new Error('Chave pública VAPID inválida retornada do backend.');
      }

      // 3. Register Push Subscription on Service Worker
      const registration = await getSWRegistration();

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      const convertedKey = urlBase64ToUint8Array(rawPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey as unknown as BufferSource,
      });

      // 4. Send subscription keys to Backend
      const subJson = subscription.toJSON();

      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        throw new Error('Chaves da subscrição retornadas pelo navegador são inválidas.');
      }

      if (authToken) {
        await pushService.subscribe(authToken, {
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh,
          auth: subJson.keys.auth,
        });
      }

      setIsSubscribed(true);
      setIsLoading(false);
      toast.success('Notificações ativadas com sucesso!');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao ativar notificações push.';
      setError(msg);
      setIsLoading(false);
      toast.error(msg);
      return false;
    }
  }, [isSupported, token]);

  /**
   * Unsubscribe device from Web Push
   */
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    const authToken = token || localStorage.getItem('worshipflow_token') || '';

    setIsLoading(true);
    setError(null);

    try {
      const registration = await getSWRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        if (authToken) {
          try {
            await pushService.unsubscribe(authToken, subscription.endpoint);
          } catch {
            // Ignore API error on unsubscribe fallback
          }
        }
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setIsLoading(false);
      toast.info('Notificações desativadas.');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao desativar notificações push.';
      setError(msg);
      setIsLoading(false);
      toast.error(msg);
      return false;
    }
  }, [isSupported, token]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}
