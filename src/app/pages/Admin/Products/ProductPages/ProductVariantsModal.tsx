import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, ChevronLeft, ChevronRight,
  X, Star, Layers, Package, Tag, Barcode,
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useAuth } from '../../../../context/AuthContext';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
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

interface ProductVariantsModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onDeleteVariant: (id: number) => void;
  isRtl: boolean;
}

function flattenVariants(available_options: AvailableOption[]): FlatVariant[] {
  return (available_options || []).flatMap((opt) =>
    (opt.available_sizes || []).map((sz) => ({
      ...sz,
      material_name: opt.material_name,
    }))
  );
}

export const ProductVariantsModal = ({
  product,
  isOpen,
  onClose,
  onDeleteVariant,
  isRtl,
}: ProductVariantsModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('create_product_variant');
  const canEdit = hasPermission('update_product_variant');
  const canDelete = hasPermission('delete_product_variant');

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [variantImageIndex, setVariantImageIndex] = useState(0);

  useEffect(() => {
    setActiveVariantIndex(0);
    setVariantImageIndex(0);
  }, [product]);

  useEffect(() => {
    setVariantImageIndex(0);
  }, [activeVariantIndex]);

  useEffect(() => {
    if (!isOpen || !product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const variants = flattenVariants(product.available_options || []);
      if (e.key === 'ArrowRight') {
        setActiveVariantIndex((prev) => (prev < variants.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setActiveVariantIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, isOpen, onClose]);

  if (!product) return null;

  const flatVariants = flattenVariants(product.available_options || []);
  const currentVariant = flatVariants[activeVariantIndex] ?? null;
  const productName = typeof product.name === 'object' ? (isRtl ? product.name?.ar : product.name?.en) : product.name;
  const productCategory = product.category?.name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[1150px] bg-white p-0 border-0 shadow-2xl overflow-hidden rounded-3xl">
        <div className="flex flex-col h-full max-h-[92vh]">
          {/* Responsive Header Container */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:px-8 md:py-6 border-b border-black/5 bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              {(product.image || product.all_images?.[0]) && (
                <img
                  src={product.image || product.all_images?.[0]}
                  alt={productName}
                  className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl object-cover border border-black/10 shadow-sm shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg md:text-xl font-extrabold text-black tracking-tight">{productName}</h2>
                  {product.is_featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] md:text-[10px] font-bold text-white shadow-sm shrink-0">
                      <Star className="h-2.5 w-2.5 fill-white" />
                      {t('admin.featured')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] md:text-xs text-black/50 mt-1.5 flex-wrap font-medium">
                  <span className="bg-black/5 px-2 py-0.5 rounded-md text-black/70 font-semibold">{productCategory}</span>
                  {product.body && <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-md">· {typeof product.body === 'object' ? (isRtl ? product.body?.ar : product.body?.en) : product.body}</span>}
                  {currentVariant && (
                    <>
                      <span className="flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-black/60 bg-black/5 px-2 py-0.5 rounded-md border border-black/5 shrink-0">
                        <Tag className="h-3 w-3 text-black/50" />
                        <span>{t('admin.sku') || 'SKU'}: {currentVariant.sku || 'N/A'}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 shrink-0">
                        {t('admin.variant') || 'Variant'} {activeVariantIndex + 1} / {flatVariants.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 md:self-center">
              {canCreate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/products/add-variant/${product.id}`)}
                  className="flex items-center gap-1.5 h-9 md:h-10 text-xs font-semibold hover:bg-black/5 rounded-xl md:rounded-2xl border-black/10 px-3 md:px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('admin.add_variant')}</span>
                </Button>
              )}
              {currentVariant && (
                <>
                  {canEdit && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => navigate(`/admin/products/edit-variant/${currentVariant.variant_id}`)}
                      className="h-9 w-9 md:h-10 md:w-10 text-black/60 hover:text-black hover:bg-black/5 rounded-xl md:rounded-2xl border-black/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onDeleteVariant(currentVariant.variant_id)}
                      className="h-9 w-9 md:h-10 md:w-10 text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive rounded-xl md:rounded-2xl border-black/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {currentVariant && (
            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                {/* Responsive Image Gallery Wrapper */}
                <div className="lg:col-span-6 bg-black/[0.02] border-b lg:border-b-0 lg:border-r border-black/5 flex flex-col relative h-[280px] sm:h-[350px] lg:h-auto min-h-[250px] lg:min-h-[450px]">
                  <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden">
                    {currentVariant.images && currentVariant.images.length > 0 ? (
                      (() => {
                        const variantImages = currentVariant.images;
                        return (
                          <div className="relative w-full h-full">
                            <img
                              src={variantImages[variantImageIndex] || variantImages[0]}
                              alt="variant"
                              className="h-full w-full object-cover absolute inset-0"
                            />
                            {variantImages.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setVariantImageIndex((prev) => (prev === 0 ? variantImages.length - 1 : prev - 1))}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer shadow-lg backdrop-blur-xs z-10"
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setVariantImageIndex((prev) => (prev === variantImages.length - 1 ? 0 : prev + 1))}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer shadow-lg backdrop-blur-xs z-10"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })()
                    ) : (product.image || product.all_images?.[0]) ? (
                      <img
                        src={product.image || product.all_images?.[0]}
                        alt="product"
                        className="h-full w-full object-cover absolute inset-0"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-black/20 bg-black/[0.02]">
                        <Layers className="h-20 w-20" />
                      </div>
                    )}
                  </div>

                  {currentVariant.images && currentVariant.images.length > 1 && (
                    <div className="flex gap-2 py-3 px-4 overflow-x-auto justify-center bg-black/5 shrink-0 border-t border-black/5">
                      {currentVariant.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setVariantImageIndex(idx)}
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                            variantImageIndex === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 p-4 md:p-8 space-y-6 md:space-y-8 flex flex-col justify-between">
                  <div className="space-y-6 md:space-y-8">
                    {/* Responsive details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="rounded-2xl bg-black/[0.01] border border-black/5 p-4 md:p-5 transition-all hover:bg-black/[0.03]">
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">{t('admin.material')}</p>
                        <p className="text-sm md:text-base font-extrabold text-black leading-snug">{currentVariant.material_name}</p>
                      </div>

                      <div className="rounded-2xl bg-black/[0.01] border border-black/5 p-4 md:p-5 transition-all hover:bg-black/[0.03]">
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">{t('admin.size')}</p>
                        <p className="text-sm md:text-base font-extrabold text-black">{currentVariant.size_name}</p>
                      </div>

                      <div className="rounded-2xl bg-black/[0.01] border border-black/5 p-4 md:p-5 transition-all hover:bg-black/[0.03]">
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">{t('admin.price')}</p>
                        <p className="text-sm md:text-base font-extrabold text-black">
                          {currentVariant.discount > 0 ? (
                            <span className="flex items-baseline gap-2.5">
                              <span className="text-red-600 text-lg md:text-xl font-black">{currentVariant.final_price}</span>
                              <span className="text-xs md:text-sm text-black/35 line-through font-normal">{currentVariant.price}</span>
                              <span className="text-[10px] md:text-xs text-black/45 font-medium">{isRtl ? 'ر.س' : 'SAR'}</span>
                            </span>
                          ) : (
                            <span className="flex items-baseline gap-1">
                              <span className="text-md md:text-lg font-black">{currentVariant.price}</span>
                              <span className="text-[10px] md:text-xs text-black/45 font-semibold">{isRtl ? 'ر.س' : 'SAR'}</span>
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-black/[0.01] border border-black/5 p-4 md:p-5 transition-all hover:bg-black/[0.03]">
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">{t('admin.stock')}</p>
                        <span className={`inline-flex items-center px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold ${
                          currentVariant.stock_quantity > 0
                            ? 'bg-green-50 text-green-700 border border-green-200/50'
                            : 'bg-red-50 text-red-700 border border-red-200/50'
                        }`}>
                          {currentVariant.stock_quantity > 0 ? t('admin.in_stock') : t('admin.out_of_stock')}
                          <span className="ml-1.5 rtl:mr-1.5 rtl:ml-0 font-extrabold">({currentVariant.stock_quantity})</span>
                        </span>
                      </div>
                    </div>

                    {currentVariant.barcode && (
                      <div className="rounded-2xl bg-black/[0.01] border border-black/5 p-4 md:p-5 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-black/40 uppercase tracking-wider self-start mb-4">
                          <Barcode className="h-4 w-4 text-black/50" />
                          <span>{t('admin.barcode')}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                          <ReactBarcode value={currentVariant.barcode} height={45} width={1.4} fontSize={12} margin={0} />
                        </div>
                      </div>
                    )}

                    {currentVariant.packages && currentVariant.packages.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-black/50" />
                          <span>{t('admin.packages')}</span>
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {currentVariant.packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-black/[0.01] px-4 md:px-5 py-3.5 text-xs transition-all hover:bg-black/[0.03] shadow-xs">
                              <span className="font-bold text-black/80">{typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}</span>
                              <div className="flex items-center gap-4">
                                <span className="bg-black/5 px-2.5 py-1 rounded-lg font-bold text-black/60">×{pkg.quantity}</span>
                                <span className="font-extrabold text-black/80">{pkg.price} {isRtl ? 'ر.س' : 'SAR'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {flatVariants.length > 1 && (
            <div className="flex items-center justify-between p-4 md:px-8 md:py-5 border-t border-black/5 bg-gray-50/50 shrink-0">
              <button
                onClick={() => setActiveVariantIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeVariantIndex === 0}
                className="flex items-center gap-1.5 px-3 md:px-4.5 py-2 md:py-2.5 rounded-xl text-xs font-semibold text-black/60 border border-black/10 hover:bg-black/5 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('admin.previous')}</span>
              </button>
              <div className="flex items-center gap-2">
                {flatVariants.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVariantIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${i === activeVariantIndex ? 'w-6 md:w-8 bg-amber-500' : 'w-2 bg-black/15 hover:bg-black/35'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveVariantIndex((prev) => Math.min(flatVariants.length - 1, prev + 1))}
                disabled={activeVariantIndex === flatVariants.length - 1}
                className="flex items-center gap-1.5 px-3 md:px-4.5 py-2 md:py-2.5 rounded-xl text-xs font-semibold text-black/60 border border-black/10 hover:bg-black/5 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
              >
                <span className="hidden sm:inline">{t('admin.next')}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
