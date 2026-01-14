'use client';

import { useState, useEffect } from 'react';
import { IProduct, ICategory } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: IProduct;
  categories: ICategory[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category: product?.category || '',
    brand: product?.brand || '',
    price: product?.price || 0,
    discount: product?.discount || 0,
    images: product?.images || [],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!product && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, formData.slug, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  const handleArrayInput = (field: 'colors' | 'sizes', value: string) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Classic Cotton T-Shirt"
        />

        <Input
          label="Slug"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., classic-cotton-tshirt"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Detailed product description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {'  '.repeat(cat.level)} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Brand"
          required
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., Nike, Adidas"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          placeholder="0.00"
        />

        <Input
          label="Discount (%)"
          type="number"
          min="0"
          max="100"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
          placeholder="0"
        />

        <Input
          label="Stock"
          type="number"
          required
          min="0"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <ImageUpload images={formData.images} onChange={handleImagesChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Colors"
          value={formData.colors.join(', ')}
          onChange={(e) => handleArrayInput('colors', e.target.value)}
          placeholder="e.g., Red, Blue, Black"
          helperText="Comma-separated values"
        />

        <Input
          label="Sizes"
          value={formData.sizes.join(', ')}
          onChange={(e) => handleArrayInput('sizes', e.target.value)}
          placeholder="e.g., S, M, L, XL"
          helperText="Comma-separated values"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-primary-600 rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {product ? 'Update' : 'Create'} Product
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
