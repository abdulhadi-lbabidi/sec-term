import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useCreateCheckoutMutation } from '../../api/client/useCheckouts';
import { useCreateOrderMutation } from '../../api/client/useOrders';
import { useCartQuery, useClearCartMutation } from '../../api/client/useCart';
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const checkoutSchema = z.object({
  first_name: z.string().min(2, { message: 'Required' }),
  last_name: z.string().min(2, { message: 'Required' }),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(8, { message: 'Required' }),
  country: z.string().min(2, { message: 'Required' }),
  city: z.string().min(2, { message: 'Required' }),
  street: z.string().min(2, { message: 'Required' }),
  floor: z.string().optional(),
  postal_code: z.string().optional(),
  additional_information: z.string().optional(),
  method: z.string().default('cod'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const navigate = useNavigate();

  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutateAsync: createCheckout, isPending: isCreatingCheckout } = useCreateCheckoutMutation();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrderMutation();
  const { mutate: clearCart } = useClearCartMutation();

  const [success, setSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      street: '',
      floor: '',
      postal_code: '',
      additional_information: '',
      method: 'cod',
    },
  });

  const items = cart?.items || [];
  const total = cart?.total_price || 0;
  const delivery = 15; // Mock delivery fee
  const finalTotal = total + delivery;

  const onSubmit = async (data: CheckoutFormValues) => {
    setOrderError(null);
    if (!cart?.id) return;

    try {
      // 1. Create Checkout
      const checkoutData = await createCheckout({
        cart_id: cart.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        street: data.street,
        floor: data.floor,
        postal_code: data.postal_code,
        additional_information: data.additional_information,
      } as any);

      const checkoutId = checkoutData?.id;

      if (!checkoutId) {
        throw new Error('Failed to create checkout record');
      }

      // 2. Place Order
      await createOrder({
        checkout_id: checkoutId,
        payment_method: data.method,
      } as any);

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setOrderError(err?.response?.data?.message || 'An error occurred while placing the order.');
    }
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

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C5A880]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h2 className="text-3xl font-black mb-4">{t.emptyCartTitle}</h2>
        <Button onClick={() => navigate('/shop')} className="bg-[#111111] text-white mt-4 hover:bg-[#C5A880]">{t.shopNow}</Button>
      </div>
    );
  }

  const isProcessing = isCreatingCheckout || isCreatingOrder;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">{t.checkoutTitle || 'Checkout'}</h1>
      
      {orderError && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl">
          {orderError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-[#EAE5DF]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="first_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.firstName || 'First Name'}</FormLabel>
                    <FormControl><Input placeholder="John" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.lastName || 'Last Name'}</FormLabel>
                    <FormControl><Input placeholder="Doe" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.email || 'Email'}</FormLabel>
                    <FormControl><Input type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.phone || 'Phone'}</FormLabel>
                    <FormControl><Input type="tel" placeholder="+123456789" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.country || 'Country'}</FormLabel>
                    <FormControl><Input placeholder="Country" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.city || 'City'}</FormLabel>
                    <FormControl><Input placeholder="City" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.street || 'Street / Address'}</FormLabel>
                    <FormControl><Input placeholder="Main St 123" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="floor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.floor || 'Floor/Apt (Optional)'}</FormLabel>
                    <FormControl><Input placeholder="Apt 4B" className="h-12 rounded-xl bg-gray-50 border-gray-200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="additional_information" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.additionalInfo || 'Order Notes'}</FormLabel>
                  <FormControl><Textarea placeholder="Special instructions for delivery..." className="rounded-xl bg-gray-50 border-gray-200 min-h-[100px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.paymentMethod || 'Payment Method'}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${form.watch('method') === 'cod' ? 'border-[#C5A880] bg-[#FCFAF7]' : 'border-gray-200'}`}>
                    <input type="radio" value="cod" {...form.register('method')} className="accent-[#C5A880]" />
                    <span className="font-bold">{t.cashOnDelivery || 'Cash on Delivery'}</span>
                  </label>
                  {/* Additional payment methods can be added here */}
                </div>
              </div>

            </form>
          </Form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-[#1C1A17] text-white p-8 rounded-3xl sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-[#C5A880]">{t.cartSummary || 'Order Summary'}</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => {
                const productName = item.variant?.product?.name || '';
                const variantLabel = item.variant?.size?.name || item.variant?.material?.name || '';
                const displayName = variantLabel ? `${productName} (${variantLabel})` : productName;
                return (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                    <span className="flex-1 pr-4 line-clamp-2">{displayName} x {item.quantity}</span>
                    <span className="font-bold whitespace-nowrap">{item.price * item.quantity} {t.currency}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-gray-400">
                <span>{t.subtotal || 'Subtotal'}</span>
                <span>{total} {t.currency}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t.deliveryFee || 'Delivery'}</span>
                <span>{delivery} {t.currency}</span>
              </div>
              <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-gray-800 text-[#C5A880]">
                <span>{t.total || 'Total'}</span>
                <span>{finalTotal} {t.currency}</span>
              </div>
            </div>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isProcessing}
              className="w-full mt-8 bg-[#C5A880] hover:bg-[#B59870] text-[#111] h-14 rounded-xl font-bold text-lg"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isProcessing ? (t.loading || 'Processing...') : (t.placeOrder || 'Place Order')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
