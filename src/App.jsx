import LandingPage from "./components/LandingPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <Router>
      <WishlistProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<ProductsPage initialTab="wishlist" />} />
        </Routes>
      </WishlistProvider>
    </Router>
  );
}

export default App;