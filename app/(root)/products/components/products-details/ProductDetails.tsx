'use client';

// Next.js
import Image from 'next/image';
import { useState } from 'react';

// Hooks
import { useProductBySlug } from '../../hooks/useProductBySlug';

// Styles
import styles from './ProductDetails.module.scss';

// Utils
import { formatCurrency } from '@/shared/utils/format-currency';
import { blurDataURL } from '@/shared/utils/image-blur';

export const ProductDetails = ({ slug }: { slug: string }) => {
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  const [price] = useState(formatCurrency(product?.price || 0));

  if (isLoading) {
    return (
      <p role="status" aria-live="polite">
        Carregando informações do produto...
      </p>
    );
  }

 

  return (
    (isError || !product) ? (
      <div
        className={styles.hostProductDetails + ' ' + styles.notFound}
        role="alert"
        aria-live="assertive"
      >
        <h1>Produto não encontrado</h1>
      </div>
    ) : (
    <article
      className={styles.hostProductDetails}
      aria-label={`Detalhes do produto: ${product.title}`}
    >
      <Image
        src={product.images[0]}
        alt={`Fotografia do produto: ${product.title}`}
        width={500}
        height={500}
        style={{ objectFit: 'cover' }}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />

      <section aria-labelledby={`product-title-${product.id}`}>
        <div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <span aria-label={`Preço: ${price}`}>{price}</span>
        </div>
      </section>
    </article>
  ));
};
