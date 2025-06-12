import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();

  
  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    const loadCart = async () => {
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        } else {
          
          await setDoc(cartRef, { items: [] });
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, [currentUser]);

  
  useEffect(() => {
    if (!currentUser || cart.length === 0) return;

    const syncCart = async () => {
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, { items: cart });
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    };

    syncCart();
  }, [cart, currentUser]);

  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
      return;
    }

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const currentCart = cartDoc.exists() ? cartDoc.data().items : [];
      
      const existingItem = currentCart.find(item => item.id === product.id);
      let updatedCart;
      
      if (existingItem) {
        updatedCart = currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...currentCart, { ...product, quantity }];
      }

      await setDoc(cartRef, { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      return;
    }

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const currentCart = cartDoc.exists() ? cartDoc.data().items : [];
      
      const updatedCart = currentCart.filter(item => item.id !== productId);
      await setDoc(cartRef, { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) {
      if (quantity === 0) {
        removeFromCart(productId);
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const currentCart = cartDoc.exists() ? cartDoc.data().items : [];
      
      let updatedCart;
      if (quantity === 0) {
        updatedCart = currentCart.filter(item => item.id !== productId);
      } else {
        updatedCart = currentCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
      }

      await setDoc(cartRef, { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await setDoc(cartRef, { items: [] });
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 