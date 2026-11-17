import { useSyncExternalStore } from 'react';

// 모바일 키보드를 뺀 "실제로 보이는 영역"의 위치/높이. (iOS Safari는 키보드가 올라와도 레이아웃이 줄지 않아 직접 읽어야 한다)
// 값은 `${top},${height}` 문자열 하나로 비교해 불필요한 리렌더를 피한다.
const subscribe = (cb: () => void) => {
  const vv = window.visualViewport;
  if (!vv) return () => {};
  vv.addEventListener('resize', cb);
  vv.addEventListener('scroll', cb);
  return () => {
    vv.removeEventListener('resize', cb);
    vv.removeEventListener('scroll', cb);
  };
};
const snapshot = () => {
  const vv = window.visualViewport;
  return vv ? `${Math.round(vv.offsetTop)},${Math.round(vv.height)}` : '';
};

export function useVisualViewport() {
  const v = useSyncExternalStore(subscribe, snapshot, () => '');
  if (!v) return null;
  const [top, height] = v.split(',').map(Number);
  return { top, height };
}
