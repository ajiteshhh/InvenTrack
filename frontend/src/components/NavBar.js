import React from "react";

const Navbar = ({ toggleSidebar, isSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen }) => {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 flex items-center h-16">
      <div className="flex items-center w-full px-4">
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <i className={`fas ${isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
        <button
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <i className={`fas ${isMobileSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;