import { IProduct } from '@/types';

// Similar products algorithm based on scoring
export function getSimilarProducts(
  currentProduct: IProduct,
  allProducts: IProduct[],
  limit: number = 6
): IProduct[] {
  const scores = allProducts
    .filter((p) => p._id !== currentProduct._id && p.isActive && p.stock > 0)
    .map((product) => {
      let score = 0;
      
      // Category match (highest priority)
      if (product.category === currentProduct.category) {
        score += 3;
      }
      
      // Brand match
      if (product.brand === currentProduct.brand) {
        score += 2;
      }
      
      // Color match (check if any color overlaps)
      const colorMatch = product.colors.some((color) =>
        currentProduct.colors.includes(color)
      );
      if (colorMatch) {
        score += 1;
      }
      
      // Price range match (within 30% price difference)
      const priceDiff = Math.abs(product.finalPrice - currentProduct.finalPrice);
      const priceRange = currentProduct.finalPrice * 0.3;
      if (priceDiff <= priceRange) {
        score += 1;
      }
      
      return { product, score };
    })
    .filter((item) => item.score >= 3) // Minimum threshold
    .sort((a, b) => {
      // Sort by score first, then by views (popularity)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.product.views - a.product.views;
    })
    .slice(0, limit)
    .map((item) => item.product);

  return scores;
}

// Complete the look algorithm (complementary products)
export function getCompleteTheLook(
  currentProduct: IProduct,
  allProducts: IProduct[],
  categoryMap: Record<string, string>,
  limit: number = 4
): IProduct[] {
  // Define complementary category mappings
  const complementaryCategories: Record<string, string[]> = {
    'T-Shirt': ['Jeans', 'Shorts', 'Skirts'],
    'Shirt': ['Jeans', 'Trousers', 'Skirts'],
    'Kurti': ['Leggings', 'Palazzo', 'Jeans'],
    'Dress': ['Heels', 'Sandals', 'Bags'],
    'Jeans': ['T-Shirt', 'Shirt', 'Tops'],
    'Trousers': ['Shirt', 'Tops', 'Blazer'],
    'Skirt': ['T-Shirt', 'Tops', 'Blouse'],
    'Leggings': ['Kurti', 'Tops', 'Tunic'],
  };

  const currentCategoryName = categoryMap[currentProduct.category.toString()] || '';
  const complementary = complementaryCategories[currentCategoryName] || [];

  if (complementary.length === 0) {
    return [];
  }

  // Find products from complementary categories
  const complementaryProducts = allProducts
    .filter((p) => {
      if (p._id === currentProduct._id || !p.isActive || p.stock <= 0) {
        return false;
      }
      const productCategoryName = categoryMap[p.category.toString()] || '';
      return complementary.includes(productCategoryName);
    })
    .sort((a, b) => {
      // Prioritize same brand
      const aSameBrand = a.brand === currentProduct.brand ? 1 : 0;
      const bSameBrand = b.brand === currentProduct.brand ? 1 : 0;
      
      if (aSameBrand !== bSameBrand) {
        return bSameBrand - aSameBrand;
      }
      
      // Then sort by views
      return b.views - a.views;
    })
    .slice(0, limit);

  return complementaryProducts;
}

// Get trending products (based on views)
export function getTrendingProducts(
  products: IProduct[],
  limit: number = 8
): IProduct[] {
  return products
    .filter((p) => p.isActive && p.stock > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Get discounted products
export function getDiscountedProducts(
  products: IProduct[],
  limit: number = 8
): IProduct[] {
  return products
    .filter((p) => p.isActive && p.stock > 0 && p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}
