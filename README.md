# SnatchX

SnatchX is a modern e-commerce web application featuring daily flash sales, wishlist and cart management, 
and seamless user authentication. Built with React, Firebase, and TailwindCSS, it offers a smooth 
shopping experience with dynamic daily discounts and a clean, responsive UI.

---

## 🚀 Features
- **Daily Flash Sales:** Unique discounts for every product, refreshed daily at midnight.
- **Product Catalog:** Browse, search, and filter products by category.
- **Product Details:** View detailed information, ratings, and reviews for each product.
- **Wishlist:** Add/remove products to your wishlist (persists per user).
- **Shopping Cart:** Add, update quantity, and remove products from your cart.
- **Order History:** View your past orders and delivery status.
- **User Authentication:** Sign up, log in, and log out securely (Firebase Auth).
- **Responsive Design:** Mobile-friendly and visually appealing UI.

---

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Icons:** Lucide React
- **APIs:** [Fake Store API](https://fakestoreapi.com/) for product data

---


## 📦 Project Structure
``
SnatchX-main/
├── src/
│   ├── components/        # React components (ProductCard, ProductDetail, etc.)
│   ├── context/           # React context for Auth, Cart, Wishlist
│   ├── firebase/          # Firebase configuration
│   ├── pages/             # Page-level components (OrderHistoryPage)
│   ├── utils/             # Utility functions (discountUtils.js)
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── package.json           # Project metadata and scripts
└── README.md              # This file
``
---


Happy Snatching! 🛒
