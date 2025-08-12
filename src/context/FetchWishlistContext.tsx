import { createContext } from "react";
import type { WishlistItem } from "./WishlistContext";

export interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  loading: boolean;
  fetchWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);
