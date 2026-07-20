import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Trash2, Loader2, Shield, Plus, Pencil } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { DeleteConfirmationModal } from '../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import { useRolesQuery, useDeleteRoleMutation, Role } from '../../../api/Admin/roles';

export const Roles = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, error } = useRolesQuery(page, perPage);
  const deleteMutation = useDeleteRoleMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setHeaderAction(
      <Button onClick={() => navigate('/admin/roles/add')} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('admin.add_role')}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [setHeaderAction, navigate, t]);

  const handleDeleteRole = (id: number) => {
    setRoleIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleIdToDelete !== null) {
      deleteMutation.mutate(roleIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setRoleIdToDelete(null);
        },
      });
    }
  };

  const rolesList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
            <p className="font-semibold">{t('admin.error_loading')}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : rolesList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-black/40">
            <Shield className="h-12 w-12" />
            <p className="text-sm font-medium">{t('admin.no_roles_found')}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRtl ? 'text-right' : 'text-left'}>ID</TableHead>
                    <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.name')}</TableHead>
                    <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.guard_name')}</TableHead>
                    <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.created_at')}</TableHead>
                    <TableHead className={isRtl ? 'text-right' : 'text-left'}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesList.map((role: Role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.guard_name}</TableCell>
                      <TableCell dir="ltr" className={isRtl ? 'text-right' : 'text-left'}>
                        {role.created_at}
                      </TableCell>
                      <TableCell className={isRtl ? 'text-left' : 'text-right'}>
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                            className="h-8 w-8 text-black/50 hover:bg-black/5 hover:text-black"
                            disabled={deleteMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                            className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="block md:hidden space-y-4">
              {rolesList.map((role: Role) => (
                <div key={role.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-black/45">ID: {role.id}</span>
                    <span className="text-xs text-black/35 dir-ltr">{role.created_at}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span>{role.name}</span>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-750 ring-1 ring-inset ring-purple-700/10 uppercase">
                        {role.guard_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                      className="h-8 gap-1 text-black/75 hover:bg-black/5 hover:text-black cursor-pointer text-xs"
                      disabled={deleteMutation.isPending}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t('admin.edit_role')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                      className="h-8 gap-1 text-destructive/85 hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t('admin.delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <GeneralPagination
        currentPage={data?.meta?.current_page || 1}
        lastPage={data?.meta?.last_page || 1}
        onPageChange={(p) => setPage(p)}
        isRtl={isRtl}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoleIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
