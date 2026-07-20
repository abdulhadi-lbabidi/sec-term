import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/app/store/useAppStore';
import { useProductDetailsQuery, useAddReviewMutation } from '@/app/api/client/useProducts';
import { toast } from 'sonner';
import { useAddToCartMutation } from '@/app/api/client/useCart';

import { Package } from '@/types/Client/product';
import { ProductGallery, ProductGallerySkeleton } from '@/app/components/client/product/ProductGallery';
import { ProductInfo, ProductInfoSkeleton } from '@/app/components/client/product/ProductInfo';
import { MaterialSelector, MaterialSelectorSkeleton } from '@/app/components/client/product/MaterialSelector';
import { SizeSelector, SizeSelectorSkeleton } from '@/app/components/client/product/SizeSelector';
import { PackageGrid, PackageGridSkeleton } from '@/app/components/client/package/PackageGrid';
import { ProductActions, ProductActionsSkeleton } from '@/app/components/client/product/ProductActions';
import { ReviewList, Review } from '@/app/components/client/review/ReviewList';
import { ReviewForm } from '@/app/components/client/review/ReviewForm';
import { useTranslation } from 'react-i18next';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { wishlist, toggleWishlist, user, cart } = useAppStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCartMutation();
  const { mutate: addReviewApi, isPending: isAddingReview } = useAddReviewMutation();

  const { data: product, isLoading }: any = useProductDetailsQuery(id!);

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.available_options && product.available_options.length > 0) {
        const firstMaterial = product.available_options[0];
        setSelectedMaterialId(firstMaterial.material_id);
        if (firstMaterial.available_sizes && firstMaterial.available_sizes.length > 0) {
          setSelectedSizeId(firstMaterial.available_sizes[0].size_id);
        }
      }
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

  const currentPrice = selectedSize ? selectedSize.final_price : (product?.final_price || 0);
  const currentStock = selectedSize ? selectedSize.stock_quantity : (product?.stock || 0);
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
        toast.success(t('success'));
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
        toast.success(t('itemAdded'));
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

  const handleAddReview = (rating: number, comment: string) => {
    if (!user) {
      toast.error(t('loginToAddReview'));
      return;
    }

    let variantId = selectedSize?.variant_id || product?.variants?.[0]?.id;
    if (!variantId && product?.available_options?.length > 0) {
      variantId = product.available_options[0]?.available_sizes?.[0]?.variant_id;
    }

    if (!variantId) {
      toast.error(t('productNotAvailableForReview'));
      return;
    }

    if (!id) return;

    addReviewApi({ rating, comment, product_variant_id: variantId, product_id: id }, {
      onSuccess: (newReviewData) => {
        const newReview: Review = {
          id: newReviewData?.id || Date.now(),
          user: { name: user.name },
          rating,
          comment,
          created_at: new Date().toISOString(),
        };

        setReviews(prev => [newReview, ...prev]);
        toast.success(t('reviewSuccess'));
      },
      onError: (err: any) => {
        toast.error(err?.message || t('error'));
      }
    });
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A880] mb-8 transition-colors">
        {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />} {t('backToShop')}
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#EAE5DF] flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        {isLoading || !product ? <ProductGallerySkeleton />
          : <ProductGallery
            activeImage={activeImage}
            name={product.name}
            isFav={isFav}
            allImages={product.all_images}
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
              originalPrice={selectedSize?.price || product.price}
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
              totalReviews={reviews.length}
              isLoading={isLoading}
            />
          </div>

          {/* Review Form */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {user ? <ReviewForm onSubmit={handleAddReview} isSubmitting={isAddingReview} />
                : <div className="bg-[#FCFAF7] rounded-3xl p-8 border border-[#EAE5DF] text-center">
                  <h3 className="text-xl font-bold text-[#1C1A17] mb-4">
                    {t('products.shareThought')}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {t('products.loginToReviewDesc')}
                  </p>
                  <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-[#111111] hover:bg-[#C5A880] text-white px-8 h-12 transition-all shadow-md w-full">
                    {t('products.logIn')}
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
