import Image from 'next/image';
import { ChevronRightIcon } from '@/components/ui/icons';
import type { StoreResult } from '../api';

// 매장이 카카오맵에 등록한 장소 페이지(영업시간·전화·리뷰 등). 아직 연결 전이면 좌표만으로 지도를 여는 공식 링크.
const kakaoMapUrl = (s: StoreResult) =>
  s.kakao_place_id
    ? `https://place.map.kakao.com/${s.kakao_place_id}`
    : `https://map.kakao.com/link/map/${encodeURIComponent(s.name)},${s.lat},${s.lng}`;

// 네이버지도: 장소 ID가 있으면 매장 장소 페이지, 없으면 매장 이름으로 검색된 채로 열리는 공식 검색 URL
const naverMapUrl = (s: StoreResult) =>
  s.naver_place_id
    ? `https://map.naver.com/p/entry/place/${s.naver_place_id}`
    : `https://map.naver.com/p/search/${encodeURIComponent(s.name)}`;

// 매장 목록의 한 줄. filtered=true 면 "검색된 N개 / 전체 M개"를 함께 보여 준다
export function StoreCard({
  store,
  active,
  filtered,
  onSelect,
  onViewThemes,
}: {
  store: StoreResult;
  active: boolean;
  filtered: boolean;
  onSelect: () => void;
  onViewThemes: () => void;
}) {
  return (
    <div
      data-store-id={store.id}
      className={`flex items-center gap-1 rounded-2xl transition hover:bg-neutral-100 ${
        active ? 'bg-primary-50 ring-primary-300 ring-1' : 'bg-neutral-50'
      }`}
    >
      <div className="min-w-0 flex-1 py-3 pl-3">
        <button
          onClick={onSelect}
          className="flex w-full min-w-0 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{store.name}</div>
            <div className="truncate text-xs text-neutral-500">
              {store.area_name} · {store.address}
            </div>
          </div>
          {store.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.thumbnail}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : null}
        </button>
        {/* 이 매장이 보유한 머미 목록으로 */}
        <button
          onClick={onViewThemes}
          className="text-primary-700 hover:text-primary-600 mt-1 flex max-w-full items-center gap-0.5 text-sm font-medium"
        >
          <span className="truncate">
            머미 {store.total_theme_count}개
            {filtered ? (
              <>
                {' · '}
                <b>검색된 머미 {store.matched_theme_count}개</b>
              </>
            ) : null}{' '}
            보러가기
          </span>
          <ChevronRightIcon />
        </button>
      </div>
      <div className="mr-3 flex shrink-0 items-center gap-1">
        <a
          href={kakaoMapUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${store.name} 카카오맵에서 열기`}
          title="카카오맵에서 열기"
          className="rounded-xl p-1 transition hover:scale-110"
        >
          <Image
            src="/brand/kakaomap.png"
            alt=""
            width={32}
            height={32}
            className="rounded-lg"
          />
        </a>
        <a
          href={naverMapUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${store.name} 네이버지도에서 검색`}
          title="네이버지도에서 검색"
          className="rounded-xl p-1 transition hover:scale-110"
        >
          <Image
            src="/brand/navermap.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            className="rounded-lg"
          />
        </a>
      </div>
    </div>
  );
}
