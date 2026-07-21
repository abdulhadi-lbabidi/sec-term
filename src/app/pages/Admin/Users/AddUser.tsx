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
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { Switch } from '../../../components/ui/switch';
import { useRolesQuery } from '../../../api/Admin/roles';
import { UserItem } from '../../../api/Admin/users';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrUpdate: (payload: any) => void;
  isPending: boolean;
  userData: UserItem | null;
}

export const AddUser = ({
  isOpen,
  onClose,
  onAddOrUpdate,
  isPending,
  userData,
}: AddUserProps) => {
  const { t } = useTranslation();
  const isEditMode = !!userData;

  const { data: rolesData, isLoading: isLoadingRoles } = useRolesQuery(1, 100);

  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
  });

  const selectedRoles = watch('roles') || [];
  const isActive = watch('is_active') ?? true;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && userData) {
        unregister('password');
        unregister('password_confirmation');
        reset({
          name: userData.name,
          email: userData.email,
          is_active: userData.is_active,
          roles: (userData.roles || []).map((r: any) => (typeof r === 'object' ? r.id : r)),
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          is_active: true,
          roles: [],
        });
      }
    }
  }, [isOpen, userData, isEditMode, reset, unregister]);

  const onSubmit = (data: any) => {
    if (isEditMode) {
      onAddOrUpdate({
        name: data.name,
        email: data.email,
        is_active: data.is_active,
        roles: data.roles,
      });
    } else {
      onAddOrUpdate({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        is_active: data.is_active,
        roles: data.roles,
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const roles = rolesData?.data || [];
  const watchPassword = watch('password');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? t('admin.edit_user') : t('admin.add_new_user')}
          </DialogTitle>
        </DialogHeader>

        {isLoadingRoles ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black/45" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">
                {t('admin.name')} *
              </Label>
              <Input
                id="name"
                placeholder={t('admin.name')}
                {...register('name', { required: t('admin.required_field') })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-[10px] font-medium text-destructive">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold">
                {t('admin.email')} *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                {...register('email', { required: t('admin.required_field') })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive">{errors.email.message as string}</p>
              )}
            </div>

            {!isEditMode && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    {t('admin.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password', { required: !isEditMode ? t('admin.password_required') : false })}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-[10px] font-medium text-destructive">{errors.password.message as string}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password_confirmation" className="text-xs font-semibold">
                    {t('admin.password_confirmation')}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    {...register('password_confirmation', {
                      required: !isEditMode ? t('admin.required_field') : false,
                      validate: (val) => {
                        if (isEditMode) return true;
                        return val === watchPassword || t('admin.passwords_dont_match');
                      },
                    })}
                    className={errors.password_confirmation ? 'border-destructive' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="text-[10px] font-medium text-destructive">
                      {errors.password_confirmation.message as string}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center justify-between py-2 border-b">
              <Label htmlFor="is_active" className="text-xs font-semibold cursor-pointer">
                {t('admin.status')}
              </Label>
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked, { shouldValidate: true, shouldDirty: true })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">{t('admin.roles')} *</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2.5">
                {roles.map((role) => {
                  const isSelected = selectedRoles.includes(role.id);
                  return (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="user-role"
                        value={role.id}
                        checked={isSelected}
                        onChange={() => {
                          setValue('roles', [Number(role.id)], { shouldValidate: true, shouldDirty: true });
                        }}
                        className="h-4 w-4 text-black border-black/20 focus:ring-black cursor-pointer accent-black"
                      />
                      <span className="text-[11px] font-medium capitalize text-black">
                        {role.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  t('admin.save_changes')
                ) : (
                  t('admin.add_user')
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
