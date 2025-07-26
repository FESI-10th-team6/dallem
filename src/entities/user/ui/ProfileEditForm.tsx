import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UpdateUserPayload, updateUserSchema } from '@/entities/user/model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdateUser } from '../api/queries';

interface ProfileEditFormProps {
  companyName: string;
  email: string;
  onClose: () => void;
}

export const ProfileEditForm = ({ companyName, email, onClose }: ProfileEditFormProps) => {
  const t = useTranslations('pages.myPage');
  const { isPending, mutate } = useUpdateUser();
  const [fileName, setFileName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      companyName: companyName,
      image: '',
    },
  });

  const onSubmit = (data: UpdateUserPayload) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setValue('image', '');
      setFileName('');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setValue('image', base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium"
          >
            {t('form.profileImage')}
          </label>
          <div className="flex w-full items-center gap-2">
            <div
              className={
                'flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2' +
                (errors.image ? ' border-red-500' : '')
              }
            >
              <span className={fileName ? 'text-gray-800' : 'text-gray-400'}>
                {fileName || t('form.imagePlaceholder')}
              </span>
            </div>
            <button
              type="button"
              className="rounded-xl border border-orange-500 bg-white px-4 py-2 font-semibold text-orange-500 transition hover:bg-orange-50 focus:outline-none"
              onClick={() => document.getElementById('profile-image-upload')?.click()}
            >
              {t('form.imageButton')}
            </button>
            <input
              type="file"
              accept="image/*"
              id="profile-image-upload"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
          </div>
          {errors.image && (
            <p className="mt-1 text-xs text-red-500">{t(errors.image.message ?? '')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium"
          >
            {t('form.companyName')}
          </label>
          <input
            type="text"
            id="companyName"
            {...register('companyName')}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-red-500">{t(errors.companyName.message ?? '')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            {t('profile.email')}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">{t('profile.emailReadOnly')}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {t('form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {isPending ? t('form.submitting') : t('form.submit')}
        </button>
      </div>
    </form>
  );
};
