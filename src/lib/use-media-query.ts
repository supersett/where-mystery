import { useSyncExternalStore } from 'react';

// 서버/첫 렌더는 false(데스크톱 기준)로 시작하고, 마운트 후 실제 화면 폭으로 맞춘다
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
