import React from 'react';
import { Package, MapPin, CreditCard, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useOrders } from '../../api/client/useOrders';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function OrdersPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center text-gray-500 font-bold">{t.loading}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-[#1C1A17]">{t.myOrders}</h2>
        <p className="text-gray-500 mb-8">{t.noOrders}</p>
        <Link to="/shop">
          <Button className="bg-[#111111] hover:bg-[#C5A880] text-white">{t.shopNow}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-black mb-8 text-[#1C1A17] flex items-center gap-3">
        <Package className="text-[#C5A880]" size={32} />
        {t.myOrders}
      </h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EAE5DF]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t.orderId}</span>
                <span className="text-[#1C1A17] font-black text-lg">#{order.id}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t.orderDate}</span>
                <span className="text-[#1C1A17] font-medium">{order.date}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold block mb-1">{t.orderStatus}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                  order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  <Clock size={14} />
                  {order.status === 'pending' ? t.statusPending : 
                   order.status === 'shipped' ? t.statusShipped : t.statusDelivered}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm font-bold block mb-1">{t.total}</span>
                <span className="text-[#C5A880] font-black text-xl">{order.total} <span className="text-sm">{t.currency}</span></span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h4 className="font-bold text-[#1C1A17] mb-4">المنتجات المطلوبة</h4>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => {
                    const name = language === 'ar' ? (item.isPackage ? item.product.nameAr : item.product.nameAr) : (item.isPackage ? item.product.nameEn : item.product.nameEn);
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                          <img src={item.product.image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-[#1C1A17] line-clamp-1">{name}</h5>
                          <div className="text-gray-500 text-sm mt-1">الكمية: <span className="font-bold">{item.quantity}</span></div>
                        </div>
                        <div className="font-black text-[#1C1A17]">
                          {item.product.price * item.quantity} {t.currency}
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
                    تفاصيل التوصيل
                  </h4>
                  <p className="text-sm text-gray-600 font-medium mb-1">{order.shippingDetails?.name}</p>
                  <p className="text-sm text-gray-500 mb-1" dir="ltr">{order.shippingDetails?.phone}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{order.shippingDetails?.address}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1A17] mb-3 flex items-center gap-2 text-sm">
                    <CreditCard size={16} className="text-[#C5A880]" />
                    طريقة الدفع
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {order.paymentMethod === 'cod' ? t.cashOnDelivery : t.creditCard}
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
