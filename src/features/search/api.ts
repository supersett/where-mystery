import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

// 브라우저 클라이언트가 기본. 서버에서 미리 받을 때는 서버용 클라이언트를 넘긴다
type Client = SupabaseClient<Database>;

export type SearchFilters = {
  area: string;
  players: number | null;
  genres: string[];
  diffMin: number | null;
  diffMax: number | null;
  time: number | null;
  q: string;
};

const rpcArgs = (f: SearchFilters) => ({
  p_area_slug: f.area,
  p_players: f.players ?? undefined,
  p_genres: f.genres.length ? f.genres : undefined,
  p_difficulty_min: f.diffMin ?? undefined,
  p_difficulty_max: f.diffMax ?? undefined,
  p_max_play_time: f.time ?? undefined,
  p_query: f.q.trim() || undefined,
});

// themeSlug가 있으면 그 작품을 보유한 매장만
export async function fetchStores(
  f: SearchFilters,
  themeSlug?: string | null,
  client: Client = createClient(),
) {
  const { data, error } = await client.rpc('search_stores', {
    ...rpcArgs(f),
    p_theme_slug: themeSlug ?? undefined,
  });
  if (error) throw error;
  return data;
}

// storeSlug가 있으면 그 매장이 보유한 작품만(가나다순)
export async function fetchThemes(
  f: SearchFilters,
  storeSlug?: string | null,
  client: Client = createClient(),
) {
  const { data, error } = await client.rpc('search_themes', {
    ...rpcArgs(f),
    p_store_slug: storeSlug ?? undefined,
  });
  if (error) throw error;
  return data;
}

export type StoreResult = Awaited<ReturnType<typeof fetchStores>>[number];
export type ThemeResult = Awaited<ReturnType<typeof fetchThemes>>[number];

export async function fetchAreas() {
  const { data, error } = await createClient()
    .from('areas')
    .select('id, parent_id, slug, name, level, sort_order')
    .order('sort_order');
  if (error) throw error;
  return data;
}
