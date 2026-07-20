export interface Overview {
  total_products: number;
  total_categories: number;
  new_orders: number;
  today_orders: number;
  total_sales: number;
}

export interface LowStockVariant {
  variant_id: number;
  product_name: string;
  size: string;
  material: string;
  stock_quantity: number;
  sku: string;
}

export interface TopSellingProduct {
  name: string;
  sales_count: number;
  revenue: number;
}

export interface RecentOrder {
  id: number;
  user_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface DashboardStatistics {
  overview: Overview;
  top_selling_products: TopSellingProduct[];
  low_stock_variants: LowStockVariant[];
  recent_orders: RecentOrder[];
}

export interface DashboardResponse {
  data: DashboardStatistics;
}
