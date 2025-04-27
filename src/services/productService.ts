
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products from the edge function');

    const { data, error } = await supabase.functions.invoke('sync-products', {
      method: 'GET',
    });

    if (error) {
      console.error('Error from sync-products function:', error);
      throw new Error(error.message);
    }

    if (!data || !data.products) {
      console.error('No products data returned from function');
      throw new Error('No products data returned from API');
    }

    console.log(`Successfully fetched ${data.products.length} products`);
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    return products.find(product => product.id === id) || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await fetchProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await fetchProducts();
    return products.filter(product => product.featured);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}
