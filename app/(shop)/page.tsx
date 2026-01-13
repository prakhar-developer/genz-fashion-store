'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-pink bg-clip-text text-transparent">
                Gen-Z Fashion
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium">
                Shop
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="text-gray-700 hover:text-primary-600">
                <Heart size={20} />
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-primary-600">
                <ShoppingCart size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Fashion That Speaks{' '}
              <span className="gradient-pink bg-clip-text text-transparent">Your Language</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the latest trends in Gen-Z fashion. Express yourself with our curated
              collection of trendy clothes and accessories.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trendy Collection</h3>
              <p className="text-gray-600">
                Latest fashion trends curated for Gen-Z style enthusiasts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Simple checkout process with multiple payment options
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Smart suggestions to help you complete your perfect look
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Gen-Z Fashion Store. Built with 💖 by @prakhar-developer
          </p>
        </div>
      </footer>
    </div>
  );
}
