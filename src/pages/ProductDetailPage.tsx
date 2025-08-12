// pages/ProductDetailPage.tsx
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkMode";
import Swal from "sweetalert2";
import Btn from "../components/Btn";
import { formatRupiah } from "../utils/formatCurrency";
import NavbarComponent from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/swiper-bundle.css";
import useProducts from "../hook/useProduct";
import type { Product } from "../types/Product";
import { useCart } from "../hook/useCart";
import { useWishlist } from "../hook/useWishlist";
import Chatbot from "../components/Chatbot";
import ProductReviews from "../components/ProductReviews";
import PromoProduct from "../components/PromoProduct";
import { useCheckout } from "../hook/useCheckout";
import OriginalModal from "../components/OriginalModal";
import useProductImages from "../context/ProductDetailContext";
import { useProductTools } from "../hook/useTool";

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { productSlug } = useParams<{ productSlug: string }>(); // Ambil productSlug dari URL
  const navigate = useNavigate();
  const { products, loading, error } = useProducts(); // Ambil data produk dari custom hook
  const { isDarkMode } = useDarkMode();
  const { isLoggedIn } = useAuth();
  const { setSelectedProducts } = useCheckout();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const { tools, fetchProductTools } = useProductTools();

  const [quantity, setQuantity] = useState(1); // State untuk kuantitas produk
  const [product, setProduct] = useState<Product | null>(null); // State untuk menyimpan produk yang dipilih
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Ekstrak ID dari productSlug
  const productId = productSlug ? parseInt(productSlug.split("-")[0]) : null;

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { loadingProductDetail, getAllImages, detailImages } = useProductImages(
    productId,
    product
  );

  // Cari produk berdasarkan ID
  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        fetchProductTools(productId);
      } else {
        Swal.fire({
          title: "Oops...",
          text: "Produk tidak ditemukan!",
          icon: "error",
        }).then(() => navigate("/")); // Redirect ke halaman utama jika produk tidak ditemukan
      }
    }
  }, [products, productId, navigate]);

  // Handle toggle wishlist
  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    if (!product) return;

    try {
      setWishlistLoading(true);

      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        Swal.fire({
          title: "Berhasil!",
          text: "Produk dihapus dari wishlist.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addToWishlist(product.id);
        Swal.fire({
          title: "Berhasil!",
          text: "Produk ditambahkan ke wishlist.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      Swal.fire({
        title: "Oops...",
        text:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memproses wishlist.",
        icon: "error",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Fungsi untuk menambah kuantitas
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Fungsi untuk mengurangi kuantitas
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Updated handleAddToCart function in ProductDetailPage.tsx
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      });
      navigate("/login");
      return;
    }

    if (product) {
      try {
        await addToCart(product.id, quantity);

        Swal.fire({
          title: "Berhasil!",
          text: "Produk telah ditambahkan ke keranjang.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/cart");
        });
      } catch {
        // console.log(error);
        Swal.fire({
          title: "Oops...",
          text: "Gagal menambahkan produk ke keranjang.",
          icon: "error",
        });
      }
    }
  };

  // Fungsi untuk membeli produk langsung
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      });
      navigate("/login");
      return;
    }

    if (product) {
      const productToCheckout = {
        id: product.id,
        product_id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        quantity: quantity,
      };

      setSelectedProducts([productToCheckout]);
      navigate("/checkout");
    }
  };

  // Tampilkan loading jika data sedang dimuat
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

  // Tampilkan error jika terjadi kesalahan
  if (error)
    return (
      <div className="p-4 w-full">
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            <i className="bx bx-x-circle mr-1"></i>
            {error}
          </p>
        </div>
      </div>
    );

  // Tampilkan pesan jika produk tidak ditemukan
  if (!product) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Produk tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
        } p-6 pt-20 sm:pt-24 pb-24 sm:pb-28 w-full min-h-screen`}
      >
        {/* Tampilan detail produk */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 xl:gap-4 md:pt-5">
            {/* Gambar Produk */}
            <div className="flex flex-col">
              <section className="bg-[#ffffff] rounded-lg p-4 mb-3 xl:mb-4 relative">
                {/* Tombol wishlist di sudut kanan atas gambar */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
                  <button
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    className="bg-white/70 hover:bg-white/90 p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                    aria-label={
                      isInWishlist(product.id)
                        ? "Hapus dari wishlist"
                        : "Tambahkan ke wishlist"
                    }
                  >
                    {wishlistLoading ? (
                      <i className="bx bx-loader-alt animate-spin text-3xl text-gray-500"></i>
                    ) : isInWishlist(product.id) ? (
                      <i className="bx bxs-heart text-3xl text-red-500"></i>
                    ) : (
                      <i className="bx bx-heart text-3xl text-gray-500 hover:text-red-500"></i>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const productUrl = window.location.href;

                      if (navigator.share) {
                        navigator
                          .share({
                            title: product?.title ?? "Produk",
                            text: "Lihat produk ini di toko kami!",
                            url: productUrl,
                          })
                          .catch((error) =>
                            console.error("Gagal membagikan:", error)
                          );
                      } else {
                        navigator.clipboard.writeText(productUrl).then(() => {
                          Swal.fire({
                            icon: "success",
                            title: "Link disalin!",
                            text: "Link produk telah disalin ke clipboard.",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        });
                      }
                    }}
                    className="bg-white/70 hover:bg-white/90 p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                    aria-label="Bagikan produk"
                  >
                    <i className="bx bx-share-alt text-3xl text-gray-600 hover:text-blue-600"></i>
                  </button>
                </div>

                <div className="relative">
                  {!loadingProductDetail ? (
                    detailImages.length > 0 ? (
                      // Ada gambar detail → Swiper
                      <Swiper
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        className="thumbnailSwiper"
                      >
                        {getAllImages().map((image, index) => (
                          <SwiperSlide key={image.id}>
                            <img
                              src={`${import.meta.env.VITE_API_URL}/storage/${
                                image.picture
                              }`}
                              alt={`${product.title} - ${index + 1}`}
                              className="w-full object-cover cursor-pointer"
                              width={800}
                              height={800}
                              onClick={() => {
                                setSelectedImage(
                                  `${import.meta.env.VITE_API_URL}/storage/${
                                    image.picture
                                  }`
                                );
                                setShowImageModal(true);
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      // Tidak ada gambar detail → tampilkan gambar utama saja
                      <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${
                          product.thumbnail
                        }`}
                        alt={product.title}
                        className="w-full object-cover cursor-pointer"
                        width={800}
                        height={800}
                        onClick={() => {
                          setSelectedImage(
                            `${import.meta.env.VITE_API_URL}/storage/${
                              product.thumbnail
                            }`
                          );
                          setShowImageModal(true);
                        }}
                      />
                    )
                  ) : (
                    // Loading State
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                        <span>Memuat gambar...</span>
                      </div>
                    </div>
                  )}
                </div>
                {showImageModal && selectedImage && (
                  <div
                    className="fixed inset-0 backdrop-blur-xs bg-[#000000b5] flex items-center justify-center z-99 p-4 w-full"
                    onClick={() => setShowImageModal(false)}
                  >
                    <img
                      src={selectedImage}
                      alt="Augmented Zoom"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()} // biar klik gambar tidak menutup
                    />
                  </div>
                )}

                <div className="flex z-10 items-center justify-center cursor-pointer absolute top-0 left-0 bg-[#456af8] text-[#FFFFFF] rounded-tl-lg rounded-br-lg md:text-base text-sm font-bold p-2 transition">
                  BV
                </div>
              </section>

              {/* Informasi Produk */}
              <div className="hidden md:block">
                <section
                  className={`${
                    isDarkMode
                      ? "bg-[#303030] text-[#f0f0f0]"
                      : "bg-[#ffffff] text-[#353535]"
                  } rounded-lg p-4 mb-3 xl:mb-4`}
                >
                  <div className="p6">Informasi Produk</div>
                  <hr className="mt-4 border-t border-gray-300" />
                  <div className="flex gap-2 mt-4 flex-wrap items-center">
                    {tools.map((tool) => (
                      <div
                        key={tool.id}
                        className={`px-4 py-1 gap-2 flex flex-wrap rounded-full items-center cursor-pointer font-semibold bbg-[#F4F6F9] text-[#454545] shadow-lg hover:bg-[#304ebe] hover:text-white hover:scale-105 transition-all`}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/storage/${
                            tool.tool_icon
                          }`}
                          alt={tool.tool_name}
                          className="w-5 h-5 object-contain"
                        />
                        <span>{tool.tool_name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  className={`${
                    isDarkMode
                      ? "bg-[#303030] text-[#f0f0f0]"
                      : "bg-[#ffffff] text-[#353535]"
                  } rounded-lg p-6 mb-3 xl:mb-4`}
                >
                  <h2 className="h3 pb-2">Jaminan Mutu</h2>
                  <div className="pt-4 flex items-center">
                    <i className="text-xl bx bx-check-circle text-[#456af8]"></i>
                    <div>100% Produk Original</div>
                    <button
                      onClick={() => setShowOriginalModal(true)}
                      type="button"
                      className="ml-auto text-xl text-primary cursor-pointer"
                    >
                      <i className="text-xl bx bx-info-circle text-[#456af8]"></i>
                    </button>

                    <OriginalModal
                      show={showOriginalModal}
                      onClose={() => setShowOriginalModal(false)}
                      product={product}
                    />
                  </div>
                </section>

                <div className="p-2">
                  <ProductReviews productId={product.id} />
                </div>
                <div
                  className={`${
                    isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                  } fixed gap-6 bottom-0 left-0 w-full p-4 shadow-2xl flex justify-between items-center z-50`}
                >
                  <Btn
                    className="flex-1"
                    variant="outline"
                    onClick={handleAddToCart}
                  >
                    <i className="bx bx-cart-add text-lg"></i> Keranjang
                  </Btn>
                  <Btn className="flex-1" onClick={handleBuyNow}>
                    Beli Sekarang
                    <i className="bx bx-right-arrow-alt text-lg"></i>
                  </Btn>
                </div>
              </div>
            </div>

            {/* Informasi Produk Lanjutan */}
            <section className="rounded-lg">
              <div className="flex flex-col">
                <section
                  className={`${
                    isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                  } p-6 mb-3 xl:mb-4 rounded-lg`}
                >
                  <h1
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } text-xl md:text-2xl font-semibold mb-2`}
                  >
                    {product.title}
                  </h1>
                  <div className="flex flex-row items-center">
                    <span className="text-[#959595] text-lg">
                      <i className="bx bxs-star text-lg text-[#FFD52DFF]"></i>
                      {product.average_rating}
                    </span>
                    <span className="text-[#959595] text-lg px-1">|</span>
                    <span className="text-[#959595] text-lg">
                      Terjual {product.terjual}
                    </span>
                  </div>

                  <div className="flex flex-row items-center mt-10">
                    <h1
                      className={`${
                        isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                      } text-2xl md:text-3xl font-bold`}
                    >
                      {formatRupiah(product.price)}
                    </h1>
                    <span
                      className={`${
                        isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                      } text-xl font-medium`}
                    >
                      &nbsp;/ pcs
                    </span>
                  </div>
                  <h1 className="text-[#959595] text-lg">
                    Stok barang {product.terjual}
                  </h1>

                  <div className="flex items-center justify-between pt-4">
                    <h3
                      className={`${
                        isDarkMode ? "text-[#F0F0F0]" : "text-[#353535]"
                      } text-lg font-semibold `}
                    >
                      Kuantitas
                    </h3>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className={`focus:outline-none cursor-pointer text-gray-400 ${
                          quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={quantity === 1}
                      >
                        <i className="bx bx-minus-circle text-2xl"></i>
                      </button>
                      <input
                        type="text"
                        className={`${
                          isDarkMode
                            ? "text-[#F0F0F0] bg-[#303030]"
                            : "text-[#353535] bg-[#ffffff]"
                        } text-base font-semibold text-center focus:outline-none w-14 border-none`}
                        name="quantity"
                        id="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="focus:outline-none cursor-pointer"
                      >
                        <i className="bx bx-plus-circle text-2xl text-gray-400"></i>
                      </button>
                    </div>
                  </div>

                  <hr className="mt-4 border-t border-gray-300" />
                  <h3
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } mt-4 text-lg font-semibold`}
                  >
                    Isi Produk:
                  </h3>
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-[#404040] text-[#f0f0f0]"
                        : "bg-[#f4f6f9] text-[#353535] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
                    } p-3 rounded-lg flex mt-4`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${
                        product.thumbnail
                      }`}
                      alt={product.title}
                      className="h-16 w-16 mr-2 object-cover rounded-lg"
                      loading="lazy"
                      width={800}
                      height={800}
                    />
                    <div
                      className={`${
                        isDarkMode ? "text-[#F0F0F0]" : "text-[#353535]"
                      } flex-1`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span>{product.title}</span>
                          <span className="font-semibold">
                            {formatRupiah(product.price * quantity)}
                          </span>
                        </div>
                        <div className="text-xxs pl-2">x{quantity}</div>
                      </div>
                    </div>
                  </div>
                  {/* <iframe className="mt-4 w-full"
                    src="https://mywebar.com/p/Project_0_kae8ad6ut"
                    allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"
                  ></iframe> */}
                </section>

                <section className="mt-4 mb-0 xl:mb-4 relative">
                  <div
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } p-4 md:px-0 font-bold text-lg leading-9`}
                  >
                    Promo Tersedia untuk Produk ini
                  </div>

                  <PromoProduct />

                  <div className="p-6 mt-4">
                    <Chatbot
                      productName={product.title}
                      productDescription={product.description}
                      productHarga={product.price}
                    />
                  </div>
                </section>

                <div className="p-2 md:hidden">
                  <ProductReviews productId={product.id} />
                </div>

                {/* Tombol untuk mobile */}
                <div className="mt-4 md:hidden">
                  <section
                    className={`${
                      isDarkMode
                        ? "bg-[#303030] text-[#f0f0f0]"
                        : "bg-[#ffffff] text-[#353535]"
                    } rounded-lg p-4 mb-3 xl:mb-4`}
                  >
                    <div className="p6">Informasi Produk</div>
                    <hr className="mt-4 border-t border-gray-300" />
                    <div className="flex gap-2 mt-4 flex-wrap items-center">
                      {tools.map((tool) => (
                        <div
                          key={tool.id}
                          className={`px-4 py-1 gap-2 flex flex-wrap rounded-full items-center cursor-pointer font-semibold bbg-[#F4F6F9] text-[#454545] shadow-lg hover:bg-[#304ebe] hover:text-white hover:scale-105 transition-all`}
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL}/storage/${
                              tool.tool_icon
                            }`}
                            alt={tool.tool_name}
                            className="w-5 h-5 object-contain"
                          />
                          <span>{tool.tool_name}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section
                    className={`${
                      isDarkMode
                        ? "bg-[#303030] text-[#f0f0f0]"
                        : "bg-[#ffffff] text-[#353535]"
                    } rounded-lg p-6 mb-3 xl:mb-4`}
                  >
                    <h2 className="h3 pb-2">Jaminan Mutu</h2>
                    <div className="pt-4 flex items-center">
                      <i className="text-xl bx bx-check-circle text-[#456af8]"></i>
                      <div>100% Produk Original</div>
                      <button
                        onClick={() => setShowOriginalModal(true)}
                        type="button"
                        className="ml-auto text-xl text-primary cursor-pointer"
                      >
                        <i className="text-xl bx bx-info-circle text-[#456af8]"></i>
                      </button>

                      <OriginalModal
                        show={showOriginalModal}
                        onClose={() => setShowOriginalModal(false)}
                        product={product}
                      />
                    </div>
                  </section>
                  <div
                    className={`${
                      isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                    } fixed gap-6 bottom-0 left-0 w-full p-4 shadow-2xl flex justify-between items-center z-50`}
                  >
                    <Btn
                      className="flex-1"
                      variant="outline"
                      onClick={handleAddToCart}
                    >
                      <i className="bx bx-cart-add text-lg"></i> Keranjang
                    </Btn>
                    <Btn className="flex-1" onClick={handleBuyNow}>
                      Beli Sekarang
                      <i className="bx bx-right-arrow-alt text-lg"></i>
                    </Btn>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
