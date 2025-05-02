import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const ReviewCard = ({ initials, name, review }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(Math.floor(Math.random() * 5) + 1);
  }, []);

  return (
    <div className="bg-[#F1EFEC] p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#123458] flex items-center justify-center text-white font-bold">
          {initials}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-[#030303]">{name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[#030303]">{review}</p>
    </div>
  );
};

export default ReviewCard; 