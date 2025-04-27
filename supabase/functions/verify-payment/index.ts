
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
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    
    // Parse the request body
    const { provider, paymentId, orderId, signature } = await req.json();
    
    let verificationResult = { success: false };
    
    // Process based on the payment provider
    switch (provider.toLowerCase()) {
      case 'stripe':
        if (!STRIPE_SECRET_KEY) {
          throw new Error('Stripe secret key not configured');
        }
        verificationResult = await verifyStripePayment(STRIPE_SECRET_KEY, paymentId, orderId);
        break;
        
      case 'razorpay':
        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
          throw new Error('Razorpay keys not configured');
        }
        verificationResult = await verifyRazorpayPayment(
          RAZORPAY_KEY_SECRET, 
          orderId, 
          paymentId, 
          signature
        );
        break;
        
      default:
        throw new Error(`Payment provider ${provider} not supported`);
    }

    return new Response(
      JSON.stringify(verificationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// Stripe payment verification
async function verifyStripePayment(
  secretKey: string,
  paymentId: string,
  orderId: string
) {
  // Import Stripe dynamically
  const stripe = await import('https://esm.sh/stripe@8.222.0');
  const stripeClient = stripe.default(secretKey);
  
  // Retrieve the payment intent
  const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentId);
  
  // Verify that the payment is successful and matches our order
  const success = 
    paymentIntent.status === 'succeeded' && 
    paymentIntent.metadata.orderId === orderId;
  
  return {
    success,
    paymentStatus: paymentIntent.status,
    lastError: paymentIntent.last_payment_error
  };
}

// Razorpay payment verification
async function verifyRazorpayPayment(
  keySecret: string,
  orderId: string,
  paymentId: string,
  signature: string
) {
  // Import crypto for signature verification
  const crypto = await import('https://deno.land/std@0.170.0/node/crypto.ts');
  
  // Generate signature verification hash
  const generatedSignature = crypto.createHmac('sha256', keySecret)
    .update(orderId + '|' + paymentId)
    .digest('hex');
  
  // Verify signature
  const success = generatedSignature === signature;
  
  return {
    success,
    paymentId
  };
}

// This is the adapter function that Supabase needs
export const POST = handler;
