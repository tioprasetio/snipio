import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import DarkModeContextProvider from "./context/DarkMode.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </BrowserRouter>
  </StrictMode>
);
