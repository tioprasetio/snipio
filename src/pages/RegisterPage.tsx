import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    alamat: "",
    confirmPassword: "",
    no_tlp: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isLoggedIn, register, loading } = useAuth(); // Gunakan useAuth hook
  const { isDarkMode } = useDarkMode();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_SIZE_MB = 2;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    setError("");

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Hanya file gambar yang diperbolehkan (jpg, jpeg, png, webp)."
        );
        e.target.value = ""; // reset input file
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file maksimal ${MAX_SIZE_MB}MB!`);
        e.target.value = ""; // reset input file
        return;
      }

      setProfilePicture(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await register({
        ...formData,
        profile_picture: profilePicture,
      });
      navigate("/login"); // Redirect ke login setelah sukses register
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
      // console.log(err);
    }
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-[#f4f6f9]"
        } flex gap-2 justify-center items-center min-h-screen z-9999`}
      >
        <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
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
        } w-full max-w-md p-8 shadow-md rounded-lg`}
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
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Foto Profil
            </label>

            <div className="flex gap-4 items-center justify-center">
              {profilePicture && (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg"
                  loading="lazy"
                />
              )}
              <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
                className={`w-full border rounded ${
                  isDarkMode
                    ? "bg-[#252525] text-[#f0f0f0]"
                    : "bg-white text-[#140c00]"
                }`}
              />
            </div>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#140c00]"
            }`}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#140c00]"
            }`}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#140c00]"
            }`}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#140c00]"
            }`}
          />
          <input
            type="text"
            name="no_tlp"
            placeholder="Nomor HP"
            value={formData.no_tlp}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#140c00]"
            }`}
          />

          <input
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={handleChange}
            required
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#353535]"
            }`}
          />

          <button
            type="submit"
            className="w-full p-4 text-white rounded-xl bg-[#456af8] hover:bg-[#167e3c] cursor-pointer"
          >
            Register
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="flex justify-center items-center gap-1 mt-4">
            <p
              className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#140c00]"}`}
            >
              Sudah punya akun?
            </p>
            <Link
              to="/login"
              type="button"
              className={`${
                isDarkMode ? "text-[#456af8]" : "text-[#456af8]"
              } hover:underline cursor-pointer inline-flex`}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
