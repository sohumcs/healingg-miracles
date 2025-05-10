import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import herosection from '../media/herosection.jpeg';
import bathSaltImg from '../media/bathsalt.jpeg';
import gemstoneImg from '../media/gemstone.jpeg';
import tealightImg from '../media/candle.jpeg';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string | null;
  image_url?: string | null;
  rating: number;
  featured: boolean;
  stock?: number;
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        const data = await response.json();
        const featured = data.filter((product: Product) => product.featured).slice(0, 3);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const floatingElements = [
    { id: 1, image: "https://images.unsplash.com/photo-1596554847864-e4e334678bd1", x: [-10, 10], y: [-15, 5], duration: 8 },
    { id: 2, image: "https://images.unsplash.com/photo-1631567473314-e0b5702f422f", x: [15, -5], y: [10, -10], duration: 9 },
    { id: 3, image: "https://images.unsplash.com/photo-1614806687902-ag416800791a", x: [-15, 15], y: [-5, 15], duration: 7 },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1612852549516-5a7536de5713?q=80&w=2070)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity,
            scale,
          }}
        />
        {floatingElements.map(element => (
          <motion.div 
            key={element.id}
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5 }}
          >
            <img src={herosection} alt="Healing element" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="container mx-auto px-4 z-20">
          <motion.div 
            className="max-w-xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.h1 
              className="font-playfair text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 text-white drop-shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Elevate Your <span className="text-pink-400">Spiritual</span> Wellness Journey
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/90 max-w-lg mx-auto mb-8 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Curated bath salts, healing gemstones, and artisan tealight holders for your mind, body, and spirit.
            </motion.p>
            <motion.div 
              className="pt-4 flex flex-col sm:flex-row sm:items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link to="/shop">
                <Button className="bg-healing-brown hover:bg-healing-dark hover:scale-105 transition-all duration-300 text-white px-8 py-6">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/shop" className="inline-flex items-center text-white hover:text-healing-pink transition-colors hover-underline group">
                <span>Explore Products</span>
                <motion.svg 
                  className="ml-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div 
            className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-16 bg-healing-beige/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport= {{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-playfair text-3xl font-semibold text-healing-dark mb-4">
              Discover Our Collections
            </h2>
            <p className="text-healing-dark/70">
              Each product is thoughtfully sourced and curated to enhance your spiritual journey.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bath Salts",
                description: "Mineral-rich blends for relaxation and renewal",
                image: bathSaltImg,
                link: "/shop?category=bath"
              },
              {
                title: "Healing Crystals",
                description: "Powerful gemstones for energy and balance",
                image: gemstoneImg,
                link: "/shop?category=gemstone"
              },
              {
                title: "Tealight Holders",
                description: "Beautiful pieces for ambient illumination",
                image: tealightImg,
                link: "/shop?category=tealight"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                <Link to={category.link} className="group block">
                  <motion.div 
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-64 overflow-hidden">
                      <motion.img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover" 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-playfair text-xl font-medium text-healing-dark mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-healing-dark/70 mb-4">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-healing-brown group-hover:text-healing-dark relative">
                        <span>Shop Now</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-healing-brown group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="flex flex-wrap items-center justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-playfair text-3xl font-semibold text-healing-dark">
              Featured Products
            </h2>
            <Link 
              to="/shop" 
              className="text-healing-brown hover:text-healing-dark transition-colors relative overflow-hidden group"
            >
              <span>View All Products</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-healing-brown group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-healing-brown"></span>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                >
                  <ProductCard product={product} featured />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-healing-dark/70 py-8">
              No featured products available right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
