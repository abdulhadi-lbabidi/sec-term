import { useQuery } from '@tanstack/react-query';
import api from './axios';
import type {
  DashboardResponse,
  DashboardStatistics,
  Overview,
  LowStockVariant,
  TopSellingProduct,
  RecentOrder,
} from '../../../types/Admin/dashboard';

export type {
  DashboardResponse,
  DashboardStatistics,
  Overview,
  LowStockVariant,
  TopSellingProduct,
  RecentOrder,
};

export const fetchDashboardStatistics = async (month?: number | string, year?: number | string): Promise<DashboardResponse> => {
  const params: Record<string, any> = {};
  if (month) params.month = month;
  if (year) params.year = year;

  const response = await api.get<DashboardResponse>('/dashboard/statistics', { params });
  return response.data;
};

export const useDashboardStatisticsQuery = (month?: number | string, year?: number | string) => {
  return useQuery({
    queryKey: ['adminDashboardStatistics', month, year],
    queryFn: () => fetchDashboardStatistics(month, year),
  });
};
