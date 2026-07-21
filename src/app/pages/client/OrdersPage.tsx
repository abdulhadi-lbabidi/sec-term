import { Package, MapPin, CreditCard, Clock, Eye, ShoppingBag } from 'lucide-react';
import { useOrdersQuery } from '@/app/api/client/useOrders';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/app/components/ui/pagination';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading }: any = useOrdersQuery({ page, per_page: 5 });
  const isRTL = i18n.language === 'ar';
  
  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data || []);
  const meta = ordersData?.meta;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-foreground">{t('myOrders')}</h2>
        <p className="text-muted-foreground mb-8">{t('noOrders')}</p>
        <Link to="/shop">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12">{t('shopNow')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-black mb-8 text-foreground flex items-center gap-3">
        <Package className="text-primary" size={32} />
        {t('myOrders')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: any) => (
          <Dialog key={order.id}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-muted-foreground text-xs font-bold block mb-1 uppercase tracking-wider">{t('orderId')}</span>
                    <span className="text-foreground font-black text-xl">#{order.id}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                    <Clock size={12} />
                    {order.status === 'pending' ? t('statusPending') :
                      order.status === 'shipped' ? t('statusShipped') : t('statusDelivered')}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-muted-foreground text-xs font-bold block mb-1 uppercase tracking-wider">{t('orderDate')}</span>
                    <span className="text-foreground font-medium text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-muted-foreground text-xs font-bold block mb-1 uppercase tracking-wider">{t('total')}</span>
                    <span className="text-primary font-black text-lg">{Number(order.total_amount).toFixed(2)} <span className="text-xs">{t('products.currency', 'SAR')}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-primary/5 p-3 rounded-2xl">
                  <ShoppingBag size={16} className="text-primary" />
                  <span className="font-medium">
                    {order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0} {t('itemsCount', 'Items')}
                  </span>
                </div>
              </div>

              <DialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-2xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground group">
                  <Eye size={18} className={isRTL ? "ml-2 group-hover:scale-110 transition-transform" : "mr-2 group-hover:scale-110 transition-transform"} />
                  {t('viewDetails', 'View Details')}
                </Button>
              </DialogTrigger>
            </div>

            <DialogContent className="w-[95vw] sm:max-w-2xl lg:max-w-4xl rounded-2xl md:rounded-3xl p-0 overflow-hidden border-border bg-background shadow-xl flex flex-col max-h-[90vh] md:max-h-[85vh]">
              <div className="bg-muted/30 px-4 md:px-6 py-4 md:py-5 border-b border-border/50 flex justify-between items-center pe-12 md:pe-16 shrink-0">
                <DialogHeader className="p-0 text-start">
                  <DialogTitle className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2 m-0 p-0 !text-start">
                    {t('orderId')} <span className="text-primary">#{order.id}</span>
                  </DialogTitle>
                </DialogHeader>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                  {order.status === 'pending' ? t('statusPending') :
                    order.status === 'shipped' ? t('statusShipped') : t('statusDelivered')}
                </span>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                  <div className="lg:w-[55%] xl:w-3/5">
                    <h4 className="font-bold text-foreground mb-4">{t('orderedProducts')}</h4>
                    <div className="space-y-3 md:space-y-4">
                      {order.items?.map((item: any, idx: number) => {
                        const name = item.product_name || 'Product';
                        const price = item.price || 0;
                        return (
                          <div key={idx} className="flex items-center gap-3 md:gap-4 bg-muted/20 p-3 md:p-4 rounded-xl md:rounded-2xl border border-border">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Package size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm text-foreground truncate">{name}</h5>
                              <div className="text-muted-foreground text-xs mt-1">{t('quantityLabel')} <span className="font-bold text-foreground">{item.quantity}</span></div>
                            </div>
                            <div className="font-black text-foreground shrink-0 text-sm md:text-base">
                              {(price * item.quantity).toFixed(2)} <span className="text-xs text-muted-foreground">{t('products.currency', 'SAR')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:w-[45%] xl:w-2/5 flex flex-col gap-4 md:gap-6">
                    <div className="bg-primary/5 p-4 md:p-5 rounded-xl md:rounded-3xl border border-primary/10">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
                        <MapPin size={18} className="text-primary" />
                        {t('deliveryDetails')}
                      </h4>
                      <p className="text-sm text-foreground font-medium mb-1">{order.shipping_details?.first_name} {order.shipping_details?.last_name}</p>
                      <p className="text-sm text-muted-foreground mb-1" dir="ltr">{order.shipping_details?.phone}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{order.shipping_details?.city}, {order.shipping_details?.country}<br />{order.shipping_details?.street}</p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 md:p-5 rounded-xl md:rounded-3xl border border-primary/10">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
                        <CreditCard size={18} className="text-primary" />
                        {t('paymentMethod')}
                      </h4>
                      <p className="text-sm text-foreground font-medium">
                        {order.payment_method === 'cod' ? t('cashOnDelivery', 'Cash on Delivery') : t('creditCard', 'Credit Card')}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 md:p-5 rounded-xl md:rounded-3xl border border-border shadow-sm flex justify-between items-center mt-auto">
                       <span className="font-bold text-muted-foreground">{t('total')}</span>
                       <span className="font-black text-xl md:text-2xl text-primary">{Number(order.total_amount).toFixed(2)} <span className="text-sm">{t('products.currency', 'SAR')}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(meta.last_page)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page < meta.last_page) setPage(page + 1); }}
                  className={page >= meta.last_page ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
