import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Award,
  BookMarked,
  TrendingUp,
  Package,
  Menu,
  Search,
  Calendar,
  ChevronRight,
  LogOut,
  User,
  Mail,
  BarChart3,
  X,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDebounce } from "use-debounce";
import AwardsPage from "../../pages/AwardsPage";
import BlogPage from "../../pages/BlogPage";
import CompanyMilestonePage from "../../pages/CompanyMilestonePage";
import CompanyProfilePage from "../../pages/CompanyProfilePage";
import ProductsPage from "../../pages/ProductsPage";
import Logo from "../../assets/allied-logo-1.png";
import { BellIcon } from "../../assets/svg/Svg";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";


// BellIcon (unchanged)


const TopNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Company Profile");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showBox, setShowBox] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [greetingIcon, setGreetingIcon] = useState(null);
  const [greetingColor, setGreetingColor] = useState("");
  const [greetingAnimation, setGreetingAnimation] = useState(false);
  const [testHour, setTestHour] = useState(null); // New state for testing hour
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isWelcomeMessageVisible, setIsWelcomeMessageVisible] = useState(true);
  const { logout,user } = useAuthStore();
console.log(user,"users")
  useEffect(() => {
    const updateGreeting = () => {
      // Use testHour if set, otherwise use current hour
      const hour = testHour !== null ? testHour : new Date().getHours();
      let newGreeting = "";
      let newTimeOfDay = "";
      let newIcon = null;
      let newColor = "";

      if (hour < 5) {
        newGreeting = "Working Late?";
        newTimeOfDay = "night";
        newIcon = (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
          </motion.div>
        );
        newColor = "from-indigo-600 to-blue-800";
      } else if (hour < 12) {
        newGreeting = "Good Morning";
        newTimeOfDay = "morning";
        newIcon = (
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sun className="w-6 h-6 text-yellow-500" />
          </motion.div>
        );
        newColor = "from-amber-400 to-orange-500";
      } else if (hour < 17) {
        newGreeting = "Good Afternoon";
        newTimeOfDay = "afternoon";
        newIcon = (
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Sun className="w-6 h-6 text-orange-500" />
          </motion.div>
        );
        newColor = "from-orange-400 to-red-500";
      } else if (hour < 21) {
        newGreeting = "Good Evening";
        newTimeOfDay = "evening";
        newIcon = (
          <motion.div
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sunset className="w-6 h-6 text-purple-500" />
          </motion.div>
        );
        newColor = "from-purple-500 to-pink-500";
      } else {
        newGreeting = "Good Night";
        newTimeOfDay = "night";
        newIcon = (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
          </motion.div>
        );
        newColor = "from-indigo-600 to-blue-800";
      }

      setGreeting(newGreeting);
      setTimeOfDay(newTimeOfDay);
      setGreetingIcon(newIcon);
      setGreetingColor(newColor);
      setGreetingAnimation(true);

      setTimeout(() => setGreetingAnimation(false), 1000);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [testHour]); // Add testHour as dependency

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: "Company Profile", path: "/admin-dashboard" },
        { id: 2, title: "Awards", path: "/awards-section" },
        { id: 3, title: "Blogs", path: "/blogs-section" },
        { id: 4, title: `Product: ${query}`, path: "/products" },
      ].filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      if (searchResults.length > 0) {
        navigate(searchResults[0].path);
      }
      setSearchQuery("");
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setIsSearchOpen(false);
    setSearchResults([]);
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    setNotificationCount(0);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

