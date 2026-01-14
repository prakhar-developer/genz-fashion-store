'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ICategory } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import CategoryTree from '@/components/admin/CategoryTree';
import CategoryForm from '@/components/admin/CategoryForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>();
  const [parentId, setParentId] = useState<string | undefined>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (parent?: string) => {
    setSelectedCategory(undefined);
    setParentId(parent);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setParentId(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (data: any) => {
    const url = selectedCategory
      ? `/api/categories/${selectedCategory._id}`
      : '/api/categories';
    const method = selectedCategory ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to save category');
    }

    setIsModalOpen(false);
    await fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories with nested structure</p>
        </div>
        <Button onClick={() => handleAdd()}>
          <Plus size={20} className="mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="card p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No categories yet</p>
              <Button onClick={() => handleAdd()}>Create First Category</Button>
            </div>
          ) : (
            <CategoryTree
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          category={selectedCategory}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          parentId={parentId}
        />
      </Modal>
    </div>
  );
}
