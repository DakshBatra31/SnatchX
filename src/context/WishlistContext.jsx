import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { currentUser } = useAuth();

  
  useEffect(() => {
    if (!currentUser) {
      setWishlist([]);
      return;
    }

    const loadWishlist = async () => {
      try {
        const wishlistRef = doc(db, 'wishlists', currentUser.uid);
        const wishlistDoc = await getDoc(wishlistRef);
        
        if (wishlistDoc.exists()) {
          setWishlist(wishlistDoc.data().items || []);
        } else {
          
          await setDoc(wishlistRef, { items: [] });
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || wishlist.length === 0) return;

    const syncWishlist = async () => {
      try {
        const wishlistRef = doc(db, 'wishlists', currentUser.uid);
        await setDoc(wishlistRef, { items: wishlist });
      } catch (error) {
        console.error('Error syncing wishlist:', error);
      }
    };

    syncWishlist();
  }, [wishlist, currentUser]);

  const addToWishlist = async (product) => {
    if (!currentUser) {
      setWishlist(prevWishlist => {
        if (!prevWishlist.some(item => item.id === product.id)) {
          return [...prevWishlist, product];
        }
        return prevWishlist;
      });
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      const wishlistDoc = await getDoc(wishlistRef);
      const currentWishlist = wishlistDoc.exists() ? wishlistDoc.data().items : [];
      
      if (!currentWishlist.some(item => item.id === product.id)) {
        const updatedWishlist = [...currentWishlist, product];
        await setDoc(wishlistRef, { items: updatedWishlist });
        setWishlist(updatedWishlist);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) {
      setWishlist(prevWishlist => 
        prevWishlist.filter(item => item.id !== productId)
      );
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      const wishlistDoc = await getDoc(wishlistRef);
      const currentWishlist = wishlistDoc.exists() ? wishlistDoc.data().items : [];
      
      const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
      await setDoc(wishlistRef, { items: updatedWishlist });
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!currentUser) {
      setWishlist([]);
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await setDoc(wishlistRef, { items: [] });
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext; 