import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '../ui/pagination';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface GeneralPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isRtl?: boolean;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
}

export const GeneralPagination = ({
  currentPage,
  lastPage,
  onPageChange,
  isRtl = false,
  perPage,
  onPerPageChange,
}: GeneralPaginationProps) => {
  const { t } = useTranslation();
  if (lastPage < 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className={`fixed bottom-1 h-fit z-40 ${isRtl ? 'left-8' : 'right-8'} flex items-center gap-4 rounded-xl border border-black/5 bg-[#fefcfa]/90 p-1.5 shadow-lg backdrop-blur`}>
      {onPerPageChange && (
        <div className={`flex items-center gap-2 ${isRtl ? 'pr-2' : 'pl-2'}`}>
          <span className="text-xs font-semibold text-black/60 hidden sm:inline">
            {isRtl ? 'عرض:' : 'Show:'}
          </span>
          <Select
            value={String(perPage || 10)}
            onValueChange={(val) => onPerPageChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[65px] text-xs font-bold border-black/10 bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((num) => (
                <SelectItem key={num} value={String(num)} className="text-xs font-bold">
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="flex items-center gap-1.5">
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40"
            >
              {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span className="hidden sm:inline">{t('admin.previous')}</span>
            </Button>
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <Button
                variant={p === currentPage ? 'outline' : 'ghost'}
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 text-xs font-bold ${p === currentPage
                    ? 'border-black bg-black text-white hover:bg-black hover:text-white'
                    : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
              >
                {p}
              </Button>
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40"
            >
              <span className="hidden sm:inline">{t('admin.next')}</span>
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
