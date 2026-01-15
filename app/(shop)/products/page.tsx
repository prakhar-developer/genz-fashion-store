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
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      
      console.log('📂 Categories API:', data);
      
      // ✅ Fix: Use data.data
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters. category);
      if (filters. brand) queryParams.append('brand', filters.brand);
      if (filters.minPrice) queryParams.append('minPrice', filters. minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters. maxPrice.toString());
      if (filters.colors?.length) queryParams.append('colors', filters. colors.join(','));
      if (filters.sizes?.length) queryParams.append('sizes', filters. sizes.join(','));
      if (searchQuery) queryParams.append('search', searchQuery);
      
      queryParams.append('isActive', 'true'); // Only show active products

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      
      console.log('📦 Products API:', data);
      
      // ✅ Fix: Use data.data
      const allProducts = data.success && data.data ? data.data : [];
      setProducts(allProducts);
      
      // Extract unique brands, colors, sizes
      const uniqueBrands = [...new Set(allProducts.map((p: IProduct) => p.brand))].filter(Boolean);
      const uniqueColors = [...new Set(allProducts.flatMap((p: IProduct) => p.colors || []))].filter(Boolean);
      const uniqueSizes = [...new Set(allProducts.flatMap((p: IProduct) => p.sizes || []))].filter(Boolean);
      
      setBrands(uniqueBrands as string[]);
      setColors(uniqueColors as string[]);
      setSizes(uniqueSizes as string[]);
      
      console.log('🔍 Filter options:', {
        brands: uniqueBrands. length,
        colors: uniqueColors. length,
        sizes: uniqueSizes.length,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop All Products
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target. value)}
                placeholder="Search for products..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              />
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                size={20} 
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FilterSidebar
                categories={categories}
                brands={brands}
                colors={colors}
                sizes={sizes}
                filters={filters}
                onFilterChange={setFilters}
              />
              
              {/* Clear Filters Button */}
              {(Object.keys(filters).length > 0 || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {isLoading ?  (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'No products found matching your filters'
                    : 'No products available yet'}
                </p>
                {(searchQuery || Object.keys(filters).length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                  </div>
                  
                  {/* Sort Dropdown (Future Enhancement) */}
                  {/* <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Sort by:  Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select> */}
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
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}