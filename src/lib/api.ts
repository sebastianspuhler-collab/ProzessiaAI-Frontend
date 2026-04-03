const API_BASE = 'https://prozessia.vercel.app';

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Tenant-ID': 'demo',
};

export const api = {
  get: async <T = unknown>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json() as Promise<T>;
  },
  post: async <T = unknown>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json() as Promise<T>;
  },
  put: async <T = unknown>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json() as Promise<T>;
  },
  delete: async <T = unknown>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json() as Promise<T>;
  },
};
