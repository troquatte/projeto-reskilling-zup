import { Product } from '@/shared/typings/Product';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../service/products';

export const useProducts = () => {
  return useQuery<Array<Product>>({
    queryKey: ['products-list'],
    queryFn: getProducts,
  });
};
