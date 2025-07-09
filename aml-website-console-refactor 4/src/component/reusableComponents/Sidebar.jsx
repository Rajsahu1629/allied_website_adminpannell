import {
  Award,
  BarChart3,
  BookMarked,
  Package,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";

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
  const [expandedItems, setExpandedItems] = useState({
    categories: false,
    products: false,
  });

  const categoryId = location.pathname
    .split("/products/category/")[1]
    ?.split("/")[0];
  const productId = location.pathname.split("/product/")[1];

  const sidebarItems = [
    { icon: BarChart3, label: "Company Profile", path: "/company-profile" },
    { icon: BarChart3, label: "Chairman's Message", path: "/chairman-message" },
    { icon: BarChart3, label: "Leadership", path: "/leadership" },
    { icon: Award, label: "Awards", path: "/awards-section" },
    { icon: BookMarked, label: "Blogs", path: "/blogs-section" },
    {
      icon: TrendingUp,
      label: "Company Milestones",
      path: "/company-milestones-section",
    },
    {
      icon: Package,
      label: "Categories",
      path: "/products",
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
    { icon: Award, label: "Publications", path: "/publications" },
    { icon: Award, label: "Upcomming Event", path: "/upcommingevents" },
    { icon: Award, label: "Trust Circle", path: "/trustcircle" },
    { icon: Award, label: "Common Contact", path: "/commoncontact" },
    { icon: Award, label: "Former Participant", path: "/formerparticipant" },
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
          className={`${level > 0 ? "ml-6" : "ml-4"}`}
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
            } py-2 rounded-xl cursor-pointer transition-all duration-300 relative mb-1
            ${
              isActive
                ? "bg-gradient-to-r from-slate-100 to-slate-400 text-slate-700 shadow-sm border-l-4 border-slate-400"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm hover:border-l-4 hover:border-slate-300"
            }`}
            title={isCollapsed ? item.label : ""}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-slate-200/70 shadow-sm"
                  : "bg-slate-100/50 group-hover:bg-slate-200/60"
              }`}
              whileHover={{ rotate: 5 }}
            >
              <item.icon
                className={`${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                } transition-all duration-300 ${
                  isActive
                    ? "text-slate-700"
                    : "text-slate-600 group-hover:text-slate-700"
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
                <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
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
      className="h-full z-50 bg-white/95 backdrop-blur-sm border-r border-slate-200/60 shadow-xl transition-all duration-500 ease-in-out"
      style={{
        background: "linear-gradient(135deg, #f6faff 0%, #dbeafe 100%)",
      }}
      initial={false}
      animate={{
        width: isCollapsed ? 100 : 275,
        borderRadius: isCollapsed ? "0 24px 24px 0" : "0 32px 32px 0",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="h-full flex flex-col">
        <motion.div
          className="border-b border-slate-200/60 h-16 p-4"
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
                  className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent ml-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  Dashboard
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 rounded-xl hover:bg-slate-100 transition-all duration-300 items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <GiHamburgerMenu className="w-5 h-5 text-slate-600 group-hover:text-slate-700" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
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
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.div
                    onClick={() =>
                      hasSubmenu && !isCollapsed
                        ? toggleSubmenu(
                            item.label.toLowerCase().replace(/\s+/g, "")
                          )
                        : handleNavigation(item)
                    }
                    className={`group flex items-center ${
                      isCollapsed
                        ? "justify-center px-6 py-3"
                        : "justify-between px-4 py-2"
                    } rounded-xl cursor-pointer transition-all duration-300 relative mb-1
                      ${
                        isActive
                          ? "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 shadow-md border-l-4 border-slate-500"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm hover:border-l-4 hover:border-slate-300"
                      }`}
                    title={isCollapsed ? item.label : ""}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-slate-200/70 shadow-sm"
                            : "bg-slate-100/50 group-hover:bg-slate-200/60"
                        }`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon
                          className={`${
                            isCollapsed ? "w-6 h-6" : "w-5 h-5"
                          } transition-all duration-300 ${
                            isActive
                              ? "text-slate-700"
                              : "text-slate-600 group-hover:text-slate-700"
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
                          <ChevronRight className="w-4 h-4 text-slate-400" />
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
          className={`p-4 border-t border-slate-200/60 ${
            isCollapsed ? "px-6" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            } p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-sm"
              whileHover={{ rotate: 5 }}
            >
              <Users
                className={`${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                } text-slate-600`}
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
                  <p className="font-semibold text-sm text-slate-700">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500">admin@allied.com</p>
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
