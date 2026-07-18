import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2, Pencil, ChevronLeft, ChevronRight, X, ImageOff } from 'lucide-react';
import { Button } from '../../../components/ui/button';
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
  const [perPage, setPerPage] = useState(10);

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
      } else if (e.key === 'Escape') {
        setActivePreviewImages(null);
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
        ) : categoriesList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-black/40">
            <ImageOff className="h-12 w-12" />
            <p className="text-sm font-medium">{t('admin.no_categories')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesList.map((category: Category) => {
              const imgUrl = category.all_images?.[0] || category.image || '';
              const imageCount = category.all_images?.length || (imgUrl ? 1 : 0);

              return (
                <div
                  key={category.id}
                  className="group relative flex flex-col rounded-2xl border border-black/8 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div
                    className="relative overflow-hidden bg-black/5 cursor-pointer"
                    style={{ aspectRatio: '4/3' }}
                    onClick={() =>
                      handlePreviewImage(
                        category.all_images && category.all_images.length > 0
                          ? category.all_images
                          : imgUrl
                          ? [imgUrl]
                          : []
                      )
                    }
                  >
                    {imgUrl ? (
                      <>
                        <img
                          src={imgUrl}
                          alt={typeof category.name === 'object' ? (isRtl ? category.name?.ar : category.name?.en) : category.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        {imageCount > 1 && (
                          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                            +{imageCount - 1}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-10 w-10 text-black/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-2">
                    <h3 className="font-semibold text-black text-sm leading-snug line-clamp-1">
                      {typeof category.name === 'object' ? (isRtl ? category.name?.ar : category.name?.en) : category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-black/50 line-clamp-2 leading-relaxed">
                        {typeof category.description === 'object' ? (isRtl ? category.description?.ar : category.description?.en) : category.description}
                      </p>
                    )}
                  
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 px-3 py-2">
                    {category.created_at && (
                      <p className="text-xs text-black/35">{category.created_at}</p>
                    )}
                    <div className="flex items-center gap-1 ms-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category.id)}
                        className="h-8 w-8 text-black/50 hover:bg-black/5 hover:text-black"
                        disabled={deleteMutation.isPending}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-8 w-8 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {activePreviewImages && activePreviewImages.length > 0 && (
        <Dialog open={true} onOpenChange={() => setActivePreviewImages(null)}>
          <DialogContent className="max-w-[95vw] h-[95vh] bg-black/95 p-0 text-white border-0 flex flex-col items-center justify-center relative shadow-2xl">
            <button
              onClick={() => setActivePreviewImages(null)}
              className="absolute top-4 right-4 text-white/75 hover:text-white hover:bg-white/10 p-2 rounded-full cursor-pointer z-50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative flex items-center justify-center w-full h-full select-none p-10">
              {activePreviewImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activePreviewImages.length - 1))}
                  className="absolute left-4 z-50 bg-black/40 hover:bg-black/60 p-3 rounded-full cursor-pointer transition-colors text-white"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}

              <img
                src={activePreviewImages[activeImageIndex]}
                alt="category preview"
                className="max-h-full max-w-full object-contain rounded-lg select-none"
              />

              {activePreviewImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < activePreviewImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 z-50 bg-black/40 hover:bg-black/60 p-3 rounded-full cursor-pointer transition-colors text-white"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}
            </div>

            {activePreviewImages.length > 1 && (
              <div className="absolute bottom-4 text-sm text-white/60 font-semibold">
                {activeImageIndex + 1} / {activePreviewImages.length}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
