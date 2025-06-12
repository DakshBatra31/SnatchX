import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckCircle } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const getOrSetDiscount = (productId) => {
    const key = `discount_${productId}`;
    let discount = localStorage.getItem(key);
    if (discount) return Number(discount);
    discount = Math.floor(Math.random() * 61) + 20; // 20-80
    localStorage.setItem(key, discount);
    return discount;
  };

  const getDiscountedPrice = (item) => {
    const discount = getOrSetDiscount(item.id);
    const originalPrice = item.price * 75;
    return originalPrice * (1 - discount / 100);
  };

  const getOriginalPrice = (item) => item.price * 75;

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowSuccess(true);
    try {
      console.log('Starting checkout process...');
      const orderData = {
        userId: currentUser.uid,
        items: cart,
        totalAmount: cart.reduce((total, item) => total + (getDiscountedPrice(item) * item.quantity), 0),
        createdAt: new Date(),
        status: 'Order Placed',
        shippingDays: Math.floor(Math.random() * 3) + 2 // 2-4 days
      };

      console.log('Creating order in Firebase...');
      await addDoc(collection(db, 'orders'), orderData);
      console.log('Order created successfully');
      
      
      
      setTimeout(() => {
        setShowSuccess(true);
        clearCart();
        navigate('/orders');

      }, 5000);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#123458] mb-8">Shopping Cart</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-[#123458] text-white rounded hover:bg-[#0e2747] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + (getDiscountedPrice(item) * item.quantity), 0);

  return (
    <>
      <div className="min-h-screen bg-[#F1EFEC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#123458] mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-24 h-24 object-contain"
                    />
                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-medium text-[#123458]">{item.title}</h3>
                      <div className="mt-2">
                        <p className="text-gray-500 line-through">
                          ₹{getOriginalPrice(item).toFixed(2)}
                        </p>
                        <p className="text-[#123458] font-medium">
                          ₹{getDiscountedPrice(item).toFixed(2)}
                        </p>
                        <p className="text-green-600">
                          {getOrSetDiscount(item.id)}% OFF
                        </p>
                      </div>
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-[#123458]">
                        ₹{(getDiscountedPrice(item) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#123458] mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-[#123458] font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-[#123458] font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#123458]">Total</span>
                      <span className="text-lg font-bold text-[#123458]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-6 py-2 bg-[#123458] text-white rounded-lg font-semibold hover:bg-[#123458]/90 transition-colors w-full mt-6"
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-[#123458]">Order Placed!</h2>
            <p className="text-gray-700 mb-4 text-center">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="text-gray-600 text-sm mb-4">Redirecting to order history...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage; 