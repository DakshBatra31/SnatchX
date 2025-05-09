import LandingPage from "./components/LandingPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;