
import { supabase } from '@/integrations/supabase/client';

export async function createOrder(orderData: any) {
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
    const orderItems = orderData.items.map((item: any) => ({
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
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function fetchOrders(userId: string) {
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
      return sheetOrder ? { ...order, status: sheetOrder.status } : order;
    });

    return updatedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}
