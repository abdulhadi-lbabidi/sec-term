export interface Category {
  image: string;
  id: number;
  name: any;
  description: any;
  images: string;
  all_images: string[];
  created_at: string;
  products_count?: number;
}

export interface CategoriesResponse {
  data: Category[];
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
