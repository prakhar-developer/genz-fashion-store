// Type definitions for the Gen-Z Fashion E-Commerce Platform

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string;
  level: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  isActive: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  products: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
  }[];
  totalAmount: number;
  paymentScreenshot?: string;
  status: 'pending' | 'payment_verified' | 'shipped' | 'delivered';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  finalPrice: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
