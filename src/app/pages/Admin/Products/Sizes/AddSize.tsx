import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

interface AddSizeProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (size: string) => void;
  isPending: boolean;
  sizeData: { id: number; size: string } | null;
}

interface FormValues {
  size: string;
}

export const AddSize = ({
  isOpen,
  onClose,
  onAdd,
  isPending,
  sizeData,
}: AddSizeProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      if (sizeData) {
        reset({ size: sizeData.size });
      } else {
        reset({ size: '' });
      }
    }
  }, [isOpen, sizeData, reset]);

  const onSubmit = (data: FormValues) => {
    onAdd(data.size);
  };

  const handleClose = () => {
    reset({ size: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {sizeData
              ? t('admin.edit_size')
              : t('admin.add_new_size')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-semibold">
              {t('admin.size_name')}
            </Label>
            <Input
              id="size"
              placeholder="e.g. 500g, 1 Kg, 20*20"
              {...register('size', {
                required: t('admin.required_field'),
              })}
              className={errors.size ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.size && (
              <p className="text-xs font-medium text-destructive">{errors.size.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {sizeData
                ? t('admin.save_changes')
                : t('admin.add_size')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
