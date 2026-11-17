import type { SearchFilters } from './api';

// 아무 필터도 걸지 않은 첫 화면의 조건. 서버가 미리 받아 두는 데이터가 이 조건의 결과다.
// (searchParsers 의 기본값과 반드시 같아야 쿼리 키가 일치해 서버 데이터가 쓰인다)
export const DEFAULT_FILTERS: SearchFilters = {
  area: 'seoul',
  players: null,
  genres: [],
  diffMin: null,
  diffMax: null,
  time: null,
  q: '',
};

export const isDefaultFilters = (f: SearchFilters) =>
  f.area === DEFAULT_FILTERS.area &&
  f.players === null &&
  f.genres.length === 0 &&
  f.diffMin === null &&
  f.diffMax === null &&
  f.time === null &&
  f.q.trim() === '';
