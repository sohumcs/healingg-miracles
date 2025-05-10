import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/media/healing-logo.png'; // ✅ Import the logo image

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Shop', path: '/shop' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm ${
        isScrolled ? 'shadow-md py-3' : 'py-5'
      }`}
    >
      <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
        {/* Logo with text */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Healing Miracles Logo"
            className="h-8 w-8 object-contain rounded-full"
          />
          <h1 className="font-playfair text-2xl font-bold tracking-wider text-healing-dark">
            Healingg<span className="text-pink-400">Miracles</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover-underline text-sm font-medium tracking-wide ${
                location.pathname === item.path
                  ? 'text-healing-dark font-semibold'
                  : 'text-healing-dark/70 hover:text-healing-dark'
              }`}
            >
              {item.text}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="text-healing-dark/70 hover:text-healing-dark transition-colors"
            aria-label={isAuthenticated ? "Account" : "Login"}
          >
            <User size={20} />
          </Link>

          <Link
            to="/cart"
            className="text-healing-dark/70 hover:text-healing-dark transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-healing-pink text-healing-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Link
            to="/cart"
            className="text-healing-dark/70 hover:text-healing-dark transition-colors relative mr-2"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-healing-pink text-healing-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-healing-dark p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm animate-fade-in">
          <div className="container px-4 py-4 mx-auto">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 text-center text-healing-dark/80 hover:text-healing-dark hover:bg-healing-beige/50 rounded-md transition-colors ${
                    location.pathname === item.path &&
                    'font-medium text-healing-dark bg-healing-beige/30'
                  }`}
                >
                  {item.text}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="py-2 px-4 text-center text-healing-dark/80 hover:text-healing-dark hover:bg-healing-beige/50 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <User size={18} />
                <span>{isAuthenticated ? "My Account" : "Login"}</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
