import { useState, useEffect } from 'react';
import { RatingStars } from './RatingStars';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string, variantId?: string | number) => void;
  isSubmitting?: boolean;
  variants?: { id: string | number; name: string }[];
  variantName?: string;
  initialVariantId?: string | number;
}

export function ReviewForm({ onSubmit, isSubmitting = false, variants = [], variantName, initialVariantId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | number | ''>(initialVariantId || '');

  const { t } = useTranslation();

  useEffect(() => {
    if (initialVariantId) {
      setSelectedVariantId(initialVariantId);
    }
  }, [initialVariantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t('reviews.emptyRatingError'));
      return;
    }
    if (variants.length > 0 && selectedVariantId === '') {
      toast.error(t('reviews.emptyVariantError', 'Please select a variant to review'));
      return;
    }
    onSubmit(rating, comment, selectedVariantId !== '' ? selectedVariantId : undefined);
    // Reset form after submission
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FCFAF7] rounded-3xl p-6 md:p-8 border border-[#EAE5DF]">
      <h3 className="text-2xl font-black text-[#1C1A17] mb-2">{t('reviews.formTitle')}</h3>
      {variantName && variants.length === 0 && (
        <div className="mb-6 inline-block bg-[#111111]/5 px-3 py-1.5 rounded-lg text-sm text-[#111111]/70 font-semibold border border-[#111111]/10">
          {variantName}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('reviews.ratingLabel')} <span className="text-red-500">*</span>
        </label>
        <RatingStars
          rating={rating}
          interactive={true}
          onChange={setRating}
          size={28}
        />
      </div>

      {variants && variants.length > 0 && (
        <div className="mb-6">
          <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-2">
            {t('reviews.variantLabel', 'Product Variant')} <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedVariantId ? String(selectedVariantId) : undefined}
            onValueChange={(val) => setSelectedVariantId(val)}
          >
            <SelectTrigger id="variant" className="w-full h-12 px-4 rounded-2xl bg-white border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#C5A880] focus-visible:outline-none transition-all">
              <SelectValue placeholder={t('reviews.selectVariantPlaceholder', 'Select a variant to review')} />
            </SelectTrigger>
            <SelectContent>
              {variants.map(v => (
                <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          {t('reviews.commentLabel')}
        </label>
        <Textarea
          id="comment"
          rows={4}
          placeholder={t('reviews.commentPlaceholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none rounded-2xl bg-white border-gray-200 focus-visible:ring-[#C5A880]"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#111111] hover:bg-[#C5A880] text-white px-8 h-12 transition-all shadow-md disabled:opacity-50"
        >
          {isSubmitting ? t('reviews.submitting') : t('reviews.submit')}
        </Button>
      </div>
    </form>
  );
}
