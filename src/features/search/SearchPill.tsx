'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@/components/ui/icons';
import { fetchAreas } from './api';
import { flattenAreas } from './area-options';
import { PLAYER_CHOICES, playersLabel, searchParsers } from './params';

type Panel = 'area' | 'players' | null;

const seg =
  'flex flex-col items-start rounded-full px-5 py-2 text-left transition hover:bg-neutral-100';
const segActive = 'bg-white shadow-md hover:bg-white';

// dropUp: 화면 아래에 놓일 때(모바일) 팝업을 위쪽으로 연다
export function SearchPill({
  dropUp = false,
  autoFocusText = false,
}: {
  dropUp?: boolean;
  autoFocusText?: boolean;
}) {
  const [f, setF] = useQueryStates(searchParsers);
  const [open, setOpen] = useState<Panel>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: fetchAreas,
  });
  const options = flattenAreas(areas);
  const areaName = areas.find((a) => a.slug === f.area)?.name ?? '서울';

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // 입력값은 로컬로 들고 있다가(한글 IME 안전), 타이핑이 멈추면 URL(=검색)에 반영
  const [text, setText] = useState(f.q);
  const committed = useRef(f.q);

  // 초기화 버튼·뒤로가기처럼 URL이 바깥에서 바뀐 경우에만 입력창을 맞춘다
  useEffect(() => {
    if (f.q !== committed.current) {
      committed.current = f.q;
      setText(f.q);
    }
  }, [f.q]);

  const commit = (value: string) => {
    if (value === committed.current) return;
    committed.current = value;
    setF({ q: value || null });
  };

  useEffect(() => {
    const t = setTimeout(() => commit(text), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const pop = dropUp ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 shadow-sm">
        <button
          className={`${seg} ${open === 'area' ? segActive : ''}`}
          onClick={() => setOpen(open === 'area' ? null : 'area')}
        >
          <span className="text-xs font-semibold">지역</span>
          <span className="text-sm text-neutral-600">{areaName}</span>
        </button>
        <span className="h-6 w-px bg-neutral-200" />
        <button
          className={`${seg} ${open === 'players' ? segActive : ''}`}
          onClick={() => setOpen(open === 'players' ? null : 'players')}
        >
          <span className="text-xs font-semibold">인원</span>
          <span
            className={`text-sm ${f.players ? 'text-neutral-900' : 'text-neutral-400'}`}
          >
            {f.players ? playersLabel(f.players) : '인원 추가'}
          </span>
        </button>
        <span className="h-6 w-px bg-neutral-200" />
        <label className={`${seg} min-w-0 flex-1 cursor-text`}>
          <span className="text-xs font-semibold">테마</span>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            placeholder="테마·매장명 (초성도 가능)"
            autoFocus={autoFocusText}
            value={text}
            onFocus={() => setOpen(null)}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter는 기다리지 않고 즉시 검색
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) commit(text);
            }}
          />
        </label>
        <span className="bg-primary-600 text-on-primary mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full">
          <SearchIcon />
        </span>
      </div>

      {open === 'area' && (
        <div
          className={`absolute left-0 z-30 ${pop} max-h-80 w-64 overflow-auto rounded-3xl border border-neutral-200 bg-white p-2 shadow-xl`}
        >
          {options.map((o) => (
            <button
              key={o.slug}
              onClick={() => {
                setF({ area: o.slug });
                setOpen(null);
              }}
              className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm hover:bg-neutral-100 ${o.slug === f.area ? 'text-primary-700 font-semibold' : ''}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {open === 'players' && (
        <div
          className={`absolute left-0 z-30 ${pop} w-72 max-w-[calc(100vw-1.5rem)] rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl md:left-40`}
        >
          <div className="text-sm font-semibold">참여 인원</div>
          <div className="mb-3 text-xs text-neutral-500">
            이 인원이 할 수 있는 테마만 보여요
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PLAYER_CHOICES.map((n) => {
              const on = f.players === n;
              return (
                <button
                  key={n}
                  // 선택한 칩을 다시 누르면 해제
                  onClick={() => {
                    setF({ players: on ? null : n });
                    setOpen(null);
                  }}
                  className={`rounded-xl border py-2.5 text-sm transition ${
                    n >= 9 ? 'col-span-2' : ''
                  } ${
                    on
                      ? 'border-neutral-900 bg-neutral-900 font-semibold text-white'
                      : 'border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {playersLabel(n)}
                </button>
              );
            })}
          </div>
          {f.players ? (
            <button
              onClick={() => {
                setF({ players: null });
                setOpen(null);
              }}
              className="mt-4 text-xs text-neutral-500 underline"
            >
              인원 조건 지우기
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
