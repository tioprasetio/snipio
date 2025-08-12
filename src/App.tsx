import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import { WishlistProvider } from "./context/WishlistContext";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import { CartProvider } from "./context/CartContext";
import GuestRoute from "./routes/guestRoute";
import CategoryPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CheckoutProvider } from "./context/CheckoutContext";
import { ReviewProvider } from "./context/ReviewContext";
import { ProductToolProvider } from "./context/ProductToolContext";
import VoucherPage from "./pages/VoucherPage";
import VoucherDetailPage from "./pages/VoucherDetailPage";
import CartPage from "./pages/CartPage";
import ProtectedRoute from "./routes/protectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";

function App() {
  return (
    <>
      <AuthProvider>
        <ReviewProvider>
          <ProductToolProvider>
            <WishlistProvider>
              <CartProvider>
                <CheckoutProvider>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/category/:category"
                      element={<CategoryPage />}
                    />
                    <Route path="/voucher" element={<VoucherPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                      path="/product/:productSlug"
                      element={<ProductDetailPage />}
                    />
                    <Route
                      path="/payment-callback"
                      element={<PaymentCallbackPage />}
                    />

                    <Route element={<GuestRoute />}>
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                      <Route path="/checkout" element={<CheckoutPage />} />
                    </Route>

                    {/* Dynamic Route */}
                    <Route
                      path="/voucher/:voucherSlug"
                      element={<VoucherDetailPage />}
                    />
                  </Routes>
                </CheckoutProvider>
              </CartProvider>
            </WishlistProvider>
          </ProductToolProvider>
        </ReviewProvider>
      </AuthProvider>
    </>
  );
}

export default App;
