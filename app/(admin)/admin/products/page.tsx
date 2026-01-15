'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { IProduct } from '@/types';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductsListingPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      
      console.log('📦 Products API response:', data);
      
      // ✅ FIX: Use data.data instead of data.products
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        console.log(`✅ Loaded ${data.data.length} products`);
      } else {
        console.error('❌ Invalid API response:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      alert('Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('✅ Product deleted successfully! ');
        await fetchProducts();
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error:  any) {
      console.error('❌ Delete error:', error);
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/add">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">No products yet</p>
          <Link href="/admin/products/add">
            <Button>Add First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product. images[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof product.category === 'object' && product.category && 'name' in product.category
                        ? (product.category as any).name
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900">₹{product.finalPrice. toLocaleString()}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="ml-1 text-xs text-green-600 font-medium">
                            ({product.discount}% off)
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`font-medium ${
                          product.stock > 10 
                            ? 'text-green-600' 
                            :  product.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {product.stock === 0 
                          ? 'Out of stock' 
                          : product. stock <= 10 
                          ? 'Low stock' 
                          : 'In stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isActive ?  'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/edit/${product._id}`}>
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product count */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total products: <span className="font-medium">{products.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}