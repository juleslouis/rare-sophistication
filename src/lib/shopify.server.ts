/**
 * Shopify Storefront API — server-only helper.
 * Reads secrets inside handlers (process.env is injected per-request).
 */

const API_VERSION = "2025-07";

function getStoreDomain(): string {
  const domain = process.env["SHOPIFY_STORE_PERMANENT_DOMAIN"];
  if (domain) return domain;
  // Fallback to the development store created for this project.
  return "divus-yibfg-z8cbpieh.myshopify.com";
}

function getStorefrontToken(): string {
  const token = process.env["SHOPIFY_STOREFRONT_ACCESS_TOKEN"];
  if (!token) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured");
  }
  return token;
}

export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain = getStoreDomain();
  const url = `https://${domain}/api/${API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": getStorefrontToken(),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  return data;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

export interface ShopifyProductsResponse {
  data?: {
    products?: {
      edges: Array<{ node: ShopifyProductNode }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export interface ShopifyProductResponse {
  data?: {
    product?: ShopifyProductNode | null;
  };
  errors?: Array<{ message: string }>;
}

export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    description
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
    options {
      name
      values
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

// ---------- Cart mutations ----------

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: { url: string; altText: string | null };
        }>;
      };
    };
    selectedOptions: Array<{ name: string; value: string }>;
    price: { amount: string; currencyCode: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>,
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

// ---------- Shop policies (legal documents) ----------

export const SHOP_POLICIES_QUERY = `
  query ShopPolicies {
    shop {
      privacyPolicy { title handle body url }
      refundPolicy { title handle body url }
      termsOfService { title handle body url }
      shippingPolicy { title handle body url }
      subscriptionPolicy { title handle body url }
    }
  }
`;

export interface ShopifyPolicy {
  title: string;
  handle: string;
  body: string;
  url: string;
}

/** Strip anything executable/style-bearing from merchant-authored HTML. */
export function sanitizePolicyHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/ on[a-z]+="[^"]*"/gi, "")
    .replace(/ on[a-z]+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// ---------- Admin API (customers) ----------

const ADMIN_API_VERSION = "2025-07";

async function adminApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const token = process.env["SHOPIFY_ACCESS_TOKEN"];
  if (!token) throw new Error("SHOPIFY_ACCESS_TOKEN is not configured");

  const response = await fetch(
    `https://${getStoreDomain()}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Shopify Admin API error: ${response.status} ${await response.text()}`,
    );
  }
  return (await response.json()) as T;
}

const CUSTOMER_CREATE_MUTATION = `
  mutation CustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id email }
      userErrors { field message }
    }
  }
`;

/**
 * Crée le contact dans la base clients Shopify (consentement marketing e-mail),
 * avec l'étiquette « waitlist » pour segmenter les inscrits.
 * Ne jette jamais : l'inscription en base reste la source de vérité.
 */
export async function createWaitlistCustomer(
  email: string,
  locale: string,
): Promise<{ ok: boolean; reason?: string }> {
  try {
    const result = await adminApiRequest<{
      data?: {
        customerCreate?: {
          customer?: { id: string } | null;
          userErrors?: Array<{ field: string[] | null; message: string }>;
        };
      };
      errors?: unknown;
    }>(CUSTOMER_CREATE_MUTATION, {
      input: {
        email,
        locale: locale === "en" ? "en" : "fr",
        tags: ["waitlist", "divus-waitlist"],
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });

    const userErrors = result.data?.customerCreate?.userErrors ?? [];
    if (result.errors || userErrors.length > 0) {
      const reason = userErrors.map((e) => e.message).join("; ") || "api error";
      // Doublon = contact déjà présent : ce n'est pas une erreur métier.
      console.warn(`[waitlist] shopify customer not created: ${reason}`);
      return { ok: false, reason };
    }
    return { ok: true };
  } catch (error) {
    console.warn(
      `[waitlist] shopify customer sync failed: ${
        error instanceof Error ? error.message : "unknown"
      }`,
    );
    return { ok: false, reason: "request failed" };
  }
}
