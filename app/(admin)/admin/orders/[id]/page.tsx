'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { IOrder } from '@/types';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      setOrder(data.order || null);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: IOrder['status']) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrder();
    } catch (error: any) {
      alert(error.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Button onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(new Date(order.createdAt))}
            </p>
          </div>
          <span className={`text-sm font-medium px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="text-sm text-gray-600">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.color && item.size && <span> • </span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{item.price}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Screenshot */}
          {order.paymentScreenshot && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Screenshot</h2>
              <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={order.paymentScreenshot}
                  alt="Payment screenshot"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total</h2>
            <div className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</div>
          </div>

          {/* Status Update */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-2">
              <Button
                onClick={() => handleStatusChange('payment_verified')}
                disabled={isUpdating}
                variant={order.status === 'payment_verified' ? 'primary' : 'secondary'}
                className="w-full"
                size="sm"
              >
                Payment Verified
              </Button>
              <Button
                onClick={() => handleStatusChange('shipped')}
                disabled={isUpdating}
                variant={order.status === 'shipped' ? 'primary' : 'secondary'}
                className="w-full"
                size="sm"
              >
                Shipped
              </Button>
              <Button
                onClick={() => handleStatusChange('delivered')}
                disabled={isUpdating}
                variant={order.status === 'delivered' ? 'primary' : 'secondary'}
                className="w-full"
                size="sm"
              >
                Delivered
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
