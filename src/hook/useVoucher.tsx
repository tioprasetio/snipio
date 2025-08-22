/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import type { Voucher } from "../types/Voucher";

const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Voucher[]>(
          `${import.meta.env.VITE_APP_API_URL}/api/vouchers`,
          {
            // Argumen kedua sekarang adalah object konfigurasi
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVouchers(response.data);
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Terjadi kesalahan saat memeriksa voucher!";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return { vouchers, loading, error };
};

export default useVouchers;