//   const user = {
//     name: "Admin",
//     email: "admin@example.com",
//     role: "Administrator",
//     lastLogin: "Today at 10:30 AM",
//   };

  const handleSignOut = () => {
      logout();
      toast.success("Logout successful!");

    navigate("/login"); // or wherever your login page is
    setShowBox(false);
  };

  // Handler for testing different hours
  const handleTestHourChange = (e) => {
    const hour = parseInt(e.target.value);
    setTestHour(hour === -1 ? null : hour); // Set to null for real-time
  };

  return (
    <motion.div className=" w-full z-[1000] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <motion.header
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/60 p-4 flex items-center justify-between sticky top-0 z-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <motion.div
            className="h-12 w-auto"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={Logo}
              alt="Allied Medical Logo"
              className="h-full w-auto object-contain cursor-pointer"
              onClick={()=>navigate("/admin-dashboard")}
            />
          </motion.div>

          {/* Enhanced Greeting Section with Testing Dropdown */}
          <div className="flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={timeOfDay}
                className={`flex items-center space-x-3 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm ${greetingAnimation
                    ? `bg-gradient-to-r ${greetingColor}`
                    : "bg-white/90"
                  }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                aria-label={`Greeting for ${timeOfDay}`}
              >
                <motion.div
                  className={`p-2 rounded-full ${greetingAnimation ? "bg-white/20" : "bg-slate-100"
                    }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {greetingIcon}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.p
                    className="text-sm font-medium"
                    animate={{
                      color: greetingAnimation ? "#ffffff" : "#334155",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {greeting}, Admin!
                  </motion.p>
                  <motion.p
                    className="text-xs capitalize"
                    animate={{
                      color: greetingAnimation ? "#e2e8f0" : "#64748b",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Happy {timeOfDay}
                  </motion.p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Testing Dropdown */}
            {/* <motion.select
              onChange={handleTestHourChange}
              className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              aria-label="Select time for testing greetings"
            >
              <option value={-1}>Real Time</option>
              <option value={3}>3 AM (Working Late?)</option>
              <option value={8}>8 AM (Good Morning)</option>
              <option value={14}>2 PM (Good Afternoon)</option>
              <option value={18}>6 PM (Good Evening)</option>
              <option value={22}>4 PM (Good Night)</option>
            </motion.select> */}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2.5 rounded-1xl hover:bg-slate-100/60 transition-all duration-300 border border-slate-200/60 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </motion.button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.button
                    key="search-button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-slate-100/80 transition-all duration-300 border border-slate-200/60 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Open search"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Search className="w-5 h-5 text-blue-600" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-form"
                    className="relative"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.form
                      onSubmit={handleSearchSubmit}
                      className="relative"
                      onKeyDown={handleKeyDown}
                    >
                      <motion.input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search dashboard..."
                        className="pl-10 pr-14 py-2.5 w-full max-w-[18rem] sm:max-w-[24rem] text-sm border border-slate-300/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                        aria-label="Search dashboard"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                      {isLoading && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                      )}
                      {!isLoading && (
                        <motion.button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setIsSearchOpen(false);
                            setSearchResults([]);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-blue-100/80 transition-colors"
                          aria-label="Close search"
                        >
                          <X className="w-4 h-4 text-blue-500" />
                        </motion.button>
                      )}
                    </motion.form>

                    <AnimatePresence>
                      {searchQuery.trim() && searchResults.length > 0 && (
                        <motion.div
                          className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-xl overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ul className="py-2">
                            {searchResults.map((result) => (
                              <motion.li
                                key={result.id}
                                className="px-4 py-2 hover:bg-blue-50/60 cursor-pointer transition-colors duration-200 text-sm text-blue-700"
                                onClick={() => handleResultClick(result.path)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {result.title}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      {searchQuery.trim() &&
                        searchResults.length === 0 &&
                        !isLoading && (
                          <motion.div
                            className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-xl overflow-hidden z-50 p-4 text-sm text-slate-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            No results found for "{searchQuery}"
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className="p-2.5 rounded-full hover:bg-slate-100/60 transition-all duration-300 relative border border-slate-200/60 shadow-sm hover:shadow-md"
                aria-label="Notifications"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon />
                <AnimatePresence>
                  {notificationCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                className="bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300/60 text-slate-7
                00 text-sm font-medium px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-default flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>{today}</span>
              </motion.div>
            </motion.div>

            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl border border-blue-500/20"
                onClick={() => setShowBox(!showBox)}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>

              <AnimatePresence>
                {showBox && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                      onClick={() => setShowBox(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute right-0 mt-3 bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden w-96 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200/60">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <User className="w-5 h-5 text-white" />
                          </motion.div>
                          <div>
                            <p className="font-bold text-blue-800 text-base">
                              {user.name}
                            </p>
                            <p className="text-sm text-blue-600">{user.role}</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-5 space-y-4">
                        <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-10 h-10 bg-blue-100/60 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">
                              Name
                            </p>
                            <p className="text-sm font-semibold text-blue-800">
                              {user?.username}
                            </p>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-10 h-10 bg-blue-100/60 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">
                              Email
                            </p>
                            <p className="text-sm font-medium text-blue-700">
                              {user.email}
                            </p>
                          </div>
                        </motion.div>
                        {/* <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-10 h-10 bg-blue-100/60 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">
                              Last Login
                            </p>
                            <p className="text-sm font-medium text-blue-700">
                              {user.lastLogin}
                            </p>
                          </div>
                        </motion.div> */}
                         <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-10 h-10 bg-blue-100/60 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">
                              Role
                            </p>
                            <p className="text-sm font-medium text-blue-700">
                              {user.role}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="border-t border-blue-200/60"></div>

                      <div className="p-4">
                        <motion.button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50/60 rounded-xl transition-colors duration-200 group border border-red-200/40"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="w-10 h-10 bg-red-100/60 group-hover:bg-red-200/60 rounded-full flex items-center justify-center transition-colors duration-200"
                            whileHover={{ rotate: 15 }}
                          >
                            <LogOut className="w-5 h-5 text-red-600" />
                          </motion.div>
                          <span className="text-sm font-medium text-red-600 group-hover:text-red-700">
                            Sign Out
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>


    </motion.div>
  );
};

export default TopNavbar;
