'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ICategory, IProduct } from '@/types';
import Button from '@/components/ui/Button';
import ProductForm from '@/components/admin/ProductForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch(`/api/products/${params.id}`),
      ]);

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      console.log('📂 Categories response:', catData);
      console.log('📦 Product response:', prodData);

      // ✅ FIX: Use data. data
      setCategories(catData. success && catData.data ?  catData.data : []);
      setProduct(prodData.success && prodData.data ? prodData.data : null);

      if (! prodData.success || !prodData.data) {
        console.error('❌ Product not found');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setCategories([]);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert('✅ Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error:  any) {
      console.error('Update error:', error);
      throw error; // Re-throw for form to handle
    }
  };

  const handleCancel = () => {
    if (confirm('Discard changes?')) {
      router.push('/admin/products');
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => router.push('/admin/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">
          Update product details for <span className="font-semibold">{product.name}</span>
        </p>
      </div>

      <div className="card p-6 max-w-4xl">
        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}