import { redirect, routing } from '@/i18n';

export default async function RootPage() {
  // 기본 locale로 리다이렉트
  redirect({ href: '/', locale: routing.defaultLocale });
}
