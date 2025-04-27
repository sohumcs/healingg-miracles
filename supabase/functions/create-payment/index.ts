
// Fix import path for edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get payment gateway config from environment variables
    const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'stripe';
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    
    // Parse the request body
    const { provider = PAYMENT_PROVIDER, orderId, amount, description, customerEmail, customerName } = await req.json();
    
    let paymentResult;
    
    // Process based on the payment provider
    switch (provider.toLowerCase()) {
      case 'stripe':
        if (!STRIPE_SECRET_KEY) {
          throw new Error('Stripe secret key not configured');
        }
        paymentResult = await createStripePayment(
          STRIPE_SECRET_KEY, 
          orderId, 
          amount, 
          description, 
          customerEmail, 
          customerName
        );
        break;
        
      case 'razorpay':
        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
          throw new Error('Razorpay keys not configured');
        }
        paymentResult = await createRazorpayPayment(
          RAZORPAY_KEY_ID,
          RAZORPAY_KEY_SECRET,
          orderId, 
          amount, 
          description, 
          customerEmail, 
          customerName
        );
        break;
        
      default:
        throw new Error(`Payment provider ${provider} not supported`);
    }

    return new Response(
      JSON.stringify(paymentResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// Stripe payment creation
async function createStripePayment(
  secretKey: string,
  orderId: string,
  amount: number,
  description: string,
  customerEmail: string,
  customerName?: string
) {
  // Import Stripe dynamically
  const stripe = await import('https://esm.sh/stripe@8.222.0');
  const stripeClient = stripe.default(secretKey);
  
  // Create a payment intent
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount,
    currency: 'usd', // This would be configurable
    description,
    metadata: {
      orderId
    },
    receipt_email: customerEmail,
  });
  
  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: paymentIntent.id
  };
}

// Razorpay payment creation
async function createRazorpayPayment(
  keyId: string,
  keySecret: string,
  orderId: string,
  amount: number,
  description: string,
  customerEmail: string,
  customerName?: string
) {
  // Import Razorpay dynamically
  const Razorpay = await import('https://esm.sh/razorpay@2.8.6');
  
  const razorpay = new Razorpay.default({
    key_id: keyId,
    key_secret: keySecret,
  });
  
  // Create order
  const order = await razorpay.orders.create({
    amount,
    currency: 'INR', // This would be configurable
    receipt: orderId,
    notes: {
      description,
      customerEmail,
      customerName
    }
  });
  
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId
  };
}

// This is the adapter function that Supabase needs
export const POST = handler;
