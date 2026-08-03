import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  getShopifyCart,
  type CartItemInput,
} from "./shopify.functions";

export interface CartItem extends CartItemInput {
  lineId: string | null;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  totalItems: number;

  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

function computeTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      totalItems: 0,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({
              data: { variantId: item.variantId, quantity: item.quantity },
            });
            if (result.success) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
                totalItems: item.quantity,
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error("Cannot update quantity for item without lineId:", existingItem);
              return;
            }
            const result = await updateShopifyCartLine({
              data: { cartId, lineId: existingItem.lineId, quantity: newQuantity },
            });
            if (result.success) {
              const currentItems = get().items;
              const nextItems = currentItems.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i,
              );
              set({ items: nextItems, totalItems: computeTotal(nextItems) });
              if (result.checkoutUrl) set({ checkoutUrl: result.checkoutUrl });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart({
              data: { cartId, variantId: item.variantId, quantity: item.quantity },
            });
            if (result.success) {
              const currentItems = get().items;
              const nextItems = [
                ...currentItems,
                { ...item, lineId: result.lineId ?? null },
              ];
              set({ items: nextItems, totalItems: computeTotal(nextItems) });
              if (result.checkoutUrl) set({ checkoutUrl: result.checkoutUrl });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (error) {
          console.error("Failed to add item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine({
            data: { cartId, lineId: item.lineId, quantity },
          });
          if (result.success) {
            const currentItems = get().items;
            const nextItems = currentItems.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i,
            );
            set({ items: nextItems, totalItems: computeTotal(nextItems) });
            if (result.checkoutUrl) set({ checkoutUrl: result.checkoutUrl });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to update quantity:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart({
            data: { cartId, lineId: item.lineId },
          });
          if (result.success) {
            const currentItems = get().items;
            const nextItems = currentItems.filter((i) => i.variantId !== variantId);
            if (nextItems.length === 0) {
              clearCart();
            } else {
              set({ items: nextItems, totalItems: computeTotal(nextItems) });
              if (result.checkoutUrl) set({ checkoutUrl: result.checkoutUrl });
            }
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () =>
        set({ items: [], cartId: null, checkoutUrl: null, totalItems: 0 }),

      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const data = await getShopifyCart({ data: { cartId } });
          if (!data.found || data.totalQuantity === 0) {
            clearCart();
          } else if (data.found) {
            // Reconcile local items with Shopify lines
            const remoteLines = data.lines.edges.map((edge) => edge.node);
            const currentItems = get().items;
            const nextItems: CartItem[] = [];

            for (const line of remoteLines) {
              const variantId = line.merchandise.id;
              const local = currentItems.find((i) => i.variantId === variantId);
              if (local) {
                nextItems.push({ ...local, lineId: line.id, quantity: line.quantity });
              } else {
                nextItems.push({
                  lineId: line.id,
                  variantId,
                  quantity: line.quantity,
                  variantTitle: line.merchandise.title,
                  price: line.merchandise.price,
                  selectedOptions: line.merchandise.selectedOptions,
                  product: {
                    id: line.merchandise.product.id,
                    title: line.merchandise.product.title,
                    handle: line.merchandise.product.handle,
                    imageUrl: line.merchandise.product.images.edges[0]?.node.url ?? null,
                  },
                });
              }
            }

            set({
              items: nextItems,
              totalItems: computeTotal(nextItems),
              checkoutUrl: data.checkoutUrl,
            });
          }
        } catch (error) {
          console.error("Failed to sync cart with Shopify:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "divus-shopify-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        totalItems: state.totalItems,
      }),
    },
  ),
);
