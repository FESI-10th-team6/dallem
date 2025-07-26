import { z } from 'zod';

// 리뷰 생성 스키마만 관리
export const createReviewSchema = z.object({
  gatheringId: z.number(),
  score: z.number().min(1, '평점을 선택해주세요').max(5),
  comment: z
    .string()
    .min(1, '리뷰 내용을 입력해주세요')
    .max(500, '리뷰는 500자 이내로 작성해주세요'),
});

export type CreateReviewPayload = z.infer<typeof createReviewSchema>;
