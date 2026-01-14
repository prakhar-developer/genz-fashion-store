'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { updateCartItemQuantity, removeFromCart } from '@/utils/storage';

interface CartItemComponentProps {
  item: CartItem;
  onUpdate: () => void;
}

export default function CartItemComponent({ item, onUpdate }: CartItemComponentProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId);
    } else {
      updateCartItemQuantity(item.productId, newQuantity);
    }
    onUpdate();
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
    onUpdate();
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {item.color && <p>Color: {item.color}</p>}
          {item.size && <p>Size: {item.size}</p>}
          <p className="font-bold text-gray-900">₹{item.finalPrice}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 p-1"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="font-bold text-gray-900">
          ₹{(item.finalPrice * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
