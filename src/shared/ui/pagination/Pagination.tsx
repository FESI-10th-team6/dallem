import { Button } from '../button';
import { ArrowLeftIcon, ArrowRightIcon } from '../icon';
import { getPaginationRange } from './getPaginationRange';

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const visiblePages = getPaginationRange(currentPage, totalPages);

  return (
    <>
      <div className="mx-auto w-full max-w-[26.25rem] min-w-[var(--breakpoint-mobile)]">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <ArrowLeftIcon />
          </Button>

          {visiblePages.map((page, index) => (
            <div key={`${page}-${index}`}>
              {typeof page === 'number' ? (
                <Button
                  variant="ghost"
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </Button>
              ) : (
                <span className="flex items-center justify-center px-3 py-2 text-gray-500">
                  {page}
                </span>
              )}
            </div>
          ))}

          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </>
  );
};
