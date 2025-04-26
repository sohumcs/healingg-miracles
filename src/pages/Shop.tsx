
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('category'));
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  
  // Filter products by category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    setActiveCategory(categoryParam);
    
    setIsLoading(true);
    setTimeout(() => {
      // Filter products by category if specified
      if (categoryParam) {
        setFilteredProducts(products.filter(product => product.category === categoryParam));
      } else {
        setFilteredProducts(products);
      }
      setIsLoading(false);
    }, 300); // Short delay for smooth transition
  }, [searchParams]);
  
  // Handle sorting
  useEffect(() => {
    setIsLoading(true);
    
    let sorted = [...filteredProducts];
    
    switch (sortOption) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default featured/relevance sort
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setTimeout(() => {
      setFilteredProducts(sorted);
      setIsLoading(false);
    }, 300);
  }, [sortOption]);
  
  // Handle category filter click
  const handleCategoryFilter = (categoryId: string | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Page Header */}
        <div className="py-8 text-center">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-3 text-healing-dark">Shop Our Collection</h1>
          <p className="text-healing-dark/70 max-w-xl mx-auto">
            Discover our carefully curated selection of bath salts, gemstones, and tealight holders to enhance your wellness journey.
          </p>
        </div>
        
        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
            <Button
              variant={!activeCategory ? "default" : "outline"}
              className={!activeCategory 
                ? "bg-healing-pink text-healing-dark hover:bg-healing-pink/90" 
                : "border-healing-brown/30 hover:bg-healing-beige"}
              onClick={() => handleCategoryFilter(null)}
            >
              All
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={activeCategory === category.id 
                  ? "bg-healing-pink text-healing-dark hover:bg-healing-pink/90" 
                  : "border-healing-brown/30 hover:bg-healing-beige"}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Sort */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label htmlFor="sort" className="text-sm text-healing-dark/80">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border border-healing-brown/30 rounded-md py-2 px-3 bg-white text-healing-dark text-sm focus:outline-none focus:ring-1 focus:ring-healing-pink"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="min-h-[400px]">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredProducts.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-healing-pink/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-lg font-medium text-healing-dark mb-1">No products found</h3>
              <p className="text-healing-dark/70 mb-4 text-center max-w-sm">
                We couldn't find any products matching your current filters.
              </p>
              <Button variant="outline" onClick={() => handleCategoryFilter(null)}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
