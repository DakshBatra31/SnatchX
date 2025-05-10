import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/products', { state: { activeTab: 'wishlist' } });
  }, [navigate]);
  
  return null;
};

export default WishlistPage; 