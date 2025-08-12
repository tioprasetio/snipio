import { useDarkMode } from "../context/DarkMode";
import { useCheckout } from "../hook/useCheckout";
import { formatRupiah } from "../utils/formatCurrency";

const ProductInformationCheckout = () => {
  const { selectedProducts } = useCheckout();
  const { isDarkMode } = useDarkMode();
  return (
    <>
      {selectedProducts.length === 0 ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <div className="space-y-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } p-4 rounded-lg flex items-center mt-4`}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/storage/${
                  product.thumbnail
                }`}
                alt={product.title}
                className="h-16 w-16 mr-4 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{product.title}</p>
                <p className="font-semibold">{formatRupiah(product.price)}</p>
                <p>Jumlah: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductInformationCheckout;
