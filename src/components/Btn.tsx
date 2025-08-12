interface BtnProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "solid" | "outline"; // Tambahkan varian tombol
  disabled?: boolean;
}

const Btn: React.FC<BtnProps> = ({
  children,
  className = "",
  onClick,
  variant = "solid",
  disabled = false, // Default false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center font-bold px-4 py-2 mt-3 rounded-md w-full cursor-pointer transition-all
        ${
          disabled
            ? "bg-gray-400 text-white cursor-not-allowed" // Warna abu-abu saat disabled
            : variant === "solid"
            ? "bg-[#456af8] text-white hover:bg-[#304ebe]" // Tombol hijau solid
            : "border border-[#456af8] text-[#456af8] bg-transparent hover:bg-[#456af8] hover:text-white" // Tombol outline
        }
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Btn;
