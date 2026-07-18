import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';

interface ProductActionsProps {
  qty: number;
  maxStock: number;
  onDecreaseQty: () => void;
  onIncreaseQty: () => void;
  onAddToCart: () => void;
  addToCartLabel: string;
  outOfStockLabel: string;
}

export function ProductActions({
  qty,
  maxStock,
  onDecreaseQty,
  onIncreaseQty,
  onAddToCart,
  addToCartLabel,
  outOfStockLabel
}: ProductActionsProps) {
  return (
    <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 w-full sm:w-auto shrink-0 justify-between">
        <button 
          onClick={onDecreaseQty} 
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-full transition-colors"
        >
          <Minus size={20} />
        </button>
        <span className="font-black text-xl w-12 text-center">{qty}</span>
        <button 
          onClick={onIncreaseQty} 
          disabled={qty >= maxStock} 
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>

      <Button
        onClick={onAddToCart}
        disabled={maxStock <= 0}
        className="w-full h-14 bg-[#111111] hover:bg-[#C5A880] text-white rounded-full text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        <ShoppingBag size={22} />
        {maxStock > 0 ? addToCartLabel : outOfStockLabel}
      </Button>
    </div>
  );
}

export function ProductActionsSkeleton() {
  return (
    <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
      <Skeleton className="w-full sm:w-[150px] h-14 rounded-full" />
      <Skeleton className="w-full h-14 rounded-full" />
    </div>
  );
}
