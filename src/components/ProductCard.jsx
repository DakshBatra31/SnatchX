import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isCarousel = false }) => {
  return (
    <div
      className={`${
        isCarousel
          ? "min-w-full h-full relative flex items-center bg-black"
          : "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 duration-300"
      }`}
    >
      {isCarousel ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
          <div className="w-1/2 h-full flex items-center justify-end pr-10 z-20">
            <div className="w-[400px] h-[400px] bg-transparent relative">
              <img
                style={{ filter: "invert(1)" }}
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
          <div className="w-1/2 z-20 text-left pl-10">
            <div className="max-w-lg">
              <div className="bg-[#123458] inline-block px-4 py-1 mb-4 text-white text-sm font-bold uppercase">
                {product.category}
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-white mb-4 line-clamp-2">
                {product.description}
              </p>
              <Link
                to='/'
                className="inline-block px-8 py-3 mt-4 bg-white text-[#030303] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-64 w-full flex items-center justify-center p-4 bg-white">
            <div className="relative w-full h-full">
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-[#030303] text-lg mb-1 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#123458] font-bold text-lg">
                  ₹{(product.price * 75).toFixed(2)}
                </span>
              </div>
              {product.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-[#030303] font-medium">
                    {product.rating.rate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard; 