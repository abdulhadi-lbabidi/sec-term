import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil, Calendar } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/button';
import { AddSize } from './AddSize';
import { DeleteConfirmationModal } from '../../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../../components/Admin/GeneralPagination';
import {
  useSizesQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
  Size,
} from '../../../../api/Admin/sizes';

export const Sizes = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sizeIdToDelete, setSizeIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { hasPermission } = useAuth();
  const canCreate = hasPermission('create_size');
  const canEdit = hasPermission('update_size');
  const canDelete = hasPermission('delete_size');

  const { data, isLoading, isError, error } = useSizesQuery(page, perPage);
  const createMutation = useCreateSizeMutation();
  const updateMutation = useUpdateSizeMutation();
  const deleteMutation = useDeleteSizeMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    if (canCreate) {
      setHeaderAction(
        <Button
          onClick={() => {
            setSelectedSize(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          {t('admin.add_size')}
        </Button>
      );
    } else {
      setHeaderAction(null);
    }
    return () => setHeaderAction(null);
  }, [isRtl, setHeaderAction, createMutation.isPending, updateMutation.isPending, t, canCreate]);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedSize(null);
  };

  const handleAddOrUpdateSize = (sizeName: string) => {
    if (selectedSize) {
      updateMutation.mutate(
        { id: selectedSize.id, size: sizeName },
        {
          onSuccess: () => {
            handleCloseAddModal();
          },
        }
      );
    } else {
      createMutation.mutate(sizeName, {
        onSuccess: () => {
          handleCloseAddModal();
        },
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setSizeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sizeIdToDelete !== null) {
      deleteMutation.mutate(sizeIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSizeIdToDelete(null);
        },
      });
    }
  };

  const handleEditClick = (sizeItem: Size) => {
    setSelectedSize(sizeItem);
    setIsAddModalOpen(true);
  };

  const sizesList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between">
      <div className="w-full">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive bg-white rounded-2xl border border-black/10 p-6">
            <p className="font-semibold">{t('admin.error_loading_sizes')}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : sizesList.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-black/10 p-6 text-black/40">
            <p className="font-semibold">{t('admin.no_sizes_available')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sizesList.map((item: Size) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-2xl font-black text-black">{item.size}</span>
                </div>
                <div className="mt-4 border-t border-black/5 pt-4 flex items-center justify-between text-xs text-black/55">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{item.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(item)}
                        className="h-8 w-8 text-black/70 hover:bg-black/5 hover:text-black cursor-pointer"
                        disabled={updateMutation.isPending}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(item.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      <AddSize
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddOrUpdateSize}
        isPending={createMutation.isPending || updateMutation.isPending}
        sizeData={selectedSize}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSizeIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
