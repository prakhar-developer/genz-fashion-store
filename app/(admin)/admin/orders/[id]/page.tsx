'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, MapPin, CreditCard, Package } from 'lucide-react';
import { IOrder } from '@/types';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      
      console.log('📦 Full order data:', data);
      
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        console.error('❌ Order not found');
        setOrder(null);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: IOrder['status']) => {
    if (! order) return;
    
    if (! confirm(`Change order status to "${status}"?`)) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('✅ Order status updated! ');
        await fetchOrder();
      } else {
        throw new Error(data.message || 'Failed to update');
      }
    } catch (error:  any) {
      console.error('Status update error:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: IOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'payment_verified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
        <p className="text-xl text-gray-600 mb-6">Order not found</p>
        <Button onClick={() => router.push('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => router.push('/admin/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </button>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order. orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order. createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month:  'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`text-sm font-semibold px-4 py-2 rounded-full border-2 ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Products */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={24} className="text-purple-600" />
              Products ({order.products?. length || 0})
            </h2>
            <div className="space-y-4">
              {order.products?.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                    <div className="text-sm text-gray-600">
                      {item.color && <span className="mr-2">Color: <strong>{item.color}</strong></span>}
                      {item. size && <span>Size: <strong>{item.size}</strong></span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price. toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per item</p>
                    <p className="text-sm font-semibold text-purple-600 mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No products</p>}
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
            
            {/* Customer */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-purple-600" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Name</p>
                  <p className="font-medium text-gray-900">{order. customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                    <Phone size={12} /> Phone
                  </p>
                  <a 
                    href={`tel:${order.phone}`}
                    className="font-medium text-purple-600 hover:underline"
                  >
                    {order.phone}
                  </a>
                </div>
                {order.email && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="font-medium text-gray-900">{order.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address - ✅ Safe Access */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Delivery Address
              </h3>
              {order.address ? (
                <div className="text-gray-700 space-y-1">
                  <p>{order.address.street}</p>
                  <p>{order. address.city}, {order.address.state}</p>
                  <p className="font-semibold">PIN: {order.address.pincode}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Address not available</p>
              )}
            </div>
          </div>

          {/* Payment Screenshot */}
          {order.paymentScreenshot && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Screenshot</h3>
              <img
                src={order.paymentScreenshot}
                alt="Payment proof"
                className="max-w-md rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-3">Order Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order. notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Summary */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Included</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{order. totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-purple-600" />
              Payment
            </h3>
            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
              order.paymentMethod === 'cod' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
            </div>
          </div>

          {/* Status Actions */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-2">
              {order.status === 'pending' && (
                <Button
                  onClick={() => handleStatusChange('payment_verified')}
                  disabled={isUpdating}
                  className="w-full"
                >
                  ✅ Mark Payment Verified
                </Button>
              )}
              {(order.status === 'pending' || order.status === 'payment_verified') && (
                <Button
                  onClick={() => handleStatusChange('shipped')}
                  disabled={isUpdating}
                  className="w-full"
                >
                  📦 Mark as Shipped
                </Button>
              )}
              {order. status === 'shipped' && (
                <Button
                  onClick={() => handleStatusChange('delivered')}
                  disabled={isUpdating}
                  className="w-full"
                >
                  🎉 Mark as Delivered
                </Button>
              )}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isUpdating}
                  variant="secondary"
                  className="w-full"
                >
                  ❌ Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}