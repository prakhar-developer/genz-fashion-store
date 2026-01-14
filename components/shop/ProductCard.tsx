'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { IProduct } from '@/types';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/utils/storage';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(product._id));
  }, [product._id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        finalPrice: product.finalPrice,
        image: product.images[0],
      });
    }
    setInWishlist(!inWishlist);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card overflow-hidden group cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {product.discount}% OFF
            </div>
          )}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Heart
              size={20}
              className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.finalPrice}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>
          {product.stock <= 0 && (
            <p className="text-sm text-red-600 mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
