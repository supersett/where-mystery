import { createClient } from '@supabase/supabase-js';
import { cacheLife, cacheTag } from 'next/cache';
import { env } from '@/env';
import type { Database } from '@/types/database';
import { fetchStores, fetchThemes } from './api';
import { DEFAULT_FILTERS } from './defaults';

// 첫 화면(필터 없음)의 작품/매장 목록. 서버에서 받아 1시간 캐시한다.
// 공개 데이터라 쿠키가 필요 없는 일반 클라이언트를 쓴다('use cache' 안에서는 cookies() 사용 불가).
export async function getInitialSearch() {
  'use cache';
  cacheLife('hours');
  cacheTag('search-initial');

  const client = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const [themes, stores] = await Promise.all([
    fetchThemes(DEFAULT_FILTERS, null, client),
    fetchStores(DEFAULT_FILTERS, null, client),
  ]);
  return { themes, stores };
}
