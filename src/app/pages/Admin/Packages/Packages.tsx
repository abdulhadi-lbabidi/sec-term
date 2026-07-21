import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { AddPackage } from './AddPackage';
import { DeleteConfirmationModal } from '../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import {
  usePackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '../../../api/Admin/packages';
import { PackageItem } from '@/types/Admin/packages';

export const Packages = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { hasPermission } = useAuth();
  const canCreate = hasPermission('create_package');
  const canEdit = hasPermission('update_package');
  const canDelete = hasPermission('delete_package');

  const { data, isLoading, isError, error } = usePackagesQuery(page, perPage);
  const createMutation = useCreatePackageMutation();
  const updateMutation = useUpdatePackageMutation();
  const deleteMutation = useDeletePackageMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    if (canCreate) {
      setHeaderAction(
        <Button
          onClick={() => {
            setSelectedPackage(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          {t('admin.add_package')}
        </Button>
      );
    } else {
      setHeaderAction(null);
    }
    return () => setHeaderAction(null);
  }, [setHeaderAction, createMutation.isPending, updateMutation.isPending, t, canCreate]);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedPackage(null);
  };

  const handleAddOrEditPackage = (values: any) => {
    if (selectedPackage) {
      const formData = new FormData();
      formData.append('name[ar]', values.nameAr);
      formData.append('name[en]', values.nameEn);
      formData.append('price', String(values.price));
      formData.append('_method', 'PUT');

      updateMutation.mutate(
        {
          id: selectedPackage.id,
          formData,
        },
        {
          onSuccess: () => {
            handleCloseAddModal();
          },
        }
      );
    } else {
      const formData = new FormData();
      formData.append('name[ar]', values.nameAr);
      formData.append('name[en]', values.nameEn);
      formData.append('price', String(values.price));

      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseAddModal();
        },
      });
    }
  };

  const handleEditPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setIsAddModalOpen(true);
  };

  const handleDeletePackage = (id: number) => {
    setPackageIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (packageIdToDelete !== null) {
      deleteMutation.mutate(packageIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setPackageIdToDelete(null);
        },
      });
    }
  };

  const packagesList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between">
      <div className="rounded-2xl border border-black/10 bg-white p-6 pt-0 text-black">
        <div className="mt-6 overflow-hidden rounded-xl border border-black/5">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/45" />
            </div>
          ) : isError ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive">
              <p className="font-semibold">{t('admin.error_loading_packages')}</p>
              <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/5">
                    <TableRow>
                      <TableHead className="font-bold">{t('admin.name')}</TableHead>
                      <TableHead className="font-bold">{t('admin.price')}</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold">{t('admin.created_at')}</TableHead>
                      <TableHead className="w-[80px] text-center font-bold">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packagesList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-black/40">
                          {t('admin.no_packages')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      packagesList.map((pkg: PackageItem) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            {typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}
                          </TableCell>
                          <TableCell>{pkg.price}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-black/50">
                            {pkg.created_at}
                          </TableCell>
                          <TableCell className="text-center">
                             <div className="flex items-center justify-center gap-1">
                               {canEdit && (
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   onClick={() => handleEditPackage(pkg)}
                                   className="text-black/60 hover:bg-black/5 hover:text-black"
                                   disabled={deleteMutation.isPending}
                                 >
                                   <Pencil className="h-4 w-4" />
                                 </Button>
                               )}
                               {canDelete && (
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   onClick={() => handleDeletePackage(pkg.id)}
                                   className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                   disabled={deleteMutation.isPending}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               )}
                             </div>
                           </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="block md:hidden space-y-4 p-4 bg-black/[0.01]">
                {packagesList.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-black/40">
                    {t('admin.no_packages')}
                  </div>
                ) : (
                  packagesList.map((pkg: PackageItem) => (
                    <div key={pkg.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold text-black/45">ID: {pkg.id}</span>
                        <span className="text-xs text-black/35">{pkg.created_at}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span>{typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}</span>
                          <span className="text-sm font-semibold text-green-600">
                            {pkg.price} {t('admin.currency')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPackage(pkg)}
                          className="h-8 gap-1 text-black/75 hover:bg-black/5 hover:text-black cursor-pointer text-xs"
                          disabled={deleteMutation.isPending}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t('admin.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="h-8 gap-1 text-destructive/85 hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
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

      <AddPackage
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddOrEditPackage}
        isPending={createMutation.isPending || updateMutation.isPending}
        packageData={selectedPackage}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPackageIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
