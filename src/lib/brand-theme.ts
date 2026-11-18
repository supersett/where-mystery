import { useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY } from './theme-boot';

// 브랜드 색 5종. color = 핀 등 CSS 변수를 쓸 수 없는 곳(지도 마커 이미지)에서 쓰는 주 색, accent = 선택된 핀 색
export const BRAND_THEMES = [
  { id: 'wine', label: '와인', color: '#8a1f41', accent: '#b83257' },
  { id: 'red', label: '딥 레드', color: '#b91c1c', accent: '#ef4444' },
  { id: 'mustard', label: '머스터드', color: '#d99a00', accent: '#b45309' },
  { id: 'teal', label: '딥 틸', color: '#0f766e', accent: '#14b8a6' },
  { id: 'indigo', label: '인디고', color: '#3730a3', accent: '#6366f1' },
] as const;
export type BrandThemeId = (typeof BRAND_THEMES)[number]['id'];

const DEFAULT: BrandThemeId = 'wine';
const valid = (v: string | null | undefined): v is BrandThemeId =>
  BRAND_THEMES.some((t) => t.id === v);

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const read = (): BrandThemeId => {
  const v = document.documentElement.dataset.theme;
  return valid(v) ? v : DEFAULT;
};

export function setBrandTheme(id: BrandThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // 저장 불가(사생활 보호 모드 등)여도 이번 방문에는 적용된다
  }
  listeners.forEach((l) => l());
}

export function useBrandTheme() {
  const id = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const t = BRAND_THEMES.find((x) => x.id === id)!;
  return { id, color: t.color, accent: t.accent };
}
