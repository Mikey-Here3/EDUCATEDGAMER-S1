'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: string | null;
  label: string;
}

export default function Countdown({ targetDate, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  if (!targetDate) {
    return (
      <div className="text-center p-6 border border-red-500/20 bg-purple-900/10 rounded-xl">
        <h3 className="text-xl font-bold text-red-400">DATE TO BE ANNOUNCED</h3>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center p-6 border border-red-500/20 bg-purple-900/10 rounded-xl">
        <h3 className="text-xl font-bold text-red-400">{label.toLowerCase().includes('registration') ? 'DEADLINE PASSED' : 'TOURNAMENT STARTED'}</h3>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-bold tracking-wider text-red-400 uppercase">{label}</h3>
      <div className="flex gap-2 sm:gap-4">
        {timeUnits.map((unit, idx) => (
          <div key={unit.label} className="flex flex-col items-center gap-2">
            <motion.div 
              key={unit.value}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-14 h-16 sm:w-20 sm:h-24 bg-[#111115] border border-red-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)] backdrop-blur-sm relative"
            >
              <span className="text-2xl sm:text-4xl font-bold text-white font-heading relative z-10">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
              {unit.label}
            </span>
            {idx < timeUnits.length - 1 && (
              <span className="absolute transform translate-x-[2.2rem] sm:translate-x-[3.2rem] translate-y-[1rem] sm:translate-y-[1.5rem] text-xl text-red-500/50 hidden sm:block">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
