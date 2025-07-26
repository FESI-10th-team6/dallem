import type { Metadata } from 'next';
import { Pretendard } from '@/app/fonts/pretendard';
import './globals.css';

export const metadata: Metadata = {
  title: '달램',
  description: '함께하는 모임으로 건강하고 활기찬 직장생활을 만들어보세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={Pretendard.className}>{children}</body>
    </html>
  );
}
