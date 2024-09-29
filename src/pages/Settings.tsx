import React, { useState } from "react";
import Layout from "./Layout"; // Adjust the import path according to your structure

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings"); // Track the active tab
  const [currentTagline, setCurrentTagline] = useState("You miss 100% of the shots you don't take"); // Current tagline
  const [newTagline, setNewTagline] = useState(""); // State for the new tagline input

  // Function to handle updating the tagline
  const handleUpdateTagline = () => {
    if (newTagline.trim() !== "") {
      setCurrentTagline(newTagline);
      setNewTagline(""); // Clear the input field after updating
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
