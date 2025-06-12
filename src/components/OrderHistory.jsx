import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

const getOrSetDiscount = (productId) => {
  const key = `discount_${productId}`;
  let discount = localStorage.getItem(key);
  if (discount) return Number(discount);
  discount = Math.floor(Math.random() * 61) + 20; // 20-80
  localStorage.setItem(key, discount);
  return discount;
};

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDiscountedPrice = (item) => {
    const discount = getOrSetDiscount(item.id);
    const originalPrice = item.price * 75;
    return originalPrice * (1 - discount / 100);
  };

  const getOriginalPrice = (item) => item.price * 75;

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

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-4">No orders found</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#123458]">Order History</h3>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-[#123458]">Order #{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-500">
                  {order.createdAt ? format(order.createdAt, 'MMM dd, yyyy') : 'Date not available'}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                order.status === 'Delivered' 
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'Processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-10 h-10 object-contain mr-2"
                    />
                    <span className="text-gray-700">{item.title}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">
                      ₹{getOriginalPrice(item).toFixed(2)}
                    </p>
                    <p className="text-[#123458] font-medium">
                      ₹{getDiscountedPrice(item).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      {getOrSetDiscount(item.id)}% OFF
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-[#123458]">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory; 