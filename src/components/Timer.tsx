// src/components/Timer.tsx

import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

interface TimerProps {
  turnEndTime: string | null;
  onTimeUp: () => void; // Добавляем обратный вызов при истечении времени
}

const Timer: React.FC<TimerProps> = ({ turnEndTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100); // Для прогресс-бара

  useEffect(() => {
    if (!turnEndTime) return;

    const endTime = new Date(turnEndTime).getTime();
    const initialTime = endTime - Date.now();

    if (initialTime <= 0) {
      setTimeLeft(0);
      setProgress(0);
      onTimeUp(); // Вызываем обратный вызов сразу, если время уже истекло
      return;
    }

    const updateTimer = () => {
      const currentTime = Date.now();
      const difference = endTime - currentTime;

      if (difference <= 0) {
        setTimeLeft(0);
        setProgress(0);
        onTimeUp(); // Вызываем обратный вызов при истечении времени
        clearInterval(intervalId);
      } else {
        const secondsLeft = Math.ceil(difference / 1000);
        setTimeLeft(secondsLeft);
        setProgress((difference / initialTime) * 100);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [turnEndTime, onTimeUp]);

  const isLowTime = timeLeft <= 5;

  return (
    <div className="timer-container">
      {turnEndTime ? (
        <div className={`timer-circle ${isLowTime ? 'low-time' : ''}`}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
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
