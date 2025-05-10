
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Check password strength (simple validation)
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error('Registration error:', err);
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
            <h2 className="font-playfair text-2xl font-semibold text-healing-dark mt-4">Create Account</h2>
            <p className="text-healing-dark/70 mt-2">Join us on your healing journey</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-healing-dark mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                placeholder="John Smith"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium text-healing-dark mb-1">
                Password
              </label>
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
              <p className="mt-1 text-xs text-healing-dark/70">Must be at least 6 characters</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-healing-dark mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-healing-brown/30 rounded-md focus:outline-none focus:ring-1 focus:ring-healing-pink"
                placeholder="********"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-healing-brown hover:bg-healing-dark text-white py-6"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="text-center text-sm text-healing-dark/70">
              Already have an account?{' '}
              <Link to="/login" className="text-healing-brown hover:text-healing-dark transition-colors hover-underline">
                Sign In
              </Link>
            </div>
          </form>
          
          <div className="mt-6 text-center text-xs text-healing-dark/70">
            By creating an account, you agree to our{' '}
            <Link to="#" className="text-healing-brown hover:text-healing-dark transition-colors hover-underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-healing-brown hover:text-healing-dark transition-colors hover-underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
