'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { IProduct, ICategory } from '@/types';
import { Search } from 'lucide-react';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters({ category: categoryFromUrl });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.colors?.length) queryParams.append('colors', filters.colors.join(','));
      if (filters.sizes?.length) queryParams.append('sizes', filters.sizes.join(','));
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      
      // Extract unique brands, colors, sizes
      const allProducts = data.products || [];
      const uniqueBrands = [...new Set(allProducts.map((p: IProduct) => p.brand))];
      const uniqueColors = [...new Set(allProducts.flatMap((p: IProduct) => p.colors))];
      const uniqueSizes = [...new Set(allProducts.flatMap((p: IProduct) => p.sizes))];
      
      setBrands(uniqueBrands as string[]);
      setColors(uniqueColors as string[]);
      setSizes(uniqueSizes as string[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop All Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              brands={brands}
              colors={colors}
              sizes={sizes}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </div>
                <ProductGrid products={products} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="lg" /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
