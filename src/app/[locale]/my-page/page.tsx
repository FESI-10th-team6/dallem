import type { Locale } from 'next-intl';
import { redirect } from '@/i18n';

interface MyPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function MyPage({ params }: MyPageProps) {
  const { locale } = await params;

  // 기본적으로 gatherings-joined 페이지로 리다이렉트
  redirect({ href: '/my-page/gatherings-joined', locale });
}
