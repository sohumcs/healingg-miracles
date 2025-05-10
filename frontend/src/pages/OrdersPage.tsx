
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock order data - would come from API in real app
const mockOrders = [
  {
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
  {
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
  {
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
];

const OrdersPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    
    // In a real app, this would be an API call using the user's ID
    // For now, we'll use the mock data
    setOrders(mockOrders);
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated || !user) return null;
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.h1 
          className="font-playfair text-3xl font-medium text-healing-dark mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Orders
        </motion.h1>
        
        {orders.length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-healing-beige/50 rounded-full flex items-center justify-center">
                <Package size={32} className="text-healing-dark/70" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-healing-dark mb-3">No orders yet</h2>
            <p className="text-healing-dark/70 max-w-md mx-auto mb-6">
              You haven't placed any orders yet. Start exploring our products to find something perfect for your spiritual journey.
            </p>
            <Link to="/shop">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-healing-brown hover:bg-healing-dark text-white">
                  Browse Products
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <span className="text-sm text-healing-dark/60">Order #</span>
                    <h3 className="text-lg font-medium text-healing-dark">{order.id}</h3>
                    <p className="text-sm text-healing-dark/70">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'dispatched' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    
                    <Link to={`/orders/track/${order.trackingNumber}`}>
                      <Button variant="outline" size="sm" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark flex items-center gap-2">
                        Track
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="border-t border-b border-healing-beige py-4 mb-4">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-healing-dark/70 text-sm mr-2">{item.quantity}x</span>
                          <span className="text-healing-dark">{item.name}</span>
                        </div>
                        <span className="text-healing-dark font-medium">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-healing-dark">
                    <span className="font-medium">Total:</span> ₹{order.total.toFixed(2)}
                  </div>
                  
                  <div className="flex gap-3">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark">
                        View Details
                      </Button>
                    </Link>
                    
                    {order.status === 'processing' && (
                      <Link to={`/orders/cancel/${order.id}`}>
                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                          Cancel Order
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
