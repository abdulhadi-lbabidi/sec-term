export interface PackageItem {
  id: number;
  name: any;
  price: number;
  created_at: string;
}

export interface PackagesResponse {
  data: PackageItem[];
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
