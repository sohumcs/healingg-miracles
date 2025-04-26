
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';

const Account = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
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
              
              <nav className="space-y-1">
                <Link
                  to="/account"
                  className="flex items-center space-x-3 px-4 py-2 rounded-md bg-healing-beige/30 text-healing-dark"
                >
                  <User size={18} />
                  <span>Account Overview</span>
                </Link>
                
                <Link
                  to="/account/orders"
                  className="flex items-center space-x-3 px-4 py-2 rounded-md text-healing-dark/70 hover:bg-healing-beige/20 hover:text-healing-dark transition-colors"
                >
                  <Package size={18} />
                  <span>Orders</span>
                </Link>
                
                <Link
                  to="/account/wishlist"
                  className="flex items-center space-x-3 px-4 py-2 rounded-md text-healing-dark/70 hover:bg-healing-beige/20 hover:text-healing-dark transition-colors"
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </Link>
                
                <Link
                  to="/account/settings"
                  className="flex items-center space-x-3 px-4 py-2 rounded-md text-healing-dark/70 hover:bg-healing-beige/20 hover:text-healing-dark transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 rounded-md text-healing-dark/70 hover:bg-healing-beige/20 hover:text-healing-dark transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
              <h2 className="font-playfair text-2xl font-medium text-healing-dark mb-6">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Details */}
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
                
                {/* Recent Orders */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-healing-dark">Recent Orders</h3>
                    <Link to="/account/orders" className="text-sm text-healing-brown hover:text-healing-dark transition-colors hover-underline">
                      View All
                    </Link>
                  </div>
                  
                  <div className="bg-healing-beige/20 rounded-md p-4 text-center">
                    <p className="text-healing-dark/70">No orders yet</p>
                  </div>
                </div>
              </div>
              
              {/* Saved Addresses */}
              <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-healing-dark">Saved Addresses</h3>
                  <Button variant="outline" size="sm" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark hover:border-healing-brown/50">
                    Add Address
                  </Button>
                </div>
                
                <div className="bg-healing-beige/20 rounded-md p-6 text-center">
                  <p className="text-healing-dark/70">No addresses saved yet</p>
                  <p className="mt-2 text-sm text-healing-dark/70">
                    Save your shipping and billing addresses for faster checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
