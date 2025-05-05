import { Star } from "lucide-react";

const ReviewCard = ({ initials, name, review, rating }) => {
  return (
    <div className="bg-[#F1EFEC] p-4 sm:p-6 rounded-lg h-full">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#123458] flex items-center justify-center text-white font-bold text-sm sm:text-base">
          {initials}
        </div>
        <div className="ml-3 sm:ml-4">
          <h4 className="font-bold text-[#030303] text-sm sm:text-base">{name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-yellow-500 mr-1 h-4 w-4 sm:h-5 sm:w-5">★</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[#030303] text-sm sm:text-base">{review}</p>
    </div>
  );
};

export default ReviewCard; 