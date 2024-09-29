import React, { createContext, useContext, useState, useEffect } from "react";

const TimerContext = createContext({
  timeLeft: 1500, 
  isRunning: false,
  mode: "work",
  startTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
});

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(1800); // Default 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");

  useEffect(() => {
    let timerInterval = null;
    if (isRunning && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && mode === "work") {
      setMode("break");
      setTimeLeft(300);
      setIsRunning(false);
    } else if (timeLeft === 0 && mode === "break") {
      setMode("work");
      setTimeLeft(1500);
      setIsRunning(false);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, timeLeft, mode]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(1500);
  };

  return (
    <TimerContext.Provider value={{ timeLeft, isRunning, mode, startTimer, pauseTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
