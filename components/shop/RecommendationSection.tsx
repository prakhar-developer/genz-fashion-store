import { IProduct } from '@/types';
import ProductGrid from './ProductGrid';

interface RecommendationSectionProps {
  title: string;
  products: IProduct[];
}

export default function RecommendationSection({ title, products }: RecommendationSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
