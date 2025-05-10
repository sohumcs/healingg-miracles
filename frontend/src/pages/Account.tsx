
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrders } from '@/data/orders';
import { useCart } from '@/contexts/CartContext';

const Account = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
    }
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated || !user) return null;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleNotificationToggle = (type: 'orderUpdates' | 'promotions') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="font-playfair text-3xl font-medium text-healing-dark mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-healing-beige/50 flex items-center justify-center">
                  <User size={24} className="text-healing-dark/70" />
                </div>
                <div>
                  <div className="font-medium text-healing-dark">
                    {user.name}
                  </div>
                  <div className="text-sm text-healing-dark/70">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2 rounded-md text-healing-dark/70 hover:bg-healing-beige/20 hover:text-healing-dark transition-colors w-full text-left"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Main Content with Tabs */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full border-b mb-6 bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="overview"
                    className="data-[state=active]:text-healing-dark data-[state=active]:border-b-2 data-[state=active]:border-healing-brown rounded-none border-b-2 border-transparent px-6 py-2"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders"
                    className="data-[state=active]:text-healing-dark data-[state=active]:border-b-2 data-[state=active]:border-healing-brown rounded-none border-b-2 border-transparent px-6 py-2"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="wishlist"
                    className="data-[state=active]:text-healing-dark data-[state=active]:border-b-2 data-[state=active]:border-healing-brown rounded-none border-b-2 border-transparent px-6 py-2"
                  >
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings"
                    className="data-[state=active]:text-healing-dark data-[state=active]:border-b-2 data-[state=active]:border-healing-brown rounded-none border-b-2 border-transparent px-6 py-2"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-healing-dark mb-4">Account Details</h3>
                      <div className="bg-healing-beige/20 rounded-md p-4">
                        <p className="font-medium text-healing-dark">{user.name}</p>
                        <p className="text-healing-dark/70">{user.email}</p>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark hover:border-healing-brown/50">
                          Edit Account Details
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-healing-dark">Recent Orders</h3>
                        <button className="text-sm text-healing-brown hover:text-healing-dark transition-colors hover:underline">
                          View All
                        </button>
                      </div>
                      
                      <div className="bg-healing-beige/20 rounded-md p-4 text-center">
                        {mockOrders.slice(0, 2).map(order => (
                          <div key={order.id} className="mb-4 last:mb-0 text-left p-3 bg-white rounded-md shadow-sm">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-healing-dark/70">Order #{order.id}</span>
                              <span className="text-sm font-medium">₹{order.total.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-healing-dark/70">
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <div className="space-y-4">
                    {mockOrders.map(order => (
                      <div key={order.id} className="bg-healing-beige/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-medium text-healing-dark">Order #{order.id}</p>
                            <p className="text-sm text-healing-dark/70">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-healing-dark">₹{order.total.toFixed(2)}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm
                              ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'dispatched' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'}`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-healing-dark/70 text-sm mr-2">{item.quantity}x</span>
                                <span className="text-healing-dark">{item.name}</span>
                              </div>
                              <span className="text-healing-dark font-medium">₹{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Link to={`/orders/track/${order.trackingNumber}`}>
                            <Button variant="outline" size="sm" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark">
                              Track Order
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
                    ))}
                  </div>
                </TabsContent>

                {/* Wishlist Tab */}
                <TabsContent value="wishlist">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart size={48} className="mx-auto mb-4 text-healing-dark/30" />
                      <h3 className="text-lg font-medium text-healing-dark mb-2">Your wishlist is empty</h3>
                      <p className="text-healing-dark/70 mb-4">Save your favorite items for later</p>
                      <Link to="/shop">
                        <Button variant="outline" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark">
                          Browse Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                          <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                          <h4 className="font-medium text-healing-dark mb-2">{item.name}</h4>
                          <p className="text-healing-dark/70 mb-4">₹{item.price.toFixed(2)}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="w-full bg-healing-brown hover:bg-healing-dark text-white">
                              Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleWishlist(item)}
                              className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-healing-dark mb-4">Password Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-healing-dark mb-1">
                            Current Password
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-healing-dark mb-1">
                            New Password
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-healing-dark mb-1">
                            Confirm New Password
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                          />
                        </div>
                        <Button className="bg-healing-brown hover:bg-healing-dark text-white">
                          Update Password
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-healing-dark mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-healing-dark">Order Updates</span>
                          <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={() => handleNotificationToggle('orderUpdates')}
                            className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-healing-dark">Promotional Emails</span>
                          <input
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={() => handleNotificationToggle('promotions')}
                            className="h-4 w-4 text-healing-brown border-healing-brown/30 focus:ring-healing-pink rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
