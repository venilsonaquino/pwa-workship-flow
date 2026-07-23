const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface VapidKeyResponse {
  success?: boolean;
  data?: {
    publicKey: string;
  };
  publicKey?: string;
}

export interface PushSubscriptionDto {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const buildAuthHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const pushService = {
  /**
   * Fetches the VAPID Public Key from the backend GET /api/push/vapid-public-key
   */
  async getVapidPublicKey(token?: string): Promise<string> {
    const headers: HeadersInit = token ? buildAuthHeaders(token) : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}/push/vapid-public-key`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter chave pública VAPID (HTTP ${response.status})`);
    }

    const resJson = (await response.json()) as VapidKeyResponse;
    const publicKey = resJson.data?.publicKey || resJson.publicKey;

    if (!publicKey) {
      throw new Error('Chave VAPID pública não retornada pelo servidor');
    }

    return publicKey;
  },

  /**
   * Sends the Web Push subscription credentials to POST /api/push/subscribe
   */
  async subscribe(token: string, payload: PushSubscriptionDto): Promise<void> {
    const response = await fetch(`${BASE_URL}/push/subscribe`, {
      method: 'POST',
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao registrar subscrição de push (HTTP ${response.status})`);
    }
  },

  /**
   * Removes the Web Push subscription from POST /api/push/unsubscribe
   */
  async unsubscribe(token: string, endpoint: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/push/unsubscribe`, {
      method: 'POST',
      headers: buildAuthHeaders(token),
      body: JSON.stringify({ endpoint }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao remover subscrição de push (HTTP ${response.status})`);
    }
  },
};

export default pushService;
