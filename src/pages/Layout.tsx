// Layout.tsx
import React from "react";
import SideBar from "../components/SideBar"; // Adjust the import path according to your structure
import NavBar from "../components/NavBar"; // Adjust the import path according to your structure
import Footer from "../components/Footer"; // Adjust the import path according to your structure

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#1e1e1e]"> {/* Make the entire layout fit the screen */}
      
      {/* Sidebar - Visible only on larger screens */}
      <div className="bg-[#262526] h-full fixed hidden lg:block" style={{ width: "250px" }}>
        <SideBar setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "250px" }}> {/* Adjusted margin-left to make room for sidebar */}
        
        {/* Navbar - Visible on larger screens */}
        <div className="bg-[#424042] h-16 hidden lg:block">
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-4">{children}</div> {/* Made the content area flexible */}

        <div className="w-full" style={{ marginLeft: "-250px", width: "calc(100% - 250px)" }}> {/* Adjust the footer position */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
