import { useState, useEffect } from 'react';
import { useParams, Link, data } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/app/store/useAppStore';
import { translations } from '@/app/i18n/translations';
import { useProductDetailsQuery } from '@/app/api/client/useProducts';
import { toast } from 'sonner';

import { Package } from '@/types/Client/product';
import { ProductGallery, ProductGallerySkeleton } from '@/app/components/client/product/ProductGallery';
import { ProductInfo, ProductInfoSkeleton } from '@/app/components/client/product/ProductInfo';
import { MaterialSelector, MaterialSelectorSkeleton } from '@/app/components/client/product/MaterialSelector';
import { SizeSelector, SizeSelectorSkeleton } from '@/app/components/client/product/SizeSelector';
import { PackageGrid, PackageGridSkeleton } from '@/app/components/client/package/PackageGrid';
import { ProductActions, ProductActionsSkeleton } from '@/app/components/client/product/ProductActions';
import { ReviewList, Review } from '@/app/components/client/review/ReviewList';
import { ReviewForm } from '@/app/components/client/review/ReviewForm';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { language, addToCart, wishlist, toggleWishlist, user, cart } = useAppStore();
  const t = translations[language];
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);

  const { data: product, isLoading } = useProductDetailsQuery(id!);

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
      const material = product.available_options?.find(m => m.material_id === selectedMaterialId);
      const size = material?.available_sizes?.find(s => s.size_id === selectedSizeId);
      if (size && size.images && size.images.length > 0) {
        setActiveImage(size.images[0]);
      } else if (product.image) {
        setActiveImage(product.image);
      }
    }
  }, [selectedMaterialId, selectedSizeId, product]);

  if (!isLoading && !product) return <div className="py-32 text-center text-red-500">Product not found.</div>;

  const isFav = product ? wishlist.some(p => p.id === product.id) : false;

  const selectedMaterial = product?.available_options?.find(m => m.material_id === selectedMaterialId);
  const selectedSize = selectedMaterial?.available_sizes?.find(s => s.size_id === selectedSizeId);

  const currentPrice = selectedSize ? selectedSize.final_price : (product?.final_price || 0);
  const currentStock = selectedSize ? selectedSize.stock_quantity : (product?.stock || 0);
  const availablePackages = selectedSize?.packages || [];

  const currentProductId = product ? (selectedSize ? `${product.id}-${selectedSize.variant_id}` : product.id) : undefined;
  const isInCart = currentProductId ? cart.some(c => c.product.id === currentProductId && !c.isPackage) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    if (isFav) {
      toast.success(language === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from wishlist');
    } else {
      toast.success(language === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = {
      ...product,
      id: selectedSize ? `${product.id}-${selectedSize.variant_id}` : product.id,
      originalId: product.id,
      price: currentPrice,
      image: activeImage,
      selectedVariant: selectedSize,
      selectedMaterial: selectedMaterial,
    };

    addToCart(cartProduct, qty);
    toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const handleAddPackageToCart = (pkg: Package) => {
    if (!product) return;
    const cartProduct = {
      ...product,
      id: `${product.id}-pkg-${pkg.id}`,
      originalId: product.id,
      price: pkg.price,
      image: activeImage,
      selectedPackage: pkg,
    };
    addToCart(cartProduct, pkg.quantity, true);
    toast.success(language === 'ar' ? 'تمت إضافة الباقة للسلة' : 'Package added to cart');
  };

  const handleMaterialSelect = (materialId: number) => {
    setSelectedMaterialId(materialId);
    if (product) {
      const material = product.available_options.find(m => m.material_id === materialId);
      if (material && material.available_sizes.length > 0) {
        setSelectedSizeId(material.available_sizes[0].size_id);
      } else {
        setSelectedSizeId(null);
      }
    }
  };

  const handleAddReview = (rating: number, comment: string) => {
    if (!user) {
      toast.error(language === 'ar' ? 'يرجى تسجيل الدخول لإضافة تقييم' : 'Please log in to add a review');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      user: { name: user.name },
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);
    toast.success(language === 'ar' ? 'شكراً لمشاركتك تجربتك اللذيذة معنا!' : 'Thank you for your delicious review!');
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A880] mb-8 transition-colors">
        {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />} {language === 'ar' ? 'العودة للمتجر' : 'Back to shop'}
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
              currency={t.currency || 'SAR'}
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
                      title={language === 'ar' ? 'المادة / المكون' : 'Material'}
                    />

                    {selectedMaterial && selectedMaterial.available_sizes && selectedMaterial.available_sizes.length > 0 && (
                      <SizeSelector
                        sizes={selectedMaterial.available_sizes}
                        selectedId={selectedSizeId}
                        onSelect={setSelectedSizeId}
                        title={language === 'ar' ? 'الحجم' : 'Size'}
                      />
                    )}
                  </div>
                )
              )}

            {/* Packages */}
            {isLoading || !product ? <PackageGridSkeleton />
              : <PackageGrid
                packages={availablePackages}
                title={language === 'ar' ? 'عروض وباقات الحجم المحدد' : 'Offers & Packages for Selected Size'}
                quantityLabel={language === 'ar' ? 'الكمية' : 'Quantity'}
                addButtonLabel={language === 'ar' ? 'إضافة للسلة' : 'Add to cart'}
                currency={t.currency || 'SAR'}
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
              addToCartLabel={t.addToCart || 'Add to Cart'}
              outOfStockLabel={t.outOfStock || 'Out of Stock'}
              isInCart={isInCart}
              inCartLabel={language === 'ar' ? 'في السلة' : 'In Cart'}
            />
          }
        </div>
      </div>

      {/* Reviews Section */}
      {!isLoading && product && (
        <div className="mt-16 flex flex-col lg:flex-row gap-12">
          {/* Reviews List */}
          <div className="lg:w-2/3">
            <ReviewList
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>

          {/* Review Form */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {user ? <ReviewForm onSubmit={handleAddReview} />
                : <div className="bg-[#FCFAF7] rounded-3xl p-8 border border-[#EAE5DF] text-center">
                  <h3 className="text-xl font-bold text-[#1C1A17] mb-4">
                    {language === 'ar' ? 'شاركنا رأيك' : 'Share your thought'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {language === 'ar' ? 'سجل دخولك لتتمكن من إضافة تقييم ومشاركة تجربتك مع الآخرين.' : 'Log in to add a review and share your experience with others.'}
                  </p>
                  <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-[#111111] hover:bg-[#C5A880] text-white px-8 h-12 transition-all shadow-md w-full">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Log In'}
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
