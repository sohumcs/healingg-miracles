
import { Order } from '../types';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_URL}/orders`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading orders:', error);
    throw error;
  }
}

export async function createOrder(orderData: {
  user_id?: string;
  total: number;
  shipping_address?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}): Promise<Order> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
}
