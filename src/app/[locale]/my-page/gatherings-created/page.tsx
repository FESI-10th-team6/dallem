'use client';

import { useTranslations } from 'next-intl';
import { useGetGatherings } from '@/entities/gathering/api/queries';
import { useGetUser } from '@/entities/user/api';
import { MyPageGatheringCard } from '@/widgets/GatheringCard/ui/MyPageGatheringCard';

export default function GatheringsCreated() {
  const t = useTranslations('pages.myPage');
  const { data: user } = useGetUser();
  const { data } = useGetGatherings({ createdBy: user?.id }, { enabled: !!user?.id });

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
              isActionButtonVisible={false}
            />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">
            {t('gatherings.noCreatedGatherings')}
          </div>
        )}
      </div>
    </div>
  );
}
