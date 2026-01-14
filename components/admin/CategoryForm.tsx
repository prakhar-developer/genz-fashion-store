'use client';

import { useState, useEffect } from 'react';
import { ICategory } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CategoryFormProps {
  category?: ICategory;
  categories: ICategory[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  parentId?: string;
}

export default function CategoryForm({
  category,
  categories,
  onSubmit,
  onCancel,
  parentId,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    parentCategory: category?.parentCategory || parentId || '',
    isActive: category?.isActive ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!category && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, formData.slug, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const availableParents = categories.filter(
    (cat) => cat._id !== category?._id && cat.level < 3
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Input
        label="Category Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., T-Shirts"
      />

      <Input
        label="Slug"
        required
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        placeholder="e.g., t-shirts"
        helperText="URL-friendly version of the name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Category
        </label>
        <select
          value={formData.parentCategory}
          onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">None (Root Category)</option>
          {availableParents.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {'  '.repeat(cat.level)} {cat.name}
            </option>
          ))}
        </select>
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
          {category ? 'Update' : 'Create'} Category
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
