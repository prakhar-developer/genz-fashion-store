import HeroBanner from '@/components/shop/HeroBanner';
import CategoryCard from '@/components/shop/CategoryCard';
import ProductGrid from '@/components/shop/ProductGrid';
import { ShoppingBag, Heart, Sparkles } from 'lucide-react';

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    return [];
  }
}

async function getTrendingProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?sort=-views&limit=8`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const [categories, trendingProducts] = await Promise.all([
    getCategories(),
    getTrendingProducts(),
  ]);

  const rootCategories = categories.filter((cat: any) => !cat.parentCategory);

  return (
    <div className="min-h-screen">
      <HeroBanner />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trendy Collection</h3>
              <p className="text-gray-600">
                Latest fashion trends curated for Gen-Z style enthusiasts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Simple checkout process with multiple payment options
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Smart suggestions to help you complete your perfect look
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {rootCategories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {rootCategories.slice(0, 6).map((category: any) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center">Trending Now</h2>
            <ProductGrid products={trendingProducts} />
          </div>
        </section>
      )}
    </div>
  );
}
