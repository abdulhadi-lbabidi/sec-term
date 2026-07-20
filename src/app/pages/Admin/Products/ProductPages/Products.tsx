import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Loader2, Pencil, ChevronLeft, ChevronRight, Star, Layers
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
import { DeleteConfirmationModal } from '../../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../../components/Admin/GeneralPagination';
import {
  useProductsQuery,
  useDeleteProductMutation,
  useDeleteProductVariantMutation,
} from '../../../../api/Admin/products';
import { ProductVariantsModal } from './ProductVariantsModal';

interface ProductCardProps {
  product: any;
  isRtl: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenOptions: (product: any) => void;
  onOpenGallery: (product: any, index: number) => void;
  isPending: boolean;
  t: (key: string) => string;
  navigate: (path: string) => void;
}

const ProductCard = ({
  product,
  isRtl,
  onEdit,
  onDelete,
  onOpenOptions,
  onOpenGallery,
  isPending,
  t,
}: ProductCardProps) => {
  const defaultImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop';
  const images = product.all_images && product.all_images.length > 0
    ? product.all_images
    : product.image
      ? [product.image]
      : [defaultImg];

  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImgUrl = images[currentIdx] || defaultImg;
  const productName = typeof product.name === 'object' ? (isRtl ? product.name?.ar : product.name?.en) : product.name;
  const productBody = typeof product.body === 'object' ? (isRtl ? product.body?.ar : product.body?.en) : product.body;

  const materials = product.available_options?.map((opt: any) => opt.material_name) || [];
  const sizes = product.available_options?.flatMap((opt: any) => opt.available_sizes?.map((sz: any) => sz.size_name)) || [];
  const uniqueSizes = Array.from(new Set(sizes)) as string[];
  const hasOptions = (product.available_options?.length || 0) > 0;

  const flattenVariantsCount = product.available_options
    ? product.available_options.flatMap((opt: any) => opt.available_sizes || []).length
    : 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-black transition-all hover:shadow-lg">
      <div>
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5 cursor-pointer"
          onClick={() => {
            if (images.length > 0) {
              onOpenGallery(product, currentIdx);
            }
          }}
        >
          <img
            src={currentImgUrl}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

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

          {product.is_featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm z-10">
              <Star className="h-3 w-3 fill-white" />
              <span>{t('admin.featured')}</span>
            </div>
          )}

          {hasOptions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenOptions(product);
              }}
              className="absolute top-2 right-2 flex items-center gap-1.5 rounded-xl bg-white/90 hover:bg-white border border-black/10 px-2.5 py-1.5 text-[11px] font-bold text-black shadow-sm backdrop-blur-sm transition-all cursor-pointer hover:shadow-md z-10"
            >
              <Layers className="h-3.5 w-3.5 text-black/60" />
              <span>{t('admin.variants')}</span>
              <span className="flex items-center justify-center h-4 w-4 rounded-full bg-black text-white text-[9px] font-bold">
                {flattenVariantsCount}
              </span>
            </button>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-block rounded-lg bg-black/5 px-2.5 py-1 text-xs font-semibold text-black/60">
              {product.category?.name}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product.id);
                }}
                className="h-8 w-8 text-black/60 hover:bg-black/5 hover:text-black rounded-full"
                disabled={isPending}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive rounded-full"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="mt-2 text-lg font-bold truncate">{productName}</h3>
          <p className="mt-1 text-sm text-black/60 line-clamp-2 h-10">{productBody}</p>

          <div className="space-y-1.5 border-t border-black/5 pt-3 text-xs text-black/70">
            {materials.length > 0 && (
              <div className="truncate">
                <span className="font-semibold text-black/85">{t('admin.materials')} </span>
                {materials.join(', ')}
              </div>
            )}
            {uniqueSizes.length > 0 && (
              <div className="truncate mt-1.5">
                <span className="font-semibold text-black/85">{t('admin.sizes')} </span>
                {uniqueSizes.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Products = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [variantIdToDelete, setVariantIdToDelete] = useState<number | null>(null);
  const [isDeleteVariantModalOpen, setIsDeleteVariantModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [activeOptionsProduct, setActiveOptionsProduct] = useState<any | null>(null);
  const [galleryProduct, setGalleryProduct] = useState<any | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  const { data, isLoading, isError, error } = useProductsQuery(page, perPage);
  const deleteMutation = useDeleteProductMutation();
  const deleteVariantMutation = useDeleteProductVariantMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setHeaderAction(
      <Button onClick={() => navigate('/admin/products/add')} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('admin.addNewProduct')}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [navigate, setHeaderAction, t]);

  const handleDeleteProduct = (id: number) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productIdToDelete !== null) {
      deleteMutation.mutate(productIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setProductIdToDelete(null);
        },
      });
    }
  };

  const handleDeleteVariant = (id: number) => {
    setVariantIdToDelete(id);
    setIsDeleteVariantModalOpen(true);
  };

  const handleConfirmDeleteVariant = () => {
    if (variantIdToDelete !== null) {
      deleteVariantMutation.mutate(variantIdToDelete, {
        onSuccess: () => {
          setIsDeleteVariantModalOpen(false);
          setVariantIdToDelete(null);
          setActiveOptionsProduct(null);
        },
      });
    }
  };

  const openOptionsModal = (product: any) => {
    setActiveOptionsProduct(product);
  };

  const productsList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between space-y-6">
      <div className="p-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
            <p className="font-semibold">{t('admin.error_loading')}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : productsList.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white p-6 text-black/40">
            {t('admin.no_products_found')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsList.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                isRtl={isRtl}
                onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
                onDelete={handleDeleteProduct}
                onOpenOptions={openOptionsModal}
                onOpenGallery={(prod, idx) => {
                  setGalleryProduct(prod);
                  setActiveGalleryIndex(idx);
                }}
                isPending={deleteMutation.isPending}
                t={t}
                navigate={navigate}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteVariantModalOpen}
        onClose={() => {
          setIsDeleteVariantModalOpen(false);
          setVariantIdToDelete(null);
        }}
        onConfirm={handleConfirmDeleteVariant}
        isPending={deleteVariantMutation.isPending}
      />

      <ProductVariantsModal
        product={activeOptionsProduct}
        isOpen={activeOptionsProduct !== null}
        onClose={() => setActiveOptionsProduct(null)}
        onDeleteVariant={handleDeleteVariant}
        isRtl={isRtl}
      />

      <Dialog open={galleryProduct !== null} onOpenChange={(open) => { if (!open) setGalleryProduct(null); }}>
        <DialogContent className="max-w-3xl bg-white p-6 text-black flex flex-col items-center">
          {galleryProduct && (
            (() => {
              const defaultImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop';
              const images: string[] = (galleryProduct.all_images && galleryProduct.all_images.length > 0
                ? galleryProduct.all_images
                : galleryProduct.image
                  ? [galleryProduct.image]
                  : [defaultImg]) as string[];
              const productName = typeof galleryProduct.name === 'object' ? (isRtl ? galleryProduct.name?.ar : galleryProduct.name?.en) : galleryProduct.name;

              return (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="w-full flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold">{productName}</h3>
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
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${activeGalleryIndex === i ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
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
