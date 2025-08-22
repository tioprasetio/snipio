import Swal from "sweetalert2";
import { formatRupiah } from "../utils/formatCurrency";
import Btn from "../components/Btn";
import { useNavigate } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PromoProduct from "../components/PromoProduct";
import { useCheckout } from "../hook/useCheckout";
import ProductInformationCheckout from "../components/ProductInformationCheckout";

const CheckoutPage = () => {
  // Context hooks
  const { selectedProducts, isLoading, cancelCheckout } = useCheckout();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, loading } = useAuth();

  // Receiver information
  const [receiverName, setReceiverName] = useState(user?.name || "");
  const [receiverPhone, setReceiverPhone] = useState(user?.no_tlp || "");
  const [receiverEmail, setReceiverEmail] = useState(user?.email || "");
  const [receiverAddress, setReceiverAddress] = useState(user?.alamat || "");
  const [useDifferentReceiver, setUseDifferentReceiver] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const hargaProduct = useMemo(() => {
    return selectedProducts.reduce((total, item) => total + item.price, 0);
  }, [selectedProducts]);

  const totalHarga = useMemo(() => {
    return hargaProduct * (1 - discount / 100);
  }, [hargaProduct, discount]);

  // Initial checks
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!isLoading && selectedProducts.length === 0) {
      navigate("/cart");
    }
  }, [user, loading, navigate, selectedProducts]);

  // Set user data on load
  useEffect(() => {
    if (user) {
      setReceiverName(user.name || "");
      setReceiverPhone(user.no_tlp || "");
      setReceiverEmail(user.email || "");
      setReceiverAddress(user.alamat || "");
    }
  }, [user]);

  // Voucher application
  const handleApplyVoucher = async () => {
    const token = localStorage.getItem("token");

    // if (!voucherCode) {
    //   Swal.fire("Error", "Masukkan kode voucher!", "error");
    //   return;
    // }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/vouchers/${voucherCode}`, // URL endpoint
        {
          // Argumen kedua sekarang adalah object konfigurasi
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.valid) {
        setDiscount(response.data.discount);
        Swal.fire(
          "Success",
          `Voucher berhasil digunakan! Diskon ${response.data.discount}%`,
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Voucher tidak valid!",
          "error"
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Terjadi kesalahan saat memeriksa voucher!";
      Swal.fire("Error", message, "error");
    }
  };

  // Cancel checkout
  const handleCancelCheckout = async () => {
    const result = await Swal.fire({
      title: "Batalkan Checkout?",
      text: "Apakah Anda yakin ingin membatalkan checkout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      try {
        await cancelCheckout();
        Swal.fire("Dibatalkan!", "Checkout telah dibatalkan.", "success");
        navigate("/cart");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        Swal.fire("Error", "Gagal membatalkan checkout.", err);
      }
    }
  };

  // Payment processing
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsProcessing(true);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/create-transaction`,
        {
          userId: user?.id,
          receiver_name: receiverName,
          receiver_phone: receiverPhone,
          receiver_email: receiverEmail,
          receiver_address: `${receiverAddress}`,
          gross_amount: totalHarga,
          voucher_code: voucherCode,
          products: selectedProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = response.data.transaction.redirect_url;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      const message =
        error.response?.data?.message || "Failed to create transaction";
      Swal.fire("Error", message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex gap-2 justify-center items-center min-h-screen z-9999`}
      >
        <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );
  }

  const exampleCode = "DISC10";

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-[#140C00] text-[#FFFFFF]"
          : "bg-[#f4f6f9] text-[#353535]"
      } p-6 mb-16 w-full min-h-screen pb-20`}
    >
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Informasi Pengguna */}
      <div
        className={`${
          isDarkMode ? "bg-[#404040]" : "bg-[#FFFFFF]"
        } p-4 rounded-lg mt-4`}
      >
        <h2 className="text-lg font-bold mb-2">Informasi Penerima</h2>

        {/* Tampilkan data user sebagai default */}
        <div
          className={`${
            isDarkMode
              ? "bg-[#252525]"
              : "bg-[#F4F6F9] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
          } mb-4 p-3  rounded-lg`}
        >
          <p className="text-lg font-bold">{user?.name}</p>
          <p className="text-sm mb-4">{user?.no_tlp}</p>
          <p className="text-sm">{user?.alamat}</p>
        </div>

        {/* Checkbox untuk toggle form */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="differentReceiver"
            checked={useDifferentReceiver}
            onChange={(e) => {
              setUseDifferentReceiver(e.target.checked);
              // Reset ke data user jika unchecked
              if (!e.target.checked) {
                setReceiverName(user?.name || "");
                setReceiverPhone(user?.no_tlp || "");
                setReceiverEmail(user?.email || "");
                setReceiverAddress(user?.alamat || "");
              }
            }}
            className="mr-2 text-green-600 accent-green-600 rounded cursor-pointer"
          />
          <label htmlFor="differentReceiver">
            *Gunakan data penerima berbeda
          </label>
        </div>

        {/* Form muncul ketika checkbox dicentang */}
        {useDifferentReceiver && (
          <div className="space-y-2 animate-fadeIn">
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Nama Penerima"
              required
            />
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Nomor HP"
              required
            />
            <textarea
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-[#252525] text-[#FFFFFF] border-gray-700"
                  : "bg-[#F4F6F9] text-[#353535] border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
              } border p-2 rounded-lg w-full`}
              placeholder="Alamat Lengkap"
              required
            ></textarea>

            {/* Tombol reset */}
            <button
              type="button"
              onClick={() => {
                setReceiverName(user?.name || "");
                setReceiverPhone(user?.no_tlp || "");
                setReceiverAddress(user?.alamat || "");
              }}
              className={`${
                isDarkMode ? "text-white" : "text-white"
              } bg-[#28a154] p-2 rounded-sm text-sm mt-1 text-left cursor-pointer`}
            >
              Kembalikan ke data profile
            </button>
          </div>
        )}
      </div>

      {/* Informasi Produk */}
      <ProductInformationCheckout />

      {/* Voucher */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
      >
        <h3 className="font-bold mb-2">Gunakan Voucher</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`(contoh: ${exampleCode})`}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className={`${
              isDarkMode
                ? "bg-[#252525] text-[#FFFFFF] placeholder-gray-300 border-gray-700"
                : "bg-[#F4F6F9] text-[#353535] placeholder-gray-400 border-gray-300 shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            } border p-2 rounded w-full`}
          />
          <button
            onClick={handleApplyVoucher}
            className="bg-[#28A154] text-white p-2 rounded cursor-pointer"
          >
            Gunakan
          </button>
        </div>
      </div>
      <PromoProduct />

      {/* Rincian Pembayaran */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex mt-4 flex-col gap-2`}
      >
        <div className="flex justify-between">
          <p className="font-medium">Subtotal untuk produk</p>
          <p className="font-medium">{formatRupiah(hargaProduct)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Voucher Diskon</p>
          <p className="font-medium">{discount}%</p>
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex justify-between">
          <p className="font-semibold">Total Pembayaran</p>
          <p className="font-semibold">{formatRupiah(totalHarga)}</p>
        </div>
      </div>

      {/* Tombol Bayar & Batal */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } fixed bottom-0 left-0 w-full p-4 shadow-xl flex flex-col gap-2 z-999`}
      >
        <h2 className="text-lg font-semibold">
          Total: {formatRupiah(totalHarga)}
        </h2>
        <div className="flex gap-2">
          <Btn
            onClick={handleCancelCheckout}
            className={`${
              isDarkMode
                ? "bg-[#cb2525] text-[#f0f0f0]"
                : "bg-[#cb2525] text-[#f0f0f0]"
            } px-4 py-2 hover:bg-[#a12828] font-semibold rounded w-1/2`}
          >
            Batal
          </Btn>
          <Btn
            onClick={handlePayment}
            disabled={isProcessing}
            className={`${
              isDarkMode
                ? "bg-[#28a154] text-[#f0f0f0]"
                : "bg-[#28a154] text-[#f0f0f0]"
            } px-4 py-2 font-semibold rounded w-1/2 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
