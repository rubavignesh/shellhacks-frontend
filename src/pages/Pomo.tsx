import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import MobileMenu from "../components/MobileMenu";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTimer } from "../context/TimerContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Pomo = () => {
  const { timeLeft, isRunning, mode, startTimer, pauseTimer, resetTimer, setCustomTime } = useTimer();
  const [activeTab, setActiveTab] = useState("pomodoro");
  const [clockedInTime, setClockedInTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [customTime, setCustomTimeInput] = useState("");

  useEffect(() => {
    let clockedInterval = null;
    let breakInterval = null;
    
    if (isRunning && mode === "work") {
        clockedInterval = setInterval(() => {
            setClockedInTime((prevTime) => prevTime + 1);
        }, 60000); // Increment every minute
    } 
    
    if (!isRunning) {
        breakInterval = setInterval(() => {
            setBreakTime((prevTime) => prevTime + 1);
        }, 60000); // Increment every minute when paused
    }

    return () => {
        clearInterval(clockedInterval);
        clearInterval(breakInterval);
    };
}, [isRunning, mode]);


  // Format the timer display (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Data for the bar chart
  const data = {
    labels: ['Time Clocked In', 'Time on Break'],
    datasets: [
      {
        label: 'Minutes',
        data: [clockedInTime, breakTime],
        backgroundColor: ['#00c6ff', '#00e6b8'],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  const handleSetTime = () => {
    const timeInMinutes = parseInt(customTime);
    if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
      setCustomTime(timeInMinutes); // Set the custom time in the context
    }
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
          <h1 className="text-3xl mb-4" style={{marginTop: "-60px"}}>{mode === "work" ? "Work Time" : "Break Time"}</h1>
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

          {/* Input for custom time */}
          <div className="mt-4 flex space-x-2">
            <input
              type="number"
              placeholder="Enter study time in minutes"
              value={customTime}
              onChange={(e) => setCustomTimeInput(e.target.value)}
              className="p-2 rounded bg-gray-300 text-black"
            />
            <button
              onClick={handleSetTime}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Set Time
            </button>
          </div>

          {/* Bar Chart */}
          <div className="w-full md:w-1/3 mt-8">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pomo;
