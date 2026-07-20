import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/app/api/client/cart.service';

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
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
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
  });
};
