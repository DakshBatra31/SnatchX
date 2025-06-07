import LandingPage from "./components/LandingPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import CartPage from "./components/CartPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {
  return (
    <Router>
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
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;