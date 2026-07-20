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

interface CategoryCardProps {
  category: Category;
  isRtl: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenGallery: (category: Category, index: number) => void;
  isPending: boolean;
  t: (key: string) => string;
}

const CategoryCard = ({ category, isRtl, onEdit, onDelete, onOpenGallery, isPending, t }: CategoryCardProps) => {
  const images = category.all_images && category.all_images.length > 0
    ? category.all_images
    : category.image
    ? [category.image]
    : [];

  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImgUrl = images[currentIdx] || '';
  const categoryName = typeof category.name === 'object' ? (isRtl ? category.name?.ar : category.name?.en) : category.name;
  const categoryDesc = typeof category.description === 'object' ? (isRtl ? category.description?.ar : category.description?.en) : category.description;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-black/8 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className="relative overflow-hidden bg-black/5 cursor-pointer"
        style={{ aspectRatio: '4/3' }}
        onClick={() => {
          if (images.length > 0) {
            onOpenGallery(category, currentIdx);
          }
        }}
      >
        {currentImgUrl ? (
          <>
            <img
              src={currentImgUrl}
              alt={categoryName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/75 transition-colors cursor-pointer z-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/75 transition-colors cursor-pointer z-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {currentIdx + 1} / {images.length}
                </div>
              </>
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
          {categoryName}
        </h3>
        {categoryDesc && (
          <p className="text-xs text-black/50 line-clamp-2 leading-relaxed">
            {categoryDesc}
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
            onClick={() => onEdit(category.id)}
            className="h-8 w-8 text-black/50 hover:bg-black/5 hover:text-black"
            disabled={isPending}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
            disabled={isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [galleryCategory, setGalleryCategory] = useState<Category | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

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
            {categoriesList.map((category: Category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isRtl={isRtl}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onOpenGallery={(cat, idx) => {
                  setGalleryCategory(cat);
                  setActiveGalleryIndex(idx);
                }}
                isPending={deleteMutation.isPending}
                t={t}
              />
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

      <Dialog open={galleryCategory !== null} onOpenChange={(open) => { if (!open) setGalleryCategory(null); }}>
        <DialogContent className="max-w-3xl bg-white p-6 text-black flex flex-col items-center">
          {galleryCategory && (
            (() => {
              const images = galleryCategory.all_images && galleryCategory.all_images.length > 0
                ? galleryCategory.all_images
                : galleryCategory.image
                ? [galleryCategory.image]
                : [];
              const categoryName = typeof galleryCategory.name === 'object' ? (isRtl ? galleryCategory.name?.ar : galleryCategory.name?.en) : galleryCategory.name;

              return (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="w-full flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold">{categoryName}</h3>
                  </div>

                  <div className="relative w-full flex items-center justify-center bg-black/5 rounded-xl p-2 min-h-[300px] max-h-[500px]">
                    {images[activeGalleryIndex] && (
                      <img
                        src={images[activeGalleryIndex]}
                        alt="gallery active"
                        className="max-h-[450px] max-w-full object-contain rounded-lg"
                      />
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveGalleryIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/85 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGalleryIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/85 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="w-full overflow-x-auto flex justify-center gap-2 py-2 border-t">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveGalleryIndex(i)}
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                            activeGalleryIndex === i ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
