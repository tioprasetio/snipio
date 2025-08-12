import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";
import { useCart } from "../hook/useCart";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { fetchCart } = useCart();
  const { login, isLoggedIn, setIsLoggedIn, setUser, loading } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const data = await login(email, password);

      // console.log("🟢 Login berhasil, token:", data.token);

      setUser(data.user); // 🔥 Update user di global state
      setIsLoggedIn(true); // 🔥 Update status login di AuthContext

      await fetchCart(); // Panggil fetchCart setelah login
      navigate("/"); // Redirect ke halaman dashboard

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Set error untuk ditampilkan di UI
      setError(error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
        } flex gap-2 justify-center items-center min-h-screen z-9999`}
      >
        <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin ml-2"></div>
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"}`}>
          Memuat data...
        </p>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"}`}>
          Anda sudah login...
        </p>
        {/* Tambahkan spinner atau skeleton loader di sini */}
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
      } flex h-full p-6 pt-28 sm:pt-32 items-center justify-center`}
    >
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#303030]" : "bg-white"
        } w-full max-w-md p-8 rounded-2xl`}
      >
        <div className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
          <Link to="/">
            <img
              src="https://k-net.co.id/assets/images/logo.png"
              className="h-8 inline-block"
              alt="K-Link"
              loading="lazy"
            />
            <span
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"
              } inline-block`}
            >
              Login K-Smart
            </span>
          </Link>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <input
            autoFocus
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#140c00] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#F4F6F9] text-[#140c00] shadow-[inset_3px_3px_6px_#DBDBDB,_inset_-3px_-3px_6px_#FFFFFF]"
            }`}
          />
          <button
            type="submit"
            className={`${
              isLoggingIn ? "opacity-50 cursor-wait" : ""
            } w-full p-4 font-bold text-white rounded-xl bg-[#456af8] hover:bg-[#304ebe] cursor-pointer`}
          >
            {isLoggingIn ? "Memproses..." : "Login"}
          </button>
          {error && (
            <div className="p-3 mb-4 text-center text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-center items-center gap-1 mt-4">
            <p
              className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"}`}
            >
              Belum punya akun?
            </p>
            <Link
              to="/register"
              type="button"
              className={`${
                isDarkMode ? "text-[#456af8]" : "text-[#456af8]"
              } hover:underline cursor-pointer inline-flex`}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
