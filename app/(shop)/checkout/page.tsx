'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CartItem } from '@/types';
import { getCart, clearCart } from '@/utils/storage';
import { Upload, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    notes: '',
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      router.push('/cart');
    }
    setCartItems(cart);
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!/^\d{10,15}$/.test(formData.phone)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotUrl = '';
      
      // Upload payment screenshot if provided
      if (paymentScreenshot) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', paymentScreenshot);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          screenshotUrl = uploadData.url;
        }
      }

      // Create order
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        products: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.finalPrice,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        totalAmount: total,
        paymentScreenshot: screenshotUrl,
        notes: formData.notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await res.json();
      setOrderNumber(data.order.orderNumber);
      setOrderSuccess(true);
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your order number is:
            </p>
            <p className="text-2xl font-bold text-primary-600 mb-8">{orderNumber}</p>
            <p className="text-sm text-gray-600 mb-8">
              We'll verify your payment and start processing your order soon. You'll receive a
              confirmation once payment is verified.
            </p>
            <Button onClick={() => router.push('/')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Phone Number"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    helperText="We'll use this to contact you about your order"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Any special instructions?"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">Pay via UPI</h3>
                  <div className="bg-white rounded-lg p-4 text-center mb-4">
                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-gray-500">QR Code Placeholder</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Scan this QR code with any UPI app to pay
                    </p>
                    <p className="text-xs text-gray-500">
                      UPI ID: merchant@upi (Replace with actual UPI ID)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Screenshot (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    {paymentScreenshot ? (
                      <div>
                        <p className="text-sm text-gray-900 font-medium mb-2">
                          {paymentScreenshot.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => setPaymentScreenshot(null)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <label className="cursor-pointer">
                          <span className="text-primary-600 font-medium">Upload a file</span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setPaymentScreenshot(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Place Order
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{(item.finalPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
