type Area = {
  id: string;
  parent_id: string | null;
  slug: string;
  name: string;
};

// 계층 트리를 들여쓰기된 평면 목록으로 변환 (DB에 지역이 추가되면 자동 반영)
export function flattenAreas(areas: Area[]) {
  const children = new Map<string | null, Area[]>();
  areas.forEach((a) => {
    const list = children.get(a.parent_id) ?? [];
    list.push(a);
    children.set(a.parent_id, list);
  });
  const out: { slug: string; label: string }[] = [];
  const walk = (parent: string | null, depth: number) =>
    (children.get(parent) ?? []).forEach((a) => {
      out.push({ slug: a.slug, label: `${'  '.repeat(depth)}${a.name}` });
      walk(a.id, depth + 1);
    });
  walk(null, 0);
  return out;
}
