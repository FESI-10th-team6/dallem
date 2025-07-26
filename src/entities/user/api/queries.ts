import type { UpdateUserPayload, User } from '@/entities/user/model';
import { ApiError } from '@/shared/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { getUser, updateUser } from './service';

export const useGetUser = () => {
  return useQuery<User>({
    queryKey: QUERY_KEYS.AUTH.USER.BASE,
    queryFn: getUser,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, ApiError, UpdateUserPayload>({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER.BASE });
    },
  });
};
