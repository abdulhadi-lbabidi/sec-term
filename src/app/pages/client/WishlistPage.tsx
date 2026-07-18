import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store/useAppStore';
import { useWishlist } from '@/app/api/client/useWishlist';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { WishlistSkeleton } from '@/app/components/client/wishlist/WishlistSkeleton';
import { WishlistEmpty } from '@/app/components/client/wishlist/WishlistEmpty';
import { WishlistGrid } from '@/app/components/client/wishlist/WishlistGrid';

export default function WishlistPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { wishlist: localWishlist } = useAppStore();
  const { data: apiWishlistData, isLoading } = useWishlist();

  // Prefer API wishlist if available, otherwise fallback to local Zustand store
  const wishlistItems = (apiWishlistData && apiWishlistData.length > 0) ? apiWishlistData : localWishlist;

  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 min-h-[60vh]">
      {/* Navigation (Breadcrumb / Back) */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        <span className="font-medium">{t('nav.shop', 'Shop')}</span>
      </button>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {t('wishlist.title', 'My Wishlist')}
        </h1>
        <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-semibold">
          {wishlistItems.length}
        </span>
      </div>

      {isLoading
        ? <WishlistSkeleton />
        : wishlistItems.length === 0
          ? <WishlistEmpty />
          : <WishlistGrid items={wishlistItems} />
      }
    </div>
  );
}
