import React, { useState } from 'react';
import tw from "tailwind-styled-components";
import { Link } from "react-router-dom";
import { XIcon } from "@heroicons/react/solid";

// Icons for the navbar tabs
const PIcon = require("../assets/icons/PIcon1.png");
const JIcon = require("../assets/icons/JIcon1.png");
const TIcon = require("../assets/icons/TIcon1.png");
const SIcon = require("../assets/icons/SIcon1.png");

const Container = tw.div`
  h-full 
  flex 
  items-center 
  justify-center
  px-4 
  text-white 
  hover:bg-[#1e1e1e]
  hover:text-yellow_vs
  cursor-pointer
  text-lg
  font-medium
  text-gray-300
`;

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const [closedTabs, setClosedTabs] = useState<string[]>([]);

  // Ensure the active tab is not in closedTabs
  if (closedTabs.includes(activeTab)) {
    setClosedTabs(closedTabs.filter(tab => tab !== activeTab));
  }

  // Helper function to handle tab closing
  const handleCloseTab = (e: React.MouseEvent, tabName: string) => {
    e.stopPropagation();
    setClosedTabs((prevState) => [...prevState, tabName]);
    setActiveTab('pomo'); 
  };

  return (
    <div className="flex flex-row h-full">
      {/* Pomodoro Tab */}
      <Container
        className={activeTab === "pomo" ? "bg-[#1e1e1e] text-yellow_vs" : "hover:bg-[#1e1e1e] hover:text-yellow_vs"}
        onClick={() => setActiveTab("pomo")}
      >
        <Link to="/" className="flex items-center">
          <img src={PIcon} alt="Pomo Icon" className="w-13 h-12 mr-1 text-yellow_vs" style={{marginRight : "0px"}} />
          Pomo
        </Link>
      </Container>

      {/* Todos Tab */}
      {!closedTabs.includes("todos") && (
        <Container
          className={activeTab === "todos" ? "bg-[#1e1e1e] text-yellow_vs" : "hover:bg-[#1e1e1e] hover:text-yellow_vs"}
          onClick={() => setActiveTab("todos")}
        >
          <Link to="/todos" className="flex items-center">
            <img src={TIcon} alt="Todos Icon" className="w-7 mr-1 text-yellow_vs" style={{marginRight : "10px"}} />
            Todos
            <XIcon
              className="w-6 ml-4 hover:bg-gray-600 hover:rounded"
              onClick={(e) => handleCloseTab(e, "todos")}
            />
          </Link>
        </Container>
      )}

      {/* Job Tab */}
      {!closedTabs.includes("job") && (
        <Container
          className={activeTab === "job" ? "bg-[#1e1e1e] text-yellow_vs" : "hover:bg-[#1e1e1e] hover:text-yellow_vs"}
          onClick={() => setActiveTab("job")}
        >
          <Link to="/job" className="flex items-center">
            <img src={JIcon} alt="Job Icon" className="w-12 h-10 mr-1 text-yellow_vs" style={{marginRight : "4px"}} />
            Job
            <XIcon
              className="w-6 ml-4 hover:bg-gray-600 hover:rounded"
              onClick={(e) => handleCloseTab(e, "job")}
            />
          </Link>
        </Container>
      )}

      {/* Settings Tab */}
      {!closedTabs.includes("settings") && (
        <Container
          className={activeTab === "settings" ? "bg-[#1e1e1e] text-yellow_vs" : "hover:bg-[#1e1e1e] hover:text-yellow_vs"}
          onClick={() => setActiveTab("settings")}
        >
          <Link to="/settings" className="flex items-center">
            <img src={SIcon} alt="Settings Icon" className="w-6 mr-1 text-yellow_vs" style={{marginRight : "12px"}} />
            Settings
            <XIcon
              className="w-6 ml-4 hover:bg-gray-600 hover:rounded"
              onClick={(e) => handleCloseTab(e, "settings")}
            />
          </Link>
        </Container>
      )}
    </div>
  );
};

export default NavBar;
