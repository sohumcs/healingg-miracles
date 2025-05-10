
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setIsUpdating(true);
    setTimeout(() => {
      updateQuantity(productId, newQuantity);
      setIsUpdating(false);
    }, 300); // Short delay for visual feedback
  };
  
  const handleRemoveItem = (productId: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      removeFromCart(productId);
      setIsUpdating(false);
    }, 300);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="font-playfair text-3xl font-medium text-healing-dark mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-healing-pink" />
            </div>
            <h2 className="text-xl font-medium text-healing-dark mb-2">Your cart is empty</h2>
            <p className="text-healing-dark/70 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/shop">
              <Button className="bg-healing-brown hover:bg-healing-dark text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-6 gap-4 p-4 bg-healing-beige/30 text-sm font-medium text-healing-dark">
                  <div className="col-span-3">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>
                
                <div className={`divide-y divide-healing-beige transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                  {cart.map(item => (
                    <div key={item.id} className="p-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center">
                      {/* Product */}
                      <div className="flex items-center col-span-3 mb-4 sm:mb-0">
                        <div className="w-20 h-20 rounded overflow-hidden bg-healing-beige/30 mr-4 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <Link 
                            to={`/product/${item.id}`} 
                            className="font-medium text-healing-dark hover:text-healing-brown transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-healing-dark/70 mt-1">
                            {item.category === 'bath' 
                              ? 'Bath Salt' 
                              : item.category === 'gemstone' 
                                ? 'Gemstone' 
                                : 'Tealight Holder'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="sm:text-center mb-2 sm:mb-0">
                        <span className="sm:hidden text-sm text-healing-dark/70">Price: </span>
                        <span className="text-healing-dark">₹{item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="sm:text-center mb-4 sm:mb-0">
                        <div className="flex items-center sm:justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="text-healing-dark/70 hover:text-healing-dark disabled:text-healing-dark/30 p-1"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-2 text-healing-dark w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="text-healing-dark/70 hover:text-healing-dark p-1"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="flex items-center justify-between sm:justify-end">
                        <span className="sm:hidden text-sm text-healing-dark/70">Total: </span>
                        <div className="flex items-center">
                          <span className="text-healing-dark font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-4 text-healing-dark/50 hover:text-healing-dark transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Continue Shopping */}
              <div className="text-center sm:text-left">
                <Link 
                  to="/shop" 
                  className="text-healing-brown hover:text-healing-dark transition-colors hover-underline inline-flex items-center"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-playfair text-xl font-medium text-healing-dark mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-healing-dark/80">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-healing-dark/80">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-healing-beige my-3 pt-3 flex justify-between font-medium text-healing-dark">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-healing-brown hover:bg-healing-dark text-white py-6"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center text-sm text-healing-dark/60">
                  Taxes calculated at checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
