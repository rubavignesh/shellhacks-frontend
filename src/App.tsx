import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Pomo from "./pages/Pomo";
import Todos from "./pages/Todos"; // Import Todos page
import Job from "./pages/Job"; // Import Job page
import Settings from "./pages/Settings"; // Import Settings page
import { TimerProvider } from "./context/TimerContext"; // Import the TimerProvider

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const existingWidth = localStorage.getItem("sideBarWidth");

    if (!existingWidth) {      
      localStorage.setItem("sideBarWidth", "270");
    }

    console.log("User:", user);
    console.log("IsAuthenticated:", isAuthenticated);

    const checkUser = () => {
      if (isAuthenticated && user) {
        console.log("Starting API call to check user...");
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `http://10.108.140.94:8080/users/name`,
          data: {
            name: user.name
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
          }
        };

        axios.request(config)
          .then(response => {
            console.log("GET response:", response.data);
            if (!response.data) {
              console.log("User does not exist, proceeding to register...");
              registerUser();
            } else {
              console.log("User already exists:", response.data);
              setUserId(response.data[0]._id); // Set the userId in the UserContext
              console.log("User ID:", userId);

            }
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 404) {
                console.log("User not found, proceeding to register...");
                registerUser();
              } else if (error.response.status === 500) {
                console.error("Internal Server Error during user check:", error);
              } else {
                console.error("Error during user check:", error);
              }
            } else {
              console.error("Network or other error during user check:", error);
            }
          });
      } else {
        console.log("User is not authenticated or user data is not available.");
      }
    };

    const registerUser = () => {
      console.log("Starting API call to register user...");
      let postConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://10.108.140.94:8080/users/register',
        data: {
          name: user.name,
          email: user.email,
          thought: ""
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        }
      };

      axios.request(postConfig)
        .then(postResponse => {
          console.log("User saved successfully:", postResponse.data);
          setUserId(postResponse.data._id);
          console.log("User ID:", userId);
        })
        .catch(postError => {
          if (postError.response && postError.response.status === 500) {
            console.error("Internal Server Error during user registration:", postError.response.data.error.errorResponse.errmsg);
          } else {
            console.error("Error registering user:", postError);
          }
        });
    };

    checkUser();
  }, [isAuthenticated, user, userId]);

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