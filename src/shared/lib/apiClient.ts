import { ApiError, type ApiErrorResponse } from '../types/api';

const DEFAULT_BASE_URL = 'http://localhost:3000/api/v1';

export function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV && envUrl && envUrl.includes('.ngrok')) {
    // In local dev, route ngrok domains through Vite proxy to bypass browser CORS & ngrok warning
    return '/api/v1';
  }
  return envUrl && typeof envUrl === 'string' && envUrl.length > 0 ? envUrl : DEFAULT_BASE_URL;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('ngrok-skip-browser-warning')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      try {
        const errorBody = (await response.json()) as ApiErrorResponse;
        if (errorBody && errorBody.error) {
          throw new ApiError(response.status, errorBody.error);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          throw err;
        }
      }
    }

    throw new ApiError(response.status, {
      code: 'HTTP_ERROR',
      message: response.statusText || `Request failed with status ${response.status}`,
    });
  }

  if (!isJson) {
    return (await response.text()) as unknown as T;
  }

  return (await response.json()) as T;
}
