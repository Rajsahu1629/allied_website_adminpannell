import {
  Award,
  BarChart3,
  BookMarked,
  Package,
  TrendingUp,
  Users,
  ChevronRight,
  Building2,
  MessageCircle,
  Calendar,
  FileText,
  Globe,
  Star,
  UserCheck,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";

const Sidebar = ({
  isOpen,
  onClose,
  activeItem,
  setActiveItem,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState({
    categories: false,
    products: false,
  });

  const categoryId = location.pathname
    .split("/products/category/")[1]
    ?.split("/")[0];
  const productId = location.pathname.split("/product/")[1];

  const sidebarItems = [
    { 
      icon: Building2, 
      label: "Company Profile", 
      path: "/company-profile",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    { 
      icon: MessageCircle, 
      label: "Chairman's Message", 
      path: "/chairman-message",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    { 
      icon: UserCheck, 
      label: "Leadership", 
      path: "/leadership",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    { 
      icon: Award, 
      label: "Awards", 
      path: "/awards-section",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      hoverColor: "hover:bg-yellow-100"
    },
    { 
      icon: BookMarked, 
      label: "Blogs", 
      path: "/blogs-section",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100"
    },
    {
      icon: TrendingUp,
      label: "Company Milestones",
      path: "/company-milestones-section",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100"
    },
    {
      icon: Package,
      label: "Categories",
      path: "/products",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      submenu: categoryId
        ? [
            {
              label: "Products",
              path: `/products/category/${categoryId}`,
              submenu: productId
                ? [
                    {
                      label: "Product Details",
                      path: `/products/category/${categoryId}/product/${productId}`,
                    },
                  ]
                : [],
            },
          ]
        : [],
    },
    { 
      icon: FileText, 
      label: "Publications", 
      path: "/publications",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100"
    },
    { 
      icon: Calendar, 
      label: "Upcoming Events", 
      path: "/upcommingevents",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100"
    },
    { 
      icon: Star, 
      label: "Trust Circle", 
      path: "/trustcircle",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      hoverColor: "hover:bg-cyan-100"
    },
    { 
      icon: Mail, 
      label: "Common Contact", 
      path: "/commoncontact",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:bg-emerald-100"
    },
    { 
      icon: Users, 
      label: "Former Participant", 
      path: "/formerparticipant",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      hoverColor: "hover:bg-violet-100"
    },
  ];

  useEffect(() => {
    if (categoryId) {
      setExpandedItems((prev) => ({
        ...prev,
        categories: true,
        products: true,
      }));
    }
  }, [categoryId]);

  const handleNavigation = (item) => {
    setActiveItem(item.label);
    navigate(item.path);
    onClose();
  };

  const toggleSubmenu = (itemLabel) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  const renderSubmenu = (items, level = 0) =>
    items.map((item, index) => {
      const isActive = location.pathname === item.path;
      const hasSubmenu = item.submenu?.length > 0;
      const isExpanded =
        expandedItems[item.label.toLowerCase().replace(/\s+/g, "")];

      return (
        <motion.div
          key={index}
          className={`${level > 0 ? "ml-8" : "ml-6"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <motion.div
            onClick={() =>
              hasSubmenu && !isCollapsed
                ? toggleSubmenu(item.label.toLowerCase().replace(/\s+/g, ""))
                : handleNavigation(item)
            }
            className={`group flex items-center ${
              isCollapsed ? "justify-center px-6" : "space-x-3 px-4"
            } py-3 rounded-xl cursor-pointer transition-all duration-300 relative mb-1
            ${
              isActive
                ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 shadow-soft border-l-4 border-primary-500"
                : "text-secondary-600 hover:bg-primary-50 hover:text-primary-700 hover:shadow-soft hover:border-l-4 hover:border-primary-300"
            }`}
            title={isCollapsed ? item.label : ""}
            whileHover={{ x: 6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary-200/70 shadow-sm"
                  : "bg-primary-100/50 group-hover:bg-primary-200/60"
              }`}
              whileHover={{ rotate: 5 }}
            >
              <Package
                className={`${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                } transition-all duration-300 ${
                  isActive
                    ? "text-primary-700"
                    : "text-primary-600 group-hover:text-primary-700"
                }`}
              />
            </motion.div>
            {!isCollapsed && (
              <motion.span
                className="font-medium text-sm transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {item.label}
              </motion.span>
            )}
            {hasSubmenu && !isCollapsed && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3 ml-auto text-secondary-400" />
              </motion.div>
            )}
          </motion.div>
          <AnimatePresence>
            {hasSubmenu && isExpanded && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderSubmenu(item.submenu, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    });

  return (
    <motion.aside
      className="h-full z-50 glass-strong shadow-allied transition-all duration-500 ease-in-out"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 50%, rgba(224,242,254,0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(14, 165, 233, 0.2)",
      }}
      initial={false}
      animate={{
        width: isCollapsed ? 100 : 280,
        borderRadius: isCollapsed ? "0 24px 24px 0" : "0 32px 32px 0",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-full flex flex-col">
        <motion.div
          className="border-b border-primary-200/60 h-18 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-soft">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gradient-allied">
                      Allied Medical
                    </div>
                    <div className="text-xs text-secondary-500">
                      Admin Panel
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 rounded-xl bg-primary-100/50 hover:bg-primary-200/60 transition-all duration-300 items-center justify-center group border border-primary-200/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? (
                  <Menu className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                ) : (
                  <X className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasSubmenu = item.submenu?.length > 0;
              const isExpanded =
                expandedItems[item.label.toLowerCase().replace(/\s+/g, "")];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="nav-highlight"
                >
                  <motion.div
                    onClick={() =>
                      hasSubmenu && !isCollapsed
                        ? toggleSubmenu(
                            item.label.toLowerCase().replace(/\s+/g, "")
                          )
                        : handleNavigation(item)
                    }
                    className={`nav-item group cursor-pointer relative mb-1 ${
                      isActive
                        ? "active"
                        : `${item.hoverColor}`
                    }`}
                    title={isCollapsed ? item.label : ""}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary-200/70 shadow-soft"
                            : `${item.bgColor} group-hover:bg-primary-100/60`
                        }`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        <Icon
                          className={`${
                            isCollapsed ? "w-6 h-6" : "w-5 h-5"
                          } transition-all duration-300 ${
                            isActive
                              ? "text-primary-700"
                              : `${item.color} group-hover:text-primary-700`
                          }`}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            className="font-medium text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && hasSubmenu && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, rotate: isExpanded ? 90 : 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-secondary-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <AnimatePresence>
                    {hasSubmenu && isExpanded && !isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {renderSubmenu(item.submenu)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </nav>

        <motion.div
          className={`p-4 border-t border-primary-200/60 ${
            isCollapsed ? "px-6" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            } p-3 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200/60 hover-lift`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft"
              whileHover={{ rotate: 5 }}
            >
              <Users
                className={`${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                } text-white`}
              />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-sm text-secondary-700">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {user?.email || "admin@allied.com"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
