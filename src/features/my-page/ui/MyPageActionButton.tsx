'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLeaveGathering } from '@/entities/gathering-detail/api/queries';
import { CreateReviewModal } from '@/features/review/ui/CreateReviewModal';
import { Button } from '@/shared/ui/button';

interface MyPageActionButtonProps {
  gatheringId: number;
  isCompleted?: boolean;
  isReviewed?: boolean;
  joinedAt?: Date;
}

export const MyPageActionButton = ({
  gatheringId,
  isCompleted,
  isReviewed,
}: MyPageActionButtonProps) => {
  const t = useTranslations('myPage.actionButton');
  const { mutate: leaveGathering } = useLeaveGathering();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleCancelReservation = () => {
    // TODO: 예약 취소 로직 구현
    leaveGathering(gatheringId);
  };

  const handleWriteReview = () => {
    // 리뷰 작성 모달 열기
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <>
      {!isCompleted && (
        <Button
          variant="outline"
          onClick={handleCancelReservation}
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          {t('cancelReservation')}
        </Button>
      )}
      {isCompleted && !isReviewed && (
        <Button
          variant="primary"
          onClick={handleWriteReview}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {t('writeReview')}
        </Button>
      )}

      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        gatheringId={gatheringId}
      />
    </>
  );
};
