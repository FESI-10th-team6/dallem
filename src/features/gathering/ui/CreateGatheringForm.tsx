import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCreateGathering } from '@/entities/gathering/api/queries';
import { CreateGatheringPayload, createGatheringSchema } from '@/entities/gathering/model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import {
  GatheringCapacityField,
  GatheringDateField,
  GatheringImageField,
  GatheringLocationField,
  GatheringNameField,
  GatheringRegistrationEndField,
  GatheringTypeField,
} from './fields';

interface CreateGatheringFormProps {
  onClose: () => void;
}

export const CreateGatheringForm = ({ onClose }: CreateGatheringFormProps) => {
  const t = useTranslations('pages.gatherings.create');
  const locale = useLocale();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<'dateTime' | 'registrationEnd' | null>(
    null,
  );

  const { isPending, mutate } = useCreateGathering();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateGatheringPayload>({
    resolver: zodResolver(createGatheringSchema),
    defaultValues: {
      name: '',
      location: undefined,
      type: undefined,
      dateTime: undefined,
      registrationEnd: undefined,
      capacity: undefined,
      image: undefined,
    },
  });

  const onSubmit = (data: CreateGatheringPayload) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const formatDateTimeMobile = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <GatheringNameField
          register={register}
          error={errors.name as FieldError}
        />
        <GatheringLocationField
          control={control}
          error={errors.location as FieldError}
        />
        <GatheringTypeField
          control={control}
          error={errors.type as FieldError}
        />
        <GatheringImageField
          setValue={setValue}
          error={errors.image as FieldError}
          watch={watch}
        />
        <div className="flex w-full gap-4">
          <GatheringDateField
            control={control}
            error={errors.dateTime as FieldError}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            currentDateField={currentDateField}
            setCurrentDateField={setCurrentDateField}
            setValue={setValue}
            watch={watch}
            formatDateTime={formatDateTime}
            formatDateTimeMobile={formatDateTimeMobile}
          />

          <GatheringRegistrationEndField
            control={control}
            error={errors.registrationEnd as FieldError}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            currentDateField={currentDateField}
            setCurrentDateField={setCurrentDateField}
            setValue={setValue}
            watch={watch}
            formatDateTime={formatDateTime}
            formatDateTimeMobile={formatDateTimeMobile}
          />
        </div>
        <GatheringCapacityField
          register={register}
          error={errors.capacity as FieldError}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="border-primary text-primary flex-1 rounded-xl border bg-white px-4 py-2 font-semibold transition hover:bg-gray-50 focus:outline-none"
          onClick={() => {
            reset();
            onClose();
          }}
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/80 flex-1 rounded-xl px-4 py-2 font-semibold text-white transition focus:outline-none"
          disabled={isPending}
        >
          {isPending ? t('pending') : t('submit')}
        </button>
      </div>
    </form>
  );
};
