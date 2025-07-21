import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getReviewList, getReviewScore } from '@/entities/review/api/reviewApi';
import { ReviewListFilter } from '@/features/review/ReviewListFilter/ui/ReviewListFilter';
import { ReviewSort } from '@/features/review/ReviewSort/ui/ReviewSort';
import { ReviewTypeFilter } from '@/features/review/ReviewTypeFilter/ui/ReviewTypeFilter';
import { Locale } from '@/i18n';
import { PencilIcon } from '@/shared/ui/icon';
import { PageInfoLayout } from '@/shared/ui/pageInfoLayout';
import { AllReviewRating } from '@/widgets/AllReviewRating';
import { ReviewList } from '@/widgets/ReviewList/ui/ReviewList';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

interface ReviewsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    type?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: string;
    offset?: string;
  }>;
}

export default async function ReviewsPage({ params, searchParams }: ReviewsPageProps) {
  const { locale } = await params;
  const filterQuery = await searchParams;
  const t = await getTranslations({ locale, namespace: 'pages.reviews' });

  const queryClient = new QueryClient();
  const reviewParams = {
    type: filterQuery.type ?? undefined,
    location: filterQuery.location ?? undefined,
    date: filterQuery.date ?? undefined,
    sortBy: filterQuery.sortBy ?? undefined,
    sortOrder: filterQuery.sortOrder || 'desc',
    limit: parseInt(filterQuery.limit || '10'),
    offset: parseInt(filterQuery.offset || '0'),
  };

  const { type, location, date, sortBy, sortOrder, limit, offset } = reviewParams;

  await queryClient.prefetchQuery({
    queryKey: ['reviewList', type, location, date, sortBy, sortOrder, limit, offset],
    queryFn: () => getReviewList(reviewParams),
  });

  await queryClient.prefetchQuery({
    queryKey: ['reviewScore', type],
    queryFn: () => getReviewScore({ type: type }),
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-[1200px] px-4">
      <div className="hidden text-2xl font-bold">{t('title')}</div>
      <PageInfoLayout
        infoImg={<PencilIcon size={60} />}
        title={t('title')}
        subtitle={t('subTitle')}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReviewTypeFilter />
        <Suspense fallback={t('loading')}>
          <AllReviewRating type={type} />
        </Suspense>
        <div className="mb-4 flex items-center justify-between">
          <ReviewListFilter />
          <ReviewSort />
        </div>
        <Suspense fallback={t('loading')}>
          <div className="mt-12">
            <ReviewList
              type={type}
              location={location}
              date={date}
              sortBy={sortBy}
              sortOrder={sortOrder}
              limit={limit}
              offset={offset}
            />
          </div>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
