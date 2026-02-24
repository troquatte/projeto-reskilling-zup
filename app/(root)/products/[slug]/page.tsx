import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';

// Services
import { getProductBySlug } from '../service/products';

// Components
import { ListProducts } from '../components/cards-list-products/ListProducts';
import { ProductDetails } from '../components/products-details/ProductDetails';

// Styles
import { Banner } from '@/shared/components/Banner/Banner';
import styles from './page.module.scss';

export default async function ProductsSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => getProductBySlug(slug),
  });

  return (
    <main className="container" role="main" aria-label={`Página do produto: ${slug}`}>
      <Banner />
      <nav className={styles.hostProductDetailsPage} aria-label="Voltar para home">
        <Link href="/" aria-label="Voltar para a página inicial">
          &larr; Voltar para home
        </Link>
      </nav>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <div role="status" aria-live="polite">
              Carregando detalhes...
            </div>
          }
        >
          <ProductDetails slug={slug} />
        </Suspense>

        {!!queryClient.getQueryData(['product-detail', slug]) && (
          <section aria-labelledby="related-products-title">
            <div className={styles.hostProductDetailsPage}>
              <h2 id="related-products-title">Produtos Relacionados</h2>
            </div>
            <Suspense
              fallback={
                <div role="status" aria-live="polite">
                  Carregando Produtos...
                </div>
              }
            >
              <ListProducts />
            </Suspense>
          </section>
        )}
      </HydrationBoundary>
    </main>
  );
}
