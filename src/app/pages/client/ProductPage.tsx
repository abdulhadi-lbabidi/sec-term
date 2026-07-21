import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/app/store/useAppStore';
import { useProductDetailsQuery, useAddReviewMutation, useReviewsQuery, useProductsQuery } from '@/app/api/client/useProducts';
import { toast } from 'sonner';
import { showAddToCartSuccessToast } from '@/app/components/ui/custom-toast';
import { useAddToCartMutation } from '@/app/api/client/useCart';

import { Package } from '@/types/Client/product';
import { ProductGallery, ProductGallerySkeleton } from '@/app/components/client/product/ProductGallery';
import { ProductInfo, ProductInfoSkeleton } from '@/app/components/client/product/ProductInfo';
import { MaterialSelector, MaterialSelectorSkeleton } from '@/app/components/client/product/MaterialSelector';
import { SizeSelector, SizeSelectorSkeleton } from '@/app/components/client/product/SizeSelector';
import { PackageGrid, PackageGridSkeleton } from '@/app/components/client/package/PackageGrid';
import { ProductActions, ProductActionsSkeleton } from '@/app/components/client/product/ProductActions';
import { ProductSection } from '@/app/components/client/home/ProductSection';
import { ReviewList } from '@/app/components/client/review/ReviewList';
import { ReviewForm } from '@/app/components/client/review/ReviewForm';
import { useTranslation } from 'react-i18next';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { wishlist, toggleWishlist, user, cart } = useAppStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [qty, setQty] = useState(1);
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCartMutation();
  const { mutate: addReviewApi, isPending: isAddingReview } = useAddReviewMutation();

  const { data: product, isLoading }: any = useProductDetailsQuery(id!);

  const variants = product?.available_options?.flatMap((m: any) =>
    m.available_sizes.map((s: any) => ({
      id: s.variant_id,
      name: `${m.material_name} - ${s.size_name}`
    }))
  ) || [];

  const variantIds = variants.map((v: any) => v.id).join(',');

  const { data: reviewsData, isLoading: isLoadingReviews } = useReviewsQuery({
    paginate: 1,
    per_page: 5,
    page: 1,
    'filter[product_variant_id]': variantIds,
  });

  const fetchedReviews = reviewsData?.data || [];
  const reviews = fetchedReviews.map((r: any) => {
    const variant = variants.find((v: any) => v.id == r.product_variant_id);
    return {
      id: r.id,
      user: { name: r.user?.name || r.name || 'Anonymous' },
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at || new Date().toISOString(),
      variantName: variant?.name || r.product_variant?.name,
    };
  });

  const { data: relatedProductsData, isLoading: isLoadingRelated } = useProductsQuery();
  const relatedProducts = Array.isArray((relatedProductsData as any)?.data)
    ? (relatedProductsData as any).data.filter((p: any) => p.id != id && p.category_id == product?.category_id).slice(0, 4)
    : [];

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedMaterialId && selectedSizeId) {
      const material = product.available_options?.find((m: any) => m.material_id === selectedMaterialId);
      const size = material?.available_sizes?.find((s: any) => s.size_id === selectedSizeId);
      if (size && size.images && size.images.length > 0) {
        setActiveImage(size.images[0]);
      } else if (product.image) {
        setActiveImage(product.image);
      }
    }
  }, [selectedMaterialId, selectedSizeId, product]);

  if (!isLoading && !product) return <div className="py-32 text-center text-red-500">{t('productNotFound')}</div>;

  const isFav = product ? wishlist.some(p => p.id === product.id) : false;

  const selectedMaterial = product?.available_options?.find((m: any) => m.material_id === selectedMaterialId);
  const selectedSize = selectedMaterial?.available_sizes?.find((s: any) => s.size_id === selectedSizeId);

  const defaultPrice = product?.available_options?.[0]?.available_sizes?.[0]?.final_price ?? (product?.final_price || 0);
  const defaultStock = product?.available_options?.[0]?.available_sizes?.[0]?.stock_quantity ?? (product?.stock || 0);

  const currentPrice = selectedSize ? selectedSize.final_price : defaultPrice;
  const currentStock = selectedSize ? selectedSize.stock_quantity : defaultStock;
  const availablePackages = selectedSize?.packages || [];

  const currentProductId = product ? (selectedSize ? `${product.id}-${selectedSize.variant_id}` : product.id) : undefined;
  const isInCart = currentProductId ? cart.some(c => c.product.id === currentProductId && !c.isPackage) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    if (isFav) {
      toast.success(t('removedFromWishlist'));
    } else {
      toast.success(t('addedToWishlist'));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    let variantId = selectedSize?.variant_id || product?.variants?.[0]?.id;
    if (!variantId && product.available_options?.length > 0) {
      variantId = product.available_options[0]?.available_sizes?.[0]?.variant_id;
    }

    if (!variantId) {
      toast.error(t('productNotAvailable'));
      return;
    }

    addToCartApi({ product_variant_id: variantId, quantity: qty }, {
      onSuccess: () => {
        showAddToCartSuccessToast(t);
      },
      onError: () => {
        toast.error(t('error'));
      }
    });
  };

  const handleAddPackageToCart = (pkg: Package) => {
    if (!product) return;

    let variantId = selectedSize?.variant_id || product?.variants?.[0]?.id;
    if (!variantId && product.available_options?.length > 0) {
      variantId = product.available_options[0]?.available_sizes?.[0]?.variant_id;
    }

    if (!variantId) {
      toast.error(t('variantNotAvailable'));
      return;
    }

    addToCartApi({ product_variant_id: variantId, product_variant_package_id: pkg.id, quantity: pkg.quantity || 1 }, {
      onSuccess: () => {
        showAddToCartSuccessToast(t);
      },
      onError: () => {
        toast.error(t('error'));
      }
    });
  };

  const handleMaterialSelect = (materialId: number) => {
    setSelectedMaterialId(materialId);
    if (product) {
      const material = product.available_options.find((m: any) => m.material_id === materialId);
      if (material && material.available_sizes.length > 0) {
        setSelectedSizeId(material.available_sizes[0].size_id);
      } else {
        setSelectedSizeId(null);
      }
    }
  };

  const handleAddReview = (rating: number, comment: string, variantId?: number) => {
    if (!user) {
      toast.error(t('loginToAddReview'));
      return;
    }

    let finalVariantId = variantId || selectedSize?.variant_id || product?.variants?.[0]?.id;
    if (!finalVariantId && product?.available_options?.length > 0) {
      finalVariantId = product.available_options[0]?.available_sizes?.[0]?.variant_id;
    }

    if (!finalVariantId) {
      toast.error(t('productNotAvailableForReview'));
      return;
    }

    if (!id) return;

    addReviewApi({ rating, comment, product_variant_id: finalVariantId, product_id: id }, {
      onSuccess: () => {
        toast.success(t('reviewSuccess'));
      },
      onError: (err: any) => {
        toast.error(err?.message || t('error'));
      }
    });
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / totalReviews : 0;

  const hasUserSelectedVariant = selectedMaterialId !== null;

  const currentVariantImages = hasUserSelectedVariant
    ? (selectedSize?.images && selectedSize.images.length > 0
      ? selectedSize.images
      : (product?.image ? [product.image] : []))
    : (product?.all_images || []);

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
        {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />} {t('backToShop')}
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#EAE5DF] flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        {isLoading || !product ? <ProductGallerySkeleton />
          : <ProductGallery
            activeImage={activeImage}
            name={product.name}
            isFav={isFav}
            allImages={currentVariantImages}
            onToggleWishlist={handleToggleWishlist}
            onImageSelect={setActiveImage}
          />
        }

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col">
          {isLoading || !product ? <ProductInfoSkeleton />
            : <ProductInfo
              name={product.name}
              categoryName={product.category?.name}
              currentPrice={currentPrice}
              originalPrice={selectedSize?.price || (product?.available_options?.[0]?.available_sizes?.[0]?.price ?? product.price)}
              currency={t('products.currency') || 'SAR'}
              description={product.body}
            />
          }

          <div className="space-y-6 mb-10">
            {/* Options */}
            {isLoading || !product ? <div className="space-y-6">
              <MaterialSelectorSkeleton />
              <SizeSelectorSkeleton />
            </div>
              : (
                product.available_options && product.available_options.length > 0 && (
                  <div className="space-y-6">
                    <MaterialSelector
                      options={product.available_options}
                      selectedId={selectedMaterialId}
                      onSelect={handleMaterialSelect}
                      title={t('products.ingredients')}
                    />

                    {selectedMaterial && selectedMaterial.available_sizes && selectedMaterial.available_sizes.length > 0 && (
                      <SizeSelector
                        sizes={selectedMaterial.available_sizes}
                        selectedId={selectedSizeId}
                        onSelect={setSelectedSizeId}
                        title={t('products.size')}
                      />
                    )}
                  </div>
                )
              )}

            {/* Packages */}
            {isLoading || !product ? <PackageGridSkeleton />
              : <PackageGrid
                packages={availablePackages}
                title={t('products.packagesTitle')}
                quantityLabel={t('products.pieces')}
                addButtonLabel={t('products.buyPackage')}
                currency={t('products.currency')}
                onAdd={handleAddPackageToCart}
              />
            }
          </div>

          {/* Actions */}
          {isLoading || !product ? <ProductActionsSkeleton />
            : <ProductActions
              qty={qty}
              maxStock={currentStock}
              onDecreaseQty={() => setQty(Math.max(1, qty - 1))}
              onIncreaseQty={() => setQty(qty + 1)}
              onAddToCart={handleAddToCart}
              addToCartLabel={isAdding ? t('products.loading') : t('products.addToCart')}
              outOfStockLabel={t('products.outOfStock')}
              isInCart={isInCart}
              inCartLabel={t('products.inCart')}
            />
          }
        </div>
      </div>

      {/* Reviews Section */}
      {product && (
        <div className="mt-16 flex flex-col lg:flex-row gap-12">
          {/* Reviews List */}
          <div className="lg:w-2/3">
            <ReviewList
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={reviewsData?.meta?.total || reviews.length}
              isLoading={isLoading || isLoadingReviews}
            />
          </div>

          {/* Review Form */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {user ? (
                <ReviewForm
                  onSubmit={handleAddReview}
                  isSubmitting={isAddingReview}
                  variants={variants}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-muted-foreground mb-6 text-center max-w-sm">{t('loginToAddReview')}</p>
                <div className="w-full max-w-xs">
                  <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 transition-all shadow-md w-full">
                    {t('login_title')}
                  </Link>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-[#EAE5DF] pt-12">
          <ProductSection
            title={t('products.relatedTitle', 'Related Products')}
            subtitle={t('products.relatedSubtitle', 'You might also like these items')}
            products={relatedProducts}
            isLoading={isLoadingRelated}
          />
        </div>
      )}
    </div>
  );
}
