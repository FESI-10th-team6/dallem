import { Fragment } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import type { Locale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';
import { routing } from '@/i18n';
import { ReactQueryProvider } from '@/shared/api';
import { ToastProvider } from '@/shared/ui/toast';
import { Header } from '@/widgets/Header/ui/Header';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as { title: string; description: string };

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: originalLocale } = await params;

  // 지원하지 않는 locale인 경우 기본 locale로 리다이렉트
  let locale = originalLocale;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const messages = await getMessages({ locale });

  return (
    <Fragment>
      {/* 동적으로 html lang 속성 업데이트 */}
      <Script
        id="update-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${locale}';`,
        }}
      />

      <div className="flex min-h-screen flex-col antialiased">
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
        >
          <ReactQueryProvider>
            <Header />
            <main className="tablet:mt-15 web:max-w-web web:px-0 tablet:px-tablet-padding px-mobile-padding mt-14 flex w-full flex-1 justify-center self-center overflow-auto">
              {children}
            </main>
            <ToastProvider />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </div>
    </Fragment>
  );
}
