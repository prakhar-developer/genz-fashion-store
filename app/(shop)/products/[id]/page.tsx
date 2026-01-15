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
      
      // Auto-select first color and size if only one option
      if (product.colors. length === 1) setSelectedColor(product.colors[0]);
      if (product.sizes.length === 1) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const fetchProduct = async (slugOrId: string) => {
    setIsLoading(true);
    try {
      // Try fetching by slug first
      let res = await fetch(`/api/products?slug=${slugOrId}`);
      let data = await res.json();
      
      console.log('📦 Product API response:', data);
      
      // ✅ Fix: Use data.data
      let products = data.success && data.data ? data.data : [];
      
      // If not found by slug, try by ID
      if (products.length === 0) {
        res = await fetch(`/api/products/${slugOrId}`);
        data = await res. json();
        
        if (data.success && data.data) {
          products = [data.data];
        }
      }
      
      if (products.length > 0) {
        const prod = products[0];
        setProduct(prod);
        
        console.log('✅ Product loaded:', prod. name);
        
        // Fetch recommendations
        try {
          const recRes = await fetch(`/api/products/recommendations/${prod._id}`);
          const recData = await recRes. json();
          
          console.log('🎯 Recommendations:', recData);
          
          // ✅ Fix: Handle recommendations response
          setRecommendations({
            similar: recData.success && recData.data?. similar ?  recData.data.similar : [],
            combo: recData.success && recData.data?.combo ?  recData.data.combo : [],
          });
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      } else {
        console.error('❌ Product not found');
        setProduct(null);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setProduct(null);
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
    
    if (product.sizes.length > 0 && ! selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      finalPrice: product.finalPrice,
      quantity: 1,
      color:  selectedColor,
      size: selectedSize,
      image: product. images[0] || '/placeholder-product.jpg',
    });

    alert('✅ Added to cart!');
    // Optionally redirect to cart
    // router.push('/cart');
  };

  const toggleWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product._id);
      alert('❤️ Removed from wishlist');
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        finalPrice: product.finalPrice,
        image: product.images[0] || '/placeholder-product.jpg',
      });
      alert('❤️ Added to wishlist! ');
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
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/products')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/')} className="hover:text-purple-600">
            Home
          </button>
          {' > '}
          <button onClick={() => router.push('/products')} className="hover:text-purple-600">
            Products
          </button>
          {' > '}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <ProductImageSlider images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.finalPrice. toLocaleString()}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Color Selector */}
            {product. colors.length > 0 && (
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
                <p className="text-green-600 font-medium">
                  ✅ In Stock ({product. stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  ❌ Out of Stock
                </p>
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
                {product.stock > 0 ?  'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                onClick={toggleWishlist}
                variant="secondary"
                className="px-6"
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={20}
                  className={inWishlist ? 'fill-red-500 text-red-500' : ''}
                />
              </Button>
            </div>

            {/* Product Details */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium">Brand: </span> {product.brand}</li>
                {product.colors.length > 0 && (
                  <li><span className="font-medium">Available Colors:</span> {product.colors.join(', ')}</li>
                )}
                {product. sizes.length > 0 && (
                  <li><span className="font-medium">Available Sizes:</span> {product.sizes.join(', ')}</li>
                )}
                <li><span className="font-medium">SKU:</span> {product._id. slice(-8).toUpperCase()}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.similar.length > 0 && (
          <div className="mb-12">
            <RecommendationSection
              title="Similar Products You Might Like"
              products={recommendations.similar}
            />
          </div>
        )}

        {recommendations.combo.length > 0 && (
          <div className="mb-12">
            <RecommendationSection
              title="Complete The Look"
              products={recommendations. combo}
            />
          </div>
        )}
      </div>
    </div>
  );
}