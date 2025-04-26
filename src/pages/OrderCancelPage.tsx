
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock order data - would come from API in real app
const mockOrders = {
  'ORD7839201': {
    id: 'ORD7839201',
    date: '2025-03-15',
    total: 87.95,
    items: [
      { id: 1, name: 'Amethyst Cluster', quantity: 1, price: 42.99 },
      { id: 2, name: 'Lavender Bath Salt', quantity: 2, price: 22.98 }
    ],
    status: 'delivered',
    trackingNumber: 'TRK5839221'
  },
  'ORD7839185': {
    id: 'ORD7839185',
    date: '2025-02-28',
    total: 65.50,
    items: [
      { id: 3, name: 'Crystal Tealight Holder', quantity: 1, price: 35.50 },
      { id: 4, name: 'Rose Quartz', quantity: 1, price: 30.00 }
    ],
    status: 'processing',
    trackingNumber: 'TRK5839205'
  },
  'ORD7839122': {
    id: 'ORD7839122',
    date: '2025-01-15',
    total: 120.75,
    items: [
      { id: 5, name: 'Selenite Wand', quantity: 1, price: 28.99 },
      { id: 6, name: 'Himalayan Salt Lamp', quantity: 1, price: 45.99 },
      { id: 7, name: 'Eucalyptus Bath Salts', quantity: 2, price: 45.77 }
    ],
    status: 'delivered',
    trackingNumber: 'TRK5839199'
  }
};

const OrderCancelPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/orders/cancel/${orderId}` } } });
      return;
    }
    
    // In a real app, this would be an API call using the order ID
    // For now, we'll use the mock data
    const fetchOrder = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (mockOrders[orderId]) {
          setOrder(mockOrders[orderId]);
          
          // Check if order can be cancelled
          if (mockOrders[orderId].status !== 'processing') {
            toast({
              title: 'Cannot cancel this order',
              description: 'This order is already being processed and cannot be cancelled.',
              variant: 'destructive'
            });
            navigate('/orders');
          }
        } else {
          // Handle case where order doesn't exist
          toast({
            title: 'Order not found',
            description: 'We couldn\'t find the order you\'re looking for.',
            variant: 'destructive'
          });
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        toast({
          title: 'Error',
          description: 'There was a problem retrieving your order. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [isAuthenticated, navigate, orderId]);
  
  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) return null;
  
  const handleCancelOrder = async () => {
    if (!reason) {
      toast({
        title: 'Please provide a reason',
        description: 'Please tell us why you\'re cancelling this order.',
        variant: 'destructive'
      });
      return;
    }
    
    setCancelling(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would make an API call to cancel the order
      setCancelled(true);
      
      // Show success message
      toast({
        title: 'Order cancelled successfully',
        description: `Your refund of $${(order.total * 0.7).toFixed(2)} (70% of order total) will be processed within 5-7 business days.`,
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: 'Error',
        description: 'There was a problem cancelling your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setCancelling(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-healing-brown"></div>
          </div>
          <p className="mt-4 text-healing-dark/70">Loading order information...</p>
        </div>
      </div>
    );
  }
  
  if (!order) return null;
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-2xl px-4">
        {cancelled ? (
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-500" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-medium text-healing-dark mb-3">Order Cancelled</h2>
            <p className="text-healing-dark/70 max-w-md mx-auto mb-2">
              Your order {order.id} has been successfully cancelled.
            </p>
            <p className="text-healing-dark/70 max-w-md mx-auto mb-6">
              A refund of ${(order.total * 0.7).toFixed(2)} (70% of order total) will be processed within 5-7 business days.
            </p>
            <Link to="/orders">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-healing-brown hover:bg-healing-dark text-white">
                  Back to My Orders
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/orders" className="text-healing-brown hover:text-healing-dark transition-colors flex items-center gap-2 mb-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Orders</span>
              </Link>
              <h1 className="font-playfair text-3xl font-medium text-healing-dark">Cancel Order</h1>
              <p className="text-healing-dark/70 mt-2">
                Order #{order.id} - Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <AlertTriangle size={20} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Cancellation Fee</h3>
                  <p className="text-sm text-amber-700">
                    Please note that a 30% cancellation fee applies to all orders. You will receive a refund of ${(order.total * 0.7).toFixed(2)} (70% of order total).
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-healing-dark mb-4">Order Summary</h3>
              <div className="border-t border-b border-healing-beige py-4 mb-4">
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-healing-dark/70 text-sm mr-2">{item.quantity}x</span>
                        <span className="text-healing-dark">{item.name}</span>
                      </div>
                      <span className="text-healing-dark font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-healing-dark font-medium">Order Total:</span>
                <span className="text-healing-dark font-medium">${order.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-healing-dark/70">Cancellation Fee (30%):</span>
                <span className="text-healing-dark">${(order.total * 0.3).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 font-medium">
                <span className="text-healing-dark">Refund Amount:</span>
                <span className="text-green-600">${(order.total * 0.7).toFixed(2)}</span>
              </div>
              
              <div className="mb-6">
                <label htmlFor="cancel-reason" className="block text-sm font-medium text-healing-dark mb-2">
                  Reason for Cancellation
                </label>
                <select
                  id="cancel-reason"
                  className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-healing-pink bg-white"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="changed-mind">Changed my mind</option>
                  <option value="found-cheaper">Found it cheaper elsewhere</option>
                  <option value="ordered-by-mistake">Ordered by mistake</option>
                  <option value="taking-too-long">Taking too long to ship</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link to="/orders">
                  <Button variant="outline" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark w-full sm:w-auto">
                    Keep Order
                  </Button>
                </Link>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? 'Processing...' : 'Confirm Cancellation'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderCancelPage;
