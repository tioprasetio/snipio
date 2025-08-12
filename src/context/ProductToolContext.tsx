import {useState } from "react";
import axios from "axios";
import { ProductToolContext } from "./FetchProductToolContext";

export type ProductTool = {
  id: number;
  product_id: number;
  tool_id: number;
  tool_name: string;
  tool_slug: string;
  tool_icon: string | null;
  created_at: string;
  updated_at: string;
};

export const ProductToolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tools, setTools] = useState<ProductTool[]>([]);
  const [totalTools, setTotalTools] = useState<number>(0);

  const fetchProductTools = async (productId: number) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/product-tools`,
        {
          params: { product_id: productId },
        }
      );

      if (res.data.success) {
        setTools((prev) =>
          JSON.stringify(prev) !== JSON.stringify(res.data.data)
            ? res.data.data
            : prev
        );
        setTotalTools((prev) =>
          prev !== res.data.total ? res.data.total : prev
        );
      }
    } catch (err) {
      console.error("Gagal mengambil product tools:", err);
    }
  };

  return (
    <ProductToolContext.Provider
      value={{ tools, totalTools, fetchProductTools }}
    >
      {children}
    </ProductToolContext.Provider>
  );
};
