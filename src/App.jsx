import LandingPage from "./components/LandingPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CartPage from "./components/CartPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<ProductsPage initialTab="wishlist" />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;