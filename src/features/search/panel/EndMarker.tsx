'use client';

import { useEffect, useRef } from 'react';

// 목록 맨 끝에 두는 보이지 않는 표시. 스크롤 영역 근처에 오면 onVisible 호출.
// (root=null: 뷰포트 기준이지만 상위 overflow 영역에 가려진 부분은 보이지 않는 것으로 계산됨)
export function EndMarker({
  onVisible,
  root,
}: {
  onVisible: () => void;
  root: HTMLElement | null;
}) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = el.current;
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onVisible();
      },
      { root, rootMargin: '300px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [onVisible, root]);
  return <div ref={el} className="h-px" />;
}
