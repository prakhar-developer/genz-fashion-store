import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
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
          <Link
            href="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
