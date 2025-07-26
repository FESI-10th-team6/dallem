'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/i18n';
import { ROUTES } from '@/shared/config/routes';
import { Tab } from '@/shared/ui/tab';

type MyPageRouter =
  | '/my-page/gatherings-joined'
  | '/my-page/reviews'
  | '/my-page/gatherings-created';

export const MyPageTab = () => {
  const t = useTranslations('pages.myPage');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const MyPageTabItems = [
    { id: 'gatherings-joined', label: t('tabs.joinedGatherings') },
    { id: 'reviews', label: t('tabs.reviews') },
    { id: 'gatherings-created', label: t('tabs.createdGatherings') },
  ];

  // 현재 경로에서 탭 ID 추출
  const getCurrentTabId = () => {
    if (pathname.includes('/gatherings-joined')) return 'gatherings-joined';
    if (pathname.includes('/reviews')) return 'reviews';
    if (pathname.includes('/gatherings-created')) return 'gatherings-created';
    return 'gatherings-joined'; // 기본값
  };

  const handleTabSelect = (id: string) => {
    // useLocale로 가져온 locale을 명시적으로 전달
    router.push(ROUTES.MY_PAGE_TAB(id) as MyPageRouter, { locale });
  };

  return (
    <Tab
      items={MyPageTabItems}
      selectedId={getCurrentTabId()}
      onSelect={handleTabSelect}
    />
  );
};
