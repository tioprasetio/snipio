import axios from "axios";
import { useState, useEffect, type ReactNode } from "react";
import { CheckoutContext } from "./FetchCheckoutContext";

export interface ProductCheckout {
  id: number;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductCheckout[]>([]);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <--- tambah loading state

  useEffect(() => {
    const token = localStorage.getItem("checkoutToken");
    if (token) setCheckoutToken(token);
  }, []);

  useEffect(() => {
    if (checkoutToken) {
      localStorage.setItem("checkoutToken", checkoutToken);
    }
  }, [checkoutToken]);

  useEffect(() => {
    if (!checkoutToken) {
      setIsLoading(false); // token gak ada berarti gak perlu loading data
      return;
    }

    async function fetchTemporaryCheckout() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/checkout-temp/${checkoutToken}`
        );
        setSelectedProducts(res.data.selected_products);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Gagal load temporary checkout:", error);
        setSelectedProducts([]); // reset kalau gagal
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemporaryCheckout();
  }, [checkoutToken]);

  useEffect(() => {
    if (selectedProducts.length === 0) return;

    async function saveTemporaryCheckout() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/checkout-temp`,
          {
            selected_products: selectedProducts,
            checkout_token: checkoutToken,
          }
        );

        setCheckoutToken(res.data.checkout_token);
      } catch (error) {
        console.error("Gagal simpan temporary checkout:", error);
      }
    }

    saveTemporaryCheckout();
  }, [selectedProducts]);

  const cancelCheckout = async () => {
    if (!checkoutToken) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/checkout-temp/${checkoutToken}`
      );
      localStorage.removeItem("checkoutToken");
      setSelectedProducts([]);
      setCheckoutToken(null);
    } catch (error) {
      console.error("Gagal membatalkan checkout:", error);
      throw error; // biar bisa di-handle dari luar
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        isLoading,
        checkoutToken,
        setCheckoutToken,
        cancelCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
