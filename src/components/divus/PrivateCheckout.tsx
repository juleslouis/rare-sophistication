import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { createPrivateCheckout } from "@/lib/private-access.functions";
import {
  getStripe,
  getStripeEnvironment,
  isStripeTestMode,
} from "@/lib/stripe";

export function PrivateCheckout({ token }: { token: string }) {
  const fetchClientSecret = async () => {
    const result = await createPrivateCheckout({
      data: {
        token,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/acces/${token}?confirmation=1&session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if ("error" in result) throw new Error(result.error);
    return result.clientSecret;
  };

  return (
    <div className="border-t border-border pt-8">
      {isStripeTestMode() && (
        <p className="label mb-8 text-center text-muted-foreground">
          Mode test — aucun débit réel
        </p>
      )}
      <EmbeddedCheckoutProvider
        stripe={getStripe()}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}