'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGetGatheringsJoined } from '@/entities/gathering/api';
import { useGetReviews } from '@/entities/review/api/queries';
import { ReviewCard } from '@/entities/review/ui';
import { useGetUser } from '@/entities/user/api';
import { Chip } from '@/shared/ui/chip';
import { MyPageGatheringCard } from '@/widgets/GatheringCard/ui';

export function ReviewsContent() {
  const t = useTranslations('pages.myPage');
  const [tab, setTab] = useState<'writable' | 'written'>('writable');

  const { data: user } = useGetUser();

  const { data: gatherings } = useGetGatheringsJoined({
    completed: true,
    reviewed: tab === 'writable' && false,
  });

  const { data: reviews } = useGetReviews({ userId: user?.id }, { enabled: !!user?.id });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Chip
          active={tab === 'writable'}
          onClick={() => setTab('writable')}
          className="cursor-pointer"
        >
          {t('tabs.writableReviews')}
        </Chip>
        <Chip
          active={tab === 'written'}
          onClick={() => setTab('written')}
          className="cursor-pointer"
        >
          {t('tabs.reviews')}
        </Chip>
      </div>
      {tab === 'writable' && (
        <>
          {gatherings && gatherings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {gatherings?.map((gathering) => (
                <MyPageGatheringCard
                  key={gathering.id}
                  gatheringId={gathering.id}
                  gatheringType={gathering.type}
                  gatheringName={gathering.name}
                  gatheringLocation={gathering.location}
                  gatheringDateTime={new Date(gathering.dateTime)}
                  gatheringParticipantCount={gathering.participantCount}
                  gatheringCapacity={gathering.capacity}
                  gatheringImage={gathering.image}
                  isCanceled={!!gathering.canceledAt}
                  isCompleted={gathering.isCompleted}
                  isReviewed={gathering.isReviewed}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-gray-500">
                {t('reviews.noWritableReviews')}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'written' && (
        <>
          {reviews && reviews.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviews?.data.map((review) => (
                <ReviewCard
                  key={review.id}
                  score={review.score}
                  comment={review.comment}
                  dateTime={review.createdAt}
                  userName={review.User.name}
                  userImg={review.User.image}
                  reviewImg={review.Gathering.image}
                  gatheringName={review.Gathering.name}
                  location={review.Gathering.location}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-gray-500">
                {t('reviews.noWrittenReviews')}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
