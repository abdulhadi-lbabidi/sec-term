import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Calendar,
  DollarSign,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Inbox,
} from 'lucide-react';
import { useDashboardStatisticsQuery } from '../../../api/Admin/dashboard';

export const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { data: statsData, isLoading, isError, error } = useDashboardStatisticsQuery();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-destructive">
        <p className="font-semibold">{t('admin.error_loading')}</p>
        <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
      </div>
    );
  }

  const stats = statsData?.data;
  const overview = stats?.overview || {
    total_products: 0,
    total_categories: 0,
    new_orders: 0,
    today_orders: 0,
    total_sales: 0,
  };

  const lowStock = stats?.low_stock_variants || [];
  const topSelling = stats?.top_selling_products || [];

  const cards = [
    {
      title: t('admin.total_products'),
      value: overview.total_products,
      icon: Package,
      gradient: 'from-white to-blue-50/10 hover:border-blue-200/50',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: t('admin.total_categories'),
      value: overview.total_categories,
      icon: FolderOpen,
      gradient: 'from-white to-purple-50/10 hover:border-purple-200/50',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: t('admin.new_orders'),
      value: overview.new_orders,
      icon: ShoppingCart,
      gradient: 'from-white to-amber-50/10 hover:border-amber-200/50',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: t('admin.today_orders'),
      value: overview.today_orders,
      icon: Calendar,
      gradient: 'from-white to-emerald-50/10 hover:border-emerald-200/50',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: t('admin.total_sales'),
      value: `${overview.total_sales} ${t('admin.currency')}`,
      icon: DollarSign,
      gradient: 'from-white to-rose-50/10 hover:border-rose-200/50',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border border-black/[0.04] bg-gradient-to-br ${card.gradient} p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.035)] group`}
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/45">{card.title}</p>
                <p className="text-xl font-black text-black tracking-tight">{card.value}</p>
              </div>
              <div className={`rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-105 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.01)] space-y-5">
          <div className="flex items-center gap-2.5 border-b pb-4">
            <div className="rounded-xl bg-red-50 p-2 text-red-500">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-black">
                {t('admin.low_stock_alert')}
              </h2>
            </div>
          </div>

          {lowStock.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-black/35 p-6 border border-dashed border-black/5 rounded-2xl bg-neutral-50/20">
              <Inbox className="h-8 w-8 text-black/20" />
              <p className="text-xs font-semibold">
                {t('admin.all_variants_in_stock')}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs text-black">
                  <thead>
                    <tr className="border-b border-black/[0.04] text-black/40 font-bold">
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {t('admin.product_name')}
                      </th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {t('admin.available_options')}
                      </th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>SKU</th>
                      <th className={`pb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {t('admin.stock_status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.03]">
                    {lowStock.map((item) => (
                      <tr key={item.variant_id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className={`py-3.5 font-bold text-black/80 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {item.product_name}
                        </td>
                        <td className={`py-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <div className="flex flex-wrap gap-1.5 justify-start">
                            <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600 border border-neutral-200/30">
                              {item.size}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-orange-50/40 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200/20">
                              {item.material}
                            </span>
                          </div>
                        </td>
                        <td className={`py-3.5 font-mono text-[11px] text-black/40 ${isRtl ? 'text-right' : 'text-left'}`}>{item.sku}</td>
                        <td className={`py-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50/60 px-2.5 py-0.5 text-[11px] font-bold text-red-600 border border-red-100/30">
                            <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                            {item.stock_quantity} {t('admin.units_left')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden space-y-3.5">
                {lowStock.map((item) => (
                  <div key={item.variant_id} className="rounded-xl border border-black/5 bg-black/[0.01] p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
                      <span className="font-bold text-black/85 text-xs">{item.product_name}</span>
                      <span className="font-mono text-[10px] text-black/40">SKU: {item.sku}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600 border border-neutral-200/30">
                        {item.size}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-orange-50/40 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200/20">
                        {item.material}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] text-black/45">{t('admin.current_stock')}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50/60 px-2.5 py-0.5 text-[11px] font-bold text-red-600 border border-red-100/30">
                        <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                        {item.stock_quantity} {t('admin.units_left')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.01)] space-y-5">
          <div className="flex items-center gap-2.5 border-b pb-4">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-black">
                {t('admin.top_selling')}
              </h2>
            </div>
          </div>

          {topSelling.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-black/35 p-6 border border-dashed border-black/5 rounded-2xl bg-neutral-50/20">
              <Inbox className="h-8 w-8 text-black/20" />
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-black/60">
                  {t('admin.no_sales_data')}
                </p>
                <p className="text-[10px] text-black/40 leading-normal max-w-[180px] mx-auto">
                  {t('admin.sales_data_desc')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {topSelling.map((prod: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between border-b border-black/[0.03] pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-black">{prod.name}</p>
                    <p className="text-[10px] text-black/40">{prod.sales_count} {t('admin.sales')}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600">
                    {prod.revenue} {t('admin.currency')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
