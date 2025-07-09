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
  Bell,
  Settings,
  Shield,
  Globe,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import Logo from "../../assets/allied-logo-1.png";
import { BellIcon } from "../../assets/svg/Svg";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

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
  const [testHour, setTestHour] = useState(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isWelcomeMessageVisible, setIsWelcomeMessageVisible] = useState(true);
  const { logout, user } = useAuthStore();

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const updateGreeting = () => {
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
            <Moon className="w-5 h-5 text-indigo-400" />
          </motion.div>
        );
        newColor = "from-indigo-500 to-purple-600";
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
            <Sun className="w-5 h-5 text-yellow-500" />
          </motion.div>
        );
        newColor = "from-yellow-400 to-orange-500";
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
            <Sun className="w-5 h-5 text-orange-500" />
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
            <Sunset className="w-5 h-5 text-purple-500" />
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
            <Moon className="w-5 h-5 text-indigo-400" />
          </motion.div>
        );
        newColor = "from-indigo-500 to-purple-600";
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
  }, [testHour]);

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
        { id: 1, title: "Company Profile", path: "/company-profile" },
        { id: 2, title: "Awards", path: "/awards-section" },
        { id: 3, title: "Blogs", path: "/blogs-section" },
        { id: 4, title: `Product: ${query}`, path: "/products" },
        { id: 5, title: "Publications", path: "/publications" },
        { id: 6, title: "Leadership", path: "/leadership" },
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
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0].path);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    toast.success("All notifications cleared!");
  };

  const handleSignOut = () => {
    logout();
    toast.success("Logout successful!");
    navigate("/");
    setShowBox(false);
  };

  const handleTestHourChange = (e) => {
    const hour = parseInt(e.target.value);
    setTestHour(hour === -1 ? null : hour);
  };

  return (
    <motion.div 
      className="w-full z-[1000]"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 50%, rgba(224,242,254,0.95) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <motion.header
        className="glass-strong shadow-allied border-b border-primary-200/60 p-4 flex items-center justify-between sticky top-0 z-30"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <motion.div
            className="h-12 w-auto"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={Logo}
              alt="Allied Medical Logo"
              className="h-full w-auto object-contain cursor-pointer filter drop-shadow-md"
              onClick={() => navigate("/company-profile")}
            />
          </motion.div>

          {/* Enhanced Greeting Section */}
          <div className="flex items-center space-x-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={timeOfDay}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-full shadow-soft transition-all duration-500 ${
                  greetingAnimation
                    ? `bg-gradient-to-r ${greetingColor} text-white`
                    : "bg-white/90 text-secondary-700 border border-primary-200/60"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                aria-label={`Greeting for ${timeOfDay}`}
              >
                <motion.div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    greetingAnimation ? "bg-white/20" : "bg-primary-100/60"
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
                    className="text-sm font-semibold"
                    animate={{
                      color: greetingAnimation ? "#ffffff" : "#334155",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {greeting}, {user?.name?.split(' ')[0] || "Admin"}!
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
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-primary-100/60 transition-all duration-300 border border-primary-200/60 shadow-soft"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-primary-600" />
          </motion.button>

          <div className="flex items-center space-x-3">
            {/* Enhanced Search */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.button
                    key="search-button"
                    onClick={() => setIsSearchOpen(true)}
                    className="btn-ghost hover:bg-primary-100 p-2.5 rounded-xl shadow-soft border border-primary-200/60"
                    aria-label="Open search"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Search className="w-5 h-5 text-primary-600" />
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
                        className="input-modern pl-10 pr-14 py-3 w-full max-w-[18rem] sm:max-w-[24rem] text-sm rounded-xl shadow-soft"
                        aria-label="Search dashboard"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-500" />
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
                          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
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
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-primary-100/60 transition-colors"
                          aria-label="Close search"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4 text-primary-600" />
                        </motion.button>
                      )}
                    </motion.form>

                    <AnimatePresence>
                      {searchQuery.trim() && searchResults.length > 0 && (
                        <motion.div
                          className="absolute top-full mt-2 w-full glass-strong shadow-strong rounded-xl overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ul className="py-2">
                            {searchResults.map((result) => (
                              <motion.li
                                key={result.id}
                                className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors duration-200 text-sm text-secondary-700 hover:text-primary-700 flex items-center space-x-3"
                                onClick={() => handleResultClick(result.path)}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Search className="w-4 h-4 text-primary-500" />
                                <span>{result.title}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      {searchQuery.trim() &&
                        searchResults.length === 0 &&
                        !isLoading && (
                          <motion.div
                            className="absolute top-full mt-2 w-full glass-strong shadow-strong rounded-xl overflow-hidden z-50 p-4 text-sm text-secondary-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center space-x-2">
                              <Search className="w-4 h-4 text-secondary-400" />
                              <span>No results found for "{searchQuery}"</span>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Notifications */}
            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className="p-2.5 rounded-xl hover:bg-primary-100/60 transition-all duration-300 relative shadow-soft border border-primary-200/60"
                aria-label="Notifications"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-primary-600" />
                <AnimatePresence>
                  {notificationCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-error-500 to-error-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-soft"
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

            {/* Enhanced Date Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex items-center space-x-2"
            >
              <motion.div
                className="card px-4 py-2.5 flex items-center space-x-2 shadow-soft border border-primary-200/60"
                whileHover={{ scale: 1.02 }}
              >
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-secondary-700">{today}</span>
              </motion.div>
            </motion.div>

            {/* Enhanced User Profile */}
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-soft hover:shadow-medium border border-primary-400/20"
                onClick={() => setShowBox(!showBox)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>

              <AnimatePresence>
                {showBox && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-40 modal-backdrop"
                      onClick={() => setShowBox(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute right-0 mt-3 glass-strong shadow-strong rounded-2xl overflow-hidden w-96 z-50 border border-primary-200/60"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="gradient-primary px-6 py-5 text-white">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-soft"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <User className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="font-bold text-lg">
                              {user?.name || "Admin User"}
                            </p>
                            <p className="text-sm text-white/80">Administrator</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-5 space-y-4">
                        <motion.div
                          className="card-hover p-4 bg-primary-50/50 border border-primary-200/40 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-primary-600 uppercase tracking-wide font-medium">
                                Username
                              </p>
                              <p className="text-sm font-semibold text-secondary-800">
                                {user?.username || "admin"}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          className="card-hover p-4 bg-primary-50/50 border border-primary-200/40 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                              <Mail className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-primary-600 uppercase tracking-wide font-medium">
                                Email
                              </p>
                              <p className="text-sm font-medium text-secondary-700">
                                {user?.email || "admin@allied.com"}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          className="card-hover p-4 bg-primary-50/50 border border-primary-200/40 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                              <Shield className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-primary-600 uppercase tracking-wide font-medium">
                                Role
                              </p>
                              <p className="text-sm font-medium text-secondary-700">
                                Administrator
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="border-t border-primary-200/60"></div>

                      <div className="p-4">
                        <motion.button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-error-50 rounded-xl transition-colors duration-200 group border border-error-200/40"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="w-10 h-10 bg-error-100 group-hover:bg-error-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                            whileHover={{ rotate: 15 }}
                          >
                            <LogOut className="w-5 h-5 text-error-600" />
                          </motion.div>
                          <span className="text-sm font-medium text-error-600 group-hover:text-error-700">
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
