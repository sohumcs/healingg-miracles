
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="font-playfair text-5xl font-semibold text-healing-dark mb-4">404</h1>
        <h2 className="text-xl font-medium text-healing-dark mb-2">Page Not Found</h2>
        <p className="text-healing-dark/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-healing-brown hover:bg-healing-dark text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
