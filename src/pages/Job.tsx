import React, { useState } from "react";
import Layout from "./Layout"; // Adjust the import path according to your folder structure
import axios from "axios";

const Job = () => {
  const [currentTab, setCurrentTab] = useState("suggested"); // Set default tab to "suggested"
  const [activeTab, setActiveTab] = useState("job"); // Track the active tab
  const [preferredRole, setPreferredRole] = useState(""); // State for preferred role
  const [location, setLocation] = useState(""); // State for location
  const [datePosted, setDatePosted] = useState("Any time"); // State for date posted
  const [experienceLevel, setExperienceLevel] = useState("Internship"); // State for experience level

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/jobs/search`, {
        jobTitle: preferredRole,
        postingTime: datePosted,
        location: location,
        experienceLevel: experienceLevel,
      });
      const { linkedInLink } = response.data;
      //console.log("LinkedIn Link:", linkedInLink);
      window.open(linkedInLink, "_blank");
    } catch (error) {
      console.error("Error fetching LinkedIn search URL:", error);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-4xl mx-auto p-4 h-full overflow-y-auto"> {/* Center content and control width */}
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-6 border-b border-gray-500">
            {/* Suggested Jobs Tab */}
            <button
              className={`px-3 py-1 ${
                currentTab === "suggested"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setCurrentTab("suggested")}
            >
              Suggested Jobs
            </button>
            
            {/* Job Application Tracker Tab */}
            <button
              className={`px-3 py-1 ${
                currentTab === "tracker"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setCurrentTab("tracker")}
            >
              Job Application Tracker
            </button>
          </div>
        </div>

        {/* Content Display */}
        {currentTab === "suggested" && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4 w-full">
              {/* Preferred Role and Location Inputs */}
              <label className="text-white text-lg mb-2">Your Preferred Role:</label>
              <div className="flex space-x-2 mb-2 w-full justify-center">
                <input
                  type="text"
                  placeholder="Enter your preferred role"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="bg-gray-300 p-3 rounded flex-2"
                  style={{ flex: 2 }} // Set flex to 2
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-300 p-3 rounded flex-1"
                  style={{ flex: 1 }} // Set flex to 1
                />
              </div>

              {/* Dropdowns for Date Posted and Experience Level */}
              <div className="flex space-x-4 mb-4">
                {/* Date Posted Dropdown */}
                <div>
                  <label className="text-white block mb-1">Date Posted:</label>
                  <select
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    <option value="Any time">Any time</option>
                    <option value="Past month">Past month</option>
                    <option value="Past week">Past week</option>
                    <option value="Past 24 hours">Past 24 hours</option>
                  </select>
                </div>

                {/* Experience Level Dropdown */}
                <div>
                  <label className="text-white block mb-1">Experience Level:</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Entry level">Entry level</option>
                    <option value="Associate">Associate</option>
                    <option value="Mid-Senior level">Mid-Senior level</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={handleSearch}>
                Take me to the 🚀
              </button>
            </div>
          </div>
        )}

        {/* Job Application Tracker Content */}
        {currentTab === "tracker" && (
          <div className="flex flex-col items-center">
            {/* Comment out the tracker content for now */}
            {/*
            <div className="flex w-full md:w-2/3 mb-4"> 
              <input
                type="text"
                placeholder="Paste your JD to add to your application list"
                className="bg-gray-300 p-3 rounded-l w-full"
              />
              <button className="bg-blue-600 text-white p-3 rounded-r hover:bg-blue-700">
                Add
              </button>
            </div>

            <table className="w-full md:w-2/3 text-white"> 
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">Company Name</th>
                  <th className="text-left px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">Assurant</td>
                  <td className="px-4 py-2">2025 SWE Internship</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Google</td>
                  <td className="px-4 py-2">2025 SWE Internship</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Microsoft</td>
                  <td className="px-4 py-2">2025 SWE Internship</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">StateFarm</td>
                  <td className="px-4 py-2">2025 SWE Internship</td>
                </tr>
              </tbody>
            </table>
            */}

            {/* Placeholder message or empty div */}
            <p className="text-white">We will be there soon with this feature!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Job;
