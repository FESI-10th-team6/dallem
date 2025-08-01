'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getReviewList } from '@/entities/review/api/reviewApi';
import { ReviewFilterProps, ReviewListResponse } from '@/entities/review/model/type';
import { ReviewCard } from '@/entities/review/ui/ReviewCard';
import { QUERY_KEYS } from '@/shared/api';
import { InfiniteScrollObserver } from '@/shared/ui/InfiniteScrollObserver/InfiniteScrollObserver';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface Props {
  filters: ReviewFilterProps;
}

export const ReviewList = ({ filters }: Props) => {
  // i18n 문자 변환
  const t = useTranslations('pages.reviews');

  //fetchNextPage 가 getNextPageParam 호출, getNextPageParam의 결과가 hasNextPage , fetchNextPage가 호출되면 isFetchingNextPage의 boolean 변경
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<ReviewListResponse>({
      queryKey: QUERY_KEYS.review.list(filters),
      queryFn: ({ pageParam = 0 }) => {
        const limit = Number(filters.limit ?? 10);
        const offset = (pageParam as number) * limit;

        return getReviewList({ ...filters, offset, limit });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const { currentPage, totalPages } = lastPage;
        if (currentPage <= totalPages - 1) return currentPage;
        return undefined;
      },
    });

  // 새로 창조된 data , 하나의 배열로 합치기
  const allReviews = useMemo(() => {
    return data.pages.flatMap((page) => page.data);
  }, [data.pages]);

  if (allReviews.length === 0) {
    return <div>{t('noReview')} 😶</div>;
  }
  return (
    <>
      <div className="">
        <ul className="space-y-6">
          {allReviews.map((review) => (
            <li key={review.id}>
              <ReviewCard
                score={review.score}
                comment={review.comment}
                dateTime={review.createdAt}
                userName={review.User?.name}
                userImg={review.User?.image}
                reviewImg={review.Gathering?.image}
                gatheringName={review.Gathering?.name}
                location={review.Gathering?.location}
              />
            </li>
          ))}
        </ul>
        <InfiniteScrollObserver
          onFetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
};
