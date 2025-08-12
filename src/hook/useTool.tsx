import { useContext } from "react";
import {
  ProductToolContext,
  type ProductToolContextType,
} from "../context/FetchProductToolContext";

export const useProductTools = (): ProductToolContextType => {
  const context = useContext(ProductToolContext);
  if (!context) {
    throw new Error(
      "useProductTools harus digunakan di dalam ProductToolProvider"
    );
  }
  return context;
};
