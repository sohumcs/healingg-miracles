
// Define types for our application that were previously in supabase/types

export interface User {
  id: string;
  email: string;
  is_admin?: boolean;
  name?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  featured: boolean;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total: number;
  status: 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
  tracking_number?: string;
  shipping_address?: string;
  items: OrderItem[];
}
