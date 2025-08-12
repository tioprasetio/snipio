import { Link, useParams, useSearchParams } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState } from "react";
import CardProduct from "../components/CardProduct";
import useProducts from "../hook/useProduct";
import useCategories from "../hook/useCategories";
import SkeletonListProduct from "../components/skeleton/SkeletonListProduct";
import type { Product } from "../types/Product";

const CategoryPage = () => {
  const { isDarkMode } = useDarkMode();
  const { category } = useParams(); // Ambil kategori dari URL
  const decodedCategory = decodeURIComponent(category || ""); // Dekode jika ada spasi
  const { products, loading, error } = useProducts();
  const { categories } = useCategories(); // Ambil daftar kategori
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort"); // termurah / termahal
  const minRating = parseFloat(searchParams.get("rating") ?? "0");

  useEffect(() => {
    let filtered = [...products];

    if (decodedCategory && categories.length > 0 && products.length > 0) {
      // Cari category_id berdasarkan nama kategori
      const matchedCategory = categories.find(
        (cat) => cat.name === decodedCategory
      );

      if (matchedCategory) {
        const categoryId = matchedCategory.id; // Ambil category_id
        // console.log("Found category ID:", categoryId);

        // Filter produk berdasarkan category_id
        filtered = products.filter((product) => {
          const rating = product.average_rating || 0;
          return product.category_id === categoryId && rating >= minRating;
        });

        if (sort === "termurah") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === "termahal") {
          filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
      } else {
        // console.log("Category not found!");
        setFilteredProducts([]);
      }
    }
  }, [decodedCategory, products, categories, minRating, sort]); // Tambahkan categories sebagai dependency

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

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
        } overflow-x-hidden w-full min-h-screen pt-16 sm:pt-24`}
      >
        <div className="text-[#353535] text-xl font-medium p-6">
          <span
            className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}
          >
            <Link className="text-[#456af8]" to="/">
              Home
            </Link>{" "}
            / {decodedCategory}
          </span>
        </div>

        <div className="flex gap-4 px-6">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                searchParams.delete("sort"); // Hapus param jika kosong
              } else {
                searchParams.set("sort", value);
              }
              setSearchParams(searchParams);
            }}
            value={sort || ""}
            className={`${
              isDarkMode
                ? "bg-gray-800 text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            } p-2 rounded-lg text-center font-semibold border border-indigo-400 text-indigo-400 focus:ring-indigo-400 focus:border-indigo-400 transition cursor-pointer`}
          >
            <option value="">Urutkan Harga</option>
            <option value="termurah">Termurah ke Termahal</option>
            <option value="termahal">Termahal ke Termurah</option>
          </select>
          <select
            onChange={(e) => {
              searchParams.set("rating", e.target.value);
              setSearchParams(searchParams);
            }}
            defaultValue={minRating || ""}
            className={`${
              isDarkMode
                ? "bg-gray-800 text-[#f0f0f0] border-[#282828]"
                : "bg-[#F4F6F9] text-[#353535] border-gray-200"
            } p-2 rounded-lg text-center font-semibold border border-indigo-400 text-indigo-400 focus:ring-indigo-400 focus:border-indigo-400 transition cursor-pointer`}
          >
            <option value="0">Semua Rating</option>
            <option value="1">⭐1</option>
            <option value="2">⭐2</option>
            <option value="3">⭐3</option>
            <option value="4">⭐4</option>
            <option value="5">⭐5</option>
          </select>
        </div>

        <div className="p-6 w-full">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonListProduct key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">
                <i className="bx bx-x-circle mr-1"></i>
                Maaf, tidak ada produk tersedia untuk kategori ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
