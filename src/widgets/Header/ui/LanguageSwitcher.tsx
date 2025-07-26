'use client';

import { useTransition } from 'react';
import type { Locale } from 'next-intl';
import { useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n';
import { Dropdown, DropdownItem, DropdownList, DropdownTrigger } from '@/shared/ui/dropdown';
import { LanguageIcon } from '@/shared/ui/icon/icons/LanguageIcon';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  // 디버깅용 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Current locale from useLocale:', currentLocale);
    console.log('🔄 Current pathname:', pathname);
    console.log('🔄 Available locales:', routing.locales);
  }

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Changing language from', currentLocale, 'to', newLocale);
      }

      // next-intl 동적 라우팅 사용시 타입 추론 불가능하여 명시적으로 any 타입 사용
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(pathname as any, { locale: newLocale });
    });
  };

  const getLanguageText = (locale: Locale) => {
    return locale === 'ko' ? '한국어' : 'English';
  };

  return (
    <Dropdown>
      {({ isOpen, toggle, onSelect: closeDropdown }) => (
        <div className="relative inline-block">
          <DropdownTrigger
            onClick={toggle}
            disabled={isPending}
            size="small"
            className="flex h-7.5 !w-auto items-center justify-center rounded-full border border-gray-200 bg-white px-1.5 py-0 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <LanguageIcon
              size={16}
              className="text-gray-600"
            />
          </DropdownTrigger>

          <DropdownList
            isOpen={isOpen}
            className="absolute top-full left-0 z-[var(--z-dropdown)] mt-1 !w-[120px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            {/* 드롭다운 헤더 */}
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <LanguageIcon
                  size={14}
                  className="text-gray-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {currentLocale === 'ko' ? '언어 선택' : 'Language'}
                </span>
              </div>
            </div>

            {/* 언어 옵션들 */}
            {routing.locales.map((lang) => (
              <DropdownItem
                key={lang}
                value={lang}
                selectedValue={currentLocale}
                onSelect={(value) => {
                  handleLanguageChange(value as Locale);
                  closeDropdown(value);
                }}
                size="small"
                className={`!w-full px-4 py-3 text-left ${
                  isPending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                } ${lang === currentLocale ? 'bg-blue-50 text-orange-600' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getLanguageText(lang)}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownList>
        </div>
      )}
    </Dropdown>
  );
};
