import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { X, CheckCircle } from "lucide-react";

const getOrSetDiscount = (productId) => {
  const key = `discount_${productId}`;
  let discount = localStorage.getItem(key);
  if (discount) return Number(discount);
  discount = Math.floor(Math.random() * 61) + 20; // 20-80
  localStorage.setItem(key, discount);
  return discount;
};

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const getDiscountedPrice = (item) => {
    const discount = getOrSetDiscount(item.id);
    const originalPrice = item.price * 75;
    return originalPrice * (1 - discount / 100);
  };
  const getOriginalPrice = (item) => item.price * 75;
  const getDiscount = (item) => getOrSetDiscount(item.id);
  const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);

  const handleCheckout = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    clearCart();
    setShowSuccess(true);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#123458] mb-6">My Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-12 bg-[#F1EFEC] rounded-lg">
            <p className="text-[#030303] text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-4">Add some products to your cart to see them here!</p>
            <Link
              to="/products"
              className="mt-4 px-6 py-2 bg-[#123458] text-white rounded-lg hover:bg-[#123458]/90 transition-colors inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-contain rounded"
                  />
                  <div className="flex-1 w-full">
                    <h2 className="font-bold text-lg text-[#030303] mb-1">{item.title}</h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {getDiscount(item)}% OFF
                      </span>
                      <span className="text-[#123458] font-bold text-lg">₹{getDiscountedPrice(item).toFixed(2)}</span>
                      <span className="text-gray-400 line-through text-sm">₹{getOriginalPrice(item).toFixed(2)}</span>
                      <span className="text-gray-500 text-sm">x</span>
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeFromCart(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-white text-base font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="ml-4 text-[#123458] font-semibold">
                        Amt: ₹{(getDiscountedPrice(item) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-0 right-0 m-2 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 shadow-sm"
                    title="Remove"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Clear Cart
              </button>
              <div className="text-xl font-bold text-[#123458]">
                Total: ₹{total.toFixed(2)}
              </div>
              <button
                className="px-6 py-2 bg-[#123458] text-white rounded-lg font-semibold hover:bg-[#123458]/90 transition-colors"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-[#123458]">Order Placed!</h2>
            <p className="text-gray-700 mb-4 text-center">Thank you for your purchase. Your order has been placed successfully.</p>
            <button
              className="px-6 py-2 bg-[#123458] text-white rounded-lg font-semibold hover:bg-[#123458]/90 transition-colors"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage; 