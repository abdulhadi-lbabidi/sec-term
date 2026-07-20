import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { useMaterialQuery } from '../../../../api/Admin/materials';

interface AddMaterialProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { materialAr: string; materialEn: string }) => void;
  isPending: boolean;
  materialId: number | null;
}

interface FormValues {
  materialAr: string;
  materialEn: string;
}

export const AddMaterial = ({
  isOpen,
  onClose,
  onAdd,
  isPending,
  materialId,
}: AddMaterialProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { data: detailData, isLoading: isFetching } = useMaterialQuery(materialId);

  useEffect(() => {
    if (isOpen) {
      if (materialId && detailData) {
        reset({
          materialAr: detailData.data?.material?.ar || '',
          materialEn: detailData.data?.material?.en || '',
        });
      } else {
        reset({
          materialAr: '',
          materialEn: '',
        });
      }
    }
  }, [isOpen, materialId, detailData, reset]);

  const onSubmit = (data: FormValues) => {
    onAdd(data);
  };

  const handleClose = () => {
    reset({ materialAr: '', materialEn: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {materialId
              ? t('admin.edit_material')
              : t('admin.add_new_material')}
          </DialogTitle>
        </DialogHeader>

        {isFetching && materialId ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black/45" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="materialAr" className="text-sm font-semibold">
                {t('admin.material_ar')}
              </Label>
              <Input
                id="materialAr"
                placeholder={t('admin.material_ar_placeholder')}
                {...register('materialAr', {
                  required: t('admin.required_field'),
                })}
                className={errors.materialAr ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.materialAr && (
                <p className="text-xs font-medium text-destructive">{errors.materialAr.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialEn" className="text-sm font-semibold">
                {t('admin.material_en')}
              </Label>
              <Input
                id="materialEn"
                placeholder={t('admin.material_en_placeholder')}
                {...register('materialEn', {
                  required: t('admin.required_field'),
                })}
                className={errors.materialEn ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {errors.materialEn && (
                <p className="text-xs font-medium text-destructive">{errors.materialEn.message}</p>
              )}
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {materialId
                  ? t('admin.save_changes')
                  : t('admin.add_material')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
