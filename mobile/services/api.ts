import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { STORAGE_KEYS } from './storage.service';
import type { ApiErrorBody } from './api.types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  statusCode?: number;
  error?: string;
  path?: string;
  code?: string;

  constructor(message: string, body?: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = body?.statusCode;
    this.error = body?.error;
    this.path = body?.path;
    this.code = body?.code;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const apiError = parseApiError(error);
    if (apiError.statusCode === 401) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    }
    return Promise.reject(apiError);
  },
);

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError<ApiErrorBody>;
  const body = axiosError.response?.data;
  if (body) {
    const rawMessage = Array.isArray(body.message)
      ? body.message.join('\n')
      : body.message;
    return new ApiError(rawMessage || body.error || 'Request failed.', {
      ...body,
      statusCode: body.statusCode ?? axiosError.response?.status,
    });
  }

  if (axiosError.request) {
    return new ApiError('Network connection failed. Please try again.');
  }

  return new ApiError(
    error instanceof Error ? error.message : 'Something went wrong.',
  );
}

export function getUserFriendlyError(error: unknown): string {
  const parsed = parseApiError(error);
  if (parsed.statusCode === 401) return 'Please log in again.';
  if (parsed.statusCode === 409) return parsed.message;
  if (parsed.statusCode && parsed.statusCode >= 500) {
    return 'Server error. Please try again shortly.';
  }
  return parsed.message || 'Something went wrong. Please try again.';
}
