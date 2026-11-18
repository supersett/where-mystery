import { ChevronRightIcon } from '@/components/ui/icons';
import type { ThemeResult } from '../api';

export const themePlayersLabel = (
  t: Pick<ThemeResult, 'min_players' | 'max_players'>,
) =>
  t.min_players === t.max_players
    ? `${t.min_players}인`
    : `${t.min_players}~${t.max_players}인`;

// 인원 · 시간 · GM 필요 · 장르를 작은 칩으로 한 줄에 (없는 정보는 생략)
export function ThemeChips({ theme }: { theme: ThemeResult }) {
  const chip =
    'rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600';
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className={chip}>{themePlayersLabel(theme)}</span>
      {theme.play_time_min ? (
        <span className={chip}>{theme.play_time_min}분</span>
      ) : null}
      {theme.gm_required ? (
        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
          GM 필요
        </span>
      ) : null}
      {theme.genres.map((g) => (
        <span key={g} className={chip}>
          {g}
        </span>
      ))}
    </div>
  );
}

// 작품 목록의 한 줄 — 누르면 그 작품을 보유한 매장 목록으로 넘어간다
export function ThemeCard({
  theme,
  active,
  onSelect,
  hideStoreCount = false,
}: {
  theme: ThemeResult;
  active: boolean;
  onSelect: () => void;
  hideStoreCount?: boolean; // 매장 하나를 보는 중이면 "매장 1곳" 표시는 의미 없다
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? 'bg-primary-50 border-primary-300'
          : 'border-neutral-200 bg-white shadow-[0_1px_2px_rgba(60,40,10,0.04)] hover:bg-neutral-50'
      }`}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="leading-snug font-semibold break-keep">
          {theme.title}
        </div>
        <ThemeChips theme={theme} />
      </div>
      <div className="flex shrink-0 items-center gap-1 text-neutral-400">
        {hideStoreCount ? null : (
          <span className="bg-primary-100 text-primary-700 rounded-full px-2.5 py-1 text-xs font-semibold">
            매장 {theme.store_count}곳
          </span>
        )}
        <ChevronRightIcon />
      </div>
    </button>
  );
}
