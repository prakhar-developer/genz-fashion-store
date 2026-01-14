import { CartItem } from '@/types';

// Cart management
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.color === item.color &&
      i.size === item.size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const updateCartItem = (
  productId: string,
  color: string | undefined,
  size: string | undefined,
  quantity: number
): void => {
  const cart = getCart();
  const index = cart.findIndex(
    (i) => i.productId === productId && i.color === color && i.size === size
  );

  if (index > -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const index = cart.findIndex((i) => i.productId === productId);

  if (index > -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const filtered = cart.filter((i) => i.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(filtered));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const clearCart = (): void => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartUpdated'));
};

// Wishlist management
interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  finalPrice: number;
  image: string;
}

export const getWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const addToWishlist = (item: WishlistItem): void => {
  const wishlist = getWishlist();
  if (!wishlist.find((i) => i.productId === item.productId)) {
    wishlist.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  }
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter((item) => item.productId !== productId);
  localStorage.setItem('wishlist', JSON.stringify(filtered));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.productId === productId);
};

export const clearWishlist = (): void => {
  localStorage.removeItem('wishlist');
  window.dispatchEvent(new Event('wishlistUpdated'));
};
