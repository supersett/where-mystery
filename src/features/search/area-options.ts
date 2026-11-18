type Area = {
  id: string;
  parent_id: string | null;
  slug: string;
  name: string;
};

// 구(또는 최상위 아래 첫 단계) 하나와 그 아래 상권들
export type AreaGroup = {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
};

// 계층 트리를 "구 → 상권" 묶음으로 변환 (DB에 지역이 추가되면 자동 반영)
export function groupAreas(areas: Area[]): AreaGroup[] {
  const roots = new Set(areas.filter((a) => !a.parent_id).map((a) => a.id));
  return areas
    .filter((a) => a.parent_id && roots.has(a.parent_id))
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      children: areas
        .filter((c) => c.parent_id === d.id)
        .map((c) => ({ slug: c.slug, name: c.name })),
    }));
}

// 칩 하나를 눌렀을 때의 새 선택 목록.
//  - 구를 고르면 그 아래 상권 선택은 구에 흡수된다
//  - 구가 선택된 상태에서 상권을 누르면 "그 상권만 제외"
//  - 구의 상권을 전부 고르면 구 하나로 합친다
export function toggleArea(
  selected: string[],
  slug: string,
  groups: AreaGroup[],
): string[] {
  const group = groups.find((g) => g.slug === slug);
  if (group) {
    const kids = new Set(group.children.map((c) => c.slug));
    return selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected.filter((s) => !kids.has(s)), slug];
  }
  const parent = groups.find((g) => g.children.some((c) => c.slug === slug));
  if (!parent)
    return selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected, slug];
  if (selected.includes(parent.slug))
    return [
      ...selected.filter((s) => s !== parent.slug),
      ...parent.children.map((c) => c.slug).filter((s) => s !== slug),
    ];
  const next = selected.includes(slug)
    ? selected.filter((s) => s !== slug)
    : [...selected, slug];
  const kids = parent.children.map((c) => c.slug);
  return kids.every((k) => next.includes(k))
    ? [...next.filter((s) => !kids.includes(s)), parent.slug]
    : next;
}

// 검색창에 보이는 요약: 없음 → 서울 전체, 1개 → 이름, 여러 개 → "홍대 외 2"
export function areaSummary(selected: string[], areas: Area[]): string {
  const names = selected.map((s) => areas.find((a) => a.slug === s)?.name ?? s);
  if (names.length === 0) return '서울 전체';
  return names.length === 1 ? names[0] : `${names[0]} 외 ${names.length - 1}`;
}
