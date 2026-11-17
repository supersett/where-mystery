import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { themeBootScript } from '@/lib/theme-boot';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '머미맵 - 머더미스터리 매장 지도',
  description:
    '어떤 매장이 어떤 머더미스터리를 보유하고 있는지 한눈에 검색하세요.',
};

// 모바일 키보드가 올라오면 레이아웃 높이 자체가 줄어들도록 (Android Chrome). iOS는 VisualViewport 훅으로 보정
export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // data-theme 은 첫 페인트 전 스크립트가 설정
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
