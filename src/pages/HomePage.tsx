// pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import useProducts from "../hook/useProduct";
import CardProduct from "../components/CardProduct";
import { useDarkMode } from "../context/DarkMode";
import Navbar from "../components/Navbar";
import SkeletonListProduct from "../components/skeleton/SkeletonListProduct";
import Banner from "../components/Banner";
import SearchBar from "../components/SearchBar";
import Category from "../components/Categories";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";
import Payment from "../components/Payment";
import PopupVoucher from "../components/PopupVoucher";
import SkeletonReviewCard from "../components/skeleton/SkeletonReviewCard";

const HomePage = () => {
  const { products, loading } = useProducts();
  const { isDarkMode } = useDarkMode();
  const [isPopupClosed, setIsPopupClosed] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);
  const [reviews, setReviews] = useState<
    {
      rating: number;
      comment: string;
      user_name: string;
      profile_picture: string;
    }[]
  >([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/api/reviews/highlights`)
      .then((res) => {
        setReviews(res.data.data);
      })
      .catch((err) => {
        console.error("❌ Gagal mengambil review:", err);
      })
      .finally(() => {
        setLoadingReview(false);
      });
  }, []);

  // Filter best sellers
  const bestSellers = useMemo(
    () => products.filter((product) => product.terjual > 2),
    [products]
  );

  // Batasi tampilan menjadi 4 produk
  const displayedBestSellers = useMemo(
    () => bestSellers.slice(0, 4),
    [bestSellers]
  );

  const displayedProducts = useMemo(() => products.slice(0, 4), [products]);

  const renderedReviews = useMemo(() => {
    return reviews.map((review, index) => (
      <div
        key={index}
        className={`p-4 rounded-xl shadow-lg flex flex-col items-start gap-2 ${
          isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Profile + Name */}
        <div className="flex items-center gap-3">
          <img
            src={
              review.profile_picture
                ? `${import.meta.env.VITE_APP_API_URL}/uploads/profile/${
                    review.profile_picture
                  }`
                : "https://static.vecteezy.com/system/resources/previews/054/343/112/non_2x/a-person-icon-in-a-circle-free-png.png"
            }
            alt={review.user_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-lg">{review.user_name}</p>
            {/* Rating */}
            <div className="text-yellow-400 text-lg flex gap-1 py-2">
              {[...Array(review.rating)].map((_, i) => (
                <i key={`filled-${i}`} className="bx bxs-star"></i>
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <i key={`empty-${i}`} className="bx bx-star"></i>
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        <p className="text-sm">{review.comment}</p>
      </div>
    ));
  }, [reviews, isDarkMode]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
      } pt-16 sm:pt-20 overflow-x-hidden w-full min-h-screen max-w-5xl mx-auto`}
    >
      {!isPopupClosed && (
        <PopupVoucher onClose={() => setIsPopupClosed(true)} />
      )}
      <Navbar />
      <div className="p-4">
        <Banner />
        <SearchBar />
        {/* Kategori */}
        <div className="w-full">
          <div className="mx-auto">
            <h2
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"
              } text-xl font-bold mb-4`}
            >
              Kategori
            </h2>
            <Category />
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="w-full">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"
                } text-xl font-bold`}
              >
                Paling Laris
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#456af8] font-medium">
                  <Link to="/best-sellers">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedBestSellers.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* All Products Section */}
        <div className="w-full mt-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"
                } text-xl font-bold`}
              >
                Semua Produk
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#456af8] font-medium">
                  <Link to="/all-product">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedProducts.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* Kata Mereka Section */}
        <div className="w-full mt-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"
                } text-xl font-bold`}
              >
                Apa kata mereka?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loadingReview
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonReviewCard key={index} />
                  ))
                : renderedReviews}
            </div>
          </div>
        </div>

        <Payment />
      </div>
      <Footer />
      <Copyright />
    </div>
  );
};

export default HomePage;
