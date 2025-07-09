import React, { useRef, useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./allroutes/AllRoutes";
import Sidebar from "./component/reusableComponents/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavbar from "./component/reusableComponents/TopNavbar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Company Profile");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isNavbarShow = location.pathname !== "/";

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = isSidebarCollapsed ? "w-28" : "w-74"; // Adjust these values based on your sidebar's actual widths
  const contentMarginLeft = isSidebarCollapsed ? "ml-28" : "ml-72";

  return (
    <div className="app-container">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'toast-container',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.12)',
          },
        }}
      />
      <div className="flex flex-col relative z-10">
        {isNavbarShow && (
          <div className="fixed w-full top-0 z-50">
            <TopNavbar />
          </div>
        )}
        <div className="flex w-full">
          {isNavbarShow && (
            <div
              className={`fixed top-[90px] h-full overflow-scroll z-40 sidebar-scroll ${sidebarWidth} transition-all duration-300`}
            >
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
              />
            </div>
          )}
          <div
            className={`w-full content-area transition-all duration-500 ${
              isNavbarShow ? `${contentMarginLeft} pt-[90px]` : ""
            }`}
          >
            <AllRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
