import { createContext } from "react";
import type { Review } from "./ReviewContext";

export type ReviewContextType = {
  reviews: Review[];
  averageRating: number;
  totalReview: number;
  fetchReviews: (productId: number) => void;
  addReview: (data: {
    user_id: number;
    product_id: number;
    order_id: string;
    rating: number;
    comment?: string;
  }) => Promise<{ success: boolean; message: string }>;
};

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
