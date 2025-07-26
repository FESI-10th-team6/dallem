'use client';

import { useTranslations } from 'next-intl';
import { useGetGatheringsJoined } from '@/entities/gathering/api/queries';
import { MyPageGatheringCard } from '@/widgets/GatheringCard/ui/MyPageGatheringCard';

export default function GatheringsJoined() {
  const t = useTranslations('pages.myPage');
  const { data } = useGetGatheringsJoined();

  return (
    <div>
      <div className="flex flex-col gap-4">
        {data && data.length > 0 ? (
          data.map((gathering) => (
            <MyPageGatheringCard
              key={gathering.id}
              gatheringId={gathering.id}
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
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">
            {t('gatherings.noJoinedGatherings')}
          </div>
        )}
      </div>
    </div>
  );
}
