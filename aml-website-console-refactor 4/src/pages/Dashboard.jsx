import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Award,
  BookMarked,
  TrendingUp,
  Package,
  Calendar,
  Activity,
  Plus,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Heart,
  MessageSquare,
  FileText,
  Clock,
  ChevronRight,
  Bell,
  Target,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 156,
    totalCategories: 12,
    totalBlogs: 45,
    totalAwards: 8,
    totalPublications: 23,
    totalEvents: 6,
    monthlyViews: 12400,
    activeUsers: 2300,
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'blog', title: 'New blog post published', time: '2 hours ago', icon: BookMarked },
    { id: 2, type: 'product', title: 'Product "Medical Device X" updated', time: '4 hours ago', icon: Package },
    { id: 3, type: 'award', title: 'New award added', time: '1 day ago', icon: Award },
    { id: 4, type: 'event', title: 'Upcoming event scheduled', time: '2 days ago', icon: Calendar },
  ]);

  const [chartData, setChartData] = useState([
    { month: 'Jan', views: 4000, users: 800 },
    { month: 'Feb', views: 3000, users: 600 },
    { month: 'Mar', views: 5000, users: 1000 },
    { month: 'Apr', views: 7000, users: 1200 },
    { month: 'May', views: 6000, users: 1100 },
    { month: 'Jun', views: 8000, users: 1500 },
  ]);

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      path: '/products',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      change: '+3.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      path: '/products',
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogs,
      change: '+8.7%',
      trend: 'up',
      icon: BookMarked,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      path: '/blogs-section',
    },
    {
      title: 'Awards',
      value: stats.totalAwards,
      change: '+2.1%',
      trend: 'up',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      path: '/awards-section',
    },
    {
      title: 'Publications',
      value: stats.totalPublications,
      change: '+5.4%',
      trend: 'up',
      icon: FileText,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      path: '/publications',
    },
    {
      title: 'Events',
      value: stats.totalEvents,
      change: '+1.8%',
      trend: 'up',
      icon: Calendar,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      path: '/upcommingevents',
    },
    {
      title: 'Monthly Views',
      value: stats.monthlyViews.toLocaleString(),
      change: '+18.2%',
      trend: 'up',
      icon: Eye,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      path: '/analytics',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+7.3%',
      trend: 'up',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      path: '/users',
    },
  ];

  const quickActions = [
    { title: 'Add New Product', icon: Plus, path: '/products', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { title: 'Create Blog Post', icon: BookMarked, path: '/blogs-section', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { title: 'Add Award', icon: Award, path: '/awards-section', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
    { title: 'Schedule Event', icon: Calendar, path: '/upcommingevents', color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { title: 'Add Publication', icon: FileText, path: '/publications', color: 'bg-gradient-to-r from-red-500 to-red-600' },
    { title: 'Update Profile', icon: Edit, path: '/company-profile', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-allied mb-2">
                Allied Medical Dashboard
              </h1>
              <p className="text-secondary-600 text-lg">
                Welcome back! Here's what's happening with your medical platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary-200">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-secondary-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all duration-300 hover:scale-105">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Notifications</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              onClick={() => handleCardClick(card.path)}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="card-elevated hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-800 mb-2">
                      {card.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {card.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-success-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-error-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        card.trend === 'up' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${card.bgColor} p-4 rounded-xl`}>
                    <card.icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary-800">Quick Actions</h3>
                <Zap className="w-5 h-5 text-primary-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    onClick={() => handleCardClick(action.path)}
                    className={`${action.color} text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-5 h-5" />
                      <span className="font-medium">{action.title}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary-800">Recent Activity</h3>
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 hover:bg-primary-50 transition-colors duration-200"
                  >
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <activity.icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-secondary-600">{activity.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-secondary-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* System Health */}
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-800">System Health</h3>
              <Shield className="w-5 h-5 text-success-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-600">Server Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-medium text-success-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-600">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-medium text-success-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-600">API Response</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-medium text-success-600">Normal</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-600">Storage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-sm font-medium text-warning-600">75% Used</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goals & Metrics */}
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-800">Monthly Goals</h3>
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-600">New Products</span>
                  <span className="text-sm font-medium text-secondary-800">8/10</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-600">Blog Posts</span>
                  <span className="text-sm font-medium text-secondary-800">12/15</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-success-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-600">User Engagement</span>
                  <span className="text-sm font-medium text-secondary-800">85%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
