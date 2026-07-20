import { RatingStars } from './RatingStars';
import { useAppStore } from '@/app/store/useAppStore';
import { translations } from '@/app/i18n/translations';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';

export interface Review {
  id: string | number;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment?: string;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FCFAF7] border border-[#EAE5DF] flex items-center justify-center text-[#C5A880] font-bold text-lg shrink-0">
          {review.user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-[#1C1A17] text-sm line-clamp-1">{review.user.name}</h4>
          <span className="text-xs text-gray-400">
            {format(new Date(review.created_at), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
      <RatingStars rating={review.rating} size={14} />
    </div>
    {review.comment && (
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
    )}
  </div>
);

export function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  const { language } = useAppStore();
  const t = translations[language];

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const displayedReviews = reviews.slice(0, 3);
  const hasMore = reviews.length > 3;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center justify-center min-w-[150px] space-y-2">
          <span className="text-5xl font-black text-[#1C1A17]">{averageRating.toFixed(1)}</span>
          <RatingStars rating={averageRating} size={20} />
          <span className="text-sm text-gray-500">{totalReviews} {t.reviews || 'تقييم'}</span>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          {distribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-sm">
              <div className="w-12 text-gray-500 font-medium flex items-center gap-1">
                {stars} <span className="text-yellow-400 text-lg leading-none">★</span>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-8 text-right text-gray-400 text-xs">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#1C1A17]">{t.reviews || 'التقييمات'}</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            {t.noReviews || 'لا توجد تقييمات بعد. كن أول من يكتب تقييماً!'}
          </div>
        ) : (
          <Dialog>
            <div className="grid gap-6">
              {displayedReviews.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-6 text-center">
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 hover:text-[#111111] hover:border-gray-300">
                    {language === 'ar' ? `عرض كل التقييمات (${totalReviews})` : `See all reviews (${totalReviews})`}
                  </Button>
                </DialogTrigger>
              </div>
            )}
            
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-gray-50/50">
              <div className="p-6 bg-white border-b border-gray-100 shrink-0">
                <DialogTitle className="text-xl font-bold text-[#1C1A17]">
                  {language === 'ar' ? 'جميع التقييمات' : 'All Reviews'}
                </DialogTitle>
              </div>
              <div className="p-6 overflow-y-auto flex-1 grid gap-6">
                {reviews.map(review => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
