'use client';

import { useTranslations } from 'next-intl';
import { useCreateReview } from '@/entities/review/api/my-page';
import { CreateReviewPayload, createReviewSchema } from '@/entities/review/model/schemas';
import { Button } from '@/shared/ui/button';
import { StarIcon } from '@/shared/ui/icon/icons/StarIcon';
import { Modal } from '@/shared/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type CreateReviewFormData = CreateReviewPayload;

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gatheringId: number;
}

export const CreateReviewModal = ({ isOpen, onClose, gatheringId }: CreateReviewModalProps) => {
  const t = useTranslations('myPage.reviewModal');
  const { mutate: createReview } = useCreateReview();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      gatheringId,
      score: 0,
      comment: '',
    },
  });

  const selectedScore = watch('score');

  const onSubmit = (data: CreateReviewFormData) => {
    if (data.score === 0) {
      toast.error(t('errors.selectRating'));
      return;
    }

    createReview(data, {
      onSuccess: () => {
        toast.success(t('success.created'));
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal.Root
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Modal.Header>
        <span className="text-lg font-bold">{t('title')}</span>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <div className="mb-2 text-base font-semibold text-gray-900">{t('rating.question')}</div>
            <div className="mb-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setValue('score', score)}
                  aria-label={t('rating.ariaLabel', { score })}
                  className="focus:outline-none"
                >
                  <StarIcon
                    size={32}
                    filled={score <= selectedScore}
                    className={`transition-colors ${score <= selectedScore ? '' : 'opacity-60'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-base font-semibold text-gray-900">{t('comment.label')}</div>
            <textarea
              id="comment"
              {...register('comment')}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              placeholder={t('comment.placeholder')}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
            )}
            <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500">
              {t('comment.helpText')}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-orange-400 bg-white text-orange-500 hover:bg-orange-50"
            >
              {t('buttons.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedScore === 0}
              className="flex-1"
            >
              {t('buttons.submit')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal.Root>
  );
};
