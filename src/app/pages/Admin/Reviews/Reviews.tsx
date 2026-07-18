import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { DeleteConfirmationModal } from '../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import { useReviewsQuery, useDeleteReviewMutation, Review } from '../../../api/Admin/reviews';

export const Reviews = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, error } = useReviewsQuery(page, perPage);
  const deleteMutation = useDeleteReviewMutation();

  const handleDeleteReview = (id: number) => {
    setReviewIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reviewIdToDelete !== null) {
      deleteMutation.mutate(reviewIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setReviewIdToDelete(null);
        },
      });
    }
  };

  const reviewsList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between">
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
        <div className="overflow-hidden rounded-xl border border-black/5">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/45" />
            </div>
          ) : isError ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive">
              <p className="font-semibold">{isRtl ? 'حدث خطأ أثناء تحميل المراجعات' : 'Error loading reviews'}</p>
              <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-black/5">
                <TableRow>
                  <TableHead className="font-bold">{isRtl ? 'المستخدم' : 'User'}</TableHead>
                  <TableHead className="font-bold">{isRtl ? 'المنتج (SKU)' : 'Product (SKU)'}</TableHead>
                  <TableHead className="font-bold">{isRtl ? 'التقييم' : 'Rating'}</TableHead>
                  <TableHead className="font-bold">{isRtl ? 'التعليق' : 'Comment'}</TableHead>
                  <TableHead className="hidden sm:table-cell font-bold">{isRtl ? 'تاريخ الإنشاء' : 'Created At'}</TableHead>
                  <TableHead className="w-[80px] text-center font-bold">{isRtl ? 'إجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-black/40">
                      {isRtl ? 'لا توجد مراجعات' : 'No reviews found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  reviewsList.map((review: Review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="font-medium">{review.user?.name}</div>
                        <div className="text-xs text-black/50">{review.user?.email}</div>
                      </TableCell>
                      <TableCell>
                        {review.product_variant?.sku ? (
                          <span className="bg-black/5 px-2 py-1 rounded-md text-xs font-semibold">{review.product_variant.sku}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-amber-500">
                          {review.rating} <Star className="h-3.5 w-3.5 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={review.comment}>
                        {review.comment}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-black/50">
                        {review.created_at}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <GeneralPagination
        currentPage={data?.meta?.current_page || 1}
        lastPage={data?.meta?.last_page || 1}
        onPageChange={(p) => setPage(p)}
        isRtl={isRtl}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReviewIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
