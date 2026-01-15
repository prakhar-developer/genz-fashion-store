// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft } from 'lucide-react';
// import { ICategory } from '@/types';
// import Button from '@/components/ui/Button';
// import ProductForm from '@/components/admin/ProductForm';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';

// export default function AddProductPage() {
//   const router = useRouter();
//   const [categories, setCategories] = useState<ICategory[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/categories');
//       const data = await res.json();
//       setCategories(data.categories || []);
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (data: any) => {
//     const res = await fetch('/api/products', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.error || 'Failed to create product');
//     }

//     router.push('/admin/products');
//   };

//   return (
//     <div>
//       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
//         <ArrowLeft size={20} className="mr-2" />
//         Back
//       </Button>

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
//         <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center py-20">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : (
//         <div className="card p-6">
//           <ProductForm
//             categories={categories}
//             onSubmit={handleSubmit}
//             onCancel={() => router.back()}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ICategory } from '@/types';
import ProductForm from '@/components/admin/ProductForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res. json();
      
      console.log('📂 Categories API:', data);
      
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      alert('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.status === 201 && data.success) {
      alert('✅ Product created successfully!');
      router.push('/admin/products');
    } else {
      throw new Error(data.message || 'Failed to create product');
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-600 mt-1">Create a new product</p>
      </div>

      <div className="card p-6 max-w-4xl">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}