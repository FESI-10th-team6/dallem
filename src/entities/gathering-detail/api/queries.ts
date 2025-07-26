import { QUERY_KEYS } from '@/entities/gathering/api';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { GatheringDetail } from '../model/types';
import { getGatheringById } from './services';
import { cancelGathering, joinGathering, leaveGathering } from './services';

export const useGetGatheringDetail = (id: number) => {
  return useSuspenseQuery<GatheringDetail>({
    queryKey: QUERY_KEYS.gathering.detail(id),

    queryFn: () => getGatheringById(id),

    staleTime: 1000 * 60 * 3, // 3분
  });
};

// 모임 참여
export const useJoinGathering = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => joinGathering(gatheringId),
    onSuccess: (_, gatheringId) => {
      // 뮤테이션 성공 시
      toast.success('모임 참여가 완료되었습니다.');

      // 모임 상세 정보 쿼리를 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.gathering.detail(gatheringId),
      });
    },
    onError: (error) => {
      // 뮤테이션 실패 시
      console.error(error);
      toast.error('모임 참여에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

// 모임 참여 취소
export const useLeaveGathering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatheringId: number) => leaveGathering(gatheringId),
    onSuccess: (_, gatheringId) => {
      toast.success('모임 참여를 취소했습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gathering.detail(gatheringId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gathering.base });
    },
    onError: (error) => {
      console.error(error);
      toast.error('요청에 실패했습니다.');
    },
  });
};

// 모임 취소
export const useCancelGathering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatheringId: number) => cancelGathering(gatheringId),
    onSuccess: (_, gatheringId) => {
      toast.success('모임이 취소되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gathering.detail(gatheringId) });
    },
    onError: (error) => {
      console.error(error);
      toast.error('모임 취소에 실패했습니다.');
    },
  });
};
