import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // 성능 최적화 설정
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // 개발 환경에서는 더 자세한 로깅
    debug: process.env.NODE_ENV === 'development',

    // 에러 필터링 (개발 환경 노이즈 제거)
    beforeSend(event) {
      // 개발 환경에서는 Sentry로 전송하지 않음
      if (process.env.NODE_ENV === 'development') {
        console.log('Sentry event (development):', event);
        return null;
      }
      return event;
    },
  });
}
