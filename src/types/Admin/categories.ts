export interface Category {
  id: number;
  name: string;
  description: string;
  images: string;
  all_images: string[];
  created_at: string;
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
