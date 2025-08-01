// API 설정

export const API_CONFIG = {
  BASE_URL: () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://fe-adv-project-together-dallaem.vercel.app';
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

    // 개발 환경에서만 기본값 허용
    if (process.env.NODE_ENV === 'development' && !teamId) {
      console.warn('⚠️ NEXT_PUBLIC_TEAM_ID가 설정되지 않아 기본값(1)을 사용합니다.');
      return `${baseUrl}/1`;
    }

    // 프로덕션에서는 엄격하게 체크
    if (!teamId) {
      throw new Error('NEXT_PUBLIC_TEAM_ID 환경변수가 설정되지 않았습니다.');
    }

    return `${baseUrl}/${teamId}`;
  },
  TIMEOUT: 10000, // 10초
} as const;

export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    SIGNUP: '/auths/signup',
    SIGNIN: '/auths/signin',
    SIGNOUT: '/auths/signout',
    USER: '/auths/user',
  },

  // 모임
  GATHERINGS: {
    LIST: '/gatherings',
    DETAIL: (id: number) => `/gatherings/${id}`,
    CREATE: '/gatherings',
    JOIN: (id: number) => `/gatherings/${id}/join`,
    LEAVE: (id: number) => `/gatherings/${id}/leave`,
    CANCEL: (id: number) => `/gatherings/${id}/cancel`,
    PARTICIPANTS: (id: number) => `/gatherings/${id}/participants`,
    JOINED: '/gatherings/joined',
  },

  // 리뷰
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    SCORES: '/reviews/scores',
  },
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 에러 코드
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  GATHERING_CANCELED: 'GATHERING_CANCELED',
  GATHERING_FULL: 'GATHERING_FULL',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  ALREADY_JOINED: 'ALREADY_JOINED',
  PAST_GATHERING: 'PAST_GATHERING',
  NOT_PARTICIPANT: 'NOT_PARTICIPANT',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;
