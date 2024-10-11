// src/components/Timer.tsx

import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

interface TimerProps {
  turnEndTime: string; // Предполагается, что время передаётся в формате строки
}

const Timer: React.FC<TimerProps> = ({ turnEndTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!turnEndTime) return;

    const endTime = new Date(turnEndTime).getTime();

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const difference = endTime - currentTime;

      if (difference <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    updateTimer(); // Запускаем сразу
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [turnEndTime]);

  const isLowTime = timeLeft <= 5;

  return (
    <div className="timer-container">
      {timeLeft > 0 ? (
        <div className={`timer-circle ${isLowTime ? 'low-time' : ''}`}>
          <span className="timer-text">{timeLeft}s</span>
        </div>
      ) : (
        <div className="timer-circle">
          <span className="timer-text">Время вышло</span>
        </div>
      )}
    </div>
  );
};

export default Timer;
