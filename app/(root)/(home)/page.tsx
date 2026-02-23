import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

// Components
import { Banner } from '../../../shared/components/Banner/Banner';

// Services
import { getProducts } from '../products/service/products';

// Styles
import { ListProducts } from '../products/components/cards-list-products/ListProducts';
import styles from './page.module.scss';

// SSG
export const dynamic = 'force-static';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['products-list'],
    queryFn: getProducts,
  });
  return (
    <main className="container">
      <div className={`${styles.hostHomeComponent}`}>
        <Banner />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Carregando Produtos...</div>}>
          <ListProducts />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
