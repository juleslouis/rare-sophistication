import { createServerFn } from "@tanstack/react-start";
import {
  storefrontApiRequest,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
  formatCheckoutUrl,
  isCartNotFoundError,
  type ShopifyProductNode,
  type ShopifyCart,
} from "./shopify.server";

// ---------- Products ----------

export const getShopifyProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const data = await storefrontApiRequest<{
      data?: { products?: { edges: Array<{ node: ShopifyProductNode }> } };
      errors?: Array<{ message: string }>;
    }>(GET_PRODUCTS_QUERY, { first: 20 });

    if (data.errors?.length) {
      throw new Error(data.errors.map((e) => e.message).join(", "));
    }

    return data.data?.products?.edges ?? [];
  },
);

export const getShopifyProductByHandle = createServerFn({ method: "POST" })
  .validator((data: { handle: string }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: { product?: ShopifyProductNode | null };
      errors?: Array<{ message: string }>;
    }>(GET_PRODUCT_BY_HANDLE_QUERY, { handle: data.handle });

    if (result.errors?.length) {
      throw new Error(result.errors.map((e) => e.message).join(", "));
    }

    return result.data?.product ?? null;
  });

// ---------- Cart ----------

export interface CartItemInput {
  variantId: string;
  quantity: number;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
  product: { id: string; title: string; handle: string; imageUrl: string | null };
}

function parseCartResponse(
  cart: ShopifyCart | null | undefined,
): { cartId: string; checkoutUrl: string; lines: ShopifyCart["lines"] } | null {
  if (!cart?.id || !cart.checkoutUrl) return null;
  return {
    cartId: cart.id,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lines: cart.lines,
  };
}

export const createShopifyCart = createServerFn({ method: "POST" })
  .validator((data: { variantId: string; quantity: number }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: {
        cartCreate?: {
          cart?: ShopifyCart;
          userErrors: Array<{ field: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(CART_CREATE_MUTATION, {
      input: { lines: [{ merchandiseId: data.variantId, quantity: data.quantity }] },
    });

    const cartCreate = result.data?.cartCreate;
    if (cartCreate?.userErrors?.length) {
      if (isCartNotFoundError(cartCreate.userErrors)) {
        return { success: false, cartNotFound: true } as const;
      }
      throw new Error(cartCreate.userErrors.map((e) => e.message).join(", "));
    }

    const parsed = parseCartResponse(cartCreate?.cart);
    if (!parsed) return { success: false } as const;

    const line = parsed.lines.edges[0]?.node;
    return {
      success: true,
      cartId: parsed.cartId,
      checkoutUrl: parsed.checkoutUrl,
      lineId: line?.id ?? null,
      totalQuantity: cartCreate?.cart?.totalQuantity ?? 0,
    } as const;
  });

export const addLineToShopifyCart = createServerFn({ method: "POST" })
  .validator((data: { cartId: string; variantId: string; quantity: number }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: {
        cartLinesAdd?: {
          cart?: ShopifyCart;
          userErrors: Array<{ field: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(CART_LINES_ADD_MUTATION, {
      cartId: data.cartId,
      lines: [{ merchandiseId: data.variantId, quantity: data.quantity }],
    });

    const cartLinesAdd = result.data?.cartLinesAdd;
    if (cartLinesAdd?.userErrors?.length) {
      if (isCartNotFoundError(cartLinesAdd.userErrors)) {
        return { success: false, cartNotFound: true } as const;
      }
      throw new Error(cartLinesAdd.userErrors.map((e) => e.message).join(", "));
    }

    const line = cartLinesAdd?.cart?.lines.edges.find(
      (edge) => edge.node.merchandise.id === data.variantId,
    )?.node;

    return {
      success: true,
      lineId: line?.id,
      checkoutUrl: cartLinesAdd?.cart?.checkoutUrl
        ? formatCheckoutUrl(cartLinesAdd.cart.checkoutUrl)
        : null,
      totalQuantity: cartLinesAdd?.cart?.totalQuantity ?? 0,
    } as const;
  });

export const updateShopifyCartLine = createServerFn({ method: "POST" })
  .validator((data: { cartId: string; lineId: string; quantity: number }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: {
        cartLinesUpdate?: {
          cart?: ShopifyCart;
          userErrors: Array<{ field: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(CART_LINES_UPDATE_MUTATION, {
      cartId: data.cartId,
      lines: [{ id: data.lineId, quantity: data.quantity }],
    });

    const cartLinesUpdate = result.data?.cartLinesUpdate;
    if (cartLinesUpdate?.userErrors?.length) {
      if (isCartNotFoundError(cartLinesUpdate.userErrors)) {
        return { success: false, cartNotFound: true } as const;
      }
      throw new Error(cartLinesUpdate.userErrors.map((e) => e.message).join(", "));
    }

    return {
      success: true,
      checkoutUrl: cartLinesUpdate?.cart?.checkoutUrl
        ? formatCheckoutUrl(cartLinesUpdate.cart.checkoutUrl)
        : null,
      totalQuantity: cartLinesUpdate?.cart?.totalQuantity ?? 0,
    } as const;
  });

export const removeLineFromShopifyCart = createServerFn({ method: "POST" })
  .validator((data: { cartId: string; lineId: string }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: {
        cartLinesRemove?: {
          cart?: ShopifyCart;
          userErrors: Array<{ field: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(CART_LINES_REMOVE_MUTATION, {
      cartId: data.cartId,
      lineIds: [data.lineId],
    });

    const cartLinesRemove = result.data?.cartLinesRemove;
    if (cartLinesRemove?.userErrors?.length) {
      if (isCartNotFoundError(cartLinesRemove.userErrors)) {
        return { success: false, cartNotFound: true } as const;
      }
      throw new Error(cartLinesRemove.userErrors.map((e) => e.message).join(", "));
    }

    return {
      success: true,
      checkoutUrl: cartLinesRemove?.cart?.checkoutUrl
        ? formatCheckoutUrl(cartLinesRemove.cart.checkoutUrl)
        : null,
      totalQuantity: cartLinesRemove?.cart?.totalQuantity ?? 0,
    } as const;
  });

export const getShopifyCart = createServerFn({ method: "POST" })
  .validator((data: { cartId: string }) => data)
  .handler(async ({ data }) => {
    const result = await storefrontApiRequest<{
      data?: { cart?: ShopifyCart | null };
      errors?: Array<{ message: string }>;
    }>(CART_QUERY, { id: data.cartId });

    if (result.errors?.length) {
      throw new Error(result.errors.map((e) => e.message).join(", "));
    }

    const cart = result.data?.cart;
    if (!cart) return { found: false as const };

    return {
      found: true as const,
      cartId: cart.id,
      checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
      totalQuantity: cart.totalQuantity,
      lines: cart.lines,
    };
});

export type { ShopifyProductNode, ShopifyCart } from "./shopify.server";
