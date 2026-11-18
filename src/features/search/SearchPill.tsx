'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@/components/ui/icons';
import { fetchAreas } from './api';
import { areaSummary, groupAreas, toggleArea } from './area-options';
import { PLAYER_CHOICES, playersLabel, searchParsers } from './params';

type Panel = 'area' | 'players' | null;

const seg =
  'flex select-none flex-col items-start rounded-full px-5 py-2 text-left transition hover:bg-neutral-100';
const segActive = 'bg-white shadow-md hover:bg-white';

// 지역 선택 칩
const chip = 'rounded-full border px-3 py-1.5 text-sm transition';
const chipOn = 'border-neutral-900 bg-neutral-900 text-white';
const chipIncluded = 'border-neutral-200 bg-neutral-200 text-neutral-700'; // 구 전체가 선택돼 포함된 상권
const chipOff = 'border-neutral-300 hover:border-neutral-900';

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
  const groups = groupAreas(areas);
  const areaName = areaSummary(f.area, areas);

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
    <div ref={ref} className="relative w-full max-w-3xl">
      <div className="flex items-center rounded-full border border-neutral-200 bg-white shadow-sm">
        <button
          className={`${seg} ${open === 'area' ? segActive : ''}`}
          onClick={() => setOpen(open === 'area' ? null : 'area')}
        >
          <span className="text-xs font-semibold">지역</span>
          <span
            className={`max-w-40 truncate text-sm ${f.area.length ? 'text-neutral-900' : 'text-neutral-600'}`}
          >
            {areaName}
          </span>
        </button>
        <span className="h-6 w-px bg-neutral-200" />
        {/* 데스크톱: 인원 버튼을 기준으로 팝업을 띄운다 (모바일은 pill 전체 기준) */}
        <div className="md:relative">
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
          {open === 'players' && (
            <div
              className={`absolute left-0 z-30 ${pop} w-72 max-w-[calc(100vw-1.5rem)] rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl ${dropUp ? '' : 'md:mt-3'}`}
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
        <span className="h-6 w-px bg-neutral-200" />
        <label className={`${seg} min-w-0 flex-1 cursor-text`}>
          <span className="text-xs font-semibold">테마</span>
          <input
            className="w-full bg-transparent text-sm outline-none select-text placeholder:text-neutral-400"
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
          className={`absolute left-0 z-30 ${pop} w-[min(28rem,calc(100vw-1.5rem))] rounded-3xl border border-neutral-200 bg-white shadow-xl`}
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div>
              <div className="text-sm font-semibold">지역</div>
              <div className="text-xs text-neutral-500">
                여러 곳을 함께 고를 수 있어요
              </div>
            </div>
            <button
              onClick={() => setOpen(null)}
              className="text-primary-700 hover:text-primary-600 text-sm font-semibold"
            >
              완료
            </button>
          </div>
          <div className="max-h-[min(22rem,55vh)] overflow-auto px-5 pb-4">
            <div className="flex flex-wrap gap-1.5 pb-3">
              <button
                onClick={() => setF({ area: null })}
                className={`${chip} ${f.area.length === 0 ? chipOn : chipOff} font-semibold`}
              >
                서울 전체
              </button>
            </div>
            <div className="flex flex-col gap-3 border-t border-neutral-200 pt-3">
              {groups.map((g) => {
                const whole = f.area.includes(g.slug);
                return (
                  <div key={g.slug} className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() =>
                        setF({ area: toggleArea(f.area, g.slug, groups) })
                      }
                      aria-pressed={whole}
                      className={`${chip} font-semibold ${whole ? chipOn : chipOff}`}
                    >
                      {g.name}
                    </button>
                    {g.children.map((c) => {
                      const on = f.area.includes(c.slug);
                      return (
                        <button
                          key={c.slug}
                          onClick={() =>
                            setF({ area: toggleArea(f.area, c.slug, groups) })
                          }
                          aria-pressed={on || whole}
                          className={`${chip} ${on ? chipOn : whole ? chipIncluded : chipOff}`}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
