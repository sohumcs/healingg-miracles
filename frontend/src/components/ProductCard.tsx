import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

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

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addToCart } = useCart();

  const getCategoryDisplayName = (category: string | null | undefined): string => {
    if (!category || typeof category !== 'string') return 'Uncategorized';

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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category || 'Uncategorized',
      image: product.image_url || '/placeholder-product.jpg',
    });
  };

  return (
    <div
      className={`product-card bg-white rounded-md overflow-hidden ${
        featured ? 'shadow-sm' : 'border border-healing-beige/60'
      }`}
    >
      <div className="product-image-container aspect-square overflow-hidden bg-healing-beige/20">
        <img
          src={product.image_url ? `${import.meta.env.VITE_API_BASE_URL}${product.image_url}` : '/placeholder-product.jpg'}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center">
          <span className="text-xs uppercase tracking-wider text-healing-dark/70">
            {getCategoryDisplayName(product.category)}
          </span>
          <div className="ml-auto flex items-center">
            <span className="text-sm font-medium text-healing-dark mr-1">
              {product.rating}
            </span>
            <svg className="w-4 h-4 text-healing-dark/70" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
        </div>

        <h3 className="font-playfair font-medium text-lg text-healing-dark">
          <Link to={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <p className="text-sm text-healing-dark/70 line-clamp-2">
          {product.description}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="font-medium text-healing-dark">
          ₹{product.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          className="w-full border-healing-brown/30 hover:bg-healing-beige hover:text-healing-dark hover:border-healing-brown/50 transition-colors"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
