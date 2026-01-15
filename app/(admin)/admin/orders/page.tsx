'use client';

import { useState, useEffect } from 'react';
import { IOrder } from '@/types';
import OrderTable from '@/components/admin/OrderTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      
      console.log('📦 Orders API response:', data);
      
      // ✅ FIX: Use data.data instead of data. orders
      if (data. success && data.data) {
        setOrders(data.data);
        console.log(`✅ Loaded ${data.data.length} orders`);
      } else {
        console.error('❌ Invalid API response:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: IOrder['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('✅ Order status updated successfully!');
        await fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (error: any) {
      console.error('Status update error:', error);
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage customer orders and track status
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <p className="text-sm text-gray-500">
            Orders will appear here once customers place them
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Total orders: <span className="font-semibold">{orders.length}</span>
            </p>
          </div>
          <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        </div>
      )}
    </div>
  );
}