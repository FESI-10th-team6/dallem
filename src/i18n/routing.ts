import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 지원하는 언어 목록
  locales: ['ko', 'en'],

  // 기본 언어
  defaultLocale: 'ko',

  // 항상 locale prefix 사용
  localePrefix: 'always',

  // URL 경로 설정
  pathnames: {
    '/': '/',
    '/gathering': '/gathering',
    '/gathering/[id]': '/gathering/[id]',
    '/favorites': '/favorites',
    '/reviews': '/reviews',
    '/signin': '/signin',
    '/signup': '/signup',
    '/my-page': '/my-page',
    '/my-page/gatherings-joined': '/my-page/gatherings-joined',
    '/my-page/reviews': '/my-page/reviews',
    '/my-page/gatherings-created': '/my-page/gatherings-created',
  },
});

// 타입 정의
export type Pathnames = keyof typeof routing.pathnames;
