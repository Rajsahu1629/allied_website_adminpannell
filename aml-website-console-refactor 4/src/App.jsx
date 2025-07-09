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
    <div className="h-[100vh]">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col">
        {isNavbarShow && (
          <div className="fixed w-full top-0 z-50">
            <TopNavbar />
          </div>
        )}
        <div className="flex w-full">
          {isNavbarShow && (
            <div
              className={`fixed top-[90px] h-full overflow-scroll z-40 sidebar-scroll ${sidebarWidth}`}
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
            className={`w-full bg-gray-100 transition-all duration-300 ${
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
