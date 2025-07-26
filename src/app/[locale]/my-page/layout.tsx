import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ProfileSection } from '@/entities/user/ui/ProfileSection';
import { MyPageTab } from '@/features/my-page/ui/MyPageTab';

interface MyPageLayoutProps {
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
}

export default async function MyPageLayout({ params, children }: MyPageLayoutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.myPage' });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="mt-5 text-2xl font-bold">{t('title')}</p>

      {/* 프로필 정보 */}
      <ProfileSection />

      <div className="border-t-2 border-t-gray-100" />

      <MyPageTab />

      {/* 중첩 라우팅을 위한 children 렌더링 */}
      {children}
    </div>
  );
}
