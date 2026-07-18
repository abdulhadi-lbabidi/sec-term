export interface ReviewUser {
  id: number;
  name: string;
  email: string;
}

export interface ReviewProductVariant {
  id: number;
  sku: string;
  price: number;
  image: string | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: ReviewUser;
  product_variant: ReviewProductVariant;
  created_at: string;
}

export interface ReviewsResponse {
  data: Review[];
  links: any;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: any;
  };
}
