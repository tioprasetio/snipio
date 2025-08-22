import { createContext } from "react";
import type { CartItem } from "./CartContext";

export interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number) => void;
  removeFromCart: (cartId: number) => void;
  fetchCart: () => void;
  clearCheckedOutItems: (selectedProducts: CartItem[]) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);