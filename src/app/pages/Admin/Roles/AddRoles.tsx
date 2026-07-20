import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  usePermissionsQuery,
  useCreateRoleMutation,
  useRoleQuery,
  useUpdateRoleMutation,
  Permission,
} from '../../../api/Admin/roles';

interface FormValues {
  name: string;
  permissions: number[];
}

export const AddRoles = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId?: string }>();
  const isEditMode = !!roleId;

  const { data: permissionsData, isLoading: isLoadingPerms } = usePermissionsQuery();
  const { data: roleData, isLoading: isLoadingRole } = useRoleQuery(roleId ? Number(roleId) : null);
  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions') || [];

  useEffect(() => {
    if (isEditMode && roleData?.data) {
      const r = roleData.data;
      setValue('name', r.name);
      setValue(
        'permissions',
        r.permissions.map((p) => p.id),
        { shouldValidate: true }
      );
    }
  }, [isEditMode, roleData, setValue]);

  const handleSelectAll = (perms: Permission[]) => {
    setValue(
      'permissions',
      perms.map((p) => p.id),
      { shouldValidate: true }
    );
  };

  const handleDeselectAll = () => {
    setValue('permissions', [], { shouldValidate: true });
  };

  const onSubmit = (data: FormValues) => {
    if (isEditMode && roleId) {
      updateRoleMutation.mutate(
        {
          id: Number(roleId),
          name: data.name,
          permissions: data.permissions,
        },
        {
          onSuccess: () => {
            navigate('/admin/roles');
          },
        }
      );
    } else {
      createRoleMutation.mutate(
        {
          name: data.name,
          permissions: data.permissions,
        },
        {
          onSuccess: () => {
            navigate('/admin/roles');
          },
        }
      );
    }
  };

  const permissions = permissionsData?.data || [];

  const groupPermissions = () => {
    const groups: { [key: string]: Permission[] } = {};
    permissions.forEach((perm) => {
      const parts = perm.name.split('_');
      const groupName = parts.length > 1 ? parts.slice(1).join(' ') : 'general';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(perm);
    });
    return groups;
  };

  const grouped = groupPermissions();

  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending;

  if (isLoadingPerms || (isEditMode && isLoadingRole)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            {t('admin.role_name')}
          </Label>
          <Input
            id="name"
            placeholder={t('admin.role_name_placeholder')}
            {...register('name', { required: t('admin.required_field') })}
            className={errors.name ? 'border-destructive focus-visible:ring-destructive/20' : ''}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <Label className="text-base font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-black/60" />
              {t('admin.permissions')}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(permissions)}
                className="text-xs"
              >
                {t('admin.select_all')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="text-xs"
              >
                {t('admin.deselect_all')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(grouped).map((groupName) => {
              const groupPerms = grouped[groupName];
              const capitalizedGroup = groupName.replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <div key={groupName} className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 space-y-3">
                  <div className="border-b pb-1.5 flex items-center justify-between">
                    <h3 className="text-sm font-black text-black/75">
                      {capitalizedGroup}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = groupPerms.every((p) => selectedPermissions.includes(p.id));
                        if (allSelected) {
                          setValue(
                            'permissions',
                            selectedPermissions.filter((id) => !groupPerms.some((p) => p.id === id)),
                            { shouldValidate: true }
                          );
                        } else {
                          const union = Array.from(new Set([...selectedPermissions, ...groupPerms.map((p) => p.id)]));
                          setValue('permissions', union, { shouldValidate: true });
                        }
                      }}
                      className="text-[10px] font-bold text-black/40 hover:text-black hover:underline cursor-pointer"
                    >
                      {groupPerms.every((p) => selectedPermissions.includes(p.id)) ? t('admin.deselect_all') : t('admin.select_all')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {groupPerms.map((perm) => {
                      const isChecked = selectedPermissions.includes(perm.id);
                      return (
                        <div key={perm.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`perm-${perm.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue('permissions', [...selectedPermissions, perm.id], { shouldValidate: true });
                              } else {
                                setValue(
                                  'permissions',
                                  selectedPermissions.filter((id) => id !== perm.id),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`perm-${perm.id}`}
                            className="text-xs text-black/70 cursor-pointer font-medium select-none capitalize"
                          >
                            {isRtl ? perm.display_name : perm.name.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            disabled={isPending}
          >
            {t('admin.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              t('admin.save_changes')
            ) : (
              t('admin.add_role')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
