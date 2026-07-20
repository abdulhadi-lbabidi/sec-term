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
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { data: categoryData } = useCategoryQuery(categoryId || null);

  const [imagePreviews, setImagePreviews] = useState<{ url: string; file?: File }[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const watchedImages = watch('image');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreviews([]);
      setDeletedMediaIds([]);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!categoryId) {
      reset({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
      });
      setImagePreviews([]);
      setDeletedMediaIds([]);
    } else if (categoryData?.data) {
      const cat = categoryData.data;
      reset({
        nameAr: cat.name?.ar || '',
        nameEn: cat.name?.en || '',
        descriptionAr: cat.description?.ar || '',
        descriptionEn: cat.description?.en || '',
      });
      if (cat.all_images) {
        setImagePreviews(cat.all_images.map((img: any) => ({ url: typeof img === 'object' ? img.url : img })));
      } else if (cat.image) {
        setImagePreviews([{ url: cat.image }]);
      }
      setDeletedMediaIds([]);
    }
  }, [categoryData, categoryId, reset]);

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const filesArray = Array.from(watchedImages);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => {
        const newPreviews = filesArray.map((file, i) => ({
          url: urls[i],
          file,
        }));
        const filteredPrev = prev.filter(
          (existingItem) =>
            !filesArray.some((newFile) => newFile.name === (existingItem.file?.name || existingItem.url.split('/').pop()))
        );
        return [...filteredPrev, ...newPreviews];
      });

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [watchedImages]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    if (categoryId !== null && categoryId !== undefined) {
      formData.append('_method', 'PUT');
    }
    formData.append('name[ar]', data.nameAr);
    formData.append('name[en]', data.nameEn);
    formData.append('description[ar]', data.descriptionAr);
    formData.append('description[en]', data.descriptionEn);

    const filesToUpload = imagePreviews
      .map((item) => item.file)
      .filter((file): file is File => !!file);

    filesToUpload.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    if (deletedMediaIds.length > 0) {
      deletedMediaIds.forEach((id, index) => {
        formData.append(`deleted_media_ids[${index}]`, id);
      });
    }

    onAdd(formData);
  };

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    setDeletedMediaIds([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full h-full max-h-screen max-w-none rounded-none p-4 md:max-w-4xl md:h-auto md:max-h-[90vh] md:rounded-2xl md:p-6 bg-white text-black flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 border-b border-black/5 pb-3">
          <DialogTitle className="text-xl font-bold">
            {categoryId
              ? t('admin.edit_category')
              : t('admin.add_new_category')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden mt-4">
          {/* Scrollable inputs wrapper */}
          <div className="space-y-5 overflow-y-auto flex-1 pr-1 py-1">
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
                  {imagePreviews.map((item, index) => (
                    <div key={index} className="group relative aspect-square rounded-md border overflow-hidden">
                      <img src={item.url} alt="preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const itemToRemove = imagePreviews[index];
                          if (itemToRemove) {
                            const originalImages = (categoryData?.data?.all_images || [])
                              .map((img: any) => typeof img === 'object' ? img.url : img);
                            const getFilename = (url: string) => url.split('/').pop() || url;
                            let originalIndex = originalImages.findIndex(
                              (imgUrl: string) => getFilename(imgUrl) === getFilename(itemToRemove.url)
                            );
                            if (originalIndex === -1 && !itemToRemove.url.startsWith('blob:')) {
                              originalIndex = index;
                            }
                            if (originalIndex !== -1) {
                              setDeletedMediaIds((prev) => [...prev, String(originalIndex + 1)]);
                            }
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
          </div>

          <DialogFooter className="mt-4 flex flex-row justify-end gap-3 shrink-0 border-t border-black/5 pt-3">
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
