import React from "react";

const Footer = () => {
  return (
    <div
      className="bg-[#424042] h-16 fixed bottom-0 flex items-center justify-center"
      style={{ marginLeft: "250px", width: "calc(100% - 250px)" }} // Adjust to start after the sidebar
    >
      <p className="text-white text-lg">"You miss 100% of the shots you don't take"</p>
    </div>
  );
};

export default Footer;
