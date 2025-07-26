import { GatheringLocation, GatheringType } from '@/entities/gathering/model/types';
import { CreateReviewPayload } from '@/entities/review/model/schemas';
import { ApiError, httpClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// type.ts
export type ReviewSortBy = 'createdAt' | 'score' | 'participantCount';
export type SortOrder = 'asc' | 'desc';

export interface GetReviewsParams {
  gatheringId?: number;
  userId?: number;
  type?: GatheringType;
  location?: GatheringLocation;
  date?: string;
  sortBy?: ReviewSortBy;
  sortOrder?: SortOrder;
}

export interface Review {
  teamId: string;
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: {
    teamId: string;
    id: number;
    type: GatheringType;
    name: string;
    dateTime: string;
    location: GatheringLocation;
    image: string;
  };
  User: {
    teamId: string;
    id: number;
    name: string;
    image: string;
  };
}

export interface GetReviewsResponse {
  data: Review[];
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateReviewResponse {
  teamId: string;
  id: number;
  userId: number;
  gatheringId: number;
  score: number;
  comment: string;
  createdAt: string;
}

// services.ts
export const getReviews = (params: GetReviewsParams): Promise<GetReviewsResponse> => {
  return httpClient.get(`${API_ENDPOINTS.REVIEWS.LIST}`, { params });
};

export const createReview = (payload: CreateReviewPayload): Promise<CreateReviewResponse> => {
  return httpClient.post<CreateReviewResponse>(`${API_ENDPOINTS.REVIEWS.CREATE}`, payload);
};

// queryKeys.ts
export const QUERY_KEYS = {
  review: {
    base: ['reviews'] as const,
    list: (params: GetReviewsParams) => [...QUERY_KEYS.review.base, 'list', params] as const,
  },
};

// queries.ts
export const useGetReviews = (params: GetReviewsParams, options?: { enabled?: boolean }) => {
  return useQuery<GetReviewsResponse>({
    queryKey: QUERY_KEYS.review.list(params),
    queryFn: () => getReviews(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateReviewResponse, ApiError, CreateReviewPayload>({
    mutationFn: (payload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.review.base });
    },
  });
};
