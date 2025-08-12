import { createContext } from "react";
import type { ProductTool } from "./ProductToolContext";

export type ProductToolContextType = {
  tools: ProductTool[];
  totalTools: number;
  fetchProductTools: (productId: number) => void;
};

export const ProductToolContext = createContext<ProductToolContextType | undefined>(
  undefined
);