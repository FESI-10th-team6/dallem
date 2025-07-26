import type { GatheringFilters, MyGatheringParams } from '@/entities/gathering/model/types';

// 객체로 쿼리 키 관리
export const QUERY_KEYS = {
  gathering: {
    // base로 관련 쿼리 한번에 무효화
    base: ['gatherings'] as const,
    list: (filters?: Omit<GatheringFilters, 'limit' | 'offset'>) =>
      [...QUERY_KEYS.gathering.base, 'list', filters] as const,
    infinite: (filters?: Omit<GatheringFilters, 'limit' | 'offset'>) =>
      [...QUERY_KEYS.gathering.base, 'infinite', filters] as const,
    detail: (id: number) => [...QUERY_KEYS.gathering.base, 'detail', id] as const,
    joined: (params?: MyGatheringParams) =>
      [...QUERY_KEYS.gathering.base, 'joined', params] as const,
  },
} as const;
