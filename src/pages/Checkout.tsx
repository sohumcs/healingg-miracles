import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard } from 'lucide-react';
import { createOrder } from '@/services/orderService';
import { initiatePayment, verifyPayment } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

type CheckoutStep = 'information' | 'shipping' | 'payment';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'United States',
    state: '',
    zip: '',
    phone: ''
  });
  
  // Check if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const goToNextStep = () => {
    if (currentStep === 'information') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('information');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== 'payment') {
      goToNextStep();
      return;
    }
    
    // Process payment
    setIsProcessing(true);
    
    try {
      // First, create the order in Supabase
      const userId = user?.id;
      if (!userId) throw new Error('User not authenticated');
      
      const order = await createOrder({
        userId,
        total: cartTotal + 5.99, // Adding shipping
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
      
      // Then initiate payment with the payment gateway
      const paymentResult = await initiatePayment(
        order.id,
        order.total,
        `Order #${order.order_number}`,
        formData.email,
        `${formData.firstName} ${formData.lastName}`
      );
      
      // Handle the payment flow based on the gateway response
      if (paymentResult.clientSecret) {
        // For Stripe - redirect to Stripe Checkout or handle Elements
        // This would be implemented using Stripe Elements in a real app
        
        // Mock successful payment for now
        const paymentVerified = await verifyPayment(
          'mock_payment_id',
          order.id
        );
        
        if (paymentVerified) {
          // Clear cart and redirect to success page
          clearCart();
          toast({
            title: "Order placed successfully!",
            description: "Your order has been confirmed and will be shipped soon.",
          });
          navigate('/');
        } else {
          throw new Error('Payment verification failed');
        }
      } else if (paymentResult.orderId) {
        // For Razorpay - redirect or open Razorpay checkout
        // This would be implemented using Razorpay checkout in a real app
        
        // Mock successful payment for now
        const paymentVerified = await verifyPayment(
          'mock_payment_id',
          order.id,
          'mock_signature'
        );
        
        if (paymentVerified) {
          // Clear cart and redirect to success page
          clearCart();
          toast({
            title: "Order placed successfully!",
            description: "Your order has been confirmed and will be shipped soon.",
          });
          navigate('/');
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        throw new Error('Unknown payment response type');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStepNumber = (step: CheckoutStep): number => {
    if (step === 'information') return 1;
    if (step === 'shipping') return 2;
    return 3;
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-healing-beige/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mt-4 mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-playfair text-2xl font-bold tracking-wider text-healing-dark">
              Healingg<span className="text-healing-pink">Miracles</span>
            </h1>
          </Link>
        </div>
        
        {/* Checkout Steps */}
        <div className="hidden sm:flex justify-center mb-8">
          <div className="flex items-center">
            {(['information', 'shipping', 'payment'] as CheckoutStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                {index > 0 && (
                  <div className={`w-16 h-0.5 ${currentStep === step || ['shipping', 'payment'].includes(currentStep) && step === 'information' || currentStep === 'payment' && step === 'shipping' ? 'bg-healing-brown' : 'bg-healing-brown/30'}`}></div>
                )}
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep === step ? 'bg-healing-brown text-white' : 
                    getStepNumber(currentStep) > getStepNumber(step) ? 'bg-healing-brown/80 text-white' : 'bg-healing-beige text-healing-dark/70'
                  }`}
                >
                  {getStepNumber(step)}
                </div>
                <span className={`ml-2 text-sm ${currentStep === step ? 'text-healing-dark font-medium' : 'text-healing-dark/70'}`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Information Step */}
              {currentStep === 'information' && (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                  <h2 className="font-playfair text-xl font-medium text-healing-dark mb-6">Contact Information</h2>
                  
                  {!isAuthenticated && (
                    <div className="mb-6">
                      <p className="text-sm text-healing-dark/70">
                        Already have an account?{' '}
                        <Link to="/login" className="text-healing-brown hover-underline">
                          Log in
                        </Link>
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-healing-dark mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                        required
                        disabled={isAuthenticated}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-healing-dark mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-healing-dark mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="font-playfair text-xl font-medium text-healing-dark mt-8 mb-6">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-healing-dark mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-healing-dark mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-healing-dark mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink bg-white"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-healing-dark mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-healing-dark mb-1">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-healing-dark mb-1">
                        Phone (for delivery questions)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Link to="/cart" className="text-healing-brown hover:text-healing-dark transition-colors hover-underline">
                      Return to cart
                    </Link>
                    <Button 
                      type="button"
                      onClick={goToNextStep}
                      className="bg-healing-brown hover:bg-healing-dark text-white"
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                  <h2 className="font-playfair text-xl font-medium text-healing-dark mb-6">Shipping Method</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-healing-brown/30 rounded-md cursor-pointer bg-healing-beige/20">
                      <input
                        type="radio"
                        name="shipping"
                        defaultChecked
                        className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink"
                      />
                      <div className="ml-3 flex-grow">
                        <span className="block text-sm font-medium text-healing-dark">Standard Shipping</span>
                        <span className="block text-sm text-healing-dark/70">3-5 business days</span>
                      </div>
                      <span className="text-healing-dark font-medium">$5.99</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-healing-brown/30 rounded-md cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink"
                      />
                      <div className="ml-3 flex-grow">
                        <span className="block text-sm font-medium text-healing-dark">Express Shipping</span>
                        <span className="block text-sm text-healing-dark/70">1-2 business days</span>
                      </div>
                      <span className="text-healing-dark font-medium">$12.99</span>
                    </label>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPreviousStep}
                      className="border-healing-brown/30 hover:bg-healing-beige text-healing-dark"
                    >
                      Back to Information
                    </Button>
                    <Button 
                      type="button"
                      onClick={goToNextStep}
                      className="bg-healing-brown hover:bg-healing-dark text-white"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                  <h2 className="font-playfair text-xl font-medium text-healing-dark mb-6">Payment</h2>
                  
                  <div className="mb-6 p-4 bg-healing-beige/30 rounded-md flex items-center">
                    <Lock size={18} className="text-healing-dark/70 mr-2" />
                    <span className="text-sm text-healing-dark/70">
                      All transactions are secure and encrypted
                    </span>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-healing-dark mb-3">Payment Method</div>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-healing-brown/30 rounded-md cursor-pointer bg-healing-beige/20">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink"
                        />
                        <div className="ml-3 flex-grow">
                          <span className="block text-sm font-medium text-healing-dark">Credit/Debit Card</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">Visa</div>
                          <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">MC</div>
                          <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">Amex</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-healing-brown/30 rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink"
                        />
                        <div className="ml-3 flex-grow">
                          <span className="block text-sm font-medium text-healing-dark">UPI Payment</span>
                        </div>
                        <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">UPI</div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Card Info Fields (only shown when card is selected) */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-healing-dark mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          placeholder="e.g. John Smith"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-healing-dark mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink pr-10"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          <CreditCard size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-healing-dark/50" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium text-healing-dark mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-healing-dark mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* UPI ID Fields (only shown when UPI is selected) */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-healing-dark mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          placeholder="name@bank"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Billing Address Checkbox */}
                  <div className="mt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink rounded"
                      />
                      <span className="ml-2 text-sm text-healing-dark">
                        Billing address same as shipping address
                      </span>
                    </label>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPreviousStep}
                      className="border-healing-brown/30 hover:bg-healing-beige text-healing-dark"
                    >
                      Back to Shipping
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-healing-brown hover:bg-healing-dark text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay $${(cartTotal + 5.99).toFixed(2)}`}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-playfair text-xl font-medium text-healing-dark mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4 pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center py-3 border-b border-healing-beige last:border-b-0">
                    <div className="relative">
                      <div className="w-16 h-16 rounded overflow-hidden bg-healing-beige/30">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-healing-beige/80 text-healing-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium text-healing-dark line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-healing-dark/70">
                        {item.category === 'bath' 
                          ? 'Bath Salt' 
                          : item.category === 'gemstone' 
                            ? 'Gemstone' 
                            : 'Tealight Holder'}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-healing-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-healing-dark/80">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-healing-dark/80">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between text-healing-dark/80">
                  <span>Taxes</span>
                  <span>Calculated at next step</span>
                </div>
              </div>
              
              <div className="border-t border-healing-beige pt-4 flex justify-between font-medium text-healing-dark">
                <span>Total</span>
                <span>${(cartTotal + 5.99).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
