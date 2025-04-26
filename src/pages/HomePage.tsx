
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`space-y-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-healing-dark">
                Elevate Your <span className="text-healing-pink">Spiritual</span> Wellness Journey
              </h1>
              <p className="text-lg text-healing-dark/80 max-w-lg">
                Curated bath salts, healing gemstones, and artisan tealight holders for your mind, body, and spirit.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link to="/shop">
                  <Button className="bg-healing-brown hover:bg-healing-dark text-white px-8 py-6">
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/shop" className="inline-flex items-center text-healing-dark hover:text-healing-pink transition-colors hover-underline">
                  <span>Explore Products</span>
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Healing crystals and bath products"
                className="rounded-lg shadow-lg w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-healing-dark/20 to-transparent rounded-lg"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white font-playfair">
                <span className="text-sm uppercase tracking-widest">Featured Collection</span>
                <h3 className="text-xl font-medium">Crystal Healing Rituals</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-healing-beige/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl font-semibold text-healing-dark mb-4">
              Discover Our Collections
            </h2>
            <p className="text-healing-dark/70">
              Each product is thoughtfully sourced and curated to enhance your spiritual journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bath Salts",
                description: "Mineral-rich blends for relaxation and renewal",
                image: "https://images.unsplash.com/photo-1614806687902-ag416800791a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmF0aCUyMHNhbHR8ZW58MHx8MHx8fDA%3D",
                link: "/shop?category=bath"
              },
              {
                title: "Healing Crystals",
                description: "Powerful gemstones for energy and balance",
                image: "https://images.unsplash.com/photo-1596554847864-e4e334678bd1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                link: "/shop?category=gemstone"
              },
              {
                title: "Tealight Holders",
                description: "Beautiful pieces for ambient illumination",
                image: "https://images.unsplash.com/photo-1631567473314-e0b5702f422f?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                link: "/shop?category=tealight"
              }
            ].map((category, index) => (
              <Link 
                to={category.link} 
                key={index}
                className={`group hover-lift transition-all duration-700 delay-${index * 200 + 100} 
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-playfair text-xl font-medium text-healing-dark mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-healing-dark/70 mb-4">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-healing-brown hover-underline">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <h2 className="font-playfair text-3xl font-semibold text-healing-dark">
              Featured Products
            </h2>
            <Link 
              to="/shop" 
              className="text-healing-brown hover:text-healing-dark transition-colors hover-underline"
            >
              View All Products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className={`transition-all duration-700 delay-${index * 100} 
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <ProductCard product={product} featured />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-healing-beige/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 delay-100 
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1520473378652-85d9c4aee6cf?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Our story"
                  className="rounded-lg shadow-md w-full h-auto" 
                />
                <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-healing-pink rounded-full hidden md:block"></div>
              </div>
            </div>
            <div className={`space-y-6 transition-all duration-700 delay-300 
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <h2 className="font-playfair text-3xl font-semibold text-healing-dark">
                Our Healing Journey
              </h2>
              <p className="text-healing-dark/80 leading-relaxed">
                HealinggMiracles began as a personal quest for holistic wellness. After discovering the transformative 
                effects of natural elements, we dedicated ourselves to sharing these healing gifts with others.
              </p>
              <p className="text-healing-dark/80 leading-relaxed">
                Each product is thoughtfully crafted to provide a sanctuary of calm and renewal in our often chaotic world. 
                From mineral-rich bath salts to energy-balancing gemstones and ambiance-setting tealight holders, our collection 
                is designed to nurture your mind, body, and spirit.
              </p>
              <div className="pt-2">
                <Link to="/shop">
                  <Button variant="outline" className="border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark hover:border-healing-brown/50">
                    Explore Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="font-playfair text-3xl font-semibold text-healing-dark mb-4">
            Join Our Community
          </h2>
          <p className="text-healing-dark/70 mb-8">
            Subscribe to receive updates on new products, special offers, and healing rituals.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border border-healing-brown/30 focus:outline-none focus:ring-2 focus:ring-healing-pink"
              required
            />
            <Button className="bg-healing-brown hover:bg-healing-dark text-white shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
