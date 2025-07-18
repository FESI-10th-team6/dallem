// 객체로 쿼리 키 관리
export const QUERY_KEYS = {
  gathering: {
    // base로 관련 쿼리 한번에 무효화
    base: ['gatherings'] as const,
    list: (filters?: object) => [...QUERY_KEYS.gathering.base, 'list', filters] as const,
    detail: (id: number) => [...QUERY_KEYS.gathering.base, 'detail', id] as const,
  },
} as const;
