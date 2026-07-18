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
  images: FileList;
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

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);
  const watchedImages = watch('images');

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
      if (prod.all_images) {
        setImagePreviews(prod.all_images);
      } else if (prod.images) {
        setImagePreviews([prod.images]);
      }
    }
  }, [productData, productId, reset]);

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const filesArray = Array.from(watchedImages);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => {
        const existing = prev.filter((url) => url.startsWith('http'));
        return [...existing, ...urls];
      });

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [watchedImages]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    if (productId) {
      formData.append('_method', 'PUT');
      deletedMediaIds.forEach((mediaId, index) => {
        formData.append(`deleted_media_ids[${index}]`, String(mediaId));
      });
    }

    formData.append('name[ar]', data.nameAr);
    formData.append('name[en]', data.nameEn);
    formData.append('body[ar]', data.bodyAr);
    formData.append('body[en]', data.bodyEn);
    formData.append('category_id', data.categoryId);
    formData.append('is_featured', data.isFeatured ? '1' : '0');

    if (data.images) {
      Array.from(data.images).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

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
             navigate('/admin/products');
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
      <div className="flex items-center gap-4 border-b border-black/5 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/products')}
          className="rounded-full hover:bg-black/5"
        >
          <ArrowLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
        </Button>
        <h1 className="text-xl font-bold">
          {productId ? t('admin.editProduct') : t('admin.addNewProduct')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
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
                    <SelectValue placeholder={isRtl ? 'اختر الفئة' : 'Select Category'} />
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
              {isRtl ? 'منتج مميز (يظهر في الواجهة)' : 'Featured Product (Shows on homepage)'}
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t('admin.images')}</Label>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="hidden"
              {...register('images', {
                required: productId ? false : (t('admin.required_image') || 'Required image'),
              })}
            />
            <Label htmlFor="images" className="flex cursor-pointer flex-col items-center justify-center gap-2">
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-600">{t('admin.click_to_upload')}</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</span>
            </Label>
          </div>
          {errors.images && (
            <p className="text-xs font-medium text-destructive">{errors.images.message}</p>
          )}

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {imagePreviews.map((url, index) => (
                <div key={index} className="group relative aspect-square rounded-md border overflow-hidden">
                  <img src={url} alt="preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const urlToDelete = imagePreviews[index];
                      if (urlToDelete.startsWith('http')) {
                        setDeletedMediaIds((prev) => [...prev, index + 1]);
                      }
                      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
              t('save')
            ) : (
              t('add')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
