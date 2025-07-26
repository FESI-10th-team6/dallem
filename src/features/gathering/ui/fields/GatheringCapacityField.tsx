import { useTranslations } from 'next-intl';
import type { CreateGatheringPayload } from '@/entities/gathering/model/schema';
import { Input } from '@/shared/ui/input';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface GatheringCapacityFieldProps {
  register: UseFormRegister<CreateGatheringPayload>;
  error?: FieldError;
}

export const GatheringCapacityField = ({ register, error }: GatheringCapacityFieldProps) => {
  const t = useTranslations('pages.gatherings.create');
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{t('form.participants')}</label>
      <Input
        type="number"
        {...register('capacity')}
        placeholder={t('form.participantsPlaceholder')}
        min={5}
        variant={error ? 'error' : 'default'}
        errorMessage={error?.message ? t(String(error.message)) : undefined}
        inputSize="lg"
        className="w-full"
      />
    </div>
  );
};
