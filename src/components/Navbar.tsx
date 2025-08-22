/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import logo from "../assets/logo-background.svg";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useDarkMode } from "../context/DarkMode";
import { useCart } from "../hook/useCart";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const { cart } = useCart();
  const { isLoggedIn, setIsLoggedIn, logout } = useAuth();

  useEffect(() => {
    import("flowbite").then((flowbite) => {
      if (flowbite && flowbite.initFlowbite) {
        flowbite.initFlowbite();
      }
    });
  }, []);

  const totalItems = cart.length;

  // Cek login saat komponen dimuat
  useEffect(() => {
    const checkLogin = async () => {
      const loggedInStatus = await isLoggedIn;
      setIsLoggedIn(loggedInStatus);
    };

    checkLogin();
  }, []);

  // Logout user saat tombol logout diklik
  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, logout!",
      cancelButtonText: "Batal",
    }).then((result: any) => {
      if (result.isConfirmed) {
        logout(); // Panggil fungsi logoutUser
        setIsLoggedIn(false); // Update state loggedIn
        window.location.assign("/login");
      }
    });
  };

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } border-gray-200 fixed top-0 left-0 w-full z-40 shadow-md`}
    >
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Flowbite Logo" />
          <span
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } self-center text-2xl font-semibold whitespace-nowrap`}
          >
            Snipio
          </span>
        </Link>

        <div className="flex items-center gap-3 md:hidden">
          {/* Cart Button */}
          <Link
            to="/cart"
            className={`relative ${
              isDarkMode
                ? "text-[#f0f0f0] bg-[#303030]"
                : "text-[#140c00] bg-[#f0f0f0]"
            } flex items-center justify-center cursor-pointer py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-center`}
          >
            <i className="bx bxs-cart-add text-xl relative"></i>

            {/* Badge notif */}
            {isLoggedIn && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile Button */}
          {isLoggedIn && (
            <Link
              to="/profile"
              className={`${
                isDarkMode
                  ? "text-[#f0f0f0] bg-[#303030]"
                  : "text-[#140c00] bg-[#f0f0f0]"
              } flex items-center justify-center cursor-pointer py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-center`}
            >
              <i className="bx bx-user text-xl"></i>
            </Link>
          )}

          {/* Hamburger Menu */}
          <button
            data-collapse-toggle="navbar-multi-level"
            type="button"
            className={`${
              isDarkMode
                ? "text-[#f0f0f0] bg-[#303030]"
                : "text-[#140c00] bg-[#f0f0f0]"
            } flex items-center justify-center cursor-pointer py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-center`}
            aria-controls="navbar-multi-level"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className="hidden w-full md:block md:w-auto"
          id="navbar-multi-level"
        >
          <ul
            className={`${
              isDarkMode
                ? "text-[#f0f0f0] bg-[#292929] md:bg-gray-900 border-[#03180b]"
                : "text-[#140c00] bg-gray-50 md:bg-white border-gray-100"
            } flex text-base flex-col md:flex-row md:items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 font-medium p-4 md:p-0 mt-4 border rounded-lg md:mt-0 md:border-0`}
          >
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode
                    ? "text-[#f0f0f0] bg-gray-900"
                    : "text-[#140c00] bg-white"
                } block py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-sm`}
                aria-current="page"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about-us"
                className={`${
                  isDarkMode
                    ? "text-[#f0f0f0] bg-gray-900"
                    : "text-[#140c00] bg-white"
                } block py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-sm`}
                aria-current="page"
              >
                Tentang Kami
              </Link>
            </li>
            
            {isLoggedIn && (
              <li>
                <Link
                  to="/voucher"
                  className={`${
                    isDarkMode
                      ? "text-[#f0f0f0] bg-gray-900"
                      : "text-[#140c00] bg-white"
                  } block py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-sm`}
                  aria-current="page"
                >
                  Voucher
                </Link>
              </li>
            )}

            {/* Cart Button */}
            <li>
              <Link
                to="/cart"
                className={`relative hidden md:block ${
                  isDarkMode
                    ? "text-[#f0f0f0] bg-[#303030]"
                    : "text-[#140c00] bg-[#f0f0f0]"
                } flex items-center justify-center cursor-pointer py-2 px-3 hover:text-white hover:bg-[#456af8] rounded-sm text-center`}
              >
                <i className="bx bxs-cart-add text-xl relative"></i>

                {/* Badge notif */}
                {isLoggedIn && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

            {/* Profile Button */}
            {isLoggedIn && (
              <li>
                <Link
                  to="/profile"
                  className={`${
                    isDarkMode
                      ? "text-[#f0f0f0] bg-[#303030]"
                      : "text-[#140c00] bg-[#f0f0f0]"
                  } hidden cursor-pointer md:block py-2 px-3 hover:text-white w-full md:w-auto hover:bg-[#456af8] rounded-sm text-center`}
                >
                  <i className="bx bx-user"></i>
                </Link>
              </li>
            )}

            {/* Dark Mode Button */}
            <li>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${
                  isDarkMode
                    ? "text-[#f0f0f0] bg-[#505050]"
                    : "text-[#140c00] bg-[#f0f0f0]"
                } cursor-pointer block py-2 px-3 text-center hover:text-white w-full md:w-auto hover:bg-[#456af8] rounded-sm`}
              >
                {isDarkMode ? (
                  <i className="bx bxs-sun"></i>
                ) : (
                  <i className="bx bxs-moon"></i>
                )}
              </button>
            </li>

            {/* Logout / Login Button */}
            <li className="w-full md:w-auto">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout} // Panggil fungsi handleLogout
                  className={`${
                    isDarkMode
                      ? "text-[#f0f0f0] bg-[#cb2525]"
                      : "text-[#f0f0f0] bg-[#cb2525]"
                  } cursor-pointer block py-2 px-3 text-center hover:text-white w-full md:w-auto hover:bg-[#cb2525] rounded-sm`}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="w-full md:w-auto block">
                  <button
                    type="button"
                    className={`${
                      isDarkMode
                        ? "text-[#f0f0f0] bg-[#456af8]"
                        : "text-[#f0f0f0] bg-[#456af8]"
                    } cursor-pointer block py-2 px-3 text-center hover:text-white w-full md:w-auto hover:bg-[#304ebe] rounded-sm`}
                  >
                    Login
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
