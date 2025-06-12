import React from 'react';
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getDailyDiscount } from '../utils/discountUtils';

const ProductCard = ({ product, isCarousel = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCart, addToCart, updateQuantity, cart } = useCart();
  const discount = getDailyDiscount(product.id);
  const [showQuantity, setShowQuantity] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart(product.id) || currentQuantity === 0) {
      addToCart(product, 1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      updateQuantity(product.id, 0);
      return;
    }
    updateQuantity(product.id, newQuantity);
  };

  const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;

  const originalPrice = product.price * 75;
  const discountedPrice = originalPrice * (1 - discount / 100);

  return (
    <div
      className={`${
        isCarousel
          ? "min-w-full h-full relative flex items-center bg-black"
          : "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 duration-300"
      }`}
    >
      {isCarousel ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
          <div className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-end md:pr-10 z-20">
            <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-transparent relative">
              <img
                style={{ filter: "invert(1)" }}
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 z-20 text-center md:text-left px-4 md:pl-10 md:pr-0">
            <div className="max-w-lg mx-auto md:mx-0">
              <div className="bg-[#123458] inline-block px-4 py-1 mb-4 text-white text-sm font-bold uppercase">
                {product.category}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">
                {product.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white mb-4 line-clamp-2">
                {product.description}
              </p>
              <Link
                to={`/products/${product.id}`}
                className="inline-block px-6 py-2 md:px-8 md:py-3 mt-4 bg-white text-[#030303] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        </>
      ) : (
        <Link to={`/products/${product.id}`} className="block h-full">
          <div className="h-64 w-full flex items-center justify-center p-4 bg-white relative">
            <div className="relative w-full h-full">
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
              />
              {discount && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  {discount}% OFF
                </span>
              )}
            </div>
            <div
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center cursor-pointer transition-colors shadow-md z-20"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-[#030303] text-lg mb-1 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[#123458] font-bold text-lg mr-2">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                {discount && (
                  <span className="text-gray-400 line-through text-sm mr-1">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1 h-5 w-5">★</span>
                  <span className="text-[#030303] font-medium">
                    {product.rating.rate}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors mt-2 ${
                isInCart(product.id) && currentQuantity > 0
                  ? "bg-[#123458] text-white hover:bg-[#123458]/90"
                  : "bg-[#123458] text-white hover:bg-[#123458]/90"
              }`}
            >
              {!isInCart(product.id) || currentQuantity === 0 ? (
                "Add to Cart"
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(currentQuantity - 1);
                    }}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{currentQuantity}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(currentQuantity + 1);
                    }}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              )}
            </button>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ProductCard; 