/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const useOrderHistory = () => {
  const { user } = useAuth();
  const [purchasedProducts, setPurchasedProducts] = useState<number[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrderHistory = async () => {
    if (!user) return;

    setLoadingOrders(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/transactions/user/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === "success" && data.data) {
          // Extract product IDs dari transaksi yang berhasil
          const productIds: number[] = [];

          data.data.forEach((transaction: any) => {
            // Hanya ambil dari transaksi yang sukses
            if (transaction.status === "success" && transaction.products) {
              transaction.products.forEach((product: any) => {
                if (product.id && !productIds.includes(product.id)) {
                  productIds.push(product.id);
                }
              });
            }
          });

          setPurchasedProducts(productIds);
        }
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const hasPurchased = (productId: number) => {
    return purchasedProducts.includes(productId);
  };

  return { fetchOrderHistory, hasPurchased, loadingOrders, purchasedProducts };
};

export default useOrderHistory;
