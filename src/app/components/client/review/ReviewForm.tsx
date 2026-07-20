import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { useAppStore } from '@/app/store/useAppStore';
import { translations } from '@/app/i18n/translations';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { language } = useAppStore();
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(language === 'ar' ? 'يرجى إعطاء تقييم بالنجوم أولاً' : 'Please select a star rating first');
      return;
    }
    onSubmit(rating, comment);
    // Reset form after submission
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FCFAF7] rounded-3xl p-6 md:p-8 border border-[#EAE5DF]">
      <h3 className="text-2xl font-black text-[#1C1A17] mb-6">{language === 'ar' ? 'شاركنا حبك لهذه التحفة' : 'Share your love for this masterpiece'}</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.rating || 'التقييم'} <span className="text-red-500">*</span>
        </label>
        <RatingStars
          rating={rating}
          interactive={true}
          onChange={setRating}
          size={28}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'كلمات من القلب (اختياري)' : 'Words from the heart (Optional)'}
        </label>
        <Textarea
          id="comment"
          rows={4}
          placeholder={language === 'ar' ? 'اكتب رأيك هنا...' : 'Write your review here...'}
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
          {isSubmitting ? (language === 'ar' ? 'جاري إرسال مشاعرك...' : 'Sending your feelings...') : (language === 'ar' ? 'إرسال رأيك بحب' : 'Send your review with love')}
        </Button>
      </div>
    </form>
  );
}
