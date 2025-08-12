import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router";
import useVouchers from "../hook/useVoucher";
import type { Voucher } from "../types/Voucher";
import SearchVoucher from "../components/SearchVoucher";

const VoucherPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { vouchers, loading } = useVouchers();
  const [filteredVouchers, setFilteredVouchers] = useState(vouchers || []);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // Filter berdasarkan keyword dari URL
  useEffect(() => {
    if (keyword) {
      const filtered = vouchers?.filter((voucher) =>
        voucher.code?.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredVouchers(filtered || []);
    } else {
      setFilteredVouchers(vouchers || []);
    }
  }, [keyword, vouchers]);

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

  //Membuat slug dari nama produk
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  const handleClick = (voucher: Voucher) => {
    navigate(`/voucher/${generateSlug(voucher.code)}`, { state: voucher });
  };

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140C00] text-[#FFFFFF]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 w-full min-h-screen pb-20`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h1 className="text-2xl font-bold">Daftar Voucher</h1>
        </div>

        <SearchVoucher />

        {/* Jika tidak ada voucher */}
        {filteredVouchers.length === 0 ? (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600 text-sm">
              <i className="bx bx-x-circle mr-1"></i>
              Tidak ada voucher yang tersedia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row flex-wrap gap-4">
            {filteredVouchers.map((voucher, index) => (
              <div key={index} className="w-full lg:w-1/3">
                <div
                  className={`${
                    isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                  } p-3 rounded-lg flex gap-4`}
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${
                        voucher.picture
                      }`}
                      alt={`Voucher ${voucher.code}`}
                      className="h-10 w-full object-cover cursor-pointer"
                      loading="lazy"
                      onClick={() => handleClick(voucher)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                      <div
                        className={`${
                          isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                        } flex-1 font-bold text-md`}
                      >
                        <div
                          className="inline-block cursor-pointer"
                          onClick={() => handleClick(voucher)}
                        >
                          Voucher Diskon {voucher.discount}% Pembelanjaan
                          Customer
                        </div>
                      </div>
                      <div className="text-[#959595] text-xs text-neutral-1 pl-1">
                        <i className="bx bx-calendar"></i> Kode: {voucher.code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VoucherPage;
