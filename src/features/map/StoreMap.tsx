'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Map,
  MapMarker,
  MarkerClusterer,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';
import { env } from '@/env';
import type { StoreResult } from '@/features/search/api';
import { useBrandTheme } from '@/lib/brand-theme';

const SEOUL = { lat: 37.5665, lng: 126.978 };

// 핀 이미지(SVG). 슬림한 물방울 모양. 기본은 브랜드 색, 선택된 매장은 한 단계 밝은 색 + 조금 더 크게
const pinSvg = (fill: string, w: number, h: number) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 38">` +
      `<defs><filter id="s" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity=".28"/></filter></defs>` +
      `<g filter="url(#s)"><path d="M12 2C6.5 2 2.5 6.2 2.5 11.6 2.5 19 12 35 12 35S21.5 19 21.5 11.6C21.5 6.2 17.5 2 12 2z" fill="${fill}" stroke="#fff" stroke-width="1.6"/>` +
      `<circle cx="12" cy="11.5" r="3.6" fill="#fff"/></g></svg>`,
  );
const PIN = { w: 22, h: 35 };
const PIN_SELECTED = { w: 29, h: 46 };
const pinImage = (selected: boolean, color: string, accent: string) => {
  const { w, h } = selected ? PIN_SELECTED : PIN;
  return {
    src: pinSvg(selected ? accent : color, w, h),
    size: { width: w, height: h },
    options: { offset: { x: w / 2, y: h * 0.92 } }, // 핀 끝(viewBox 35/38 지점)이 좌표에 오도록
  };
};

type Props = {
  stores: StoreResult[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** 지도 위에 떠 있는 패널이 가리는 왼쪽 폭(px). 핀이 패널 뒤에 숨지 않도록 범위 계산에 반영 */
  insetLeft: number;
  /** 팝업의 "보유 작품 보기" */
  onViewThemes: (id: string) => void;
};

export function StoreMap({
  stores,
  selectedId,
  onSelect,
  insetLeft,
  onViewThemes,
}: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY,
    libraries: ['clusterer'],
  });
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const brand = useBrandTheme();
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState('');
  const [tilesReady, setTilesReady] = useState(false); // 지도 타일이 처음 그려졌는지
  const selected = stores.find((s) => s.id === selectedId) ?? null;

  // 지도 영역 크기가 바뀌면(모바일 전환, 방향 전환 등) 지도를 다시 맞춘다
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setBoxSize(
        `${Math.round(e.contentRect.width)}x${Math.round(e.contentRect.height)}`,
      ),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  // 검색 결과가 바뀌면 모든 매장이 보이도록 지도 범위를 맞춤
  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading || stores.length === 0) return;
    map.relayout(); // 컨테이너 크기가 바뀐 뒤에도 좌표 계산이 맞도록
    const bounds = new kakao.maps.LatLngBounds();
    stores.forEach((s) => bounds.extend(new kakao.maps.LatLng(s.lat, s.lng)));
    map.setBounds(bounds, 80, 80, 80, 80 + insetLeft);
  }, [stores, loading, insetLeft, boxSize]);

  // 목록에서 매장을 고르면 그 위치로 이동
  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading || !selected) return;
    // 너무 멀리서 보고 있으면 매장이 보이는 정도로 확대 (이미 가까우면 그대로)
    if (map.getLevel() > 5) map.setLevel(5);
    // 패널에 가려지지 않은 영역(지도 보이는 부분)의 한가운데에 오도록 이동
    const proj = map.getProjection();
    const pt = proj.containerPointFromCoords(
      new kakao.maps.LatLng(selected.lat, selected.lng),
    );
    map.panTo(
      proj.coordsFromContainerPoint(
        new kakao.maps.Point(pt.x - insetLeft / 2, pt.y),
      ),
    );
  }, [selected, loading, insetLeft]);

  if (error)
    return (
      <div className="p-6 text-sm text-red-600">
        지도를 불러오지 못했습니다. 카카오 키와 도메인 등록을 확인하세요.
      </div>
    );
  if (loading) return <MapSkeleton />;

  return (
    <div ref={boxRef} className="relative h-full w-full">
      <Map
        center={SEOUL}
        level={8}
        className="map-tone h-full w-full"
        onCreate={(m) => {
          mapRef.current = m;
          kakao.maps.event.addListener(m, 'tilesloaded', () =>
            setTilesReady(true),
          );
        }}
        onClick={() => onSelect(null)}
      >
        <MarkerClusterer averageCenter minLevel={6}>
          {stores
            .filter((s) => s.id !== selectedId)
            .map((s) => (
              <MapMarker
                key={s.id}
                position={{ lat: s.lat, lng: s.lng }}
                image={pinImage(false, brand.color, brand.accent)}
                onClick={() => onSelect(s.id)}
              />
            ))}
        </MarkerClusterer>
        {/* 선택한 매장은 클러스터 밖에서 항상 맨 위에 크게 표시 */}
        {selected ? (
          <MapMarker
            position={{ lat: selected.lat, lng: selected.lng }}
            image={pinImage(true, brand.color, brand.accent)}
            zIndex={10}
            onClick={() => onSelect(selected.id)}
          />
        ) : null}
      </Map>
      {/* 타일이 그려지기 전까지 스켈레톤으로 덮어 두었다가 부드럽게 걷어 낸다 */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[5] transition-opacity duration-300 ${
          tilesReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <MapSkeleton />
      </div>
      {/* 지도 윗가장자리를 흐리게 — 위쪽 목록/헤더와의 경계선을 없애 하나의 화면처럼 이어 보이게 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white via-white/70 to-transparent [mask-image:linear-gradient(to_bottom,#000_40%,transparent)] backdrop-blur-[3px] [-webkit-mask-image:linear-gradient(to_bottom,#000_40%,transparent)] md:hidden"
      />
      {selected ? (
        <div className="absolute bottom-4 left-1/2 w-[min(92%,24rem)] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-lg md:right-4 md:left-auto md:translate-x-0">
          <div className="font-semibold">{selected.name}</div>
          <div className="text-sm text-neutral-500">{selected.address}</div>
          <div className="mt-1 flex items-center justify-between gap-2 text-sm">
            <span>머미 {selected.total_theme_count}개</span>
            <button
              onClick={() => onViewThemes(selected.id)}
              className="bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-xs font-semibold transition"
            >
              보유 머미 보기 ›
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// 지도 SDK/타일을 불러오는 동안 보여 주는 자리 표시: 지도 영역이 비었다가 생기는 느낌을 없앤다
function MapSkeleton() {
  return (
    <div className="relative h-full w-full animate-pulse overflow-hidden bg-neutral-100">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200" />
    </div>
  );
}
