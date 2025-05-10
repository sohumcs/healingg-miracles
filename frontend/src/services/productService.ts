// product.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string; // Optional to avoid null crash
  image: string;
  rating: number;
  featured: boolean;
  benefits?: string;
  ingredients?: string;
  size?: string;
  color?: string;
  reviews?: number;
  stock?: number;
  image_url?: string;
}

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading product ${productId}:`, error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}
