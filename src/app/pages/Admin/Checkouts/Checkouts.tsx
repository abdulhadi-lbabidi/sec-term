import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, User, Phone } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import { useCheckoutsQuery } from '../../../api/Admin/checkouts';
import { CheckoutItem } from '@/types/Admin/checkouts';

export const Checkouts = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, error } = useCheckoutsQuery(page, perPage);

  const checkoutsList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
        <div className="overflow-hidden rounded-xl border border-black/5">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/45" />
            </div>
          ) : isError ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive">
              <p className="font-semibold">{t('admin.error_loading') || 'Error loading checkouts'}</p>
              <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/5">
                    <TableRow>
                      <TableHead className="font-bold">{t('admin.customer') || 'Customer'}</TableHead>
                      <TableHead className="font-bold">{t('admin.contact') || 'Contact'}</TableHead>
                      <TableHead className="font-bold">{t('admin.address') || 'Address'}</TableHead>
                      <TableHead className="font-bold">{t('admin.status') || 'Status'}</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold">{t('admin.created_at') || 'Date'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkoutsList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-black/40">
                          {t('admin.no_checkouts') || 'No checkouts found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      checkoutsList.map((item: CheckoutItem) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-bold text-black">{item.first_name} {item.last_name}</div>
                            {item.user && (
                              <div className="text-xs text-black/45 flex items-center gap-1 mt-0.5">
                                <User size={12} />
                                <span>{item.user.name}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-semibold text-black">{item.email}</div>
                            <div className="text-[11px] text-black/55 flex items-center gap-1 mt-0.5">
                              <Phone size={11} />
                              <span>{item.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-black leading-normal max-w-[220px] truncate" title={`${item.country}, ${item.city}, ${item.street}`}>
                              {item.city}, {item.street}
                            </div>
                            <div className="text-[10px] text-black/45">
                              {item.floor ? `${t('admin.floor') || 'Floor'}: ${item.floor}` : ''} {item.postal_code ? `| ${item.postal_code}` : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                              item.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {t(`admin.status_${item.status}`) || item.status}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-black/50">
                            {item.created_at}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="block md:hidden space-y-4">
                {checkoutsList.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-black/40 bg-white rounded-xl border border-black/5">
                    {t('admin.no_checkouts') || 'No checkouts found'}
                  </div>
                ) : (
                  checkoutsList.map((item: CheckoutItem) => (
                    <div key={item.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{item.first_name} {item.last_name}</span>
                          <span className="text-[10px] text-black/35">{item.email}</span>
                        </div>
                        <span className="text-[10px] text-black/35">{item.created_at}</span>
                      </div>
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-black/55">{t('admin.phone') || 'Phone'}:</span>
                          <span className="font-medium">{item.phone}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-black/55 shrink-0">{t('admin.address') || 'Address'}:</span>
                          <span className="text-end font-medium max-w-[200px] truncate">{item.city}, {item.street}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black/55">{t('admin.status') || 'Status'}:</span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            item.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {t(`admin.status_${item.status}`) || item.status}
                          </span>
                        </div>
                        {item.additional_information && (
                          <div className="border-t pt-2 mt-1">
                            <p className="font-semibold text-black/60 mb-0.5 text-[10px]">{t('admin.additional_info') || 'Additional Info'}:</p>
                            <p className="text-black bg-black/[0.02] p-2 rounded-lg leading-relaxed text-[11px]">{item.additional_information}</p>
                          </div>
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
    </div>
  );
};
