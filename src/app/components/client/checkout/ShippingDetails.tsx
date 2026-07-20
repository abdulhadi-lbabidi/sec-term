import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

interface ShippingDetailsProps {
  form: UseFormReturn<any>;
}

export const ShippingDetails: React.FC<ShippingDetailsProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#1C1A17] mb-4 pb-2 border-b border-gray-100">
        {t('checkoutTitle')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="first_name" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('firstName')}</FormLabel>
            <FormControl><Input placeholder={t('firstName')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="last_name" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('lastName')}</FormLabel>
            <FormControl><Input placeholder={t('lastName')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('emailAddr')}</FormLabel>
            <FormControl><Input type="email" placeholder="example@mail.com" className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('phone')}</FormLabel>
            <FormControl><Input type="tel" placeholder="+962790000000" className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" dir="ltr" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="country" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('country')}</FormLabel>
            <FormControl><Input placeholder={t('country')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('city')}</FormLabel>
            <FormControl><Input placeholder={t('city')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="street" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('street')}</FormLabel>
            <FormControl><Input placeholder={t('street')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="floor" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('floor')}</FormLabel>
            <FormControl><Input placeholder={t('floor')} className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="postal_code" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('postalCode')}</FormLabel>
          <FormControl><Input placeholder="11181" className="h-12 md:h-14 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#C5A880]" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="additional_information" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('orderNotes')}</FormLabel>
          <FormControl><Textarea placeholder={t('orderNotesPlaceholder')} className="rounded-xl bg-gray-50 border-gray-200 min-h-[100px] md:min-h-[120px] focus-visible:ring-[#C5A880] resize-none" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};
