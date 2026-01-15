'use client';

import Link from 'next/link';
import { IProduct } from '@/types';
import { AlertCircle } from 'lucide-react';

export interface InventoryTableProps {
  products: IProduct[];
  onUpdate: () => Promise<void>; // <-- Add this line
}

export default function InventoryTable({ products, onUpdate }: InventoryTableProps) {
  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);
  };

  const getStockStatus = (stock: number): string => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const lowStockProducts = getLowStockProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-900 mb-1">Low Stock Alert</h3>
            <p className="text-sm text-red-700">
              {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} with low stock levels
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const stockColor =
                stockStatus === 'Out of Stock'
                  ? 'text-red-600'
                  : stockStatus === 'Low Stock'
                  ? 'text-yellow-600'
                  : 'text-green-600';

              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {typeof product.category === 'object' && product.category && 'name' in product.category
                      ? (product.category as any).name
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">₹{product.finalPrice}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold ${stockColor}`}>{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${stockColor}`}>
                      {stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Update Stock
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
