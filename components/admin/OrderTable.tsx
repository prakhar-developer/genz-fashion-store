'use client';

import Link from 'next/link';
import { IOrder } from '@/types';
import { formatDate } from '@/lib/utils';

interface OrderTableProps {
  orders: IOrder[];
  onStatusChange?: (orderId: string, status: IOrder['status']) => void;
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const getStatusColor = (status: IOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_verified':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Products
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-gray-900">{order.orderNumber}</span>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-900">
                  {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {onStatusChange ? (
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value as IOrder['status'])}
                    className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="payment_verified">Payment Verified</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                ) : (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(new Date(order.createdAt))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
