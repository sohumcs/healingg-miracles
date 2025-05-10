
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate content loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-healing-white">
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-grow"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
