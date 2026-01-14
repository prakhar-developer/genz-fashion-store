'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductImageSlider from '@/components/shop/ProductImageSlider';
import SizeSelector from '@/components/shop/SizeSelector';
import ColorSelector from '@/components/shop/ColorSelector';
import RecommendationSection from '@/components/shop/RecommendationSection';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { IProduct } from '@/types';
import { ShoppingCart, Heart } from 'lucide-react';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist } from '@/utils/storage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [recommendations, setRecommendations] = useState<{
    similar: IProduct[];
    combo: IProduct[];
  }>({ similar: [], combo: [] });
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (product) {
      setInWishlist(isInWishlist(product._id));
    }
  }, [product]);

  const fetchProduct = async (slug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?slug=${slug}`);
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        const prod = data.products[0];
        setProduct(prod);
        
        // Fetch recommendations
        const recRes = await fetch(`/api/products/recommendations/${prod._id}`);
        const recData = await recRes.json();
        setRecommendations({
          similar: recData.similarProducts || [],
          combo: recData.completeTheLook || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      finalPrice: product.finalPrice,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      image: product.images[0],
    });

    router.push('/cart');
  };

  const toggleWishlist = () => {
    if (!product) return;
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/products')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <ProductImageSlider images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.finalPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <ColorSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelect={setSelectedColor}
                />
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={toggleWishlist}
                variant="secondary"
                className="px-6"
              >
                <Heart
                  size={20}
                  className={inWishlist ? 'fill-red-500 text-red-500' : ''}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.similar.length > 0 && (
          <RecommendationSection
            title="Similar Products You Might Like"
            products={recommendations.similar}
          />
        )}

        {recommendations.combo.length > 0 && (
          <RecommendationSection
            title="Complete The Look"
            products={recommendations.combo}
          />
        )}
      </div>
    </div>
  );
}
