import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/app/components/ui/form';
import { ShippingDetails } from './ShippingDetails';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderSummary } from './OrderSummary';
import { useCreateCheckoutMutation } from '@/app/api/client/useCheckouts';
import { useCreateOrderMutation } from '@/app/api/client/useOrders';
import { useClearCartMutation } from '@/app/api/client/useCart';


const getCheckoutSchema = (t: any) => z.object({
  first_name: z.string().min(2, { message: t('requiredField') }),
  last_name: z.string().min(2, { message: t('requiredField') }),
  email: z.string().email({ message: t('invalidEmail') }),
  phone: z.string().min(8, { message: t('requiredField') }),
  country: z.string().min(2, { message: t('requiredField') }),
  city: z.string().min(2, { message: t('requiredField') }),
  street: z.string().min(2, { message: t('requiredField') }),
  floor: z.string().optional(),
  postal_code: z.string().optional(),
  additional_information: z.string().optional(),
  method: z.string(),
});

export interface CheckoutFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  floor?: string;
  postal_code?: string;
  additional_information?: string;
  method: string;
}

interface CheckoutFormProps {
  cart: any;
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, onSuccess }) => {
  const { mutateAsync: createCheckout, isPending: isCreatingCheckout } = useCreateCheckoutMutation();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrderMutation();
  const { mutate: clearCart } = useClearCartMutation();

  const [orderError, setOrderError] = useState<string | null>(null);

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const cartId = searchParams.get('id');
  const checkoutSchema = getCheckoutSchema(t);

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

  const isProcessing = isCreatingCheckout || isCreatingOrder;
  const items = Array.isArray(cart) ? cart : (cart?.items || []);
  const total = items.reduce((sum: number, item: any) => sum + ((item.variant?.final_price || item.variant?.price || 0) * item.quantity), 0);
  const deliveryFee = 0; // Standard delivery fee

  const onSubmit = async (data: CheckoutFormValues) => {
    setOrderError(null);

    try {
      // 1. Create Checkout
      const checkoutData = await createCheckout({
        cart_id: cartId ? Number(cartId) : undefined,
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

      clearCart();
      onSuccess();
    } catch (err: any) {
      setOrderError(err?.message || err?.response?.data?.message || t('checkoutError'));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3 bg-background p-6 md:p-10 rounded-3xl shadow-sm border border-border/60 relative overflow-hidden">
  
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10">
          {orderError && (
            <div className="mb-8 p-4 bg-red-950/50 text-red-400 border border-red-900/50 rounded-xl font-medium flex items-center gap-3">
              <span className="text-xl">⚠️</span> {orderError}
            </div>
          )}

          <Form {...form}>
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); }}>
              <ShippingDetails form={form} />
              <PaymentMethodSelector form={form} />
            </form>
          </Form>
        </div>
      </div>

      <div className="lg:w-1/3">
        <OrderSummary
          items={items}
          total={total}
          deliveryFee={deliveryFee}
          isProcessing={isProcessing}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
