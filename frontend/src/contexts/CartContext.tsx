import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string | null; // ✅ made optional to prevent .toLowerCase crash
};

interface CartContextType {
  cart: CartItem[];
  wishlist: Omit<CartItem, 'quantity'>[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Omit<CartItem, 'quantity'>) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('healingMiraclesCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState<Omit<CartItem, 'quantity'>[]>(() => {
    const savedWishlist = localStorage.getItem('healingMiraclesWishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('healingMiraclesCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('healingMiraclesWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;

        toast({
          title: "Updated Cart",
          description: `${product.name} quantity updated in your cart.`,
          duration: 2000,
        });

        return updatedCart;
      } else {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
          duration: 2000,
        });

        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);

      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
        duration: 2000,
      });

      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    });
  };

  const toggleWishlist = (product: Omit<CartItem, 'quantity'>) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.some(item => item.id === product.id);

      if (exists) {
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
          duration: 2000,
        });

        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
          duration: 2000,
        });

        return [...prevWishlist, product];
      }
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
