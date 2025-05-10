import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        const relatedResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/products?category=${data.category ?? ''}`
        );
        const relatedData = await relatedResponse.json();
        setRelatedProducts(
          relatedData.filter((p: any) => p.id !== data.id).slice(0, 3)
        );

        setIsLoading(false);
      } catch (error) {
        navigate('/shop');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-healing-pink/20 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-healing-pink/20 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-healing-pink/20 rounded"></div>
              <div className="h-4 bg-healing-pink/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Parse JSON strings for benefits and ingredients
  const productBenefits = product.benefits ? JSON.parse(product.benefits) : [];
  const productIngredients = product.ingredients ? JSON.parse(product.ingredients) : [];

  const formatCategory = (category?: string | null) => {
    if (!category) return 'Uncategorized';
    switch (category.toLowerCase()) {
      case 'bath':
        return 'Bath Salt';
      case 'gemstone':
        return 'Gemstone';
      case 'tealight':
        return 'Tealight Holder';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Breadcrumbs */}
        <nav className="py-4">
          <ol className="flex text-sm">
            <li>
              <Link to="/" className="text-healing-dark/60 hover:text-healing-dark">Home</Link>
            </li>
            <li className="mx-2 text-healing-dark/60">/</li>
            <li>
              <Link to="/shop" className="text-healing-dark/60 hover:text-healing-dark">Shop</Link>
            </li>
            <li className="mx-2 text-healing-dark/60">/</li>
            <li className="text-healing-dark font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 animate-fade-in">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg shadow-md bg-white">
            <img 
              src={
                product.image_url
                  ? `${import.meta.env.VITE_API_BASE_URL}${product.image_url}`
                  : '/placeholder-product.jpg'
              }
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-1">
                <span className="text-sm uppercase tracking-wider text-healing-dark/70">
                  {formatCategory(product.category)}
                </span>
              </div>
              <h1 className="font-playfair text-3xl font-medium text-healing-dark mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-healing-brown' : 'text-healing-brown/30'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-healing-dark/70">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <p className="text-2xl font-medium text-healing-dark mb-4">
              ₹{product.price.toFixed(2)}
              </p>
              <p className="text-healing-dark/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Features */}
            <div className="border-t border-b border-healing-beige py-6">
              <h3 className="font-playfair font-medium text-lg text-healing-dark mb-4">Benefits</h3>
              <ul className="grid grid-cols-2 gap-2">
                {productBenefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center text-healing-dark/80">
                    <svg className="w-5 h-5 text-healing-pink mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Additional Product Details */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {productIngredients.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-healing-dark mb-1">Ingredients</h4>
                    <p className="text-sm text-healing-dark/70">
                      {productIngredients.join(', ')}
                    </p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <h4 className="text-sm font-medium text-healing-dark mb-1">Size</h4>
                    <p className="text-sm text-healing-dark/70">{product.size}</p>
                  </div>
                )}
                {product.color && (
                  <div>
                    <h4 className="text-sm font-medium text-healing-dark mb-1">Color</h4>
                    <p className="text-sm text-healing-dark/70">{product.color}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-healing-dark mb-1">Availability</h4>
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-healing-brown/30 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 text-healing-dark hover:bg-healing-beige/50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-healing-dark">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 text-healing-dark hover:bg-healing-beige/50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-grow bg-healing-brown hover:bg-healing-dark text-white py-6"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-playfair text-2xl font-semibold text-healing-dark mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
