'use client';

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
}

export default function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  if (colors.length === 0) return null;

  const colorMap: { [key: string]: string } = {
    Black: 'bg-black',
    White: 'bg-white border-gray-300',
    Red: 'bg-red-500',
    Blue: 'bg-blue-500',
    Green: 'bg-green-500',
    Yellow: 'bg-yellow-400',
    Pink: 'bg-pink-500',
    Purple: 'bg-purple-500',
    Gray: 'bg-gray-500',
    Brown: 'bg-amber-700',
    Navy: 'bg-blue-900',
    Beige: 'bg-amber-100',
    Orange: 'bg-orange-500',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Color <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color ? 'border-primary-600 scale-110' : 'border-gray-300'
            }`}
            title={color}
          >
            <span className={`absolute inset-1 rounded-full ${colorMap[color] || 'bg-gray-300'}`} />
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</p>
      )}
    </div>
  );
}
