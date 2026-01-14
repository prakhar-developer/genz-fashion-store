'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ICategory } from '@/types';

interface FilterSidebarProps {
  categories: ICategory[];
  brands: string[];
  colors: string[];
  sizes: string[];
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({
  categories,
  brands,
  colors,
  sizes,
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    color: true,
    size: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleArrayFilterChange = (key: 'colors' | 'sizes', value: string) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    onFilterChange({ ...filters, [key]: newArray });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-gray-900">Category</h3>
          {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.slug}
                  onChange={() => handleFilterChange('category', category.slug)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-gray-900">Brand</h3>
          {expandedSections.brand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => handleFilterChange('brand', brand)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-gray-900">Price Range</h3>
          {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Min Price</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="₹0"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="₹10000"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-gray-900">Colors</h3>
            {expandedSections.color ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.color && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleArrayFilterChange('colors', color)}
                  className={`px-3 py-1 rounded-lg text-sm border ${
                    (filters.colors || []).includes(color)
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-gray-900">Sizes</h3>
            {expandedSections.size ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.size && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleArrayFilterChange('sizes', size)}
                  className={`px-3 py-1 rounded-lg text-sm border ${
                    (filters.sizes || []).includes(size)
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
