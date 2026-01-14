import Link from 'next/link';
import { ICategory } from '@/types';

interface CategoryCardProps {
  category: ICategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="card p-6 hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👕</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center">{category.name}</h3>
      </div>
    </Link>
  );
}
