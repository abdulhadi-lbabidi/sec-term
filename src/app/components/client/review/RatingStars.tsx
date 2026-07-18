import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = 18,
  interactive = false,
  onChange,
  className
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalf = !interactive && starValue - 0.5 <= displayRating && starValue > displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-all duration-200",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
            style={{ padding: 0, background: 'none', border: 'none' }}
          >
            <div className="relative">
              {/* Background empty star */}
              <Star
                size={size}
                className="text-gray-200"
                strokeWidth={1.5}
              />
              {/* Foreground filled/half star */}
              {(isFilled || isHalf) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star
                    size={size}
                    className="text-yellow-400 fill-yellow-400"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
