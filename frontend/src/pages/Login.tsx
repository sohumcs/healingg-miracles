
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // For demo, you can use 'user@example.com' / 'password'
      const success = await login(email, password);
      
      if (success) {
        navigate(from);
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-healing-beige/30">
      <div className="container mx-auto max-w-md px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="font-playfair text-2xl font-bold tracking-wider text-healing-dark">
                Healingg<span className="text-healing-pink">Miracles</span>
              </h1>
            </Link>
            <h2 className="font-playfair text-2xl font-semibold text-healing-dark mt-4">Sign In</h2>
            <p className="text-healing-dark/70 mt-2">Welcome back to your healing journey</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-healing-dark mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                placeholder="your@email.com"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-healing-dark">
                  Password
                </label>
                <Link to="/reset-password" className="text-xs text-healing-brown hover:text-healing-dark transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                  placeholder="********"
                  disabled={isSubmitting || isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-healing-dark/50 hover:text-healing-dark"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-healing-brown hover:bg-healing-dark text-white py-6"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center text-sm text-healing-dark/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-healing-brown hover:text-healing-dark transition-colors hover-underline">
                Sign Up
              </Link>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-healing-beige"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-healing-dark/70">Demo Account</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-healing-dark/70">
              <p>Email: user@example.com</p>
              <p>Password: password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
