
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-healing-beige py-12 mt-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="font-playfair text-xl font-bold tracking-wider text-healing-dark">
                Healingg<span className="text-healing-pink">Miracles</span>
              </h2>
            </Link>
            <p className="text-sm text-healing-dark/70 max-w-xs">
              Elevating your spiritual wellness journey with premium bath salts, gemstones, and tealight holders.
            </p>
            <div className="pt-2">
              <p className="text-xs text-healing-dark/50">
                &copy; {currentYear} HealinggMiracles. All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-base font-medium mb-4 text-healing-dark">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Shop', 'About', 'Contact', 'Shipping & Returns', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Shop' ? '/shop' : '#'} 
                    className="text-sm text-healing-dark/70 hover:text-healing-dark transition-colors hover-underline inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-playfair text-base font-medium mb-4 text-healing-dark">
              Join Our Journey
            </h3>
            <p className="text-sm text-healing-dark/70 mb-4">
              Subscribe to receive updates on new products and special offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 text-sm text-healing-dark bg-white border border-healing-brown/30 focus:outline-none focus:ring-1 focus:ring-healing-pink rounded-l-md w-full"
                required
              />
              <button
                type="submit"
                className="bg-healing-brown text-white px-4 py-2 text-sm font-medium rounded-r-md hover:bg-healing-brown/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
