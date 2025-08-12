import { createContext } from "react";
import type { ProductCheckout } from "./CheckoutContext";

export interface CheckoutContextType {
  selectedProducts: ProductCheckout[];
  isLoading: boolean;
  setSelectedProducts: (products: ProductCheckout[]) => void;
  checkoutToken: string | null;
  setCheckoutToken: (token: string | null) => void;
  cancelCheckout: () => Promise<void>;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);
