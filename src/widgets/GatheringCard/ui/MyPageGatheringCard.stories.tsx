import { NextIntlClientProvider } from 'next-intl';
import ko from '@/messages/ko.json';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { MyPageGatheringCard } from './MyPageGatheringCard';

const meta: Meta<typeof MyPageGatheringCard> = {
  title: 'Widgets/MyPageGatheringCard',
  component: MyPageGatheringCard,
  parameters: {
    layout: 'padded',
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider
        messages={ko}
        locale="ko"
      >
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseGatheringData = {
  gatheringId: 1,
  gatheringName: '달램핏 오피스 스트레칭',
  gatheringLocation: '을지로 3가',
  gatheringDateTime: new Date('2026-01-07T17:30:00'),
  gatheringParticipantCount: 20,
  gatheringCapacity: 20,
  gatheringImage:
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=224&fit=crop&crop=center&q=80',
  isCanceled: false,
  joinedAt: new Date('2025-07-26T11:40:53.743Z'),
  isCompleted: false,
  isReviewed: false,
};

export const Upcoming: Story = {
  args: {
    ...baseGatheringData,
    gatheringDateTime: new Date('2026-12-31T17:30:00'), // 미래 날짜
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '이용 예정 상태의 모임 카드입니다. 예약 취소 버튼이 표시됩니다.',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    ...baseGatheringData,
    gatheringDateTime: new Date('2025-01-07T17:30:00'), // 확실히 과거 날짜
    isCompleted: true,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '이용 완료 상태의 모임 카드입니다. 리뷰 작성 버튼이 표시됩니다.',
      },
    },
  },
};

export const Canceled: Story = {
  args: {
    ...baseGatheringData,
    isCanceled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '취소된 모임 카드입니다. 오버레이가 표시되고 버튼이 비활성화됩니다.',
      },
    },
  },
};

export const UpcomingNotConfirmed: Story = {
  args: {
    ...baseGatheringData,
    gatheringDateTime: new Date('2026-12-31T17:30:00'),
    gatheringParticipantCount: 3,
    gatheringCapacity: 10,
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '이용 예정이지만 개설확정되지 않은 모임 카드입니다.',
      },
    },
  },
};

export const CompletedNotConfirmed: Story = {
  args: {
    ...baseGatheringData,
    gatheringDateTime: new Date('2025-01-07T17:30:00'),
    gatheringParticipantCount: 3,
    gatheringCapacity: 10,
    isCompleted: true,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '개설확정되지 않았던 모임 카드입니다.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    ...baseGatheringData,
    gatheringName: '매우 긴 모임 이름입니다 이것은 테스트를 위한 것입니다',
    gatheringLocation: '매우 긴 장소 이름입니다 이것도 테스트를 위한 것입니다',
    gatheringDateTime: new Date('2024-12-31T17:30:00'), // 미래 날짜
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '긴 텍스트가 포함된 모임 카드입니다. 레이아웃이 깨지지 않는지 확인할 수 있습니다.',
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    ...baseGatheringData,
    gatheringImage: '',
    gatheringDateTime: new Date('2024-12-31T17:30:00'), // 미래 날짜
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '이미지가 없는 모임 카드입니다. 기본 이미지가 표시됩니다.',
      },
    },
  },
};

export const LowCapacity: Story = {
  args: {
    ...baseGatheringData,
    gatheringParticipantCount: 5,
    gatheringCapacity: 8,
    gatheringDateTime: new Date('2024-12-31T17:30:00'), // 미래 날짜
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '참여자 수가 적은 모임 카드입니다. 개설확정 칩이 표시됩니다.',
      },
    },
  },
};

export const FullCapacity: Story = {
  args: {
    ...baseGatheringData,
    gatheringParticipantCount: 20,
    gatheringCapacity: 20,
    gatheringDateTime: new Date('2024-12-31T17:30:00'), // 미래 날짜
    isCompleted: false,
    isReviewed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '최대 인원에 도달한 모임 카드입니다. 개설확정 칩이 표시됩니다.',
      },
    },
  },
};
