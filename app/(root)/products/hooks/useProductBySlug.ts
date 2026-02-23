import { Product } from '@/shared/typings/Product';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '../service/products';

export const useProductBySlug = (slug: string) => {
  return useQuery<Product | null>({
    queryKey: ['product-detail', slug],
    queryFn: () => getProductBySlug(slug),
  });
};
