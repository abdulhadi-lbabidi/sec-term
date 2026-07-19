import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react';
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

  const { data, isLoading, isError, error } = usePackagesQuery(page, perPage);
  const createMutation = useCreatePackageMutation();
  const updateMutation = useUpdatePackageMutation();
  const deleteMutation = useDeletePackageMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
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
    return () => setHeaderAction(null);
  }, [setHeaderAction, createMutation.isPending, updateMutation.isPending, t]);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedPackage(null);
  };

  const handleAddOrEditPackage = (values: any) => {
    if (selectedPackage) {
      updateMutation.mutate(
        {
          id: selectedPackage.id,
          data: {
            'name[ar]': values.nameAr,
            'name[en]': values.nameEn,
            price: Number(values.price),
          },
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPackage(pkg)}
                            className="text-black/60 hover:bg-black/5 hover:text-black"
                            disabled={deleteMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
