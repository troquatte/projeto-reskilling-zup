import { Product } from '@/shared/typings/Product';

export const getProducts = async (): Promise<Array<Product>> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const res = await fetch(`${apiUrl}/api/products`, {
      cache: 'force-cache', // SSG
    });

    if (!res.ok) throw new Error('Failed to fetch API');

    return res.json();
  } catch (err) {
    console.error('Erro ao buscar produtos da API real:', err);

    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      cache: 'no-store', // SSR
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch API');
    }

    return res.json();
  } catch (err) {
    console.error('Erro ao buscar produto por slug na API:', err);
    return null;
  }
};
