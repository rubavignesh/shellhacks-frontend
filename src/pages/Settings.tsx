import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout"; // Adjust the import path according to your structure
import axios from "axios";
import { UserContext } from "../App";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings"); // Track the active tab
  const [currentTagline, setCurrentTagline] = useState(""); // Current tagline
  const [newTagline, setNewTagline] = useState(""); // State for the new tagline input
  const { userId } = useContext(UserContext);

  useEffect(() => {
    // Fetch the current user's data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`); // Replace with your actual API endpoint
        setCurrentTagline(response.data.thought);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentTagline, userId]);
  
  // Function to handle updating the tagline
  const handleUpdateTagline = async () => {
    if (newTagline.trim() !== "") {
      try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/thought`, {
          thought: newTagline
        });
        
        if (response.data.user) {
          setCurrentTagline(response.data.user.thought);
          setNewTagline(""); // Clear the input field after updating
        }
      } catch (error) {
        console.error("Error updating tagline:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div id="Settings" className="pb-72 mt-36 flex flex-col items-center">
        {/* Current Tagline Section */}
        <h2 className="text-3xl font-bold text-white mb-6">Current Tagline:</h2>
        <p className="text-lg text-[#a2aabc] mb-8">{currentTagline}</p>
        
        {/* New Tagline Input Section */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newTagline}
            onChange={(e) => setNewTagline(e.target.value)}
            placeholder="Enter your new tagline"
            className="p-3 rounded bg-gray-700 text-white w-80 focus:outline-none"
          />
          <button
            onClick={handleUpdateTagline}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
