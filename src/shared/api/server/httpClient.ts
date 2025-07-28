import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/shared/config';
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../apiError';
import { logError, logRequest, logResponse } from '../logger';

// 팀 아이디 : 실제 배포시에는 환경변수로 관리
export const TEST_TEAM_ID = '1';

// 서버용 HTTP 클라이언트 팩토리 함수
export const createServerHttpClient = (req?: NextRequest) => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL(TEST_TEAM_ID),
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(async (config) => {
    if (config.authRequired && req) {
      try {
        const token = await getToken({
          req: req as NextRequest,
          secret: process.env.NEXTAUTH_SECRET,
          raw: true,
        });

        if (token) {
          const headers = AxiosHeaders.from(config.headers);
          headers.set('Authorization', `Bearer ${token}`);
          config.headers = headers;
        }
      } catch (error) {
        console.error('Failed to get server token:', error);
      }
    }

    logRequest(config);
    return config;
  });

  instance.interceptors.response.use(
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

      if (status >= 500) {
        // Sentry.captureException(error);
      }

      return Promise.reject(
        new ApiError(message || '알 수 없는 오류가 발생했습니다.', code || 'UNKNOWN_ERROR', status),
      );
    },
  );

  return {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
      instance.get<T>(url, config).then((response) => response.data),

    post: <T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig,
    ): Promise<T> => instance.post<T>(url, data, config).then((response) => response.data),

    put: <T = unknown, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig,
    ): Promise<T> => instance.put<T>(url, data, config).then((response) => response.data),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
      instance.delete<T>(url, config).then((response) => response.data),
  };
};
