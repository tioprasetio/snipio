import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { formatRupiah } from "../utils/formatCurrency";
import { useCart } from "../hook/useCart";
import { useCheckout } from "../hook/useCheckout";
import { useDarkMode } from "../context/DarkMode";

const PaymentCallbackPage = () => {
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { clearCheckedOutItems } = useCart();
  const { selectedProducts, setSelectedProducts, checkoutToken } =
    useCheckout();
  const [status, setStatus] = useState<"success" | "failed" | "pending">(
    "pending"
  );
  const [transactionDetails, setTransactionDetails] = useState<{
    gross_amount: number;
    order_id: string;
    receiver_name: string;
  } | null>(null);

  useEffect(() => {
    // Ambil query parameters dari URL
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("order_id");
    const statusCode = searchParams.get("status_code");
    const transactionStatus = searchParams.get("transaction_status");

    if (orderId && transactionStatus) {
      if (
        (transactionStatus === "settlement" ||
          transactionStatus === "capture") &&
        statusCode === "200"
      ) {
        // Jika status sukses, ambil detail transaksi dari backend
        fetchTransactionDetails(orderId);
        setStatus("success");
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        setStatus("failed");
      } else {
        setStatus("pending");
      }
    } else {
      setStatus("failed");
    }
  }, [location]);

  const fetchTransactionDetails = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/transactions/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactionDetails(response.data.data); // Perhatikan responsenya, pastikan sesuai struktur
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      Swal.fire("Error", "Gagal mengambil detail transaksi", "error");
    }
  };

  const handleSelesai = async () => {
    try {
      // Hapus dari backend (temporary_checkouts)
      if (checkoutToken) {
        await axios.delete(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/checkout-temp/${checkoutToken}`
        );
      }
      localStorage.removeItem("order_id");

      clearCheckedOutItems(selectedProducts);

      localStorage.removeItem("checkoutToken");

      // Hapus checkout dari local storage dan state
      localStorage.removeItem("selectedProducts");
      setSelectedProducts([]);

      // Redirect ke halaman utama
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal menyelesaikan checkout:", error);
      alert("Terjadi kesalahan saat menyelesaikan transaksi.");
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } p-4 min-h-screen flex items-center justify-center `}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-lg shadow-lg text-center`}
      >
        {status === "success" && transactionDetails ? (
          <div className={`${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>
            <div className="flex justify-center mb-4">
              <img
                src="/assets/images/check.png"
                className="h-32 w-auto"
                alt="snipio"
                loading="lazy"
              />
            </div>
            <h1 className="text-2xl font-bold text-green-500 mb-4">
              Pembayaran Berhasil!
            </h1>
            <p>
              Terima kasih <strong>{transactionDetails.receiver_name}!</strong>{" "}
              Anda telah melakukan pembayaran sebesar{" "}
              <span className="font-semibold">
                {formatRupiah(transactionDetails.gross_amount)}
              </span>
              .
            </p>
            <p className="mt-4">Order ID: {transactionDetails.order_id}</p>
            <button
              onClick={handleSelesai}
              className="mt-6 bg-[#456af8] text-white px-6 py-2 rounded-lg hover:bg-[#304ebe] cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : status === "failed" ? (
          <div className={`${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Pembayaran Gagal
            </h1>
            <p>
              Maaf, pembayaran Anda gagal. Silakan coba lagi atau hubungi tim
              support.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className={`${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>
            <h1 className="text-2xl font-bold text-gray-600 mb-4">
              Memproses Pembayaran...
            </h1>
            <p>Silakan tunggu sebentar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
