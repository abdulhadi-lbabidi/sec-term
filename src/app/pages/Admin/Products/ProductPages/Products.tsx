import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Loader2, Pencil, ChevronLeft, ChevronRight,
  X, Star, Layers, Package, Tag, Barcode,
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
import ReactBarcode from 'react-barcode';

interface VariantSize {
  variant_id: number;
  size_id: number;
  size_name: string;
  stock_quantity: number;
  price: number;
  discount: number;
  final_price: number;
  sku?: string;
  barcode?: string;
  images?: string[];
  packages?: { id: number; name: any; price: number; quantity: number }[];
}

interface AvailableOption {
  material_id: number;
  material_name: string;
  available_sizes: VariantSize[];
}

interface FlatVariant extends VariantSize {
  material_name: string;
}

function flattenVariants(available_options: AvailableOption[]): FlatVariant[] {
  return available_options.flatMap((opt) =>
    (opt.available_sizes || []).map((sz) => ({
      ...sz,
      material_name: opt.material_name,
    }))
  );
}

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

  const [activePreviewImages, setActivePreviewImages] = useState<string[] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const [activeOptionsProduct, setActiveOptionsProduct] = useState<any | null>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeOptionsProduct) {
        const variants = flattenVariants(activeOptionsProduct.available_options || []);
        if (e.key === 'ArrowRight') {
          setActiveVariantIndex((prev) => (prev < variants.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowLeft') {
          setActiveVariantIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Escape') {
          setActiveOptionsProduct(null);
        }
        return;
      }
      if (!activePreviewImages || activePreviewImages.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev < activePreviewImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activePreviewImages.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePreviewImages, activeOptionsProduct]);

  const handlePreviewImage = (images: string[] | string) => {
    const urls = Array.isArray(images) ? images : [images];
    setActivePreviewImages(urls);
    setActiveImageIndex(0);
  };

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
          // If the modal is open, we can close it or adjust the variant index
          if (activeOptionsProduct && activeOptionsProduct.available_options) {
             const variants = flattenVariants(activeOptionsProduct.available_options);
             if (variants.length <= 1) {
               setActiveOptionsProduct(null);
             } else if (activeVariantIndex >= variants.length - 1) {
               setActiveVariantIndex((prev) => Math.max(0, prev - 1));
             }
          }
        },
      });
    }
  };

  const openOptionsModal = (product: any) => {
    setActiveOptionsProduct(product);
    setActiveVariantIndex(0);
  };

  const productsList = data?.data || [];

  const flatVariants: FlatVariant[] = activeOptionsProduct
    ? flattenVariants(activeOptionsProduct.available_options || [])
    : [];

  const currentVariant = flatVariants[activeVariantIndex] ?? null;

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
            {t('admin.no_products') || (isRtl ? 'لا يوجد منتجات' : 'No products found')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsList.map((product: any) => {
              const imgUrl = product.image || product.all_images?.[0] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop';
              const previewUrls = product.all_images && product.all_images.length > 0
                ? product.all_images
                : (product.image ? [product.image] : [imgUrl]);

              const materials = product.available_options?.map((opt: any) => opt.material_name) || [];
              const sizes = product.available_options?.flatMap((opt: any) => opt.available_sizes?.map((sz: any) => sz.size_name)) || [];
              const uniqueSizes = Array.from(new Set(sizes)) as string[];
              const hasOptions = (product.available_options?.length || 0) > 0;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-black transition-all hover:shadow-lg"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5">
                      <img
                        src={imgUrl}
                        alt={typeof product.name === 'object' ? (isRtl ? product.name?.ar : product.name?.en) : product.name}
                        onClick={() => handlePreviewImage(previewUrls)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                      {product.is_featured && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                          <Star className="h-3 w-3 fill-white" />
                          <span>{isRtl ? 'مميز' : 'Featured'}</span>
                        </div>
                      )}
                      {hasOptions && (
                        <button
                          onClick={() => openOptionsModal(product)}
                          className="absolute top-2 right-2 flex items-center gap-1.5 rounded-xl bg-white/90 hover:bg-white border border-black/10 px-2.5 py-1.5 text-[11px] font-bold text-black shadow-sm backdrop-blur-sm transition-all cursor-pointer hover:shadow-md"
                        >
                          <Layers className="h-3.5 w-3.5 text-black/60" />
                          <span>{isRtl ? 'المتغيرات' : 'Variants'}</span>
                          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-black text-white text-[9px] font-bold">
                            {flattenVariants(product.available_options).length}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-block rounded-lg bg-black/5 px-2.5 py-1 text-xs font-semibold text-black/60">
                          {product.category?.name}
                        </span>
                        <div className="flex flex-col items-end gap-1 text-right">
                          {product.price !== null && product.price !== undefined && (
                            <div className="flex items-baseline gap-1.5">
                              {product.discount > 0 ? (
                                <>
                                  <span className="text-sm font-bold text-red-600">
                                    {product.final_price} {isRtl ? 'ر.س' : 'SAR'}
                                  </span>
                                  <span className="text-[10px] text-black/40 line-through">
                                    {product.price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm font-bold text-black">
                                  {product.price} {isRtl ? 'ر.س' : 'SAR'}
                                </span>
                              )}
                            </div>
                          )}
                          {product.stock !== null && product.stock !== undefined && (
                            <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {isRtl ? 'المخزون' : 'Stock'}: {product.stock}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-2 text-lg font-bold truncate">{typeof product.name === 'object' ? (isRtl ? product.name?.ar : product.name?.en) : product.name}</h3>
                      <p className="mt-1 text-sm text-black/60 line-clamp-2 h-10">{typeof product.body === 'object' ? (isRtl ? product.body?.ar : product.body?.en) : product.body}</p>

                      <div className="space-y-1.5 border-t border-black/5 pt-3 text-xs text-black/70">
                        {materials.length > 0 && (
                          <div className="truncate">
                            <span className="font-semibold text-black/85">{isRtl ? 'المواد:' : 'Materials:'} </span>
                            {materials.join(', ')}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1 h-8">
                          {uniqueSizes.length > 0 ? (
                            <div className="truncate pr-2">
                              <span className="font-semibold text-black/85">{isRtl ? 'الأحجام:' : 'Sizes:'} </span>
                              {uniqueSizes.join(', ')}
                            </div>
                          ) : (
                            <div></div>
                          )}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              className="h-8 w-8 text-black/60 hover:bg-black/5 hover:text-black rounded-full"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
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
                alt="product preview"
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

      {activeOptionsProduct && (
        <Dialog open={true} onOpenChange={() => setActiveOptionsProduct(null)}>
          <DialogContent className="max-w-4xl w-full bg-white p-0 border-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="flex flex-col" style={{ maxHeight: '88vh' }}>

              <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-black/6 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {(activeOptionsProduct.image || activeOptionsProduct.all_images?.[0]) && (
                    <img
                      src={activeOptionsProduct.image || activeOptionsProduct.all_images?.[0]}
                      alt={activeOptionsProduct.name}
                      className="h-12 w-12 rounded-xl object-cover border border-black/8 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-black">{activeOptionsProduct.name}</h2>
                      {activeOptionsProduct.is_featured && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                          <Star className="h-2.5 w-2.5 fill-white" />
                          {isRtl ? 'مميز' : 'Featured'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/45 mt-1 flex-wrap">
                      <span className="truncate">{activeOptionsProduct.category?.name}</span>
                      {activeOptionsProduct.body && <span className="truncate">· {activeOptionsProduct.body}</span>}
                      {currentVariant?.sku && (
                        <span className="flex items-center gap-1 text-black/60 font-semibold bg-black/5 px-2 py-0.5 rounded-md shrink-0">
                          <Tag className="h-3 w-3" /> {currentVariant.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => navigate(`/admin/products/add-variant/${activeOptionsProduct.id}`)}
                    title={isRtl ? 'إضافة متغير' : 'Add Variant'}
                    className="h-8 w-8 text-black/50 hover:text-black hover:bg-black/5 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {currentVariant && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/admin/products/edit-variant/${currentVariant.variant_id}`)}
                        title={isRtl ? 'تعديل هذا المتغير' : 'Edit Variant'}
                        className="h-8 w-8 text-black/50 hover:text-black hover:bg-black/5 rounded-full"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteVariant(currentVariant.variant_id)}
                        title={isRtl ? 'حذف هذا المتغير' : 'Delete Variant'}
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <button
                    onClick={() => setActiveOptionsProduct(null)}
                    className="text-black/35 hover:text-black hover:bg-black/5 p-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {currentVariant && (
                <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                  <div className="w-[40%] shrink-0 bg-black/[0.03] overflow-hidden">
                    {currentVariant.images && currentVariant.images.length > 0 ? (
                      <img src={currentVariant.images[0]} alt="variant" className="h-full w-full object-cover" />
                    ) : (activeOptionsProduct.image || activeOptionsProduct.all_images?.[0]) ? (
                      <img
                        src={activeOptionsProduct.image || activeOptionsProduct.all_images?.[0]}
                        alt="product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-black/20">
                        <Layers className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-black/[0.03] border border-black/6 px-3.5 py-3">
                        <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-1">{isRtl ? 'المادة' : 'Material'}</p>
                        <p className="text-xs font-semibold text-black leading-snug">{currentVariant.material_name}</p>
                      </div>
                      <div className="rounded-xl bg-black/[0.03] border border-black/6 px-3.5 py-3">
                        <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-1">{isRtl ? 'الحجم' : 'Size'}</p>
                        <p className="text-xs font-semibold text-black">{currentVariant.size_name}</p>
                      </div>
                      <div className="rounded-xl bg-black/[0.03] border border-black/6 px-3.5 py-3">
                        <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-1">{isRtl ? 'السعر' : 'Price'}</p>
                        <p className="text-sm font-bold text-black">
                          {currentVariant.discount > 0 ? (
                            <span className="flex items-baseline gap-1.5">
                              <span className="text-red-600">{currentVariant.final_price}</span>
                              <span className="text-[10px] text-black/30 line-through">{currentVariant.price}</span>
                              <span className="text-[10px] text-black/40">{isRtl ? 'ر.س' : 'SAR'}</span>
                            </span>
                          ) : (
                            <span>{currentVariant.price} <span className="text-[10px] text-black/40 font-normal">{isRtl ? 'ر.س' : 'SAR'}</span></span>
                          )}
                        </p>
                      </div>
                      <div className="rounded-xl bg-black/[0.03] border border-black/6 px-3.5 py-3">
                        <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-1">{isRtl ? 'المخزون' : 'Stock'}</p>
                        <p className={`text-sm font-bold ${currentVariant.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {currentVariant.stock_quantity}
                        </p>
                      </div>
                      {currentVariant.barcode && (
                        <div className="col-span-2 rounded-xl bg-black/[0.03] border border-black/6 px-3.5 py-3 flex flex-col items-center justify-center">
                          <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-2 flex items-center gap-1 self-start">
                            <Barcode className="h-2.5 w-2.5" /> {isRtl ? 'الباركود' : 'Barcode'}
                          </p>
                          <div className="bg-white p-2 rounded-lg border border-black/5">
                            <ReactBarcode value={currentVariant.barcode} height={35} width={1.2} fontSize={12} margin={0} />
                          </div>
                        </div>
                      )}
                    </div>

                    {currentVariant.packages && currentVariant.packages.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-black/35 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Package className="h-3 w-3" />
                          {isRtl ? 'الباقات' : 'Packages'}
                        </p>
                        <div className="space-y-1.5">
                          {currentVariant.packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-black/6 bg-black/[0.02] px-3.5 py-2.5 text-xs">
                              <span className="font-semibold text-black">{typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}</span>
                              <div className="flex items-center gap-3 text-black/50">
                                <span>×{pkg.quantity}</span>
                                <span className="font-bold text-black/70">{pkg.price} {isRtl ? 'ر.س' : 'SAR'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flatVariants.length > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-black/6 bg-black/[0.01] shrink-0">
                  <button
                    onClick={() => setActiveVariantIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeVariantIndex === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {isRtl ? 'السابق' : 'Prev'}
                  </button>
                  <div className="flex items-center gap-2">
                    {flatVariants.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveVariantIndex(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${i === activeVariantIndex ? 'w-5 bg-black' : 'w-2 bg-black/20 hover:bg-black/40'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveVariantIndex((prev) => Math.min(flatVariants.length - 1, prev + 1))}
                    disabled={activeVariantIndex === flatVariants.length - 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {isRtl ? 'التالي' : 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
