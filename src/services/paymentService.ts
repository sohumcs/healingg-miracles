
import { supabase } from '@/integrations/supabase/client';
import { updateOrderStatus } from './orderService';

interface PaymentGatewayConfig {
  provider: 'stripe' | 'razorpay' | 'cashfree';
  apiKey: string;
  apiSecret?: string;
  currency: string;
}

let paymentConfig: PaymentGatewayConfig = {
  provider: 'stripe',
  apiKey: '',
  currency: 'USD'
};

export function configurePaymentGateway(config: PaymentGatewayConfig): void {
  paymentConfig = config;
}

/**
 * Initiates a payment using the configured payment gateway
 */
export async function initiatePayment(
  orderId: string, 
  amount: number, 
  description: string, 
  customerEmail: string,
  customerName?: string
) {
  try {
    // Call the appropriate payment function based on the configured provider
    switch (paymentConfig.provider) {
      case 'stripe':
        return initiateStripePayment(orderId, amount, description, customerEmail, customerName);
      case 'razorpay':
        return initiateRazorpayPayment(orderId, amount, description, customerEmail, customerName);
      case 'cashfree':
        return initiateCashfreePayment(orderId, amount, description, customerEmail, customerName);
      default:
        throw new Error(`Payment provider ${paymentConfig.provider} not supported`);
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
}

/**
 * Verify and complete a payment after user returns from payment gateway
 */
export async function verifyPayment(
  paymentId: string, 
  orderId: string, 
  signature?: string
): Promise<boolean> {
  try {
    // Call the appropriate verify function based on the configured provider
    let success = false;
    
    switch (paymentConfig.provider) {
      case 'stripe':
        success = await verifyStripePayment(paymentId, orderId);
        break;
      case 'razorpay':
        success = await verifyRazorpayPayment(paymentId, orderId, signature);
        break;
      case 'cashfree':
        success = await verifyCashfreePayment(paymentId, orderId);
        break;
      default:
        throw new Error(`Payment provider ${paymentConfig.provider} not supported`);
    }
    
    // If payment was successful, update the order status
    if (success) {
      await updateOrderStatus(orderId, 'paid');
      
      // Sync to edge function/Google Sheets
      await supabase.functions.invoke('sync-orders', {
        method: 'POST',
        body: { 
          updateOrder: {
            id: orderId,
            status: 'paid',
            paymentId
          }
        }
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

// Stripe payment implementation
async function initiateStripePayment(
  orderId: string, 
  amount: number, 
  description: string, 
  customerEmail: string,
  customerName?: string
) {
  try {
    // We'll implement this through a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-payment', {
      method: 'POST',
      body: {
        orderId,
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        description,
        customerEmail,
        customerName
      }
    });

    if (error) throw new Error(`Error creating payment: ${error.message}`);
    
    return data;
  } catch (error) {
    console.error('Error creating Stripe payment:', error);
    throw error;
  }
}

async function verifyStripePayment(paymentId: string, orderId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      method: 'POST',
      body: {
        provider: 'stripe',
        paymentId,
        orderId
      }
    });

    if (error) throw new Error(`Error verifying payment: ${error.message}`);
    
    return data.success;
  } catch (error) {
    console.error('Error verifying Stripe payment:', error);
    return false;
  }
}

// Razorpay payment implementation
async function initiateRazorpayPayment(
  orderId: string, 
  amount: number, 
  description: string, 
  customerEmail: string,
  customerName?: string
) {
  try {
    // This will be implemented through a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-payment', {
      method: 'POST',
      body: {
        provider: 'razorpay',
        orderId,
        amount: Math.round(amount * 100), // Razorpay uses paise
        description,
        customerEmail,
        customerName
      }
    });

    if (error) throw new Error(`Error creating payment: ${error.message}`);
    
    return data;
  } catch (error) {
    console.error('Error creating Razorpay payment:', error);
    throw error;
  }
}

async function verifyRazorpayPayment(
  paymentId: string, 
  orderId: string, 
  signature?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      method: 'POST',
      body: {
        provider: 'razorpay',
        paymentId,
        orderId,
        signature
      }
    });

    if (error) throw new Error(`Error verifying payment: ${error.message}`);
    
    return data.success;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
}

// Cashfree payment implementation (basic structure)
async function initiateCashfreePayment(
  orderId: string, 
  amount: number, 
  description: string, 
  customerEmail: string,
  customerName?: string
) {
  // This will be similar to the other implementations
  return initiateStripePayment(orderId, amount, description, customerEmail, customerName);
}

async function verifyCashfreePayment(paymentId: string, orderId: string): Promise<boolean> {
  // This will be similar to the other implementations
  return verifyStripePayment(paymentId, orderId);
}
