'use client';

import { useState } from 'react';
import { ICategory } from '@/types';
import { ChevronRight, ChevronDown, Edit, Trash2, Plus } from 'lucide-react';

interface CategoryTreeProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (categoryId: string) => void;
  onAdd: (parentId?: string) => void;
}

export default function CategoryTree({ categories, onEdit, onDelete, onAdd }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  console.log('🌲 CategoryTree received categories:', categories);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // ✅ FIXED: Handle null/undefined properly
  const buildTree = (parentId?: string | null, level:  number = 0): ICategory[] => {
    return categories
      .filter((cat) => {
        const catParent = cat. parentCategory;
        
        // Root level
        if (parentId === undefined || parentId === null) {
          return catParent === null || catParent === undefined || catParent === '';
        }
        
        // Child level
        return catParent === parentId;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const renderCategory = (category: ICategory, level: number = 0) => {
    const children = buildTree(category._id, level + 1);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <div key={category._id} className="mb-1">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 group ${
            level > 0 ? 'ml-6' : ''
          }`}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(category._id)} className="p-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="text-xs text-gray-500">({category.slug})</span>
              {! category.isActive && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Level:  {category.level}</p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onAdd(category._id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="Add subcategory"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => onEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-6">
            {children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootCategories = buildTree(null, 0);
  
  console.log('🌳 Root categories found:', rootCategories. length);

  // ✅ Add fallback if no categories
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No categories available
      </div>
    );
  }

  if (rootCategories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-2">No root categories found</p>
        <p className="text-sm">All categories have parent assigned</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rootCategories.map((category) => renderCategory(category, 0))}
    </div>
  );
}