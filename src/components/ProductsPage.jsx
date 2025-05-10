import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Search, X } from 'lucide-react';
import Navbar from './Navbar';
const ProductsPage = ({ initialTab }) => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || 'all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    initialTab || location.pathname === '/wishlist' ? 'wishlist' : (location.state?.activeTab || 'all')
  );
  
  const { wishlist } = useWishlist();

  useEffect(() => {
    if (activeTab === 'wishlist' && location.pathname !== '/wishlist') {
      navigate('/wishlist', { replace: true });
    } else if (activeTab === 'all' && location.pathname === '/wishlist') {
      navigate('/products', { replace: true });
    }
  }, [activeTab, location.pathname, navigate]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }

    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = [
          'all',
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;

    if (activeTab === 'wishlist') {
      const wishlistIds = wishlist.map(item => item.id);
      filtered = products.filter(product => wishlistIds.includes(product.id));
    } else {
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products, activeTab, wishlist]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleResetSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#123458] mb-6">
          {searchTerm 
            ? `Search results for "${searchTerm}"`
            : selectedCategory !== 'all' 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
              : 'Our Products'}
        </h1>
        
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === 'all'
                ? 'text-[#123458] border-b-2 border-[#123458]'
                : 'text-gray-500 hover:text-[#123458]'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Products
          </button>
          <button
            className={`py-3 px-4 font-medium flex items-center space-x-2 ${
              activeTab === 'wishlist'
                ? 'text-[#123458] border-b-2 border-[#123458]'
                : 'text-gray-500 hover:text-[#123458]'
            }`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span>My Wishlist</span>
            <Heart className={`h-5 w-5 ${activeTab === 'wishlist' ? 'text-red-500 fill-red-500' : ''}`} />
            <span className="bg-[#123458] text-white rounded-full px-2 py-0.5 text-xs">
              {wishlist.length}
            </span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
          
          {activeTab === 'all' && (
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all'
                    ? 'All Categories'
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-[#F1EFEC] rounded-lg">
              {activeTab === 'wishlist' ? (
                <div className="flex flex-col items-center">
                  <Heart className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-[#030303] text-lg mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500">Find products you love and add them to your wishlist!</p>
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="mt-4 px-6 py-2 bg-[#123458] text-white rounded-lg hover:bg-[#123458]/90 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-[#030303] text-lg mb-2">No products found matching your criteria.</p>
                  {searchTerm && (
                    <button 
                      onClick={handleResetSearch}
                      className="mt-4 px-6 py-2 bg-[#123458] text-white rounded-lg hover:bg-[#123458]/90 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
};

export default ProductsPage; 