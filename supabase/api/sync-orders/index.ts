// Fix import path for edge functions
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define valid statuses as specific string literals to avoid type errors
const validStatuses: ('processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled')[] = [
  'processing', 'paid', 'shipped', 'delivered', 'cancelled'
];

export async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { GOOGLE_SHEETS_API_KEY: SHEETS_API_KEY, GOOGLE_SHEETS_ORDERS_SHEET_ID: SHEET_ID } = process.env;

    if (!SHEETS_API_KEY || !SHEET_ID) {
      throw new Error('Missing required environment variables');
    }

    const isPost = req.method === 'POST';
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Orders!${isPost ? 'A:G:append?valueInputOption=RAW' : 'A2:G'}`;
    const headers = {
      'Authorization': `Bearer ${SHEETS_API_KEY}`,
      ...(isPost && { 'Content-Type': 'application/json' }),
    };

    if (isPost) {
      const { order } = await req.json();

      const values = [[
        order.id,
        order.orderNumber || order.order_number,
        order.userId || order.user_id,
        order.total,
        order.status,
        new Date().toISOString(),
        JSON.stringify(order.items || []),
      ]];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add order to Google Sheets: ${response.status} ${errorText}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders from Google Sheets: ${response.status} ${errorText}`);
      }

      const { values = [] } = await response.json();

      const orders = values.map((row = []) => {
        let status = row[4] as 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled'; // Explicitly define type for status
        if (!validStatuses.includes(status)) {
          console.warn(`Invalid status "${status}" for order ${row[0]}, defaulting to "processing".`);
          status = 'processing'; // Default to "processing" if status is invalid
        }

        return {
          id: row[0],
          orderNumber: row[1],
          userId: row[2],
          total: parseFloat(row[3]) || 0, // Ensure total is a valid number
          status,
          createdAt: row[5],
          items: JSON.parse(row[6] || '[]'),
        };
      });

      return new Response(JSON.stringify({ orders }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error syncing orders:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// This is the adapter function that Supabase needs
export const GET = handler;
export const POST = handler;
