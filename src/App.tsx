import React, {useEffect} from 'react';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Pomo from "./pages/Pomo";
import Todos from "./pages/Todos"; // Import Todos page
import Job from "./pages/Job"; // Import Job page
import Settings from "./pages/Settings"; // Import Settings page
import { TimerProvider } from "./context/TimerContext"; // Import the TimerProvider

function App() {

  useEffect(() => {
    const existingWidth = localStorage.getItem("sideBarWidth");

    if (!existingWidth) {      
      localStorage.setItem("sideBarWidth", "270");
    }

  }, []);

  return (
    <TimerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pomo />} />
          <Route path="/todos" element={<Todos />} /> 
          <Route path="/job" element={<Job />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
