import { RatingStars } from './RatingStars';
import { useAppStore } from '@/app/store/useAppStore';
import { format } from 'date-fns';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewDialog } from './ReviewDialog';

export interface Review {
  id: string | number;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment?: string;
  created_at: string;
  variantName?: string;
  product_variant?: {
    id: string | number;
    sku?: string;
    price?: number;
    image?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isLoading?: boolean;
}

export const ReviewItem = ({ review }: { review: Review }) => (
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

export function ReviewList({ reviews, averageRating, totalReviews, isLoading }: ReviewListProps) {
  const { language } = useAppStore();
  const { t } = useTranslation();

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const uniqueVariants = useMemo(() => {
    const variants = new Map<string, { id: string; name: string }>();
    reviews.forEach(r => {
      if (r.product_variant?.id) {
        variants.set(String(r.product_variant.id), {
          id: String(r.product_variant.id),
          name: r.variantName || r.product_variant.sku || 'Variant'
        });
      } else if (r.variantName) {
        variants.set(r.variantName, { id: r.variantName, name: r.variantName });
      }
    });
    return Array.from(variants.values());
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchRating = selectedRating ? Math.round(r.rating) === selectedRating : true;
      const matchVariant = selectedVariant
        ? (String(r.product_variant?.id) === selectedVariant || r.variantName === selectedVariant)
        : true;
      return matchRating && matchVariant;
    });
  }, [reviews, selectedRating, selectedVariant]);

  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const displayedReviews = filteredReviews.slice(0, 4);
  const hasMore = filteredReviews.length > 3;

  const handleRatingClick = (stars: number) => {
    setSelectedRating(prev => prev === stars ? null : stars);
  };

  const clearFilters = () => {
    setSelectedRating(null);
    setSelectedVariant(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-10 w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
          <div className="flex flex-col items-center justify-center min-w-[150px] space-y-2">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex-1 w-full space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm w-full">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white p-6 sm:p-8 rounded-[32px] border border-[#EAE5DF] shadow-sm">
        <div className="flex flex-col items-center justify-center min-w-[180px] space-y-2">
          <span className="text-6xl font-black text-[#1C1A17] tracking-tighter">{averageRating.toFixed(1)}</span>
          <RatingStars rating={averageRating} size={22} />
          <span className="text-sm font-medium text-gray-500">{totalReviews} {t('reviews.loversShared')}</span>
        </div>

        <div className="flex-1 w-full space-y-3 select-none">
          {distribution.map(({ stars, count, percentage }) => {
            const isSelected = selectedRating === stars;
            return (
              <div
                key={stars}
                onClick={() => handleRatingClick(stars)}
                className={cn(
                  "flex items-center gap-4 text-sm cursor-pointer group p-1.5 -mx-1.5 rounded-full transition-all duration-300",
                  isSelected ? "bg-[#FCFAF7] border border-[#EAE5DF]" : "hover:bg-gray-50 border border-transparent"
                )}
                role="button"
                tabIndex={0}
              >
                <div className={cn("w-12 font-bold flex items-center gap-1.5 justify-end", isSelected ? "text-[#C5A880]" : "text-gray-500")}>
                  {stars} <Star size={14} className={cn("mb-0.5", isSelected ? "fill-[#C5A880] text-[#C5A880]" : "fill-gray-300 text-gray-300")} />
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", isSelected ? "bg-[#C5A880]" : "bg-yellow-400 group-hover:bg-yellow-500")}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className={cn("w-10 text-right text-xs font-bold", isSelected ? "text-[#C5A880]" : "text-gray-400")}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-[#1C1A17]">{t('reviews.loversOpinions', 'Customer Opinions')}</h3>

        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#FCFAF7] rounded-3xl border border-dashed border-[#EAE5DF]">
            <div className="text-4xl mb-4">✨</div>
            <h4 className="text-lg font-bold text-[#1C1A17] mb-2">{t('reviews.noReviews', 'No reviews found')}</h4>
            {reviews.length > 0 ? (
              <>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-4">
                  {t('reviews.adjustFilters', 'Try adjusting your filters to see more reviews.')}
                </p>
                <Button variant="outline" onClick={clearFilters} className="rounded-full">
                  {t('reviews.clearFilters', 'Clear Filters')}
                </Button>
              </>
            ) : (
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-4">
                {t('reviews.beFirst', 'Be the first to review this product.')}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedReviews.map(review => (
                <ReviewItem key={`review-${review.id}`} review={review} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-full px-8 font-bold border-[#EAE5DF] text-[#1C1A17] hover:bg-gray-50"
                >
                  {t('reviews.viewAll', 'View All Reviews')} ({filteredReviews.length})
                </Button>
              </div>
            )}
          </>
        )}

        <ReviewDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
          distribution={distribution}
          uniqueVariants={uniqueVariants}
        />
      </div>
    </div>
  );
}
