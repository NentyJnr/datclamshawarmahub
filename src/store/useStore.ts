import { create } from 'zustand';
import { CartItem, MenuItem, Order, OrderStatus, UserRole } from '../types';

interface AuthState {
  user: { id: string; name: string; role: UserRole } | null;
  token: string | null;
  login: (user: { id: string; name: string; role: UserRole }, token: string) => void;
  logout: () => void;
}

interface CartState {
  items: CartItem[];
  fixedDeliveryFee: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getGrandTotal: () => number;
}

interface ActiveOrderState {
  order: Order | null;
  riderLocation: { latitude: number; longitude: number } | null;
  setActiveOrder: (order: Order) => void;
  updateOrderStatus: (status: OrderStatus) => void;
  updateRiderLocation: (lat: number, lon: number) => void;
  clearActiveOrder: () => void;
}

interface AppStore {
  auth: AuthState;
  cart: CartState;
  activeOrder: ActiveOrderState;
}

export const useStore = create<AppStore>((set, get) => ({
  auth: {
    user: JSON.parse(localStorage.getItem('shawarma_user') || 'null'),
    token: localStorage.getItem('shawarma_token'),
    login: (user, token) => {
      localStorage.setItem('shawarma_user', JSON.stringify(user));
      localStorage.setItem('shawarma_token', token);
      set((state) => ({
        auth: { ...state.auth, user, token }
      }));
    },
    logout: () => {
      localStorage.removeItem('shawarma_user');
      localStorage.removeItem('shawarma_token');
      set((state) => ({
        auth: { ...state.auth, user: null, token: null }
      }));
    }
  },

  cart: {
    items: JSON.parse(localStorage.getItem('shawarma_cart') || '[]'),
    fixedDeliveryFee: 1500,

    addToCart: (menuItem) => {
      set((state) => {
        const existing = state.cart.items.find((i) => i.menuItem.id === menuItem.id);
        let updated: CartItem[];
        if (existing) {
          updated = state.cart.items.map((i) =>
            i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updated = [...state.cart.items, { menuItem, quantity: 1 }];
        }
        localStorage.setItem('shawarma_cart', JSON.stringify(updated));
        return { cart: { ...state.cart, items: updated } };
      });
    },

    removeFromCart: (menuItemId) => {
      set((state) => {
        const updated = state.cart.items.filter((i) => i.menuItem.id !== menuItemId);
        localStorage.setItem('shawarma_cart', JSON.stringify(updated));
        return { cart: { ...state.cart, items: updated } };
      });
    },

    updateQuantity: (menuItemId, quantity) => {
      set((state) => {
        if (quantity <= 0) {
          const updated = state.cart.items.filter((i) => i.menuItem.id !== menuItemId);
          localStorage.setItem('shawarma_cart', JSON.stringify(updated));
          return { cart: { ...state.cart, items: updated } };
        }
        const updated = state.cart.items.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i
        );
        localStorage.setItem('shawarma_cart', JSON.stringify(updated));
        return { cart: { ...state.cart, items: updated } };
      });
    },

    clearCart: () => {
      localStorage.removeItem('shawarma_cart');
      set((state) => ({ cart: { ...state.cart, items: [] } }));
    },

    getSubtotal: () => {
      const items = get().cart.items;
      return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    },

    getGrandTotal: () => {
      return get().cart.getSubtotal() + get().cart.fixedDeliveryFee;
    }
  },

  activeOrder: {
    order: JSON.parse(localStorage.getItem('shawarma_active_order') || 'null'),
    riderLocation: null,

    setActiveOrder: (order) => {
      localStorage.setItem('shawarma_active_order', JSON.stringify(order));
      set((state) => ({
        activeOrder: {
          ...state.activeOrder,
          order,
          riderLocation: { latitude: order.deliveryLatitude, longitude: order.deliveryLongitude }
        }
      }));
    },

    updateOrderStatus: (status) => {
      set((state) => {
        if (!state.activeOrder.order) return state;
        const updated = { ...state.activeOrder.order, orderStatus: status };
        localStorage.setItem('shawarma_active_order', JSON.stringify(updated));
        return {
          activeOrder: { ...state.activeOrder, order: updated }
        };
      });
    },

    updateRiderLocation: (latitude, longitude) => {
      set((state) => ({
        activeOrder: {
          ...state.activeOrder,
          riderLocation: { latitude, longitude }
        }
      }));
    },

    clearActiveOrder: () => {
      localStorage.removeItem('shawarma_active_order');
      set((state) => ({
        activeOrder: { ...state.activeOrder, order: null, riderLocation: null }
      }));
    }
  }
}));
