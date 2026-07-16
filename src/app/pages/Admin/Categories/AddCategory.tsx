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

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  isPending?: boolean;
}

interface FormValues {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  images: FileList;
}

export const AddCategory = ({ isOpen, onClose, onAdd, isPending }: AddCategoryProps) => {
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

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const watchedImages = watch('images');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreviews([]);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const filesArray = Array.from(watchedImages);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [watchedImages]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('name[ar]', data.nameAr);
    formData.append('name[en]', data.nameEn);
    formData.append('description[ar]', data.descriptionAr);
    formData.append('description[en]', data.descriptionEn);

    if (data.images) {
      Array.from(data.images).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
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
            {isRtl ? 'إضافة فئة جديدة' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name AR */}
            <div className="space-y-2">
              <Label htmlFor="nameAr" className="text-sm font-semibold">
                {isRtl ? 'الاسم (بالعربية) *' : 'Name (Arabic) *'}
              </Label>
              <Input
                id="nameAr"
                placeholder={isRtl ? 'مثال: ملاعب' : 'e.g. ملاعب'}
                {...register('nameAr', {
                  required: isRtl ? 'هذا الحقل مطلوب' : 'This field is required',
                })}
                className={errors.nameAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.nameAr && (
                <p className="text-xs font-medium text-destructive">{errors.nameAr.message}</p>
              )}
            </div>

            {/* Name EN */}
            <div className="space-y-2">
              <Label htmlFor="nameEn" className="text-sm font-semibold">
                {isRtl ? 'الاسم (بالإنجليزية) *' : 'Name (English) *'}
              </Label>
              <Input
                id="nameEn"
                placeholder={isRtl ? 'مثال: court' : 'e.g. court'}
                {...register('nameEn', {
                  required: isRtl ? 'هذا الحقل مطلوب' : 'This field is required',
                })}
                className={errors.nameEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.nameEn && (
                <p className="text-xs font-medium text-destructive">{errors.nameEn.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Description AR */}
            <div className="space-y-2">
              <Label htmlFor="descriptionAr" className="text-sm font-semibold">
                {isRtl ? 'الوصف (بالعربية) *' : 'Description (Arabic) *'}
              </Label>
              <Textarea
                id="descriptionAr"
                placeholder={isRtl ? 'هذا وصف الملعب...' : 'This is court description...'}
                {...register('descriptionAr', {
                  required: isRtl ? 'هذا الحقل مطلوب' : 'This field is required',
                })}
                className={errors.descriptionAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.descriptionAr && (
                <p className="text-xs font-medium text-destructive">{errors.descriptionAr.message}</p>
              )}
            </div>

            {/* Description EN */}
            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className="text-sm font-semibold">
                {isRtl ? 'الوصف (بالإنجليزية) *' : 'Description (English) *'}
              </Label>
              <Textarea
                id="descriptionEn"
                placeholder={isRtl ? 'this is court...' : 'this is court...'}
                {...register('descriptionEn', {
                  required: isRtl ? 'هذا الحقل مطلوب' : 'This field is required',
                })}
                className={errors.descriptionEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.descriptionEn && (
                <p className="text-xs font-medium text-destructive">{errors.descriptionEn.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {isRtl ? 'الصور *' : 'Images *'}
            </Label>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                className="hidden"
                {...register('images', {
                  required: isRtl ? 'يجب تحميل صورة واحدة على الأقل' : 'Please upload at least one image',
                })}
              />
              <Label htmlFor="images" className="flex cursor-pointer flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-gray-100 p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {isRtl ? 'اضغط هنا لرفع الصور' : 'Click here to upload images'}
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, JPEG (Max 5MB)
                </span>
              </Label>
            </div>
            {errors.images && (
              <p className="text-xs font-medium text-destructive">{errors.images.message}</p>
            )}

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="group relative aspect-square rounded-md border overflow-hidden">
                    <img src={url} alt="preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        // Clear selected files when individual delete is clicked (simplification)
                        setValue('images', null as any);
                        setImagePreviews([]);
                      }}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
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
              {isRtl ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isRtl ? 'إضافة الفئة' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
