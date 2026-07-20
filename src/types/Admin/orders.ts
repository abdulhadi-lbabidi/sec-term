export interface OrderShippingDetails {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  street: string;
}

export interface OrderItemVariant {
  id: number;
  size: string | null;
  material: string | null;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
  variant: OrderItemVariant;
}

export interface Order {
  id: number;
  total_amount: number;
  shipping_fee: number;
  delivery_fee: number;
  payment_method: string;
  status: string;
  created_at: string;
  shipping_details: OrderShippingDetails;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
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
