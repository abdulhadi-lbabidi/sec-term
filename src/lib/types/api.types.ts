export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  paginate?: number; // usually 1 for true
  [key: string]: any;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  category_id: number;
  category?: Category;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface Size {
  id: number;
  name: string;
  value?: string;
}

export interface Material {
  id: number;
  name: string;
  description?: string;
}

export interface Package {
  id: number;
  name: string;
  description?: string;
  discount_percentage?: number;
  price?: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size_id?: number;
  material_id?: number;
  price: number;
  stock: number;
  sku?: string;
  size?: Size;
  material?: Material;
  product?: Product;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  total: number;
  variant?: ProductVariant;
}

export interface Cart {
  id: number;
  user_id?: number;
  session_id?: string;
  total_price: number;
  items: CartItem[];
}

export interface Checkout {
  id: number;
  cart_id: number;
  user_id?: number;
  status: string;
  shipping_address: string;
  billing_address?: string;
  payment_method: string;
  total_amount: number;
}

export interface Order {
  id: number;
  checkout_id: number;
  user_id: number;
  status: string; // e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// Params for filtering products
export interface ProductFilters extends PaginationParams {
  'filter[search]'?: string;
  'filter[category_id]'?: number;
  'filter[size_id]'?: number;
  'filter[material_id]'?: number;
  'filter[min_price]'?: number;
  'filter[max_price]'?: number;
}
