import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    authRequired?: boolean;
  }
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface HttpClientConfig extends AxiosRequestConfig {
  authRequired?: boolean;
}
