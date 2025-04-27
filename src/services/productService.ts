
import { supabase } from '@/integrations/supabase/client';

export async function fetchProducts() {
  try {
    const { data, error } = await supabase.functions.invoke('sync-products');
    
    if (error) throw error;
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
