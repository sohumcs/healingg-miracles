
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  featured: boolean;
}

// Mock products data for fallback
const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Crystal Healing Bath Salt",
    price: 24.99,
    description: "Infused with natural minerals and essential oils to create a rejuvenating bath experience.",
    category: "bath",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000",
    rating: 4.8,
    featured: true
  },
  {
    id: "p2",
    name: "Amethyst Crystal",
    price: 34.99,
    description: "Natural amethyst crystal known for its calming and healing properties.",
    category: "gemstone",
    image: "https://images.unsplash.com/photo-1598751337485-0417629f25b0?q=80&w=1000",
    rating: 4.9,
    featured: true
  },
  {
    id: "p3",
    name: "Himalayan Salt Tealight Holder",
    price: 19.99,
    description: "Hand-carved Himalayan salt tealight holder that emits a warm, soothing glow.",
    category: "tealight",
    image: "https://images.unsplash.com/photo-1606672080636-f8affeec8a6e?q=80&w=1000",
    rating: 4.7,
    featured: false
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    // First try to fetch from Supabase edge function
    const { data, error } = await supabase.functions.invoke('sync-products', {
      method: 'GET'
    });

    if (error) {
      console.error('Error from Supabase function:', error);
      throw new Error(`Error fetching products: ${error.message}`);
    }

    if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
    
    // If no products returned, try direct API call to Google Sheets
    // This serves as a fallback mechanism
    console.warn('No products returned from edge function, attempting direct fetch');
    return await fetchProductsDirectly();
  } catch (error) {
    console.error('Error in primary fetch method:', error);
    
    // As a last resort, return mock products for development
    console.warn('Using mock products as fallback');
    return mockProducts;
  }
}

// This is a fallback direct implementation if the edge function fails
async function fetchProductsDirectly(): Promise<Product[]> {
  try {
    // Note: This should be replaced with proper environment variables in production
    // For now, we'll use mock products if direct fetching fails
    throw new Error('Direct fetching not implemented');
  } catch (error) {
    console.error('Error directly fetching products:', error);
    throw error;
  }
}
