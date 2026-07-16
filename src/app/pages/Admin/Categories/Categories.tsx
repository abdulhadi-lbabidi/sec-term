import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { Dialog, DialogContent } from '../../../components/ui/dialog';
import { AddCategory } from './AddCategory';
import { DeleteConfirmationModal } from '../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  Category,
} from '../../../api/Admin/categories';

export const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPageLimit] = useState(10);

  const [activePreviewImages, setActivePreviewImages] = useState<string[] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handlePreviewImage = (images: string[] | string) => {
    const urls = Array.isArray(images) ? images : [images];
    setActivePreviewImages(urls);
    setActiveImageIndex(0);
  };

  const { data, isLoading, isError, error } = useCategoriesQuery(page, perPage);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setHeaderAction(
      <Button
        onClick={() => {
          setSelectedCategoryId(null);
          setIsAddModalOpen(true);
        }}
        className="flex items-center gap-2"
        disabled={createMutation.isPending || updateMutation.isPending}
      >
        <Plus className="h-4 w-4" />
        {t('admin.add_category')}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [isRtl, setHeaderAction, createMutation.isPending, updateMutation.isPending, t]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePreviewImages || activePreviewImages.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev < activePreviewImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activePreviewImages.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePreviewImages]);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedCategoryId(null);
  };

  const handleAddCategory = (formData: FormData) => {
    if (selectedCategoryId !== null) {
      updateMutation.mutate({ id: selectedCategoryId, formData }, {
        onSuccess: () => {
          handleCloseAddModal();
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseAddModal();
        },
      });
    }
  };

  const handleEditCategory = (id: number) => {
    setSelectedCategoryId(id);
    setIsAddModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryIdToDelete !== null) {
      deleteMutation.mutate(categoryIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setCategoryIdToDelete(null);
        },
      });
    }
  };

  const categoriesList = data?.data || [];

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
            <p className="font-semibold">{t('admin.error_loading')}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-black/5">
              <TableRow>
                <TableHead className="w-[100px] text-center font-bold">
                  {t('admin.image')}
                </TableHead>
                <TableHead className="font-bold">
                  {t('admin.name')}
                </TableHead>
                <TableHead className="hidden md:table-cell font-bold">
                  {t('admin.description')}
                </TableHead>
                <TableHead className="hidden sm:table-cell font-bold">
                  {t('admin.created_at')}
                </TableHead>
                <TableHead className="w-[80px] text-center font-bold">
                  {t('admin.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-black/40">
                    {t('admin.no_categories')}
                  </TableCell>
                </TableRow>
              ) : (
                categoriesList.map((category: Category) => {
                  // Get first image from all_images or fallback
                  const imgUrl = category.all_images?.[0] || category.images || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop';
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="flex justify-center items-center">
                        <img
                          src={imgUrl}
                          alt={category.name}
                          onClick={() => handlePreviewImage(category.all_images && category.all_images.length > 0 ? category.all_images : [imgUrl])}
                          className="h-12 w-12 rounded-lg object-cover border border-black/5 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-black/70 max-w-[300px] truncate">
                        {category.description}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-black/50">
                        {category.created_at}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCategory(category.id)}
                            className="text-black/60 hover:bg-black/5 hover:text-black"
                            disabled={deleteMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
      />

      <AddCategory
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddCategory}
        isPending={createMutation.isPending || updateMutation.isPending}
        categoryId={selectedCategoryId}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />

      {activePreviewImages && (
        <Dialog open={true} onOpenChange={() => setActivePreviewImages(null)}>
          <DialogContent className="max-w-3xl bg-black/95 p-6 text-white border-0 flex flex-col items-center justify-center relative shadow-2xl">
            <button
              onClick={() => setActivePreviewImages(null)}
              className="absolute top-4 right-4 text-white/75 hover:text-white hover:bg-white/10 p-2 rounded-full cursor-pointer z-50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative flex items-center justify-center w-full max-h-[70vh] aspect-video mt-4 select-none">
              {activePreviewImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activePreviewImages.length - 1))}
                  className="absolute left-2 z-50 bg-black/40 hover:bg-black/60 p-3 rounded-full cursor-pointer transition-colors text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                src={activePreviewImages[activeImageIndex]}
                alt="category preview"
                className="max-h-[70vh] max-w-full object-contain rounded-lg select-none"
              />

              {activePreviewImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < activePreviewImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 z-50 bg-black/40 hover:bg-black/60 p-3 rounded-full cursor-pointer transition-colors text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {activePreviewImages.length > 1 && (
              <div className="mt-4 text-sm text-white/60 font-semibold">
                {activeImageIndex + 1} / {activePreviewImages.length}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
