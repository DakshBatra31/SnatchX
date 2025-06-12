// Function to generate a consistent daily discount for a product
export const getDailyDiscount = (productId) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Create a unique key combining date and product ID
  const key = `discount_${today}_${productId}`;
  
  // Check if we already have a discount for today
  let discount = localStorage.getItem(key);
  
  if (discount) {
    return Number(discount);
  }
  
  // Generate a new discount for today
  // Using a combination of date and productId to ensure consistency
  const dateNum = parseInt(today.replace(/-/g, ''));
  // Convert productId to string and extract numbers, or use 0 if no numbers found
  const productNum = typeof productId === 'string' 
    ? parseInt(productId.replace(/\D/g, '') || '0')
    : productId || 0;
  const seed = dateNum + productNum;
  
  // Generate a number between 20 and 80
  discount = 20 + (seed % 61);
  
  // Store the discount for today
  localStorage.setItem(key, discount.toString());
  
  return discount;
};

// Function to clear old discounts
export const clearOldDiscounts = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Clear all discount keys except today's
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('discount_') && !key.includes(today)) {
      localStorage.removeItem(key);
    }
  });
}; 