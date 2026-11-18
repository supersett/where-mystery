'use client';

import { useQueryStates } from 'nuqs';
import { ChevronLeftIcon, SearchIcon } from '@/components/ui/icons';
import { useVisualViewport } from '@/lib/use-visual-viewport';
import { playersLabel, searchParsers } from './params';
import { SearchPill } from './SearchPill';

// 모바일 하단의 검색 "열기 버튼". 현재 조건을 요약해 보여 준다.
export function SearchLauncher({ onOpen }: { onOpen: () => void }) {
  const [f] = useQueryStates(searchParsers);
  const parts = [
    f.players ? playersLabel(f.players) : null,
    f.genres.length ? f.genres.join('·') : null,
    f.q.trim() || null,
  ].filter(Boolean);
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-full border border-neutral-200 bg-white py-2 pr-2 pl-5 text-left shadow-sm"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold">테마·매장 검색</span>
        <span
          className={`block truncate text-sm ${parts.length ? 'text-neutral-900' : 'text-neutral-400'}`}
        >
          {parts.length ? parts.join(' · ') : '테마·매장명 (초성도 가능)'}
        </span>
      </span>
      <span className="bg-primary-600 text-on-primary grid h-10 w-10 shrink-0 place-items-center rounded-full">
        <SearchIcon />
      </span>
    </button>
  );
}

// 전체 화면 검색 모드: 입력창은 맨 위, 결과는 그 아래에 꽉 채운다.
// 높이를 "키보드를 뺀 보이는 영역"에 맞춰서, 결과 목록이 키보드에 가려지지 않는다.
export function MobileSearchLayer({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode; // 결과 패널
}) {
  const vv = useVisualViewport();
  return (
    <div
      className="fixed inset-x-0 z-50 flex flex-col bg-background"
      style={
        vv ? { top: vv.top, height: vv.height } : { top: 0, height: '100dvh' }
      }
    >
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-4">
        <button
          onClick={onClose}
          aria-label="검색 닫기"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-neutral-100"
        >
          <ChevronLeftIcon size={28} />
        </button>
        <SearchPill autoFocusText />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
