
import { supabase } from '@/integrations/supabase/client';

export async function fetchProducts() {
  try {
    // Get the Supabase URL from the client to construct the Edge Function URL
    const supabaseUrl = supabase.supabaseUrl;
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
