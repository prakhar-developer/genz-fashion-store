'use client';

import Link from 'next/link';
import { IProduct } from '@/types';
import { ShoppingCart, Heart } from 'lucide-react';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist } from '@/utils/storage';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(product._id));
  }, [product._id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // ✅ Prevent link navigation
    e.stopPropagation();

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      finalPrice: product.finalPrice,
      quantity: 1,
      image:  product.images[0] || '/placeholder.jpg',
    });

    alert('✅ Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // ✅ Prevent link navigation
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        finalPrice: product.finalPrice,
        image: product.images[0] || '/placeholder.jpg',
      });
    }
    setInWishlist(!inWishlist);
  };

  // ✅ FIX: Use slug for URL, fallback to ID
  const productUrl = `/products/${product.slug || product._id}`;

  return (
    <Link href={productUrl} className="group">
      <div className="card overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {product. discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <Heart
              size={16}
              className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Quick Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 left-2 right-2 bg-purple-600 text-white py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity hover: bg-purple-700 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product. finalPrice. toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            {product.stock > 0 ?  (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}