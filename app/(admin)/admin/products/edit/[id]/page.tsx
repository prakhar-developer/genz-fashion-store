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
    fetchData();
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

      setCategories(catData.categories || []);
      setProduct(prodData.product || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/products/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update product');
    }

    router.push('/admin/products');
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product details</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !product ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => router.push('/admin/products')}>Back to Products</Button>
        </div>
      ) : (
        <div className="card p-6">
          <ProductForm
            product={product}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </div>
      )}
    </div>
  );
}
