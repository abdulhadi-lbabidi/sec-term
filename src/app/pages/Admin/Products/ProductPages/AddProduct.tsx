import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Upload, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { useCategoriesQuery } from '../../../../api/Admin/categories';
import {
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../../../../api/Admin/products';

interface FormValues {
  nameAr: string;
  nameEn: string;
  bodyAr: string;
  bodyEn: string;
  categoryId: string;
  isFeatured: boolean;
}

export const AddProduct = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : null;

  const { data: categoriesData } = useCategoriesQuery(1, 100);
  const { data: productData, isLoading: isLoadingProduct } = useProductQuery(productId);
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (productData?.data && productId) {
      const prod = productData.data;
      reset({
        nameAr: prod.name?.ar || '',
        nameEn: prod.name?.en || '',
        bodyAr: prod.body?.ar || '',
        bodyEn: prod.body?.en || '',
        categoryId: String(prod.category?.id || ''),
        isFeatured: prod.is_featured,
      });
    }
  }, [productData, productId, reset]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    if (productId) {
      formData.append('_method', 'PUT');
    }

    formData.append('name[ar]', data.nameAr);
    formData.append('name[en]', data.nameEn);
    formData.append('body[ar]', data.bodyAr);
    formData.append('body[en]', data.bodyEn);
    formData.append('category_id', data.categoryId);
    formData.append('is_featured', data.isFeatured ? '1' : '0');



    if (productId) {
      updateMutation.mutate(
        { id: productId, formData },
        {
          onSuccess: () => {
             navigate('/admin/products');
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (res) => {
          const newProductId = res?.data?.id || res?.id;
          if (newProductId) {
             navigate(`/admin/products/add-variant/${newProductId}`);
          } else {
            navigate('/admin/products');
          }
        },
      });
    }
  };

  const categories = categoriesData?.data || [];
  const isPending = createMutation.isPending || updateMutation.isPending;

  if (productId && isLoadingProduct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nameAr" className="text-sm font-semibold">
              {t('admin.productNameAr')}
            </Label>
            <Input
              id="nameAr"
              placeholder={t('admin.productNameAr')}
              {...register('nameAr', { required: t('admin.required_field') })}
              className={errors.nameAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.nameAr && (
              <p className="text-xs font-medium text-destructive">{errors.nameAr.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEn" className="text-sm font-semibold">
              {t('admin.productNameEn')}
            </Label>
            <Input
              id="nameEn"
              placeholder={t('admin.productNameEn')}
              {...register('nameEn', { required: t('admin.required_field') })}
              className={errors.nameEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.nameEn && (
              <p className="text-xs font-medium text-destructive">{errors.nameEn.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bodyAr" className="text-sm font-semibold">
              {t('admin.descAr')}
            </Label>
            <Textarea
              id="bodyAr"
              placeholder={t('admin.descAr')}
              {...register('bodyAr', { required: t('admin.required_field') })}
              className={errors.bodyAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              rows={4}
            />
            {errors.bodyAr && (
              <p className="text-xs font-medium text-destructive">{errors.bodyAr.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyEn" className="text-sm font-semibold">
              {t('admin.descEn')}
            </Label>
            <Textarea
              id="bodyEn"
              placeholder={t('admin.descEn')}
              {...register('bodyEn', { required: t('admin.required_field') })}
              className={errors.bodyEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              rows={4}
            />
            {errors.bodyEn && (
              <p className="text-xs font-medium text-destructive">{errors.bodyEn.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t('admin.category')}</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: t('admin.required_field') }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.categoryId ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                  >
                    <SelectValue placeholder={t('admin.select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {typeof cat.name === 'object' ? (isRtl ? cat.name?.ar : cat.name?.en) : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-xs font-medium text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              id="isFeatured"
              {...register('isFeatured')}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <Label htmlFor="isFeatured" className="text-sm font-semibold cursor-pointer">
              {t('admin.featured_product')}
            </Label>
          </div>
        </div>



        <div className="flex justify-end gap-3 border-t border-black/5 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={isPending}
          >
            {t('admin.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : productId ? (
              t('admin.save_changes')
            ) : (
              t('admin.add')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
