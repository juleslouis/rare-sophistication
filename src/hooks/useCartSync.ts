import { useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";

export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    syncCart();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncCart();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncCart]);
}
