import type { CreateGatheringPayload } from '@/entities/gathering/model/schema';
import type {
  Gathering,
  GatheringFilters,
  MyGathering,
  MyGatheringParams,
} from '@/entities/gathering/model/types';
import { ApiError } from '@/shared/api';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { createGathering, getGatherings, getGatheringsJoined } from './services';

// 모임 조회
export const useGetGatherings = (filters?: GatheringFilters, options?: { enabled?: boolean }) => {
  return useQuery<Gathering[]>({
    queryKey: QUERY_KEYS.gathering.list(filters),
    queryFn: () => getGatherings(filters),
    enabled: options?.enabled ?? true,
  });
};

// 무한스크롤 모임 조회
export const useGetGatheringsInfinite = (filters?: Omit<GatheringFilters, 'limit' | 'offset'>) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.gathering.infinite(filters),
    queryFn: ({ pageParam = 0 }) =>
      getGatherings({
        ...filters,
        limit: 10, // 페이지당 10개
        offset: pageParam * 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 10개 미만이면 더 이상 페이지가 없음
      return lastPage.length === 10 ? allPages.length : undefined;
    },
  });
};

// 모임 생성 훅
export const useCreateGathering = () => {
  const queryClient = useQueryClient();
  return useMutation<Gathering, ApiError, CreateGatheringPayload>({
    mutationFn: createGathering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gathering.base });
    },
  });
};

export const useGetGatheringsJoined = (params?: MyGatheringParams) => {
  return useQuery<MyGathering[]>({
    queryKey: QUERY_KEYS.gathering.joined(params),
    queryFn: () => getGatheringsJoined(params),
  });
};
