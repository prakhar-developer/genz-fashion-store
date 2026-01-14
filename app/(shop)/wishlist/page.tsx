'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductGrid from '@/components/shop/ProductGrid';
import Button from '@/components/ui/Button';
import { IProduct } from '@/types';
import { getWishlist, clearWishlist } from '@/utils/storage';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch full product details for wishlist items
      const productIds = wishlist.map((item) => item.productId);
      const res = await fetch(`/api/products?ids=${productIds.join(',')}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch wishlist products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
      setProducts([]);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8">
            Save your favorite items here to keep track of them.
          </p>
          <Button onClick={() => router.push('/products')}>
            Discover Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Clear Wishlist
          </button>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
