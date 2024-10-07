import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Pomo from "./pages/Pomo";
import Todos from "./pages/Todos";
import Job from "./pages/Job";
import Settings from "./pages/Settings";
import { TimerProvider } from "./context/TimerContext";

// Create UserContext
export const UserContext = createContext<{
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  userId: null,
  setUserId: () => {},
});

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize sidebar width in localStorage if not already set
    const existingWidth = localStorage.getItem("sideBarWidth");
    if (!existingWidth) {
      localStorage.setItem("sideBarWidth", "270");
    }

    // Check if user is authenticated and user data is available
    const checkUser = async () => {
      if (isAuthenticated && user) {
        try {
          console.log("Starting API call to check user...");
          const response = await axios.post(
            `http://192.168.1.247:5001/users/name`,
            { name: user.name },
            { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" } }
          );

          if (!response.data || response.data.length === 0) {
            console.log("User does not exist, registering user...");
            registerUser();
          } else {
            console.log("User found:", response.data);
            console.log("User ID:", response.data._id);
            setUserId(response.data._id); // Set the userId in the UserContext
            localStorage.setItem('userId', response.data._id); // Save userId to localStorage
            console.log("User ID set in context:", localStorage.getItem('userId'));
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("User not found, proceeding to register...");
            registerUser();
          } else {
            console.error("Error checking user:", error);
          }
        }
      }
    };

    const registerUser = async () => {
      try {
        console.log("Registering user...");
        const postResponse = await axios.post(
          'http://192.168.1.247:5001/users/register',
          { name: user.name, email: user.email, thought: "" },
          { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" } }
        );
        console.log("User registered:", postResponse.data);
        setUserId(postResponse.data._id);
        localStorage.setItem('userId', postResponse.data._id);
      } catch (postError) {
        console.error("Error registering user:", postError);
      }
    };

    checkUser();
  }, [isAuthenticated, user]); // Remove userId from dependency array to avoid re-triggering the effect

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
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
    </UserContext.Provider>
  );
}

export default App;
