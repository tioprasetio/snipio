import { useContext } from "react";
import {
  ReviewContext,
  type ReviewContextType,
} from "../context/FetchReviewContext";

export const useReview = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview harus digunakan di dalam ReviewProvider");
  }
  return context;
};
