'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getCart, clearCart, getCartTotal } from '@/utils/storage';
import { CartItem } from '@/types';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address:  '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
    paymentScreenshot: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cart = getCart();
    if (cart. length === 0) {
      router.push('/cart');
    }
    setCartItems(cart);
  }, [router]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ Validate form
      if (!formData.name. trim()) {
        alert('Please enter your name');
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone.trim() || formData.phone.length < 10) {
        alert('Please enter valid phone number');
        setIsSubmitting(false);
        return;
      }

      if (!formData.address.trim()) {
        alert('Please enter your address');
        setIsSubmitting(false);
        return;
      }

      if (!formData.city.trim()) {
        alert('Please enter your city');
        setIsSubmitting(false);
        return;
      }

      if (!formData.state.trim()) {
        alert('Please enter your state');
        setIsSubmitting(false);
        return;
      }

      if (!formData.pincode.trim() || formData.pincode. length !== 6) {
        alert('Please enter valid 6-digit pincode');
        setIsSubmitting(false);
        return;
      }

      // ✅ Prepare order data
      const orderData = {
        customerName: formData.name. trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        address: {
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData. state.trim(),
          pincode: formData.pincode.trim(),
        },
        products:  cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.finalPrice,
          quantity: item. quantity,
          color: item. color,
          size: item. size,
          image: item. image,
        })),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        paymentScreenshot: formData.paymentScreenshot || '',
        notes: formData.notes.trim() || '',
      };

      console.log('📤 Submitting order:', orderData);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      console.log('📥 Order response:', data);

      if (res.status === 201 && data.success) {
        alert(`✅ Order placed successfully!\n\nOrder Number: ${data.data.orderNumber}\n\nWe'll contact you soon! `);
        clearCart();
        router.push(`/orders/success?orderNumber=${data.data.orderNumber}`);
      } else {
        alert(`❌ ${data.message || 'Failed to place order'}`);
      }
    } catch (error:  any) {
      console.error('Order submission error:', error);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData. name}
                    onChange={(e) => setFormData({ ...formData, name: e. target.value })}
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <Input
                  label="Email (Optional)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ... formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="mt-4"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-purple-600 focus:border-transparent"
                    placeholder="House/Flat No., Building Name, Street, Area"
                  />
                </div>

                <div className="grid grid-cols-1 md: grid-cols-3 gap-4 mt-4">
                  <Input
                    label="City"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />

                  <Input
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />

                  <Input
                    label="Pincode"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Online Payment</p>
                      <p className="text-sm text-gray-600">UPI / Bank Transfer</p>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'online' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      Pay to:  <strong>8707274031@paytm</strong>
                    </p>
                    <Input
                      label="Payment Screenshot URL (Optional)"
                      value={formData.paymentScreenshot}
                      onChange={(e) => setFormData({ ...formData, paymentScreenshot: e.target.value })}
                      placeholder="Upload screenshot and paste URL"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Any special instructions..."
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item. name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.color && `${item.color} `}
                        {item.size && `• ${item.size}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{item.finalPrice} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal. toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}