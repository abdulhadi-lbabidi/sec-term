import { Category } from './categories';

export interface Product {
  id: number;
  name: any;
  body: any;
  category: Category;
  is_featured: boolean;
  images?: string;
  all_images: string[];
  created_at?: string;
}

export interface ProductsResponse {
  data: Product[];
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
