import { useTranslations } from 'next-intl';
import type { CreateGatheringPayload } from '@/entities/gathering/model/schema';
import { Dropdown, DropdownItem, DropdownList, DropdownTrigger } from '@/shared/ui/dropdown';
import { Control, Controller, FieldError } from 'react-hook-form';

interface GatheringLocationFieldProps {
  control: Control<CreateGatheringPayload>;
  error?: FieldError;
}

export const GatheringLocationField = ({ control, error }: GatheringLocationFieldProps) => {
  const t = useTranslations('pages.gatherings.create');
  const LOCATION_OPTIONS = [
    { value: '건대입구', label: t('form.locations.konkuk') },
    { value: '을지로3가', label: t('form.locations.euljiro') },
    { value: '신림', label: t('form.locations.sinrim') },
    { value: '홍대입구', label: t('form.locations.hongdae') },
  ];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{t('form.location')}</label>
      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <Dropdown>
            {({ isOpen, toggle, onSelect: closeDropdown }) => (
              <div className="relative w-full">
                <DropdownTrigger
                  type="button"
                  size="large"
                  state="default"
                  className={error ? 'w-full border-red-500' : 'w-full'}
                  onClick={toggle}
                  tabIndex={0}
                >
                  <span className={field.value ? 'text-gray-800' : 'text-gray-400'}>
                    {LOCATION_OPTIONS.find((opt) => opt.value === field.value)?.label ||
                      t('form.locationPlaceholder')}
                  </span>
                </DropdownTrigger>
                <DropdownList
                  isOpen={isOpen}
                  className="absolute z-[var(--z-dropdown)] w-full overflow-hidden rounded-xl border-gray-200 bg-gray-50"
                >
                  {LOCATION_OPTIONS.map((opt) => (
                    <DropdownItem
                      key={opt.value}
                      size="large"
                      value={opt.value}
                      selectedValue={field.value}
                      onSelect={(value) => {
                        field.onChange(value);
                        closeDropdown(value);
                      }}
                      className="w-full px-4 py-2.5"
                    >
                      {opt.label}
                    </DropdownItem>
                  ))}
                </DropdownList>
                {error && <p className="text-xs text-red-500">{t(error.message ?? '')}</p>}
              </div>
            )}
          </Dropdown>
        )}
      />
    </div>
  );
};
