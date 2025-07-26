import type { UpdateUserPayload, User } from '@/entities/user/model';
import { httpClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config';

export const getUser = async (): Promise<User> => {
  return await httpClient.get<User>(API_ENDPOINTS.AUTH.USER);
};

export const updateUser = async (payload: UpdateUserPayload): Promise<User> => {
  return await httpClient.put<User>(API_ENDPOINTS.AUTH.USER, payload);
};
