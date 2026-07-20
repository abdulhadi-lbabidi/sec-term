import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from './cart.service';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useCartQuery = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartService.getCart(),
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      // Show a user-friendly toast with the API error message, fallback to generic text
      const message = err?.response?.data?.message || err?.message || 'Failed to add item to cart';
      import('sonner').then(({ toast }) => toast.error(message));
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number | string; quantity: number }) => 
      cartService.updateCartItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to update cart';
      import('sonner').then(({ toast }) => toast.error(message));
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to remove item';
      import('sonner').then(({ toast }) => toast.error(message));
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to clear cart';
      import('sonner').then(({ toast }) => toast.error(message));
    },
  });
};
