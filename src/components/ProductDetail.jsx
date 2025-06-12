import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import { getDailyDiscount } from '../utils/discountUtils';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCart, addToCart, updateQuantity, cart } = useCart();
  const [showQuantity, setShowQuantity] = useState(false);

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      if (!isInCart(product.id) || currentQuantity === 0) {
        addToCart(product, 1);
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      updateQuantity(product.id, 0);
      return;
    }
    updateQuantity(product.id, newQuantity);
  };

  const currentQuantity = cart.find(item => item.id === product?.id)?.quantity || 0;

  useEffect(() => {
    setLoading(true);
    
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();
      })
      .then(data => {
        setProduct(data);
        
        return fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(data.category)}`);
      })
      .then(res => res.json())
      .then(categoryProducts => {
        const related = categoryProducts
          .filter(p => p.id !== Number(productId))
          .slice(0, 4);
          
        setRelatedProducts(related);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-32 w-full bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Product not found'}</p>
        <Link
          to="/products"
          className="inline-block bg-[#123458] text-white px-6 py-3 rounded-lg hover:bg-[#123458]/90 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = getDailyDiscount(product.id);
  const originalPrice = product.price * 75;
  const discountedPrice = originalPrice * (1 - discount / 100);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <Link to="/products" className="flex items-center text-[#123458] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-96 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400?text=Image+Not+Available';
              }}
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                {discount}% OFF
              </span>
            )}
            <button
              onClick={handleWishlistClick}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
            >
              <Heart
                className={`h-6 w-6 ${
                  isInWishlist(product.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5" />
                  <span className="ml-1 text-gray-700">{product.rating?.rate || '4.5'}</span>
                </div>
                <span className="text-gray-500 text-sm">({product.rating?.count || '120'} reviews)</span>
                <span className="text-gray-500">•</span>
                <span className="capitalize text-gray-700">{product.category}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#123458]">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                {discount && (
                  <span className="text-gray-400 line-through text-lg">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors mt-2 ${
                isInCart(product.id) && currentQuantity > 0
                  ? "bg-[#123458] text-white hover:bg-[#123458]/90"
                  : "bg-[#123458] text-white hover:bg-[#123458]/90"
              }`}
            >
              {!isInCart(product.id) || currentQuantity === 0 ? (
                "Add to Cart"
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(currentQuantity - 1);
                    }}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{currentQuantity}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuantityChange(currentQuantity + 1);
                    }}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              )}
            </button>

            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Stock</p>
                  <p>Yes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p>{product.rating?.rate || '4.5'}/5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reviews</p>
                  <p>{product.rating?.count || '120'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage; 