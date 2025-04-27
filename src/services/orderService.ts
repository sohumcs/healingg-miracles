
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total: number;
  status: 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at?: string;
  order_items?: OrderItem[];
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  message?: string;
}

export async function createOrder(orderData: {
  userId: string;
  total: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}): Promise<Order> {
  try {
    // First create order in Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.userId,
        order_number: `ORD${Date.now()}`,
        total: orderData.total,
        status: 'processing'
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Sync to Google Sheets
    const { data, error } = await supabase.functions.invoke('sync-orders', {
      method: 'POST',
      body: { order: { ...order, items: orderItems } }
    });

    if (error) {
      throw new Error(`Error syncing order: ${error.message}`);
    }
    
    return order as Order; // Type assertion to ensure it matches the Order type
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function fetchOrders(userId: string): Promise<Order[]> {
  try {
    const { data: orders, error: dbError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    // Sync with Google Sheets to get latest status
    const { data, error } = await supabase.functions.invoke('sync-orders', {
      method: 'GET'
    });

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
    
    // Update local orders with latest status from Google Sheets
    const sheetsOrders = data.orders;
    const updatedOrders = orders.map(order => {
      const sheetOrder = sheetsOrders.find((so: any) => so.id === order.id);
      // Ensure the status is cast to the correct type
      const status = sheetOrder?.status || order.status;
      // Verify status is one of the allowed values
      const validStatus = ['processing', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status) 
        ? status as Order['status']
        : 'processing';
      
      return { 
        ...order, 
        status: validStatus 
      } as Order;
    });

    return updatedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
