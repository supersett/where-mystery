import { Suspense } from 'react';
import { SearchView } from '@/features/search/SearchView';
import { getInitialSearch } from '@/features/search/initial-data';

export default async function Home() {
  const initial = await getInitialSearch();
  return (
    <Suspense>
      <SearchView initial={initial} />
    </Suspense>
  );
}
