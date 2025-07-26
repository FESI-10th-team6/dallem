import { useTranslations } from 'next-intl';
import type { CreateGatheringPayload } from '@/entities/gathering/model/schema';
import { BoxSelector } from '@/shared/ui/box-selector/BoxSelector';
import { Control, Controller, FieldError } from 'react-hook-form';

interface GatheringTypeFieldProps {
  control: Control<CreateGatheringPayload>;
  error?: FieldError;
}

export const GatheringTypeField = ({ control, error }: GatheringTypeFieldProps) => {
  const t = useTranslations('pages.gatherings.create');
  const SERVICE_OPTIONS = [
    {
      value: 'OFFICE_STRETCHING',
      label: t('form.services.officeStretching.label'),
      subtitle: t('form.services.officeStretching.subtitle'),
    },
    {
      value: 'MINDFULNESS',
      label: t('form.services.mindfulness.label'),
      subtitle: t('form.services.mindfulness.subtitle'),
    },
    {
      value: 'WORKATION',
      label: t('form.services.workation.label'),
      subtitle: t('form.services.workation.subtitle'),
    },
  ];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{t('form.type')}</label>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="flex w-full min-w-0 gap-2">
            {SERVICE_OPTIONS.map((opt) => (
              <BoxSelector
                key={opt.value}
                isSelected={field.value === opt.value}
                title={opt.label}
                subtitle={opt.subtitle}
                onSelect={() => field.onChange(opt.value)}
                className="min-w-0 flex-1"
              />
            ))}
          </div>
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{t(error.message ?? '')}</p>}
    </div>
  );
};
