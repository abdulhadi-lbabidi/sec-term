import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from 'react-i18next';

export const WishlistEmpty = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center bg-card border border-border rounded-3xl p-12 text-center shadow-sm">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <HeartCrack className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{t('wishlist.empty_title', 'Your wishlist is empty')}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t('wishlist.empty_message', 'Looks like you haven\'t added anything to your wishlist yet. Explore our products and save your favorites!')}
      </p>
      <Button asChild className="h-12 px-8 rounded-xl font-bold">
        <Link to="/shop">{t('wishlist.explore', 'Explore Products')}</Link>
      </Button>
    </div>
  );
};
