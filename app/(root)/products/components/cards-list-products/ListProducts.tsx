'use client';

// Types
import { Product } from '@/shared/typings/Product';

// Utils
import { blurDataURL } from '@/shared/utils/image-blur';

// Next
import Image from 'next/image';
import Link from 'next/link';

// Hooks
import { useProducts } from '@/app/(root)/products/hooks/useProducts';

// Styles
import styles from './ListProducts.module.scss';

export const ListProducts = () => {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <p role="status" aria-live="polite">
        Carregando produtos...
      </p>
    );
  }

  if (isError || !products || products.length === 0) {
    return (
      <p role="alert" aria-live="assertive">
        Nenhum produto encontrado.
      </p>
    );
  }

  return (
    // Tag principal identificada como uma região de produtos
    <ul className={styles.hostListComponent} aria-label="Lista de produtos disponíveis" role="list">
      {products.map((product: Product) => (
        <li className="card" key={product.id} role="listitem">
          <Image
            src={product.images[0]}
            alt={`Imagem do produto: ${product.title}`}
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
          <hgroup>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
          </hgroup>

          <footer className={styles.footer}>
            <span aria-label={`Preço: ${product.price} reais`}>R${product.price}</span>
            <Link
              href={'/products/' + product.slug}
              aria-label={`Ver mais detalhes sobre o produto ${product.title}`}
            >
              Ver mais
            </Link>
          </footer>
        </li>
      ))}
    </ul>
  );
};
