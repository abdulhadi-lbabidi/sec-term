export interface CheckoutUser {
  id: number;
  name: string;
  email: string;
}

export interface CheckoutCartItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  product_name: string;
  variant_sku?: string;
  variant_size?: string;
  variant_material?: string;
}

export interface CheckoutCart {
  id: number;
  status: string;
  items: CheckoutCartItem[];
}

export interface CheckoutItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  floor: string;
  postal_code: string;
  additional_information: string | null;
  status: string;
  created_at: string;
  user: CheckoutUser;
  cart: CheckoutCart;
}

export interface CheckoutsResponse {
  data: CheckoutItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
