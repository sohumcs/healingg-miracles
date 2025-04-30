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
    // Commenting out payment logic temporarily
    // const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'stripe';
    // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    // const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    // const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    // const { provider = PAYMENT_PROVIDER, orderId, amount, description, customerEmail, customerName } = await req.json();

    // let paymentResult;

    // switch (provider.toLowerCase()) {
    //   case 'stripe':
    //     if (!STRIPE_SECRET_KEY) throw new Error('Stripe secret key not configured');
    //     paymentResult = await createStripePayment(
    //       STRIPE_SECRET_KEY, orderId, amount, description, customerEmail, customerName
    //     );
    //     break;

    //   case 'razorpay':
    //     if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) throw new Error('Razorpay keys not configured');
    //     paymentResult = await createRazorpayPayment(
    //       RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, orderId, amount, description, customerEmail, customerName
    //     );
    //     break;

    //   default:
    //     throw new Error(`Payment provider ${provider} not supported`);
    // }

    // return new Response(JSON.stringify(paymentResult), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    // Just return a sample response for now until payment gateway is set up
    return new Response(
      JSON.stringify({ message: 'Payment gateway logic is commented out for now.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
}

// async function createStripePayment(secretKey: string, orderId: string, amount: number, description: string, customerEmail: string, customerName?: string) {
//   const stripe = (await import('stripe')).default;
//   const stripeClient = stripe(secretKey);

//   const paymentIntent = await stripeClient.paymentIntents.create({
//     amount,
//     currency: 'usd',
//     description,
//     metadata: { orderId },
//     receipt_email: customerEmail,
//   });

//   return {
//     clientSecret: paymentIntent.client_secret,
//     paymentId: paymentIntent.id
//   };
// }

// async function createRazorpayPayment(keyId: string, keySecret: string, orderId: string, amount: number, description: string, customerEmail: string, customerName?: string) {
//   const Razorpay = (await import('razorpay')).default;
//   const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

//   const order = await razorpay.orders.create({
//     amount,
//     currency: 'INR',
//     receipt: orderId,
//     notes: { description, customerEmail, customerName }
//   });

//   return {
//     orderId: order.id,
//     amount: order.amount,
//     currency: order.currency,
//     keyId
//   };
// }

export const POST = handler;
