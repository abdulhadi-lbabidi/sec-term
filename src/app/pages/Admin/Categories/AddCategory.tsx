import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X, Upload } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../../components/ui/dialog';
import { useCategoryQuery } from '../../../api/Admin/categories';

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  isPending?: boolean;
  categoryId?: number | null;
}

interface FormValues {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: FileList;
}

export const AddCategory = ({ isOpen, onClose, onAdd, isPending, categoryId }: AddCategoryProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { data: categoryData } = useCategoryQuery(categoryId || null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const watchedImages = watch('image');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreviews([]);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (categoryData?.data && categoryId) {
      const cat = categoryData.data;
      reset({
        nameAr: cat.name?.ar || '',
        nameEn: cat.name?.en || '',
        descriptionAr: cat.description?.ar || '',
        descriptionEn: cat.description?.en || '',
      });
      if (cat.all_images) {
        setImagePreviews(cat.all_images);
      } else if (cat.image) {
        setImagePreviews([cat.image]);
      }
    }
  }, [categoryData, categoryId, reset]);

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const filesArray = Array.from(watchedImages);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => {
        const existing = prev.filter(url => url.startsWith('http'));
        return [...existing, ...urls];
      });

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [watchedImages]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    if (categoryId) {
      formData.append('_method', 'PUT');
    }
    formData.append('name[ar]', data.nameAr);
    formData.append('name[en]', data.nameEn);
    formData.append('description[ar]', data.descriptionAr);
    formData.append('description[en]', data.descriptionEn);

    if (data.image) {
      Array.from(data.image).forEach((file, index) => {
        formData.append(`image[${index}]`, file);
      });
    }

    onAdd(formData);
  };

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {categoryId
              ? t('admin.edit_category')
              : t('admin.add_new_category')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="nameAr" className="text-sm font-semibold">
                {t('admin.name_ar')}
              </Label>
              <Input
                id="nameAr"
                placeholder={t('admin.name_ar_placeholder')}
                {...register('nameAr', {
                  required: t('admin.required_field'),
                })}
                className={errors.nameAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.nameAr && (
                <p className="text-xs font-medium text-destructive">{errors.nameAr.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="nameEn" className="text-sm font-semibold">
                {t('admin.name_en')}
              </Label>
              <Input
                id="nameEn"
                placeholder={t('admin.name_en_placeholder')}
                {...register('nameEn', {
                  required: t('admin.required_field'),
                })}
                className={errors.nameEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.nameEn && (
                <p className="text-xs font-medium text-destructive">{errors.nameEn.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="descriptionAr" className="text-sm font-semibold">
                {t('admin.description_ar')}
              </Label>
              <Textarea
                id="descriptionAr"
                placeholder={t('admin.description_ar_placeholder')}
                {...register('descriptionAr', {
                  required: t('admin.required_field'),
                })}
                className={errors.descriptionAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.descriptionAr && (
                <p className="text-xs font-medium text-destructive">{errors.descriptionAr.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className="text-sm font-semibold">
                {t('admin.description_en')}
              </Label>
              <Textarea
                id="descriptionEn"
                placeholder={t('admin.description_en_placeholder')}
                {...register('descriptionEn', {
                  required: t('admin.required_field'),
                })}
                className={errors.descriptionEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.descriptionEn && (
                <p className="text-xs font-medium text-destructive">{errors.descriptionEn.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t('admin.images')}
            </Label>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400">
              <input
                type="file"
                id="image"
                multiple
                accept="image/*"
                className="hidden"
                {...register('image', {
                  required: categoryId ? false : t('admin.required_image'),
                })}
              />
              <Label htmlFor="image" className="flex cursor-pointer flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-gray-100 p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {t('admin.click_to_upload')}
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, JPEG (Max 5MB)
                </span>
              </Label>
            </div>
            {errors.image && (
              <p className="text-xs font-medium text-destructive">{errors.image.message}</p>
            )}


            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="group relative aspect-square rounded-md border overflow-hidden">
                    <img src={url} alt="preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
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

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {categoryId
                ? t('admin.save_changes')
                : t('admin.add_category')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
