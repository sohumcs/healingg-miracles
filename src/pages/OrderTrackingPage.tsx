
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, CheckCircle } from 'lucide-react';

// Mock tracking data - would come from API in real app
const mockTrackingData = {
  'TRK5839221': {
    orderId: 'ORD7839201',
    status: 'delivered',
    timeline: [
      { status: 'processing', date: '2025-03-15T10:30:00', message: 'Order confirmed and processing' },
      { status: 'dispatched', date: '2025-03-16T14:15:00', message: 'Package dispatched from warehouse' },
      { status: 'out for delivery', date: '2025-03-18T08:45:00', message: 'Out for delivery with courier' },
      { status: 'delivered', date: '2025-03-18T15:22:00', message: 'Package delivered' }
    ],
    estimatedDelivery: '2025-03-18',
    carrier: 'GHI Express',
    items: [
      { name: 'Amethyst Cluster', quantity: 1 },
      { name: 'Lavender Bath Salt', quantity: 2 }
    ]
  },
  'TRK5839205': {
    orderId: 'ORD7839185',
    status: 'processing',
    timeline: [
      { status: 'processing', date: '2025-02-28T16:20:00', message: 'Order confirmed and processing' }
    ],
    estimatedDelivery: '2025-03-03',
    carrier: 'GHI Express',
    items: [
      { name: 'Crystal Tealight Holder', quantity: 1 },
      { name: 'Rose Quartz', quantity: 1 }
    ]
  },
  'TRK5839199': {
    orderId: 'ORD7839122',
    status: 'delivered',
    timeline: [
      { status: 'processing', date: '2025-01-15T09:10:00', message: 'Order confirmed and processing' },
      { status: 'dispatched', date: '2025-01-16T11:30:00', message: 'Package dispatched from warehouse' },
      { status: 'out for delivery', date: '2025-01-18T08:15:00', message: 'Out for delivery with courier' },
      { status: 'delivered', date: '2025-01-18T14:45:00', message: 'Package delivered' }
    ],
    estimatedDelivery: '2025-01-19',
    carrier: 'GHI Express',
    items: [
      { name: 'Selenite Wand', quantity: 1 },
      { name: 'Himalayan Salt Lamp', quantity: 1 },
      { name: 'Eucalyptus Bath Salts', quantity: 2 }
    ]
  }
};

const OrderTrackingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { trackingNumber } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/orders/track/${trackingNumber}` } } });
      return;
    }
    
    // In a real app, this would be an API call using the tracking number
    // For now, we'll use the mock data
    const fetchTrackingData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (mockTrackingData[trackingNumber]) {
          setTrackingData(mockTrackingData[trackingNumber]);
        } else {
          // Handle case where tracking number doesn't exist
          console.error('Tracking number not found');
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrackingData();
  }, [isAuthenticated, navigate, trackingNumber]);
  
  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-healing-brown"></div>
          </div>
          <p className="mt-4 text-healing-dark/70">Loading tracking information...</p>
        </div>
      </div>
    );
  }
  
  if (!trackingData) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center">
                <Package size={32} className="text-red-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-healing-dark mb-3">Tracking information not found</h2>
            <p className="text-healing-dark/70 max-w-md mx-auto mb-6">
              We couldn't find any information for tracking number {trackingNumber}. Please check the tracking number and try again.
            </p>
            <Link to="/orders">
              <Button className="bg-healing-brown hover:bg-healing-dark text-white">
                Back to My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock size={24} className="text-blue-500" />;
      case 'dispatched':
        return <Package size={24} className="text-amber-500" />;
      case 'out for delivery':
        return <Truck size={24} className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle size={24} className="text-green-500" />;
      default:
        return <Clock size={24} className="text-blue-500" />;
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
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
          <h1 className="font-playfair text-3xl font-medium text-healing-dark">Track Your Order</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
            <span className="text-healing-dark/70">Tracking Number:</span>
            <span className="font-medium text-healing-dark">{trackingNumber}</span>
            {trackingData.carrier && (
              <span className="text-healing-dark/70 md:ml-4">Carrier: {trackingData.carrier}</span>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium text-healing-dark">Shipment Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium 
              ${trackingData.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                trackingData.status === 'dispatched' ? 'bg-amber-100 text-amber-800' :
                trackingData.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'}`}
            >
              {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
            </div>
          </div>
          
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-healing-beige -ml-px"></div>
            
            {trackingData.timeline.map((event, index) => (
              <motion.div 
                key={index}
                className="flex gap-6 mb-8 last:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <div className="relative z-10">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center
                    ${event.status === 'processing' ? 'bg-blue-100' : 
                      event.status === 'dispatched' ? 'bg-amber-100' :
                      event.status === 'out for delivery' ? 'bg-purple-100' :
                      'bg-green-100'}`}
                  >
                    {getStatusIcon(event.status)}
                  </div>
                </div>
                <div className="flex-grow pt-1">
                  <h4 className="font-medium text-healing-dark capitalize">{event.message}</h4>
                  <p className="text-sm text-healing-dark/70">
                    {new Date(event.date).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-healing-dark mb-4">Order Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-healing-dark/70">Order ID</span>
                <span className="text-healing-dark">{trackingData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-healing-dark/70">Estimated Delivery</span>
                <span className="text-healing-dark">
                  {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-healing-dark/70">Carrier</span>
                <span className="text-healing-dark">{trackingData.carrier}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-healing-dark mb-4">Items in Shipment</h3>
            <div className="space-y-3">
              {trackingData.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-healing-dark">{item.name}</span>
                  <span className="text-healing-dark/70">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
