import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

// 1. Definisikan tipe context
interface DarkModeContextType {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Buat context
const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: ReactNode;
}

const DarkModeContextProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  // 3. Ambil nilai awal dari localStorage atau default ke false
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 4. Simpan ke localStorage setiap kali isDarkMode berubah
  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));

    const body = document.body;
    // body.classList.add("transition-colors", "duration-200", "ease-in-out");

    if (isDarkMode) {
      body.classList.add("bg-gray-900", "text-[#f0f0f0]");
      body.classList.remove("bg-[#f4f6f9]", "text-[#353535]");
    } else {
      body.classList.remove("bg-gray-900", "text-[#f0f0f0]");
      body.classList.add("bg-[#f4f6f9]", "text-[#353535]");
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      "useDarkMode must be used within a DarkModeContextProvider"
    );
  }
  return context;
};

export { DarkModeContext };
export default DarkModeContextProvider;
