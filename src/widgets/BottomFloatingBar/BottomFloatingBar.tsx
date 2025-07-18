import { Button } from '@/shared/ui/button';
import { twMerge } from 'tailwind-merge';

// 모임 내 사용자 역할을 정의하는 enum
// 역할에 따라 버튼 UI가 달라짐
export enum GatheringRole {
  // 모임에 참여하지 않은 사용자
  GUEST = 'guest',
  // 모임에 참여한 사용자
  MEMBER = 'member',
  // 모임을 주최한 사용자
  HOST = 'host',
}

type BottomFloatingBarProps = {
  role: GatheringRole;
  title: string;
  content: string;
  isFull?: boolean;
  onJoin?: () => void;
  onCancelJoin?: () => void;
  onCancelProject?: () => void;
  onShare?: () => void;
};

export const BottomFloatingBar = ({
  role,
  title,
  content,
  isFull = false,
  onJoin,
  onCancelJoin,
  onCancelProject,
  onShare,
}: BottomFloatingBarProps) => {
  const isHost = role === GatheringRole.HOST;
  const commonButtonClass = 'h-[44px] w-[115px] font-semibold whitespace-nowrap';
  return (
    <div
      className={`fixed bottom-0 left-0 flex w-full items-center gap-1 border-t-2 border-gray-900 bg-white px-4 ${
        isHost
          ? 'h-auto flex-col items-start gap-3 py-4 md:h-[84px] md:flex-row md:items-center md:justify-between md:py-0'
          : 'h-24 justify-between'
      } `}
    >
      <div className="flex flex-col">
        <span className="text-base font-semibold whitespace-nowrap text-gray-800">{title}</span>
        <span className="text-xs font-medium text-gray-700">{content}</span>
      </div>
      <div className={`flex gap-2 ${isHost ? 'w-full justify-center md:w-auto' : ''} `}>
        {role === GatheringRole.GUEST && (
          <Button
            variant={'primary'}
            onClick={onJoin}
            disabled={isFull}
            className={twMerge(commonButtonClass, isFull && 'bg-gray-400 text-white opacity-50')}
          >
            참여하기
          </Button>
        )}
        {role === GatheringRole.MEMBER && (
          <Button
            variant={'outline'}
            onClick={onCancelJoin}
            className={commonButtonClass}
          >
            참여 취소하기
          </Button>
        )}
        {role === GatheringRole.HOST && (
          <>
            <Button
              variant={'outline'}
              onClick={onCancelProject}
              className={commonButtonClass}
            >
              취소하기
            </Button>
            <Button
              variant={'primary'}
              onClick={onShare}
              className={commonButtonClass}
            >
              공유하기
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
