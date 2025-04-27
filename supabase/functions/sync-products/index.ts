
// Fix import path for edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  featured: boolean;
}

export async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get secrets from environment
    const SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SHEET_ID = process.env.GOOGLE_SHEETS_PRODUCT_SHEET_ID;

    if (!SHEETS_API_KEY || !SHEET_ID) {
      throw new Error('Missing required environment variables');
    }

    console.log('Fetching products with API Key and Sheet ID:', SHEETS_API_KEY?.substring(0, 3) + '...', SHEET_ID);

    // Fetch products from Google Sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Products!A2:H`,
      {
        headers: {
          'Authorization': `Bearer ${SHEETS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      throw new Error(`Failed to fetch products from Google Sheets: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Google Sheets API response:', JSON.stringify(data).substring(0, 100) + '...');

    const products: Product[] = data.values?.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      price: parseFloat(row[2]),
      description: row[3],
      category: row[4],
      image: row[5],
      rating: parseFloat(row[6]),
      featured: row[7]?.toLowerCase() === 'true'
    })) || [];

    console.log(`Processed ${products.length} products`);

    return new Response(
      JSON.stringify({ products }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error syncing products:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// This is the adapter function that Supabase needs
export const GET = handler;
export const POST = handler;
