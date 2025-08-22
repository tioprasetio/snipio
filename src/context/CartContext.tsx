import { useEffect, useState } from "react";
import axios from "axios";
import { getEmailFromToken } from "../utils/authUtils";
import { CartContext } from "./FetchCartContext";

const checkIsLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // Mengembalikan true jika token ada, false jika tidak ada
};

export interface CartItem {
  id: number;
  product_id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const userEmail = getEmailFromToken();
  // Ambil data keranjang saat komponen dimuat atau saat userEmail berubah
  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn();

    if (isLoggedIn && userEmail) {
      // console.log("Fetching cart for user:", userEmail);
      fetchCart();
    }
  }, [userEmail]);

  // Fungsi untuk mengambil data keranjang
  const fetchCart = async () => {
    const userEmail = getEmailFromToken(); // Ambil email dari token
    if (!userEmail) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cart?email=${userEmail}`
      );
      setCart(response.data); // Perbarui state cart
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (
    productId: number,
  ) => {
    if (!userEmail) {
      console.error("User email not found in token");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/cart`, {
        user_email: userEmail,
        product_id: productId,
      });
      fetchCart(); // Refresh data keranjang
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/${cartId}`
      );
      fetchCart(); // Refresh data keranjang
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = () => {
    setCart([]); // Kosongkan cart
  };

  // Tambahkan useEffect untuk mendengarkan event logout
  useEffect(() => {
    const handleUserLogout = () => {
      clearCart(); // Panggil fungsi clearCart saat user logout
    };

    window.addEventListener("userLoggedOut", handleUserLogout);

    return () => {
      window.removeEventListener("userLoggedOut", handleUserLogout);
    };
  }, []);

  const clearCheckedOutItems = async (selectedProducts: CartItem[]) => {
    try {
      // Loop melalui selectedProducts dan hapus dari cart
      for (const product of selectedProducts) {
        await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/${product.id}`
        );
      }

      // Refresh data keranjang setelah menghapus item
      fetchCart();
    } catch (error) {
      console.error("Error clearing checked out items:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        fetchCart,
        clearCheckedOutItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
