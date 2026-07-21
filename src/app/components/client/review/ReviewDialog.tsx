import { Dialog, DialogContent, DialogTitle } from '../../ui/dialog';
import { RatingStars } from './RatingStars';
import { Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '@/lib/utils';
import { ScrollableRow } from '../../ui/scrollable-row';
import { Review } from './ReviewList';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Skeleton } from '../../ui/skeleton';
import { useTranslation } from 'react-i18next';

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FCFAF7] border border-[#EAE5DF] flex items-center justify-center text-[#C5A880] font-bold text-lg shrink-0">
          {review.user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[#1C1A17] text-sm line-clamp-1">{review.user.name}</h4>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {format(new Date(review.created_at), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
      <RatingStars rating={review.rating} size={14} />
    </div>
    {(review.variantName || review.product_variant) && (
      <div className="flex items-center gap-3 rounded-2xl border border-[#EAE5DF] bg-[#FCFAF7] p-2.5">
        {review.product_variant?.image && (
          <img
            src={review.product_variant.image}
            alt={review.variantName || review.product_variant.sku || 'Product variant'}
            className="h-12 w-12 shrink-0 rounded-xl object-cover border border-[#EAE5DF]"
          />
        )}
        <div className="min-w-0">
          {review.variantName && (
            <p className="truncate text-xs font-bold text-[#1C1A17]">{review.variantName}</p>
          )}
          {review.product_variant?.sku && (
            <p className="truncate text-[11px] text-gray-500 font-medium mt-0.5">{review.product_variant.sku}</p>
          )}
        </div>
      </div>
    )}
    {review.comment && (
      <p className="text-[#4A453E] text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
    )}
  </div>
);

interface ReviewDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number; percentage: number }[];
  uniqueVariants: { id: string; name: string }[];
}

export const ReviewDialog = ({
  isOpen,
  setIsOpen,
  reviews,
  averageRating,
  totalReviews,
  distribution,
  uniqueVariants
}: ReviewDialogProps) => {
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchRating = selectedRating ? Math.round(r.rating) === selectedRating : true;
      const matchVariant = selectedVariant
        ? (String(r.product_variant?.id) === selectedVariant || r.variantName === selectedVariant)
        : true;
      return matchRating && matchVariant;
    });
  }, [reviews, selectedRating, selectedVariant]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filteredReviews]);

  const handleRatingClick = (stars: number) => {
    setSelectedRating(prev => prev === stars ? null : stars);
  };

  const clearFilters = () => {
    setSelectedRating(null);
    setSelectedVariant(null);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (visibleCount < filteredReviews.length && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 10, filteredReviews.length));
          setIsLoadingMore(false);
        }, 800);
      }
    }
  };

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[700px] h-[90vh] sm:h-[85vh] flex flex-col p-0 overflow-hidden bg-white sm:rounded-[32px] shadow-2xl gap-0 border-0">
        <div className="px-6 py-5 bg-white border-b border-[#EAE5DF] shrink-0 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <DialogTitle className="text-xl font-black text-[#1C1A17]">
            {t('reviews.loversLog')}
          </DialogTitle>
        </div>

        <div className="overflow-y-auto flex-1 select-none flex flex-col no-scrollbar bg-[#FCFAF7]" onScroll={handleScroll}>
          <div className="p-6 sm:p-8 bg-white shrink-0 border-b border-[#EAE5DF]">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-7xl font-black text-[#1C1A17] tracking-tighter leading-none">{averageRating.toFixed(1)}</span>
                <div className="pt-2">
                  <RatingStars rating={averageRating} size={20} />
                </div>
                <span className="text-sm font-medium text-gray-400 mt-2">{totalReviews} {t('reviews.loversShared')}</span>
              </div>

              <div className="flex-1 w-full space-y-2.5 select-none">
                {distribution.map(({ stars, count, percentage }) => {
                  const isSelected = selectedRating === stars;
                  return (
                    <div
                      key={stars}
                      onClick={() => handleRatingClick(stars)}
                      className={cn(
                        "flex items-center gap-3 text-sm cursor-pointer group p-1 -mx-1 rounded-full transition-all duration-300",
                        isSelected ? "bg-[#FCFAF7]" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-4 text-xs font-bold text-gray-500 text-right">{stars}</div>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", isSelected ? "bg-[#1C1A17]" : "bg-yellow-400 group-hover:bg-yellow-500")}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white border-b border-[#EAE5DF] sticky top-0 z-10 shadow-sm shrink-0">
            <ScrollableRow className="px-6 py-4 gap-2.5">
              <button
                onClick={clearFilters}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200 flex items-center gap-2",
                  !selectedRating && !selectedVariant
                    ? "bg-[#1C1A17] text-white border-[#1C1A17]"
                    : "bg-white text-gray-600 border-[#EAE5DF] hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {t("reviews.all-reviews")}
              </button>

              {[5, 4, 3, 2, 1].map(star => {
                const isSelected = selectedRating === star;
                return (
                  <button
                    key={`chip-star-${star}`}
                    onClick={() => handleRatingClick(star)}
                    className={cn(
                      "shrink-0 px-4 py-2 flex items-center gap-1.5 rounded-full text-sm font-bold border transition-all duration-200",
                      isSelected
                        ? "bg-[#C5A880]/10 text-[#A68A64] border-[#C5A880]/30"
                        : "bg-white text-gray-600 border-[#EAE5DF] hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {star} <Star size={14} className={cn("mb-0.5", isSelected ? "fill-[#A68A64] text-[#A68A64]" : "fill-gray-400 text-gray-400")} />
                  </button>
                )
              })}
            </ScrollableRow>

            {uniqueVariants.length > 1 && (
              <ScrollableRow className="px-6 pb-4 gap-2.5 pt-1 border-t border-gray-50">
                {uniqueVariants.map(variant => {
                  const isSelected = selectedVariant === variant.id;
                  return (
                    <button
                      key={`chip-var-${variant.id}`}
                      onClick={() => setSelectedVariant(selectedVariant === variant.id ? null : variant.id)}
                      className={cn(
                        "shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200",
                        isSelected
                          ? "bg-[#1C1A17] text-white border-[#1C1A17]"
                          : "bg-white text-gray-600 border-[#EAE5DF] hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </ScrollableRow>
            )}
          </div>

          <div className="p-6 flex-1">
            {filteredReviews.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#EAE5DF]">
                  <Star className="text-gray-300 w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#1C1A17] mb-2">{t('reviews.noReviewsMatch', 'No reviews match your filters')}</h4>
                <p className="text-gray-500 text-sm max-w-[250px] mb-6">
                  {t('reviews.tryAdjustingFilters', 'Try selecting a different rating or variant to see more reviews.')}
                </p>
                <Button onClick={clearFilters} variant="outline" className="rounded-full font-bold">
                  {t('reviews.clearAllFilters', 'Clear all filters')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 max-w-3xl mx-auto">
                {displayedReviews.map(review => (
                  <ReviewItem key={review.id} review={review} />
                ))}
                {isLoadingMore && (
                  <div className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="w-24 h-4" />
                    </div>
                    <Skeleton className="w-full h-16" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
