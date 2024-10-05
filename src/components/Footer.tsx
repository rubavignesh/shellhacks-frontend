import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

const Footer = () => {
  const { userId } = useContext(UserContext);
  const [currentTagline, setCurrentTagline] = useState(""); // Current tagline

  useEffect(() => {
    // Fetch the current user's data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.204:5001/users/${userId}`); // Replace with your actual API endpoint
        setCurrentTagline(response.data.thought);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, currentTagline]);

  return (
    <div
      className="bg-[#424042] h-16 fixed bottom-0 flex items-center justify-center"
      style={{ marginLeft: "250px", width: "calc(100% - 250px)" }} // Adjust to start after the sidebar
    >
      <p className="text-white text-lg">{currentTagline}</p>
    </div>
  );
};

export default Footer;
