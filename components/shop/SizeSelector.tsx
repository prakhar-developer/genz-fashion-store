'use client';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Size <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-4 py-2 rounded-lg border font-medium transition-all ${
              selectedSize === size
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
