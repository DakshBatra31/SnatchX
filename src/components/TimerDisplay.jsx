const TimerDisplay = ({ timeLeft }) => {
  return (
    <div className="flex justify-center space-x-6">
      <div className="bg-white rounded-lg p-6 w-24 shadow-md">
        <div className="text-4xl font-bold text-[#123458]">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <div className="text-[#123458] font-medium">Hours</div>
      </div>
      <div className="bg-white rounded-lg p-6 w-24 shadow-md">
        <div className="text-4xl font-bold text-[#123458]">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="text-[#123458] font-medium">Minutes</div>
      </div>
      <div className="bg-white rounded-lg p-6 w-24 shadow-md">
        <div className="text-4xl font-bold text-[#123458]">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="text-[#123458] font-medium">Seconds</div>
      </div>
    </div>
  );
};

export default TimerDisplay; 