import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User } from 'lucide-react';

const Navbar = () => {
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
              className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link
              to="/wishlist"
              className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
            >
              <Heart className="h-6 w-6" />
            </Link>
            <Link
              to="/login"
              className="p-2 text-[#030303] hover:text-[#123458] rounded-full hover:bg-[#F1EFEC] transition-colors"
            >
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 