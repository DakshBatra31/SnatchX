import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
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
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <User className="h-6 w-6" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}
              {currentUser && dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <span className="block text-[#123458] font-semibold text-base">{currentUser.displayName}</span>
                    <span className="block text-gray-500 text-sm">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-[#123458] hover:bg-[#F1EFEC] font-medium rounded-b-lg transition-colors"
                  >
                    Sign out
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