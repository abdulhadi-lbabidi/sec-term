export interface Package {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface SizeVariant {
  variant_id: number;
  size_id: number;
  size_name: string;
  stock_quantity: number;
  price: number;
  discount: number;
  final_price: number;
  sku: string;
  barcode: string;
  images: string[];
  packages: Package[];
}

export interface MaterialOption {
  material_id: number;
  material_name: string;
  available_sizes: SizeVariant[];
}

export interface Product {
  id: number;
  name: string;
  body: string;
  is_featured: boolean;
  image: string;
  all_images: string[];
  category?: { id: number; name: string; description: string; };
  available_options: MaterialOption[];
  price: number;
  discount: number;
  final_price: number;
  stock: number;
  sku: string;
}
