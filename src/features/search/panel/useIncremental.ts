import { useCallback, useState } from 'react';

// 이미 받아 둔 목록을 step개씩 나눠 그린다. 끝에 닿으면 loadMore()로 step개 더.
// 전체 개수 표시는 items.length 그대로 쓰면 된다.
export function useIncremental<T>(items: T[], step = 30) {
  const [count, setCount] = useState(step);
  const [prevItems, setPrevItems] = useState(items);

  // 목록 자체가 바뀌면(검색/필터/작품 선택) 처음부터 (렌더 중 파생 상태 갱신)
  if (prevItems !== items) {
    setPrevItems(items);
    setCount(step);
  }

  const loadMore = useCallback(() => setCount((c) => c + step), [step]);

  return {
    visible: items.slice(0, count),
    hasMore: count < items.length,
    loadMore,
  };
}
