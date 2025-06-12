
export const getDailyDiscount = (productId) => {
  const today = new Date().toDateString();
  const key = `discount_${today}_${productId}`;
  
  
  let discount = localStorage.getItem(key);
  if (discount) {
    return Number(discount);
  }

  
  const seed = today + productId;
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  
  const random = Math.abs(hash) % 41; 
  discount = random + 20; 

  
  localStorage.setItem(key, discount.toString());
  
  
  clearOldDiscounts();
  
  return discount;
};


export const clearOldDiscounts = () => {
  const today = new Date().toDateString();
  
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('discount_') && !key.includes(today)) {
      localStorage.removeItem(key);
    }
  });
}; 