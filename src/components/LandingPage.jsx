import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";
import TimerDisplay from "./TimerDisplay";

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow - now;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const resetAutoplay = () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }

      autoplayRef.current = setTimeout(() => {
        setCurrentSlide(
          (prevSlide) =>
            (prevSlide + 1) % (products.length > 5 ? 5 : products.length || 1)
        );
      }, 5000);
    };

    resetAutoplay();
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentSlide, products.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0
        ? products.length > 5
          ? 4
          : products.length - 1 || 0
        : prevSlide - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide + 1) % (products.length > 5 ? 5 : products.length || 1)
    );
  };

  const handleCategoryClick = (category) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  const categories = [
    { name: "WOMEN", category: "women's clothing" },
    { name: "MEN", category: "men's clothing" },
    { name: "ELECTRONICS", category: "electronics" },
    { name: "JEWELRY", category: "jewelery" },
  ];

  const reviews = [
    {
      initials: "JD",
      name: "John Doe",
      review: "The quality of products is amazing! I got my order within 2 days and everything was perfect.",
      rating: 5
    },
    {
      initials: "AS",
      name: "Alice Smith",
      review: "Best flash sale platform I've used! The deals are incredible and the checkout process is smooth.",
      rating: 5
    },
    {
      initials: "MB",
      name: "Mike Brown",
      review: "The customer service is outstanding. They helped me resolve an issue within minutes!",
      rating: 4
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F1EFEC]">
      <Navbar />
      <div className="bg-[#123458] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center overflow-x-auto">
            <div className="flex flex-nowrap">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.category)}
                  className="px-4 sm:px-8 md:px-12 py-4 font-bold hover:bg-[#030303] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden"
        ref={carouselRef}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#123458]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.slice(0, 5).map((product, index) => (
                <ProductCard key={index} product={product} isCarousel={true} />
              ))}
            </div>

            <div className="absolute bottom-4 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {products.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full focus:outline-none border border-white ${
                    currentSlide === index ? "bg-white" : "bg-transparent"
                  }`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>

            <button
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-sm p-1 sm:p-2 rounded-full z-20 hover:bg-white/50 transition-colors"
              onClick={goToPrevSlide}
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </button>
            <button
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-sm p-1 sm:p-2 rounded-full z-20 hover:bg-white/50 transition-colors"
              onClick={goToNextSlide}
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </button>
          </>
        )}
      </div>

      <div className="py-8 sm:py-12 md:py-16 bg-[#D4C9BE]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123458] mb-4 sm:mb-6">
              FLASH SALE ENDS IN
            </h2>
            <TimerDisplay timeLeft={timeLeft} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                >
                  <div className="bg-gray-300 h-64 w-full"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              products.slice(5, 8).map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-[#123458] text-white font-bold rounded hover:bg-[#123458]/90 transition-colors"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 md:py-16 bg-[#F1EFEC]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#030303] mb-8 sm:mb-10 md:mb-12">
            COLLECTIONS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {!loading && products.length > 0 ? (
              ["electronics", "jewelery", "men's clothing"].map(
                (category, index) => {
                  const categoryProduct = products.find(
                    (p) => p.category === category
                  );
                  if (!categoryProduct) return null;

                  return (
                    <div
                      key={index}
                      className="group cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-white">
                        <div className="h-80 flex items-center justify-center p-6">
                          <img
                            src={categoryProduct.image}
                            alt={category}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white uppercase">
                            {category}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-[#030303] text-xl">
                  Collection categories will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#030303] mb-8 sm:mb-10 md:mb-12">
            WHAT OUR CUSTOMERS SAY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                initials={review.initials}
                name={review.name}
                review={review.review}
                rating={review.rating}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="py-8 sm:py-10 md:py-12 bg-[#123458]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            JOIN OUR COMMUNITY
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Subscribe to our newsletter for exclusive deals, new arrivals, and
            special offers. Be the first to know about our flash sales!
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded sm:rounded-l sm:rounded-r-none focus:outline-none bg-white"
            />
            <button className="w-full sm:w-auto bg-[#030303] text-white font-bold px-6 py-3 rounded sm:rounded-l-none sm:rounded-r hover:bg-gray-900 transition-colors">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
