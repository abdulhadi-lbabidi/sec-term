import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2, Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
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

  const { hasPermission } = useAuth();
  const canDelete = hasPermission('delete_review');

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
              <p className="font-semibold">{t('admin.error_loading_reviews')}</p>
              <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/5">
                    <TableRow>
                      <TableHead className="font-bold">{t('admin.user')}</TableHead>
                      <TableHead className="font-bold">{t('admin.product_sku')}</TableHead>
                      <TableHead className="font-bold">{t('admin.rating')}</TableHead>
                      <TableHead className="font-bold">{t('admin.comment')}</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold">{t('admin.created_at')}</TableHead>
                      <TableHead className="w-[80px] text-center font-bold">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewsList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-black/40">
                          {t('admin.no_reviews_found')}
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
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="block md:hidden space-y-4">
                {reviewsList.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-black/40">
                    {t('admin.no_reviews_found')}
                  </div>
                ) : (
                  reviewsList.map((review: Review) => (
                    <div key={review.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{review.user?.name}</span>
                          <span className="text-[10px] text-black/35">{review.user?.email}</span>
                        </div>
                        <span className="text-[10px] text-black/35">{review.created_at}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-black/55">{t('admin.product_sku')}:</span>
                          {review.product_variant?.sku ? (
                            <span className="bg-black/5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">{review.product_variant.sku}</span>
                          ) : (
                            '-'
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-black/55">{t('admin.rating')}:</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            {review.rating} <Star className="h-3 w-3 fill-current" />
                          </span>
                        </div>
                        <div className="text-xs border-t pt-2 mt-1">
                          <p className="font-semibold text-black/60 mb-0.5">{t('admin.comment')}:</p>
                          <p className="text-black bg-black/[0.02] p-2 rounded-lg leading-relaxed text-xs">{review.comment}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            className="h-8 gap-1 text-destructive/85 hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t('admin.delete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
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
