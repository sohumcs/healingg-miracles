
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SHEET_ID = process.env.GOOGLE_SHEETS_ORDERS_SHEET_ID;

    if (!SHEETS_API_KEY || !SHEET_ID) {
      throw new Error('Missing required environment variables');
    }

    // If method is POST, add a new order to Google Sheets
    if (req.method === 'POST') {
      const requestData = await req.json();
      const { order } = requestData;
      
      const values = [
        [
          order.id,
          order.orderNumber,
          order.userId,
          order.total,
          order.status,
          new Date().toISOString(),
          JSON.stringify(order.items)
        ]
      ];

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Orders!A:G:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SHEETS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add order to Google Sheets');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      // Get orders from Google Sheets (GET method)
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Orders!A2:G`,
        {
          headers: {
            'Authorization': `Bearer ${SHEETS_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders from Google Sheets');
      }

      const data = await response.json();
      const orders = data.values?.map((row: any[]) => ({
        id: row[0],
        orderNumber: row[1],
        userId: row[2],
        total: parseFloat(row[3]),
        status: row[4],
        createdAt: row[5],
        items: JSON.parse(row[6])
      })) || [];

      return new Response(
        JSON.stringify({ orders }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
  } catch (error) {
    console.error('Error syncing orders:', error);
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
