
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-healing-white">
      <ScrollToTop />
      <Navbar />
      <main className={`flex-grow transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
