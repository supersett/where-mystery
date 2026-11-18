'use client';

import { useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@/components/ui/icons';
import type { StoreResult, ThemeResult } from '../api';
import { StoreCard } from './StoreCard';
import { ThemeCard, themePlayersLabel } from './ThemeCard';
import { EndMarker } from './EndMarker';
import { useIncremental } from './useIncremental';

export type PanelTab = 'themes' | 'stores';

type Props = {
  themes: ThemeResult[];
  stores: StoreResult[];
  activeTheme: ThemeResult | null; // 작품 하나로 좁힌 상태
  activeStore: StoreResult | null; // 매장 하나로 좁힌 상태
  tab: PanelTab;
  filtered: boolean; // 검색어/필터가 걸려 있는지
  loading: boolean;
  selectedStoreId: string | null;
  onTab: (t: PanelTab) => void;
  onSelectTheme: (slug: string | null) => void;
  onSelectStore: (id: string) => void;
  onViewStoreThemes: (store: StoreResult) => void;
  onClearStore: () => void;
};

const tabCls = (on: boolean) =>
  `relative pb-2 text-lg font-bold transition ${
    on ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
  }`;

export function ResultPanel({
  themes,
  stores,
  activeTheme,
  activeStore,
  tab,
  filtered,
  loading,
  selectedStoreId,
  onTab,
  onSelectTheme,
  onSelectStore,
  onViewStoreThemes,
  onClearStore,
}: Props) {
  const [list, setList] = useState<HTMLDivElement | null>(null); // 스크롤 컨테이너
  const themeList = useIncremental(themes);
  const storeList = useIncremental(stores);

  // 지도 핀을 눌러 선택하면 목록에서 해당 매장이 보이도록 스크롤
  useEffect(() => {
    if (!selectedStoreId) return;
    list
      ?.querySelector(`[data-store-id="${selectedStoreId}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedStoreId, tab, list]);

  // 작품이 바뀌면 목록 맨 위로
  useEffect(() => {
    list?.scrollTo({ top: 0 });
  }, [activeTheme?.slug, activeStore?.slug, tab, list]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end gap-5 border-b border-neutral-200 px-5 pt-4">
        <button
          className={tabCls(tab === 'themes')}
          onClick={() => onTab('themes')}
        >
          머미 <span className="text-sm font-semibold">{themes.length}</span>
          {tab === 'themes' ? <Underline /> : null}
        </button>
        <button
          className={tabCls(tab === 'stores')}
          onClick={() => onTab('stores')}
        >
          매장 <span className="text-sm font-semibold">{stores.length}</span>
          {tab === 'stores' ? <Underline /> : null}
        </button>
        {loading ? (
          <span className="mb-2 ml-auto text-xs text-neutral-400">
            검색 중…
          </span>
        ) : null}
      </div>

      {/* 선택한 작품 헤더: 스크롤 영역 밖에 두어 탭 바로 아래에 붙고, 목록이 그 뒤로 가려지지 않는다 */}
      {tab === 'stores' && activeTheme ? (
        <ActiveThemeHeader
          theme={activeTheme}
          storeCount={stores.length}
          onClear={() => onSelectTheme(null)}
        />
      ) : null}

      {tab === 'themes' && activeStore ? (
        <ActiveStoreHeader
          store={activeStore}
          matched={themes.length}
          onClear={onClearStore}
        />
      ) : null}

      <div
        ref={setList}
        className="min-h-0 flex-1 scroll-py-4 overflow-y-auto p-4"
      >
        {tab === 'stores' ? (
          <div className="flex flex-col gap-2">
            {stores.length ? (
              storeList.visible.map((s) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  active={s.id === selectedStoreId}
                  filtered={filtered}
                  onSelect={() => onSelectStore(s.id)}
                  onViewThemes={() => onViewStoreThemes(s)}
                />
              ))
            ) : (
              <Empty loading={loading}>조건에 맞는 매장이 없습니다.</Empty>
            )}
            {storeList.hasMore ? (
              <EndMarker onVisible={storeList.loadMore} root={list} />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {themes.length ? (
              themeList.visible.map((t) => (
                <ThemeCard
                  key={t.id}
                  theme={t}
                  active={t.slug === activeTheme?.slug}
                  hideStoreCount={!!activeStore}
                  onSelect={() => onSelectTheme(t.slug)}
                />
              ))
            ) : (
              <Empty loading={loading}>조건에 맞는 머미가 없습니다.</Empty>
            )}
            {themeList.hasMore ? (
              <EndMarker onVisible={themeList.loadMore} root={list} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

const Underline = () => (
  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-neutral-900" />
);

const Empty = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => (
  <p className="py-10 text-center text-sm text-neutral-500">
    {loading ? '불러오는 중…' : children}
  </p>
);

// 작품 하나로 좁혔을 때 탭 아래에 고정되는 얇은 헤더(스크롤 영역 밖).
// 영역은 최소로, 대신 "뒤로가기 + 작품명 + 보유 매장 수"로 지금 어디를 보고 있는지만 또렷하게 알려 준다.
function ActiveThemeHeader({
  theme,
  storeCount,
  onClear,
}: {
  theme: ThemeResult;
  storeCount: number;
  onClear: () => void;
}) {
  const meta = [
    themePlayersLabel(theme),
    theme.play_time_min ? `${theme.play_time_min}분` : null,
    ...theme.genres,
  ].filter(Boolean);
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-neutral-200 bg-background px-3 py-4">
      <button
        onClick={onClear}
        aria-label="전체 머미로 돌아가기"
        className="text-primary-600 hover:bg-primary-50 grid h-9 w-9 shrink-0 place-items-center rounded-full transition"
      >
        <ChevronLeftIcon />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{theme.title}</div>
        <div className="truncate text-xs text-neutral-500">
          {meta.join(' · ')}
          {theme.gm_required ? (
            <span className="ml-1.5 font-medium text-amber-700">GM 필요</span>
          ) : null}
        </div>
      </div>
      <div className="shrink-0 pr-1 text-sm text-neutral-500">
        <b className="text-primary-600 text-base font-bold">{storeCount}</b>곳
      </div>
    </div>
  );
}

// 매장 하나로 좁혔을 때 탭 아래에 고정되는 헤더 — 작품 헤더와 같은 구조(뒤로가기 + 이름 + 개수)
function ActiveStoreHeader({
  store,
  matched,
  onClear,
}: {
  store: StoreResult;
  matched: number;
  onClear: () => void;
}) {
  const total = store.total_theme_count;
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-neutral-200 bg-background px-3 py-4">
      <button
        onClick={onClear}
        aria-label="전체 머미로 돌아가기"
        className="text-primary-600 hover:bg-primary-50 grid h-9 w-9 shrink-0 place-items-center rounded-full transition"
      >
        <ChevronLeftIcon />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{store.name}</div>
        <div className="truncate text-xs text-neutral-500">
          {store.area_name} · {store.address}
        </div>
      </div>
      <div className="shrink-0 pr-1 text-right text-sm text-neutral-500">
        {matched === total ? (
          <>
            보유 <b className="text-primary-600 text-base font-bold">{total}</b>
            개
          </>
        ) : (
          <>
            조건에 맞는{' '}
            <b className="text-primary-600 text-base font-bold">{matched}</b> /
            전체 {total}
          </>
        )}
      </div>
    </div>
  );
}
