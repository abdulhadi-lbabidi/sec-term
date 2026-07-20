import { Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { useOrdersQuery } from '@/app/api/client/useOrders';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export default function OrdersPage() {
  const { t } = useTranslation();
  const { data: orders, isLoading }: any = useOrdersQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-[#1C1A17]">{t('myOrders')}</h2>
        <p className="text-gray-500 mb-8">{t('noOrders')}</p>
        <Link to="/shop">
          <Button className="bg-[#111111] hover:bg-[#C5A880] text-white">{t('shopNow')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-black mb-8 text-[#1C1A17] flex items-center gap-3">
        <Package className="text-[#C5A880]" size={32} />
        {t('myOrders')}
      </h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EAE5DF]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t('orderId')}</span>
                <span className="text-[#1C1A17] font-black text-lg">#{order.id}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t('orderDate')}</span>
                <span className="text-[#1C1A17] font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t('orderStatus')}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                  <Clock size={14} />
                  {order.status === 'pending' ? t('statusPending') :
                    order.status === 'shipped' ? t('statusShipped') : t('statusDelivered')}
                </span>
              </div>
              <div className="text-end">
                <span className="text-gray-400 text-sm font-bold block mb-1">{t('total')}</span>
                <span className="text-[#C5A880] font-black text-xl">{order.total_amount} <span className="text-sm">{t('products.currency', 'SAR')}</span></span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h4 className="font-bold text-[#1C1A17] mb-4">{t('orderedProducts')}</h4>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => {
                    const name = item.product_name || 'Product';
                    const image = item.variant?.image || item.product?.image || '/placeholder-food.jpg';
                    const price = item.price || 0;
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                          <img src={image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-[#1C1A17] line-clamp-1">{name}</h5>
                          <div className="text-gray-500 text-sm mt-1">{t('quantityLabel')} <span className="font-bold">{item.quantity}</span></div>
                        </div>
                        <div className="font-black text-[#1C1A17]">
                          {(price * item.quantity).toFixed(2)} {t('products.currency', 'SAR')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="md:w-1/3 space-y-6 bg-[#FCFAF7] p-6 rounded-2xl border border-[#EAE5DF]">
                <div>
                  <h4 className="font-bold text-[#1C1A17] mb-3 flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-[#C5A880]" />
                    {t('deliveryDetails')}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium mb-1">{order.shipping_details?.first_name} {order.shipping_details?.last_name}</p>
                  <p className="text-sm text-gray-500 mb-1" dir="ltr">{order.shipping_details?.phone}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{order.shipping_details?.city}, {order.shipping_details?.country}<br />{order.shipping_details?.street}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1A17] mb-3 flex items-center gap-2 text-sm">
                    <CreditCard size={16} className="text-[#C5A880]" />
                    {t('paymentMethod')}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {order.payment_method === 'cod' ? t('cashOnDelivery') : t('creditCard')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
