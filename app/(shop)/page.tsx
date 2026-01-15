import HeroBanner from '@/components/shop/HeroBanner';
import CategoryCard from '@/components/shop/CategoryCard';
import ProductGrid from '@/components/shop/ProductGrid';
import { ShoppingBag, Heart, Sparkles } from 'lucide-react';

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      console.error('Categories API failed:', res.status);
      return [];
    }
    
    const data = await res.json();
    console.log('📂 Categories API response:', data);
    
    // ✅ Fix: Use data.data
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

async function getTrendingProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?sort=-views&limit=8`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      console.error('Products API failed:', res.status);
      return [];
    }
    
    const data = await res. json();
    console.log('📦 Products API response:', data);
    
    // ✅ Fix: Use data.data
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function HomePage() {
  const [categories, trendingProducts] = await Promise.all([
    getCategories(),
    getTrendingProducts(),
  ]);

  console.log('🏠 HomePage data:', {
    categoriesCount: categories.length,
    productsCount: trendingProducts. length,
  });

  // ✅ Filter root categories properly
  const rootCategories = categories.filter(
    (cat: any) => !cat.parentCategory || cat.parentCategory === null
  );

  console.log('📂 Root categories:', rootCategories. length);

  return (
    <div className="min-h-screen">
      <HeroBanner />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trendy Collection</h3>
              <p className="text-gray-600">
                Latest fashion trends curated for Gen-Z style enthusiasts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Simple checkout process with multiple payment options
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-purple-600" />
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
      {rootCategories.length > 0 ?  (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {rootCategories.slice(0, 6).map((category: any) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500">No categories available yet</p>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts. length > 0 ? (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Trending Now 🔥
            </h2>
            <ProductGrid products={trendingProducts} />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500">No products available yet</p>
            <a 
              href="/admin/login" 
              className="mt-4 inline-block text-purple-600 hover:underline"
            >
              Login as admin to add products
            </a>
          </div>
        </section>
      )}
    </div>
  );
}