import { RatingStars } from './RatingStars';
import { useAppStore } from '@/app/store/useAppStore';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollableRow } from '../../ui/scrollable-row';

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

  const displayedReviews = filteredReviews.slice(0, 3);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="grid gap-6">
              {displayedReviews.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-full px-8 border-[#EAE5DF] text-[#1C1A17] font-bold hover:bg-[#FCFAF7] transition-all"
                >
                  {t('reviews.readAll')} ({filteredReviews.length})
                </Button>
              </div>
            )}

            <DialogContent className="max-w-[700px] h-[90vh] sm:h-[85vh] flex flex-col p-0 overflow-hidden bg-white sm:rounded-[32px] shadow-2xl gap-0 border-0">
              <div className="px-6 py-5 bg-white border-b border-[#EAE5DF] shrink-0 sticky top-0 z-20 flex justify-between items-center shadow-sm">
                <DialogTitle className="text-xl font-black text-[#1C1A17]">
                  {t('reviews.loversLog')}
                </DialogTitle>
              </div>

              <div className="overflow-y-auto flex-1 select-none flex flex-col no-scrollbar bg-[#FCFAF7]">
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
                            onClick={() => setSelectedVariant(prev => prev === variant.id ? null : variant.id)}
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
                      <h4 className="text-lg font-bold text-[#1C1A17] mb-2">No reviews match your filters</h4>
                      <p className="text-gray-500 text-sm max-w-[250px] mb-6">
                        Try selecting a different rating or variant to see more reviews.
                      </p>
                      <Button onClick={clearFilters} variant="outline" className="rounded-full font-bold">
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 max-w-3xl mx-auto">
                      {filteredReviews.map(review => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
