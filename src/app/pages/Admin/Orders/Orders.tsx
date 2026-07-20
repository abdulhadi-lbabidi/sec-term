import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Phone, Eye, ShoppingBag, MapPin, User, Calendar, CreditCard, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import { Dialog, DialogContent } from '../../../components/ui/dialog';
import { useOrdersQuery, useUpdateOrderStatusMutation } from '../../../api/Admin/orders';
import { useAuth } from '../../../context/AuthContext';
import { Order, OrderItem } from '@/types/Admin/orders';

export const Orders = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { hasPermission } = useAuth();
  const canUpdate = hasPermission('update_order');

  const { data, isLoading, isError, error } = useOrdersQuery(page, perPage);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const ordersList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-black font-sans">
        <div className="overflow-hidden rounded-xl border border-black/5">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/45" />
            </div>
          ) : isError ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive">
              <p className="font-semibold">{t('admin.error_loading')}</p>
              <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/5">
                    <TableRow>
                     
                      <TableHead className="font-bold">{t('admin.customer')}</TableHead>
                      <TableHead className="font-bold">{t('admin.total')}</TableHead>
                      <TableHead className="font-bold">{t('admin.payment')}</TableHead>
                      <TableHead className="font-bold">{t('admin.status')}</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold">{t('admin.created_at')}</TableHead>
                      <TableHead className="w-[80px] text-center font-bold">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-black/40">
                          {t('admin.no_orders')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersList.map((item: Order) => (
                        <TableRow key={item.id}>
                        
                          <TableCell>
                            {item.shipping_details ? (
                              <>
                                <div className="font-bold text-black">{item.shipping_details.first_name} {item.shipping_details.last_name}</div>
                                <div className="text-xs text-black/45 flex items-center gap-1 mt-0.5">
                                  <Phone size={12} />
                                  <span>{item.shipping_details.phone}</span>
                                </div>
                              </>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-black">
                            {item.total_amount} {t('admin.currency')}
                            <div className="text-[10px] text-black/40 font-normal">
                              {t('admin.items_count')}: {item.items?.length || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold uppercase">{item.payment_method}</TableCell>
                          <TableCell>
                            {canUpdate ? (
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className={`rounded-xl px-2.5 py-1 text-xs font-bold border border-black/10 bg-white cursor-pointer ${item.status === 'pending'
                                    ? 'text-amber-700 bg-amber-50'
                                    : item.status === 'completed'
                                      ? 'text-green-700 bg-green-50'
                                      : 'text-red-700 bg-red-50'
                                  }`}
                              >
                                <option value="pending">{t('admin.status_pending')}</option>
                                <option value="completed">{t('admin.status_completed')}</option>
                                <option value="cancelled">{t('admin.status_cancelled')}</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase ${item.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : item.status === 'completed'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {t(`admin.status_${item.status}`)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-black/50">
                            {item.created_at}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedOrder(item)}
                              className="text-black/60 hover:bg-black/5 hover:text-black rounded-full h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="block md:hidden space-y-4">
                {ordersList.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-black/40 bg-white rounded-xl border border-black/5">
                    {t('admin.no_orders')}
                  </div>
                ) : (
                  ordersList.map((item: Order) => (
                    <div key={item.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">#{item.id}</span>
                          <span className="text-[10px] text-black/35">{item.created_at}</span>
                        </div>
                        {canUpdate ? (
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold border border-black/10 bg-white"
                          >
                            <option value="pending">{t('admin.status_pending')}</option>
                            <option value="completed">{t('admin.status_completed')}</option>
                            <option value="cancelled">{t('admin.status_cancelled')}</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${item.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {t(`admin.status_${item.status}`)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        {item.shipping_details && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-black/55">{t('admin.customer')}:</span>
                              <span className="font-bold">{item.shipping_details.first_name} {item.shipping_details.last_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-black/55">{t('admin.phone')}:</span>
                              <span>{item.shipping_details.phone}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-black/55">{t('admin.total')}:</span>
                          <span className="font-bold text-black">{item.total_amount} {t('admin.currency')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black/55">{t('admin.payment')}:</span>
                          <span className="uppercase">{item.payment_method}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(item)}
                          className="h-8 gap-1 text-black/75 hover:bg-black/5 hover:text-black cursor-pointer text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {t('admin.view')}
                        </Button>
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

      {/* Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="sm:max-w-[650px] w-full bg-white p-0 rounded-3xl shadow-2xl border-0 overflow-hidden text-black font-sans">
          {selectedOrder && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header block with elegant subtle gradient banner */}
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-850 border-b border-black/5 px-6 py-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold tracking-wider uppercase mb-1">
                    <span>{t('admin.order_details')}</span>
                    <span>·</span>
                    <span className="text-amber-600 font-black">#{selectedOrder.id}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-black tracking-tight">
                    {selectedOrder.shipping_details ? `${selectedOrder.shipping_details.first_name} ${selectedOrder.shipping_details.last_name}` : t('admin.customer')}
                  </h3>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase border ${
                  selectedOrder.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : selectedOrder.status === 'completed'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {t(`admin.status_${selectedOrder.status}`)}
                </span>
              </div>

              <div className="p-6 overflow-y-auto space-y-6" style={{ minHeight: 0 }}>
                {/* Meta data row */}
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-neutral-200/60 flex items-center justify-center shrink-0">
                      <Calendar className="h-4.5 w-4.5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{t('admin.created_at')}</p>
                      <p className="text-xs font-black text-neutral-800 mt-0.5">{selectedOrder.created_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-neutral-200/60 flex items-center justify-center shrink-0">
                      <CreditCard className="h-4.5 w-4.5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{t('admin.payment')}</p>
                      <p className="text-xs font-black text-neutral-800 uppercase mt-0.5">{selectedOrder.payment_method}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping info Section */}
                {selectedOrder.shipping_details && (
                  <div className="space-y-3 bg-neutral-50/50 p-4 rounded-2xl border border-black/5">
                    <h4 className="font-extrabold text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      {t('admin.shipping_details')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="space-y-1">
                        <span className="text-neutral-400 font-semibold">{t('admin.name')}</span>
                        <p className="font-bold text-neutral-800 flex items-center gap-1">
                          <User className="h-3 w-3 text-neutral-400" />
                          {selectedOrder.shipping_details.first_name} {selectedOrder.shipping_details.last_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 font-semibold">{t('admin.phone')}</span>
                        <p className="font-bold text-neutral-800 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          <span dir="ltr">{selectedOrder.shipping_details.phone}</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 font-semibold">{t('admin.email') || 'Email'}</span>
                        <p className="font-bold text-neutral-800 flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 text-neutral-400" />
                          <span>{selectedOrder.shipping_details.email}</span>
                        </p>
                      </div>
                      <div className="sm:col-span-3 space-y-1 border-t border-black/5 pt-2">
                        <span className="text-neutral-400 font-semibold">{t('admin.address')}</span>
                        <p className="font-bold text-neutral-800 leading-relaxed">
                          {selectedOrder.shipping_details.country}, {selectedOrder.shipping_details.city}, {selectedOrder.shipping_details.street}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order items list */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-neutral-550 uppercase tracking-wider flex items-center gap-1.5 px-1">
                    <ShoppingBag className="h-4 w-4 text-neutral-450" />
                    {t('admin.items')}
                  </h4>
                  <div className="border border-black/5 rounded-2xl overflow-hidden divide-y divide-black/5 bg-white">
                    {selectedOrder.items?.map((item: OrderItem) => (
                      <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-neutral-50 transition-colors">
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0 border border-black/5">
                            <ShoppingBag className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-800 truncate text-[13px]">{item.product_name}</p>
                            <div className="text-[10px] text-neutral-400 font-semibold mt-1 flex items-center gap-1.5 flex-wrap">
                              {item.variant?.size && (
                                <span className="bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-600">
                                  {t('admin.size')}: {item.variant.size}
                                </span>
                              )}
                              {item.variant?.material && (
                                <span className="bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-600">
                                  {t('admin.material')}: {item.variant.material}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-end shrink-0 pl-4">
                          <span className="text-[11px] font-bold text-neutral-400">{item.quantity} × {item.price} {t('admin.currency')}</span>
                          <p className="font-bold text-neutral-900 mt-1 text-sm">{item.total} {t('admin.currency')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price summary block with light bottom background */}
              <div className="bg-neutral-50 text-neutral-800 p-6 shrink-0 space-y-3 border-t border-black/5">
                <div className="flex justify-between text-xs font-semibold text-neutral-500">
                  <span>{t('admin.subtotal')}:</span>
                  <span className="text-neutral-800">{selectedOrder.total_amount - selectedOrder.shipping_fee} {t('admin.currency')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-neutral-500">
                  <span>{t('admin.shipping_fee')}:</span>
                  <span className="text-neutral-800">{selectedOrder.shipping_fee} {t('admin.currency')}</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-neutral-200 pt-3 text-neutral-950">
                  <span>{t('admin.total')}:</span>
                  <span className="text-amber-600">{selectedOrder.total_amount} {t('admin.currency')}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
