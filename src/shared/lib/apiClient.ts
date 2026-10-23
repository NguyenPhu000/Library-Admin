import { API_ERROR_CODE, ApiError, type ApiErrorDetail } from '../types/api';

export const DEFAULT_BASE_URL = 'http://localhost:3000/api/v1';
export const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

interface RawErrorPayload {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
  requestId?: string;
  error?: string | ApiErrorDetail;
}

export function getBaseUrl(
  envUrl: string | undefined = import.meta.env.VITE_API_URL,
  isDev: boolean = import.meta.env.DEV,
): string {
  const trimmed = typeof envUrl === 'string' ? envUrl.trim() : '';
  if (isDev && trimmed && trimmed.includes('.ngrok')) {
    // In local dev, route ngrok domains through Vite proxy to bypass browser CORS & ngrok warning
    return '/api/v1';
  }
  return trimmed.length > 0 ? trimmed : DEFAULT_BASE_URL;
}

function getFallbackStatusMessage(status: number, statusText: string): string {
  switch (status) {
    case 400:
      return 'Invalid request parameters or payload.';
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'Request timed out. Please try again.';
    case 409:
      return 'The request conflicts with the current state of the resource.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'The server encountered an error. Please try again later.';
    default:
      return statusText || `Request failed with status ${status}`;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, signal: externalSignal, ...fetchOptions } =
    options;

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(fetchOptions.headers);
  const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
  if (hasBody && !headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (!headers.has('ngrok-skip-browser-warning')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  const controller = new AbortController();
  let isTimedOut = false;

  const timeoutId =
    timeoutMs > 0
      ? setTimeout(() => {
          isTimedOut = true;
          controller.abort();
        }, timeoutMs)
      : undefined;

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    if (isTimedOut) {
      throw new ApiError(408, {
        code: API_ERROR_CODE.TIMEOUT_ERROR,
        message: 'Request timed out. Please check your connection and try again.',
      });
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(0, {
      code: API_ERROR_CODE.NETWORK_ERROR,
      message:
        'Unable to connect to the server. Please check your network connection and try again.',
    });
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      try {
        const errorBody = (await response.json()) as RawErrorPayload;
        if (errorBody && typeof errorBody === 'object') {
          if (errorBody.error && typeof errorBody.error === 'object') {
            throw new ApiError(response.status, errorBody.error);
          }
          if (typeof errorBody.message === 'string' && errorBody.message.trim().length > 0) {
            throw new ApiError(response.status, {
              code:
                typeof errorBody.code === 'string'
                  ? errorBody.code
                  : API_ERROR_CODE.HTTP_ERROR,
              message: errorBody.message,
              details: errorBody.details,
              requestId: errorBody.requestId,
            });
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          throw err;
        }
      }
    }

    throw new ApiError(response.status, {
      code:
        response.status >= 500
          ? API_ERROR_CODE.INTERNAL_SERVER_ERROR
          : API_ERROR_CODE.HTTP_ERROR,
      message: getFallbackStatusMessage(response.status, response.statusText),
    });
  }

  const rawText = await response.text();
  if (!rawText.trim()) {
    return undefined as unknown as T;
  }

  if (!isJson) {
    const trimmedText = rawText.trimStart();
    if (trimmedText.startsWith('<!DOCTYPE') || trimmedText.startsWith('<html')) {
      throw new ApiError(502, {
        code: API_ERROR_CODE.INVALID_RESPONSE,
        message: 'Received an unexpected HTML response instead of JSON from the API server.',
      });
    }
    return rawText as unknown as T;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new ApiError(502, {
      code: API_ERROR_CODE.INVALID_RESPONSE,
      message: 'Received malformed JSON from the server.',
    });
  }
}
