import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format, addDays, isAfter } from 'date-fns';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { getDailyDiscount } from '../utils/discountUtils';

const OrderHistoryPage = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDiscountedPrice = (item) => {
    const discount = getDailyDiscount(item.id);
    const originalPrice = item.price * 75;
    return originalPrice * (1 - discount / 100);
  };

  const getOriginalPrice = (item) => item.price * 75;

  const getDeliveryInfo = (order) => {
    const orderDate = order.createdAt;
    const shippingDays = order.shippingDays || Math.floor(Math.random() * 3) + 2; // 2-4 days
    const deliveryDate = addDays(orderDate, shippingDays);
    const now = new Date();
    const isDelivered = isAfter(now, deliveryDate);

    return {
      shippingDays,
      deliveryDate: format(deliveryDate, 'MMM dd, yyyy'),
      isDelivered,
      status: isDelivered ? 'Delivered' : order.status
    };
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#123458] mb-4">Order History</h1>
            <p className="text-gray-500">No orders found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#123458] mb-6">Order History</h1>
        <div className="space-y-6">
          {orders.map((order) => {
            const { shippingDays, deliveryDate, isDelivered, status } = getDeliveryInfo(order);
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-[#123458]">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt ? format(order.createdAt, 'MMM dd, yyyy') : 'Date not available'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      status === 'Delivered' 
                        ? 'bg-green-100 text-green-800'
                        : status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {isDelivered ? 'Delivered on ' : 'Delivery by '}{deliveryDate}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-16 h-16 object-contain"
                        />
                        <div>
                          <h3 className="font-medium text-[#123458]">{item.title}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <div className="text-sm">
                            <p className="text-gray-500 line-through">
                              ₹{getOriginalPrice(item).toFixed(2)}
                            </p>
                            <p className="text-[#123458] font-medium">
                              ₹{getDiscountedPrice(item).toFixed(2)}
                            </p>
                            <p className="text-green-600">
                              {getDailyDiscount(item.id)}% OFF
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[#123458] font-medium">
                          ₹{(getDiscountedPrice(item) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-4 py-2 bg-[#123458] text-white rounded hover:bg-[#0e2747] transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="text-lg font-bold text-[#123458]">
                      Total: ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage; 