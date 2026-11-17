import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs';

// 검색 필터 상태 = URL 쿼리스트링 (공유/뒤로가기/새로고침 유지)
export const searchParsers = {
  area: parseAsString.withDefault('seoul'),
  players: parseAsInteger,
  genres: parseAsArrayOf(parseAsString).withDefault([]),
  diffMin: parseAsInteger,
  diffMax: parseAsInteger,
  time: parseAsInteger,
  q: parseAsString.withDefault(''),
  theme: parseAsString, // 선택한 작품(slug) — 있으면 그 작품을 보유한 매장만
  store: parseAsString, // 선택한 매장(slug) — 있으면 그 매장의 보유 작품만
  tab: parseAsStringLiteral(['themes', 'stores'] as const).withDefault(
    'themes',
  ),
  view: parseAsStringLiteral(['map', 'list'] as const).withDefault('map'),
};

export const GENRES = ['추리', '공포', '스릴러', '감성', '코미디', '판타지'];

// 인원 칩: 1~8인, 그리고 9인 이상. players=9 는 "9인 이상"(최대 인원이 9명 이상인 작품)을 뜻한다.
export const PLAYER_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const PLAYERS_OPEN_ENDED = 9;
export const playersLabel = (n: number) =>
  n >= PLAYERS_OPEN_ENDED ? `${PLAYERS_OPEN_ENDED}인 이상` : `${n}인`;
