import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useCreateOrderMutation } from '../../api/client/useOrders';
import { Button } from '../../components/ui/button';

export default function CheckoutPage() {
  const { language, cart, clearCart } = useAppStore();
  const t = translations[language];
  const navigate = useNavigate();
  const placeOrderMutation = useCreateOrderMutation();

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', method: 'cod' });
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const delivery = 15;
  const finalTotal = total + delivery;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrderMutation.mutate({
      items: cart,
      shipping: formData,
      total: finalTotal
    }, {
      onSuccess: () => {
        setSuccess(true);
        clearCart();
      }
    });
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-[#1C1A17]">{t.orderSuccessTitle}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{t.orderSuccessDesc}</p>
        <Button onClick={() => navigate('/')} className="bg-[#111111] hover:bg-[#C5A880] text-white px-8 h-12 rounded-xl">
          {t.backToHome}
        </Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h2 className="text-3xl font-black mb-4">{t.emptyCartTitle}</h2>
        <Button onClick={() => navigate('/shop')} className="bg-[#111111] text-white mt-4">{t.shopNow}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">{t.checkoutTitle}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-[#EAE5DF] space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.fullName}</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 focus:outline-none focus:border-[#C5A880]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.phone}</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 focus:outline-none focus:border-[#C5A880]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.address}</label>
            <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-[#C5A880]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.paymentMethod}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.method === 'cod' ? 'border-[#C5A880] bg-[#FCFAF7]' : 'border-gray-200'}`}>
                <input type="radio" name="payment" checked={formData.method === 'cod'} onChange={() => setFormData({ ...formData, method: 'cod' })} className="accent-[#C5A880]" />
                <span className="font-bold">{t.cashOnDelivery}</span>
              </label>
              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.method === 'card' ? 'border-[#C5A880] bg-[#FCFAF7]' : 'border-gray-200'}`}>
                <input type="radio" name="payment" checked={formData.method === 'card'} onChange={() => setFormData({ ...formData, method: 'card' })} className="accent-[#C5A880]" />
                <span className="font-bold">{t.creditCard}</span>
              </label>
            </div>
          </div>
        </form>

        <div className="lg:w-1/3">
          <div className="bg-[#1C1A17] text-white p-8 rounded-3xl sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-[#C5A880]">{t.cartSummary}</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                  <span className="flex-1 pr-4">{language === 'ar' ? item.product.nameAr : item.product.nameEn} x {item.quantity}</span>
                  <span className="font-bold">{item.product.price * item.quantity} {t.currency}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-gray-400">
                <span>{t.subtotal}</span>
                <span>{total} {t.currency}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t.deliveryFee}</span>
                <span>{delivery} {t.currency}</span>
              </div>
              <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-gray-800 text-[#C5A880]">
                <span>{t.total}</span>
                <span>{finalTotal} {t.currency}</span>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={placeOrderMutation.isPending}
              className="w-full mt-8 bg-[#C5A880] hover:bg-[#B59870] text-[#111] h-14 rounded-xl font-bold text-lg"
            >
              {placeOrderMutation.isPending ? t.loading : t.placeOrder}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
