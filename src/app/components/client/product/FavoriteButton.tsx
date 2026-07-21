import React from 'react';
import { Heart } from 'lucide-react';
import { useAppStore } from '@/app/store/useAppStore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  product: any;
  className?: string;
  iconSize?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product, className, iconSize = 18 }) => {
  const { wishlist, toggleWishlist, user } = useAppStore();
  const { t } = useTranslation();

  if (!product) return null;

  const isFav = wishlist.some(p => p.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(t('messages.loginRequired'));
      return;
    }

    toggleWishlist(product);
    if (isFav) {
      toast.success(t('messages.removedFromWishlist'));
    } else {
      toast.success(t('messages.addedToWishlist'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      className={cn(
        "rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all z-20",
        isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-white',
        className
      )}
    >
      <Heart size={iconSize} fill={isFav ? "currentColor" : "none"} />
    </button>
  );
};
