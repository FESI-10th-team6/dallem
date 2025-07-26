export const ROUTES = {
  ROOT: '/',
  GATHERING: '/gathering',
  GATHERING_DETAIL: (id: number) => `/gathering/${id}`,
  FAVORITE: '/favorites',
  REVIEW: '/reviews',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  MY_PAGE: '/my-page',
  MY_PAGE_TAB: (id: string) => `/my-page/${id}`,
} as const;
