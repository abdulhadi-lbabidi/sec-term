import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ar' | 'en';
export type UserRole = 'admin' | 'customer';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface CartItem {
  product: any;
  quantity: number;
  isPackage?: boolean;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  user: User | null;
  loginUser: (email: string, role: UserRole) => void;
  logoutUser: () => void;

  cart: CartItem[];
  addToCart: (item: any, qty: number, isPackage?: boolean) => void;
  removeFromCart: (itemId: string, isPackage?: boolean) => void;
  updateCartQty: (itemId: string, qty: number, isPackage?: boolean) => void;
  clearCart: () => void;

  wishlist: any[];
  toggleWishlist: (product: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar' as Language,
      setLanguage: (lang: Language) => set({ language: lang }),

      user: {
        name: 'ضيفنا الكريم',
        email: '',
        role: 'customer' as UserRole
      },
      loginUser: (email: string, role: UserRole) => set({
        user: {
          name: role === 'admin' ? 'الخباز الرئيسي (أدمن)' : 'ضيفنا الكريم',
          email,
          role
        }
      }),
      logoutUser: () => set({ user: null, cart: [], wishlist: [] }),

      cart: [],
      addToCart: (item: any, qty: number, isPackage: boolean = false) => set((state: AppState) => {
        const existingIndex = state.cart.findIndex(c => c.product.id === item.id && c.isPackage === isPackage);
        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + qty
          };
          return { cart: newCart };
        }
        return { cart: [...state.cart, { product: item, quantity: qty, isPackage }] };
      }),
      removeFromCart: (itemId: string, isPackage: boolean = false) => set((state: AppState) => ({
        cart: state.cart.filter(c => !(c.product.id === itemId && c.isPackage === isPackage))
      })),
      updateCartQty: (itemId: string, qty: number, isPackage: boolean = false) => set((state: AppState) => {
        if (qty <= 0) {
          return { cart: state.cart.filter(c => !(c.product.id === itemId && c.isPackage === isPackage)) };
        }
        return {
          cart: state.cart.map(c =>
            (c.product.id === itemId && c.isPackage === isPackage) ? { ...c, quantity: qty } : c
          )
        };
      }),
      clearCart: () => set({ cart: [] }),

      wishlist: [],
      toggleWishlist: (product: any) => set((state: AppState) => {
        const isFav = state.wishlist.find(p => p.id === product.id);
        if (isFav) {
          return { wishlist: state.wishlist.filter(p => p.id !== product.id) };
        }
        return { wishlist: [...state.wishlist, product] };
      }),
    }),
    {
      name: 'bakery-store',
      partialize: (state: AppState) => ({ language: state.language, user: state.user, cart: state.cart, wishlist: state.wishlist }),
    }
  ) as unknown as StateCreator<AppState, [], []>
);
