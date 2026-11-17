'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useQueryStates } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { StoreMap } from '@/features/map/StoreMap';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useMediaQuery } from '@/lib/use-media-query';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';
import {
  fetchStores,
  fetchThemes,
  type StoreResult,
  type ThemeResult,
} from './api';
import { ResultPanel, type PanelTab } from './panel/ResultPanel';
import { MobileSearchLayer, SearchLauncher } from './MobileSearch';
import { isDefaultFilters } from './defaults';
import { SearchPill } from './SearchPill';
import { searchParsers } from './params';
import { StoreList } from './StoreList';

const PANEL_WIDTH = 392; // px (md 이상)

type Props = { initial: { themes: ThemeResult[]; stores: StoreResult[] } };

export function SearchView({ initial }: Props) {
  const [f, setF] = useQueryStates(searchParsers);
  const {
    view,
    theme: themeParam,
    store: storeParam,
    tab: tabParam,
    ...filters
  } = f;
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [searchOpen, setSearchOpen] = useState(false); // 모바일 전체 화면 검색 모드

  const useDefault = isDefaultFilters(filters);

  // 필터에 맞는 작품 목록 (작품 탭)
  const themesQ = useQuery({
    queryKey: ['themes', filters, storeParam],
    queryFn: () => fetchThemes(filters, storeParam),
    placeholderData: (prev) => prev,
    // 첫 화면(필터 없음)은 서버가 미리 받아 둔 데이터로 바로 시작
    initialData: useDefault && !storeParam ? initial.themes : undefined,
  });
  const themes = themesQ.data ?? [];

  // 검색 결과가 작품 하나뿐이면 자동으로 그 작품의 보유 매장을 보여 준다
  const autoTheme =
    !themeParam && !storeParam && themes.length === 1 ? themes[0] : null;
  const activeSlug = themeParam ?? autoTheme?.slug ?? null;
  const activeTheme = themes.find((t) => t.slug === activeSlug) ?? null;

  // 선택한 작품이 새 검색어/필터에서 사라졌다면 선택을 푼다
  useEffect(() => {
    if (
      themeParam &&
      themesQ.isSuccess &&
      !themesQ.isPlaceholderData &&
      !activeTheme
    )
      setF({ theme: null });
  }, [
    themeParam,
    themesQ.isSuccess,
    themesQ.isPlaceholderData,
    activeTheme,
    setF,
  ]);

  const storesQ = useQuery({
    queryKey: ['stores', filters, activeSlug],
    queryFn: () => fetchStores(filters, activeSlug),
    placeholderData: (prev) => prev, // 필터 변경 중 깜빡임 방지
    initialData: useDefault && !activeSlug ? initial.stores : undefined,
  });
  const stores = storesQ.data ?? [];
  const isFetching = themesQ.isFetching || storesQ.isFetching;
  const error = themesQ.error ?? storesQ.error;

  // 매장 하나로 좁힌 상태. 필터 때문에 매장 목록에서 빠져도 헤더가 사라지지 않게 마지막으로 누른 매장을 기억한다
  const [pickedStore, setPickedStore] = useState<StoreResult | null>(null);
  const activeStore =
    stores.find((s) => s.slug === storeParam) ??
    (pickedStore?.slug === storeParam ? pickedStore : null);

  const hasFilter =
    !!filters.q.trim() ||
    filters.players !== null ||
    filters.genres.length > 0 ||
    filters.diffMin !== null ||
    filters.diffMax !== null ||
    filters.time !== null ||
    !!activeSlug ||
    !!storeParam;
  const tab: PanelTab = tabParam;

  // 무엇을 검색했느냐에 따라 기본 탭을 바꾼다
  //  - 작품명(검색어)을 입력/삭제  → 매장 탭 / 작품 탭
  //  - 인원수를 바꿈             → 작품 탭
  const prev = useRef({ q: filters.q.trim(), players: filters.players });
  useEffect(() => {
    const q = filters.q.trim();
    const p = prev.current;
    if (q !== p.q)
      setF({ tab: q ? 'stores' : 'themes', theme: null, store: null });
    else if (filters.players !== p.players)
      setF({ tab: 'themes', theme: null });
    prev.current = { q, players: filters.players };
  }, [filters.q, filters.players, setF]);

  const selectTheme = (slug: string | null) => {
    setSelectedStoreId(null);
    setF({ theme: slug, store: null, tab: slug ? 'stores' : 'themes' });
  };

  // 매장의 보유 작품 보기: 작품 탭으로 바꾸고, 지도에서는 그 매장을 강조(다른 핀은 그대로 둔다)
  const viewStoreThemes = (s: StoreResult) => {
    setPickedStore(s);
    setSelectedStoreId(s.id);
    setF({ store: s.slug, theme: null, tab: 'themes' });
  };
  const clearStore = () => setF({ store: null });

  const panel = (
    <ResultPanel
      themes={themes}
      stores={stores}
      activeTheme={activeTheme}
      activeStore={activeStore}
      tab={tab}
      filtered={hasFilter}
      loading={isFetching}
      selectedStoreId={selectedStoreId}
      onTab={(t) => setF({ tab: t })}
      onSelectTheme={selectTheme}
      onSelectStore={setSelectedStoreId}
      onViewStoreThemes={viewStoreThemes}
      onClearStore={clearStore}
    />
  );
  const pill = <SearchPill />;

  return (
    <div className="flex h-dvh flex-col">
      <header className="relative z-20 flex flex-wrap items-center gap-3 bg-white px-4 py-3">
        <h1 className="shrink-0">
          <Image
            src="/brand/logo-mumi.svg"
            alt="머미맵"
            width={77}
            height={40}
            priority
            unoptimized // SVG는 이미 벡터라 최적화 변환이 필요 없다
            className="h-10 w-auto"
          />
        </h1>
        {/* 데스크톱: 상단 검색 / 모바일: 화면 맨 아래로 이동 */}
        <div className="hidden flex-1 justify-center md:flex">{pill}</div>
        <div className="ml-auto flex items-center gap-3 text-sm md:ml-0">
          <ThemeToggle />
          <span className="hidden text-neutral-500 sm:inline">
            {isFetching ? '검색 중…' : `${stores.length}개 매장`}
          </span>
          <div className="flex overflow-hidden rounded-full border border-neutral-300">
            {(['map', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setF({ view: v })}
                className={`px-4 py-1.5 ${view === v ? 'bg-neutral-900 text-white' : 'bg-white'}`}
              >
                {v === 'map' ? '지도' : '리스트'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 반응형은 JS(useMediaQuery)가 아니라 CSS(md:)로 처리한다.
          서버가 만든 첫 HTML이 이미 올바른 레이아웃이라 새로고침 때 데스크톱→모바일로 깜빡이지 않는다.
          모바일: [결과 목록] 위 / [지도 30%] 아래 — 지도는 남는 영역만 쓰므로 핀이 가려지지 않는다
          데스크톱: 지도가 전체, 결과 목록은 그 위에 떠 있는 왼쪽 패널 */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {view === 'map' ? (
          <aside
            className={`order-1 min-h-0 flex-1 bg-white md:absolute md:top-4 md:bottom-4 md:left-4 md:z-10 md:w-[392px] md:flex-none md:overflow-hidden md:rounded-3xl md:shadow-xl md:transition-transform md:duration-200 ${
              panelOpen ? '' : 'md:-translate-x-[calc(100%+1rem)]'
            }`}
          >
            {panel}
          </aside>
        ) : null}

        <main
          className={`relative order-2 overflow-auto ${
            view === 'map'
              ? 'h-[30dvh] shrink-0 md:h-auto md:min-h-0 md:flex-1'
              : 'min-h-0 flex-1'
          }`}
        >
          {error ? (
            <div className="p-6 text-sm text-red-600">
              검색 중 오류가 발생했습니다.
            </div>
          ) : view === 'map' ? (
            <>
              <StoreMap
                stores={stores}
                selectedId={selectedStoreId}
                onSelect={setSelectedStoreId}
                onViewThemes={(id) => {
                  const st = stores.find((x) => x.id === id);
                  if (st) viewStoreThemes(st);
                }}
                insetLeft={!isMobile && panelOpen ? PANEL_WIDTH + 16 : 0}
              />
              <button
                onClick={() => setPanelOpen((o) => !o)}
                aria-label={panelOpen ? '패널 접기' : '패널 열기'}
                className={`absolute top-1/2 z-10 hidden h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-xl bg-white shadow-md hover:bg-neutral-50 md:flex ${
                  panelOpen ? 'left-[408px]' : 'left-0'
                }`}
              >
                {panelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </button>
            </>
          ) : stores.length ? (
            <StoreList stores={stores} />
          ) : (
            <div className="p-6 text-sm text-neutral-500">
              조건에 맞는 매장이 없습니다.
            </div>
          )}
        </main>
      </div>

      {/* 모바일: 하단에는 검색 "열기 버튼"만 두고, 누르면 전체 화면 검색 모드 */}
      <div className="relative z-20 rounded-t-3xl bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_28px_-14px_rgba(0,0,0,0.22)] md:hidden">
        <SearchLauncher onOpen={() => setSearchOpen(true)} />
      </div>
      {isMobile && searchOpen ? (
        <MobileSearchLayer onClose={() => setSearchOpen(false)}>
          <ResultPanel
            themes={themes}
            stores={stores}
            activeTheme={activeTheme}
            activeStore={activeStore}
            tab={tab}
            filtered={hasFilter}
            loading={isFetching}
            selectedStoreId={selectedStoreId}
            onTab={(t) => setF({ tab: t })}
            onSelectTheme={selectTheme}
            // 매장을 고르면 검색 모드를 닫고 지도에서 그 위치를 보여 준다
            onSelectStore={(id) => {
              setSelectedStoreId(id);
              setSearchOpen(false);
              setF({ view: 'map' });
            }}
            // 작품 보기는 검색 모드를 닫지 않고 작품 탭만 바꾼다
            onViewStoreThemes={viewStoreThemes}
            onClearStore={clearStore}
          />
        </MobileSearchLayer>
      ) : null}
    </div>
  );
}
