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

export const fetchDashboardStatistics = async (): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>('/dashboard/statistics');
  return response.data;
};

export const useDashboardStatisticsQuery = () => {
  return useQuery({
    queryKey: ['adminDashboardStatistics'],
    queryFn: fetchDashboardStatistics,
  });
};
