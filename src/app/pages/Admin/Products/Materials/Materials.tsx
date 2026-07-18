import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil, Calendar } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { AddMaterial } from './AddMaterial';
import { DeleteConfirmationModal } from '../../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../../components/Admin/GeneralPagination';
import {
  useMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  Material,
} from '../../../../api/Admin/materials';

export const Materials = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialIdToDelete, setMaterialIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, error } = useMaterialsQuery(page, perPage);
  const createMutation = useCreateMaterialMutation();
  const updateMutation = useUpdateMaterialMutation();
  const deleteMutation = useDeleteMaterialMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setHeaderAction(
      <Button
        onClick={() => {
          setSelectedMaterialId(null);
          setIsAddModalOpen(true);
        }}
        className="flex items-center gap-2"
        disabled={createMutation.isPending || updateMutation.isPending}
      >
        <Plus className="h-4 w-4" />
        {isRtl ? 'إضافة مكون' : 'Add Material'}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [isRtl, setHeaderAction, createMutation.isPending, updateMutation.isPending]);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedMaterialId(null);
  };

  const handleAddOrUpdateMaterial = (values: { materialAr: string; materialEn: string }) => {
    if (selectedMaterialId !== null) {
      updateMutation.mutate(
        { id: selectedMaterialId, materialAr: values.materialAr, materialEn: values.materialEn },
        {
          onSuccess: () => {
            handleCloseAddModal();
          },
        }
      );
    } else {
      createMutation.mutate(
        { materialAr: values.materialAr, materialEn: values.materialEn },
        {
          onSuccess: () => {
            handleCloseAddModal();
          },
        }
      );
    }
  };

  const handleDeleteClick = (id: number) => {
    setMaterialIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialIdToDelete !== null) {
      deleteMutation.mutate(materialIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setMaterialIdToDelete(null);
        },
      });
    }
  };

  const handleEditClick = (id: number) => {
    setSelectedMaterialId(id);
    setIsAddModalOpen(true);
  };

  const materialsList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between">
      <div className="w-full">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive bg-white rounded-2xl border border-black/10 p-6">
            <p className="font-semibold">{isRtl ? 'حدث خطأ أثناء تحميل المكونات' : 'Error loading materials'}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : materialsList.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-black/10 p-6 text-black/40">
            <p className="font-semibold">{isRtl ? 'لا توجد مكونات حالياً. قم بإضافة مكون جديد.' : 'No materials available. Please add one.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {materialsList.map((item: Material) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="text-lg font-black text-black leading-snug">{item.material}</span>
                </div>
                <div className="mt-4 border-t border-black/5 pt-4 flex items-center justify-between text-xs text-black/55">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{item.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(item.id)}
                      className="h-8 w-8 text-black/70 hover:bg-black/5 hover:text-black cursor-pointer"
                      disabled={updateMutation.isPending}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(item.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

      <AddMaterial
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddOrUpdateMaterial}
        isPending={createMutation.isPending || updateMutation.isPending}
        materialId={selectedMaterialId}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMaterialIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
