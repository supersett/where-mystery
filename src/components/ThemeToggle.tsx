'use client';

import { BRAND_THEMES, setBrandTheme, useBrandTheme } from '@/lib/brand-theme';

// 헤더의 브랜드 색 선택: 색 점 4개
export function ThemeToggle() {
  const { id } = useBrandTheme();
  return (
    <div
      role="radiogroup"
      aria-label="브랜드 색"
      className="flex items-center gap-1.5"
    >
      {BRAND_THEMES.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={t.id === id}
          aria-label={t.label}
          title={t.label}
          onClick={() => setBrandTheme(t.id)}
          style={{ backgroundColor: t.color }}
          className={`h-5 w-5 rounded-full transition ${
            t.id === id
              ? 'ring-2 ring-neutral-900 ring-offset-2'
              : 'hover:scale-110'
          }`}
        />
      ))}
    </div>
  );
}
