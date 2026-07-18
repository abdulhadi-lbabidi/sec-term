import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Loader2 } from 'lucide-react';
import { usePackageQuery } from '../../../api/Admin/packages';

interface AddPackageProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  isPending?: boolean;
  packageData: { id: number; name: string; price: number } | null;
}

interface FormValues {
  nameAr: string;
  nameEn: string;
  price: number;
}

export const AddPackage = ({ isOpen, onClose, onAdd, isPending, packageData }: AddPackageProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { data: fullPackageData, isLoading: isFetchingPackage } = usePackageQuery(packageData?.id || null);

  useEffect(() => {
    if (isOpen) {
      if (packageData) {
        if (fullPackageData?.data) {
          reset({
            nameAr: fullPackageData.data.name?.ar || '',
            nameEn: fullPackageData.data.name?.en || '',
            price: fullPackageData.data.price,
          });
        } else {
          // Fallback while loading
          reset({
            nameAr: (packageData.name as any)?.ar || packageData.name || '',
            nameEn: (packageData.name as any)?.en || packageData.name || '',
            price: packageData.price,
          });
        }
      } else {
        reset({
          nameAr: '',
          nameEn: '',
          price: 0,
        });
      }
    }
  }, [isOpen, packageData, fullPackageData, reset]);

  const onSubmit = (data: FormValues) => {
    onAdd(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {packageData
              ? t('admin.edit_package')
              : t('admin.add_new_package')}
          </DialogTitle>
        </DialogHeader>

        {packageData && isFetchingPackage ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold">
              {t('admin.package_price')}
            </Label>
            <Input
              id="price"
              type="number"
              placeholder={t('admin.package_price_placeholder')}
              {...register('price', {
                required: t('admin.required_field'),
                min: { value: 0, message: t('admin.required_field') },
              })}
              className={errors.price ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.price && (
              <p className="text-xs font-medium text-destructive">{errors.price.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {packageData
                ? t('admin.save_changes')
                : t('admin.add_package')}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
