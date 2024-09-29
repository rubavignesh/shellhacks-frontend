import React, { useState, useEffect } from "react";
import About from "./About";
import Contact from "./Contact";
import SideBar from "../components/SideBar";
import Resume from "./Resume";
import MobileMenu from "../components/MobileMenu";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
// import LoginButton from "../components/LoginButton";
// import LogoutButton from "../components/LogoutButton";
// import { useAuth0 } from "@auth0/auth0-react";
// import Profile from "../components/Profile";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarWidth, setSidebarWidth] = useState(270); // Default width
  // const { isAuthenticated } = useAuth0();
  // console.log(isAuthenticated);
  useEffect(() => {
    const savedWidth = localStorage.getItem("sideBarWidth");
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sideBarWidth", sidebarWidth.toString());
  }, [sidebarWidth]);

  return (
    <div id="home" className="App flex h-full">
      <div
        className="bg-[#262526] h-full fixed hidden lg:block"
        style={{ width: `${sidebarWidth}px` }}
      >
        <SideBar setWidth={setSidebarWidth} width={sidebarWidth} />
      </div>
      <div className="bg-[#1e1e1e] h-full">
        <div className="lg:hidden">
          <MobileMenu />
        </div>
        <div
          className="bg-[#424042] h-16 hidden lg:block"
          style={{ paddingLeft: `${sidebarWidth}px` }}
        >
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {activeTab === "home" && (
          <div style={{ paddingLeft: `${sidebarWidth}px` }}>
            <Header />
            <About />
            <Resume />
            <Contact />
            {/* <button className="bg-white text-black py-2 px-4 rounded">
              <LoginButton />
            </button>
            <button className="bg-white text-black py-2 px-4 rounded">
              <LogoutButton />
            </button>
            
            <div className="bg-white text-black py-2 px-4 rounded">
              <Profile />
            </div> */}

            {/* Buttons for Auth0 */}

          </div>
        )}
        {activeTab === "about" &&  <div style={{ paddingLeft: `${sidebarWidth}px` }}><About /></div>}
        {activeTab === "resume" && <div style={{ paddingLeft: `${sidebarWidth}px` }}><Resume /></div>}
        {activeTab === "contact" && <div style={{ paddingLeft: `${sidebarWidth}px` }}><Contact /></div>}
      </div>
    </div>
  );
};

export default Home;
