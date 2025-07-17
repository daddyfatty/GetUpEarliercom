import React, { useState, useEffect } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MarathonCountdown: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-10-11T07:55:00-04:00'); // 7:55 AM EDT on October 11, 2025

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#0039A6]/90 to-[#0052D4]/90 text-white p-6 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Hartford Marathon 2025 Countdown</h2>
        <div className="flex justify-center space-x-4 sm:space-x-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#94D600]">{timeRemaining.days}</div>
            <div className="text-xs sm:text-sm uppercase tracking-wide">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#94D600]">{timeRemaining.hours}</div>
            <div className="text-xs sm:text-sm uppercase tracking-wide">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#94D600]">{timeRemaining.minutes}</div>
            <div className="text-xs sm:text-sm uppercase tracking-wide">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#94D600]">{timeRemaining.seconds}</div>
            <div className="text-xs sm:text-sm uppercase tracking-wide">Seconds</div>
          </div>
        </div>
        <p className="mt-4 text-sm sm:text-lg">Race Day: October 11, 2025 at 7:55 AM</p>
      </div>
    </div>
  );
};

export default MarathonCountdown;