'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Locale, useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  useCancelGathering,
  useGetGatheringDetail,
  useJoinGathering,
  useLeaveGathering,
} from '@/entities/gathering-detail/api/queries';
import { GatheringDeadlineTag } from '@/entities/gathering/ui';
import { useGetParticipants } from '@/entities/participant/api/queries';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/shared/config/routes';
import { formatDateAndTime } from '@/shared/lib/date';
import { Popup } from '@/shared/ui/modal/Popup';
import { BottomFloatingBar } from '@/widgets/BottomFloatingBar';
import { ContainerInformation } from '@/widgets/ContainerInformation';
import toast from 'react-hot-toast';
import { calculateGatheringRole } from '../model/calculateGatheringRole';
import { ReviewList } from './ReviewList';

export const GatheringDetailLayout = ({ id, locale }: { id: number; locale: Locale }) => {
  const t = useTranslations('pages.gathering.detail');
  const tCommon = useTranslations('common');
  const { data: sessionData } = useSession();
  const rawUser = sessionData?.user;

  const { data: gathering } = useGetGatheringDetail(id);
  const {
    data: participantsData,
    isPending: isParticipantsLoading,
    isError: isParticipantsError,
  } = useGetParticipants(id);

  const { mutate: join, isPending: isJoining } = useJoinGathering();
  const { mutate: leave, isPending: isLeaving } = useLeaveGathering();
  const { mutate: cancel, isPending: isCanceling } = useCancelGathering();
  const router = useRouter();

  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  const openCancelPopup = () => setIsCancelPopupOpen(true);
  const closeCancelPopup = () => setIsCancelPopupOpen(false);

  if (isParticipantsLoading) {
    return <div>{t('loadingParticipants')}</div>;
  }
  if (isParticipantsError || !participantsData) {
    return <div>{t('failedToLoadParticipants')}</div>;
  }

  // isPending 상태 값 활용하기전 임시 콘솔
  console.log(isJoining, isLeaving, isCanceling);

  const isFull = gathering.capacity <= gathering.participantCount;

  const userSession = rawUser
    ? {
        id: Number(rawUser.id),
      }
    : undefined;

  const role = calculateGatheringRole(userSession, gathering, participantsData);

  const handleJoin = () => {
    join(id);
  };

  const handleLeave = () => {
    leave(id);
  };
  const confirmCancel = () => {
    cancel(id, {
      onSuccess: () => {
        closeCancelPopup();
        router.push(ROUTES.GATHERING);
      },
    });
  };
  const handleCancel = () => {
    openCancelPopup();
  };

  const handleShare = () => {
    // 공유하기 로직 구현
    // url링크 클립보드로 복사
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(t('copySuccess'));
    });
  };

  const participants =
    participantsData?.map(({ userId, User }) => ({
      id: String(userId),
      image:
        User.image ||
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1728361169610_19610008.JPG',
    })) ?? [];

  const { formattedDate, formattedTime } = formatDateAndTime(gathering.dateTime, locale);

  return (
    <div className="tablet:mb-[100px] mb-[200px] flex w-[996px] flex-col px-4 py-8">
      <section className="mx-auto mb-8 flex w-full max-w-[996px] flex-col gap-4 md:flex-row">
        {/* Gathering Banner */}
        <div className="relative h-[270px] w-full overflow-hidden rounded-xl md:h-auto md:min-w-0 md:flex-1">
          <Image
            src={gathering.image || '/gathering-default-image.png'}
            alt={'alt'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Tag */}
          <GatheringDeadlineTag registrationEnd={new Date(gathering.registrationEnd)} />
        </div>
        {/* ContainerInformation 컴포넌트 */}
        <ContainerInformation
          id={id}
          title={gathering.name || '제목 없음'}
          location={gathering.location}
          date={formattedDate}
          time={formattedTime}
          participants={participants}
          minParticipants={5}
          maxParticipants={gathering.capacity}
        />
        {/* 리뷰 리스트 컴포넌트 */}
      </section>
      <section className="mx-auto h-[687px] w-full max-w-[996px] border-t-2 border-gray-300 p-4">
        <h2 className="mb-4 text-xl font-semibold">{t('reviewTitle')}</h2>
        <ReviewList id={id} />
      </section>
      <Popup
        isOpen={isCancelPopupOpen}
        onClose={closeCancelPopup}
        onConfirm={confirmCancel}
        message={t('confirmCancel')}
        primaryButtonText={tCommon('confirm')}
        secondaryButtonText={tCommon('cancel')}
      />
      {/* 하단 플로팅 바 */}
      <BottomFloatingBar
        role={role}
        title={t('bottomBar.title')}
        content={t('bottomBar.content')}
        isFull={isFull}
        onJoin={handleJoin}
        onCancelJoin={handleLeave}
        onCancelProject={handleCancel}
        onShare={handleShare}
      />
    </div>
  );
};
