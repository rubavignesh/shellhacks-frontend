import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import MobileMenu from "../components/MobileMenu";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTimer } from "../context/TimerContext";

const Pomo = () => {
  const { timeLeft, isRunning, mode, startTimer, pauseTimer, resetTimer } = useTimer();
  const [activeTab, setActiveTab] = useState("pomodoro");

  // Format the timer display (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div id="pomodoro" className="App flex flex-col min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="bg-[#262526] h-full fixed hidden lg:block" style={{ width: "250px" }}>
        <SideBar setActiveTab={setActiveTab} /> {/* Pass setActiveTab prop */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#1e1e1e] h-full" style={{ marginLeft: "250px" }}>
        <div className="lg:hidden">
          <MobileMenu />
        </div>
        <div className="bg-[#424042] h-16 hidden lg:block">
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} /> {/* Pass activeTab and setActiveTab props */}
        </div>

        {/* Pomodoro Timer Content */}
        <div className="h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl mb-4">{mode === "work" ? "Work Time" : "Break Time"}</h1>
          <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>

          {/* Timer Controls */}
          <div className="flex space-x-4">
            <button
              className={`px-6 py-3 rounded bg-green-600 hover:bg-green-700 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={startTimer}
              disabled={isRunning}
            >
              Start
            </button>
            <button
              className={`px-6 py-3 rounded bg-yellow-600 hover:bg-yellow-700 ${!isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={pauseTimer}
              disabled={!isRunning}
            >
              Pause
            </button>
            <button className="px-6 py-3 rounded bg-red-600 hover:bg-red-700" onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pomo;
