/**
 * Axios API client for the Next.js frontend.
 *
 * Behavior:
 * - Reads auth token from `auth_token` cookie and injects `Authorization: Bearer <token>`.
 * - Exposes `setAuthToken` to set/clear the cookie and sync axios defaults.
 * - Clears token automatically on 401 responses.
 */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

/** Base URL for the backend API (configurable via NEXT_PUBLIC_API_BASE_URL). */
const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/';

/** Pre-configured Axios instance used across the app. */
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Read bearer token from cookie on the client */
function readTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (_) {
    return null;
  }
}

/** Set or clear the token cookie and sync axios default header */
export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') {
    if (token) {
      (api.defaults.headers.common as any).Authorization = `Bearer ${token}`;
    } else {
      delete (api.defaults.headers.common as any).Authorization;
    }
    return;
  }

  if (token) {
    // Do not set Secure in local dev over http
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; secure' : '';
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secureFlag}`;
    (api.defaults.headers.common as any).Authorization = `Bearer ${token}`;
  } else {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; secure' : '';
    document.cookie = `auth_token=; path=/; max-age=0; samesite=lax${secureFlag}`;
    delete (api.defaults.headers.common as any).Authorization;
  }
}

// Attach Authorization header automatically, preferring Zustand token then cookie
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let token: string | null = null;
  try {
    token = useAuthStore.getState().token || null;
  } catch (_) {
    token = null;
  }
  if (!token) {
    token = readTokenFromCookie();
  }
  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Clear token on 401 responses
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(err);
  },
);

export default api;


