// Category
export interface ICategory {
  _id: string;
  name:  string;
  slug: string;
  parentCategory?: string | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string | ICategory;
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
  createdAt: string;
  updatedAt: string;
}

// Cart Item
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  finalPrice: number;
  quantity: number;
  color?: string;
  size?:  string;
  image: string;
}

// Wishlist Item
export interface WishlistItem {
  productId: string;
  name:  string;
  price: number;
  finalPrice: number;
  image: string;
  addedAt: string;
}

// Order Product
export interface OrderProduct {
  productId: string;
  name:  string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?:  string;
}

// Order
export interface IOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  email?:  string;
  phone:  string;
  address: {
    street: string;
    city: string;
    state:  string;
    pincode: string;
  };
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  paymentScreenshot?: string;
  status: 'pending' | 'payment_verified' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}