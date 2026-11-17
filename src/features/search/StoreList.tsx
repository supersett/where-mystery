import type { StoreResult } from './api';

export function StoreList({ stores }: { stores: StoreResult[] }) {
  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((s) => (
        <li
          key={s.id}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
        >
          <div className="aspect-[16/9] bg-neutral-100">
            {s.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.thumbnail}
                alt={s.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-4">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-neutral-500">{s.address}</div>
            <div className="mt-2 text-sm">
              조건에 맞는 테마 {s.matched_theme_count}개
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
