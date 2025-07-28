import { getSession, signOut } from 'next-auth/react';
import { API_CONFIG } from '@/shared/config';
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../apiError';
import { logError, logRequest, logResponse } from '../logger';

// 팀 아이디 : 실제 배포시에는 환경변수로 관리
export const TEST_TEAM_ID = '1';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL(TEST_TEAM_ID),
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(async (config) => {
  if (config.authRequired) {
    const session = await getSession();
    const accessToken = session?.user?.accessToken;
    console.log({ session });

    if (accessToken) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);
      config.headers = headers;
    }
  }

  // FormData 자동 변환
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    const formData = new FormData();

    Object.entries(config.data || {}).forEach(([key, value]) => {
      if (value == null) return;

      // Date 객체를 ISO 형식으로 변환
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    config.data = formData;
  }

  logRequest(config);
  return config;
});

let isAlreadyLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logResponse(response);
    return response;
  },
  (error: AxiosError) => {
    logError(error);

    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('네트워크 연결 상태를 확인해주세요.'));
    }

    if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error);
      return Promise.reject(new Error('요청 시간이 초과되었습니다.'));
    }

    const { status, data } = error.response;
    const { code, message } = (data as { code?: string; message?: string }) || {};
    const pathname = window.location.pathname;
    const isAuthPage = pathname.includes('/signin') || pathname.includes('/signup');

    if (
      (code === 'UNAUTHORIZED' || code === 'INVALID_TOKEN') &&
      !isAuthPage &&
      !isAlreadyLoggingOut
    ) {
      isAlreadyLoggingOut = true;
      console.error('401 Unauthorized:', message);
      localStorage.removeItem('accessToken');

      // 현재 locale을 가져와서 리다이렉트
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/^\/([a-z]{2})(\/|$)/);
      const currentLocale = localeMatch ? localeMatch[1] : 'ko';

      signOut({ redirect: false }).then(() => {
        window.location.href = `/${currentLocale}/signin`;
      });
      return;
    }

    if (status >= 500) {
      // Sentry.captureException(error);
    }

    return Promise.reject(
      new ApiError(message || '알 수 없는 오류가 발생했습니다.', code || 'UNKNOWN_ERROR', status),
    );
  },
);

export const httpClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T>(url, config).then((response) => response.data),

  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, data, config).then((response) => response.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config).then((response) => response.data),
};
