import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderHistory from './OrderHistory';

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowOrders(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
    setShowOrders(false);
  };

  const toggleOrders = () => {
    setShowOrders(!showOrders);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl text-[#123458] font-bold">
                SnatchX
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link
                to="/"
                className="text-[#030303] hover:text-[#123458] px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-[#030303] hover:text-[#123458] px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="relative p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => navigate('/products', { state: { activeTab: 'wishlist' } })}
              className="relative p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
            >
              <Heart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <div className="relative" ref={dropdownRef}>
              {currentUser ? (
                <button
                  className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors focus:outline-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  <span className="font-medium">{currentUser.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 