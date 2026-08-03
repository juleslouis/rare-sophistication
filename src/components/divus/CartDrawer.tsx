import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useLang } from "@/lib/i18n";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang } = useLang();
  const {
    items,
    isLoading,
    isSyncing,
    totalItems,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode || "EUR";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="relative opacity-90 transition-opacity hover:opacity-60"
          aria-label={t("Panier")}
        >
          <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.2} />
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-medium text-background">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full border-l border-border bg-background sm:max-w-md flex flex-col h-full">
        <SheetHeader className="flex-shrink-0 border-b border-border pb-6">
          <SheetTitle className="display text-2xl font-normal">{t("Votre sélection")}</SheetTitle>
          <SheetDescription className="label-sm text-muted-foreground">
            {totalItems === 0
              ? t("Votre sélection est vide")
              : `${totalItems} ${totalItems > 1 ? t("pièces") : t("pièce")} ${t("sélectionnée")}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-8 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/60 mb-5" strokeWidth={1.2} />
              <p className="text-sm text-muted-foreground">{t("Aucune pièce dans votre sélection")}</p>
              <Link
                to="/collection"
                onClick={() => setIsOpen(false)}
                className="btn-line btn-line-hover mt-8"
              >
                {t("Découvrir la collection")}
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-secondary">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <h4 className="display text-base font-normal truncate">
                            {item.product.title}
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.selectedOptions.map((o) => o.value).join(" · ")}
                          </p>
                        </div>
                        <div className="flex items-end justify-between">
                          <p className="text-sm">
                            {(parseFloat(item.price.amount) * item.quantity).toLocaleString(lang === "en" ? "en-GB" : "fr-FR")} {item.price.currencyCode}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={isLoading || isSyncing}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-5 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={isLoading || isSyncing}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => removeItem(item.variantId)}
                              disabled={isLoading || isSyncing}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-5 pt-6 border-t border-border">
                <div className="flex items-baseline justify-between">
                  <span className="display text-lg font-normal">{t("Total")}</span>
                  <span className="display text-xl font-normal">
                    {totalPrice.toLocaleString(lang === "en" ? "en-GB" : "fr-FR")} {currency}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("Procéder au paiement")}
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t("Paiement sécurisé par Shopify")}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
