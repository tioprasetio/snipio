import { useEffect, useState } from "react";
import axios from "axios";
import type { Voucher } from "../types/Voucher";

const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get<Voucher[]>(
          `${import.meta.env.VITE_APP_API_URL}/api/vouchers`
        );
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("Gagal memuat voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return { vouchers, loading, error };
};

export default useVouchers;
