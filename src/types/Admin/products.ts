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

export interface SizeInfo {
  id: number;
  size: string;
  created_at?: string;
}

export interface MaterialInfo {
  id: number;
  material: string;
  created_at?: string;
}

export interface PackageInfo {
  id: number;
  name: any;
  price: number;
  created_at?: string;
  package_id?: number;
  quantity?: number;
  pivot?: {
    quantity?: number;
  };
}

export interface ProductVariantImage {
  id: number;
  url: string;
  image?: string;
}

export interface ProductVariant {
  id: number;
  variant_id?: number; // Some endpoints might use variant_id
  image: string;
  product_all_images: ProductVariantImage[];
  product: Product;
  packages: PackageInfo[];
  price: number;
  discount: number;
  final_price: number;
  current_size: SizeInfo;
  current_material: MaterialInfo;
  stock_quantity: number;
  sku: string;
  barcode: string;
  created_at: string;
  reviews_avg: number;
  reviews_count: number;
  images?: string[];
  size_id?: number | string;
  material_id?: number | string;
  discaount?: number;
}

export interface ProductVariantResponse {
  data: ProductVariant;
}
