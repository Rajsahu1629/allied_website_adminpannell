import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AlliedLogo from "../assets/allied-logo.png";
import useAuthStore from "../store/useAuthStore";
import { sendPostRequest } from "../api/apiRequest";
import GlobalLoading from "../component/globalComponent/GlobalLoading";
import { motion } from "framer-motion";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username or email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        identifier: data.username,
        password: data.password,
      };
      const response = await sendPostRequest(
        `/api/auth/login`,
        payload
      );
 
      const { token, user } = response;

      login({ token, user });
      toast.success("Login successful!");
     
    } catch (error) {
           console.log(import.meta.env.VITE_API_BASE_URL,"import.meta.env.VITE_API_BASE_URL")
      console.log(error,"sfads")
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10 animate-pulse"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 sm:max-w-lg lg:max-w-xl p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl border border-blue-200 dark:border-gray-700"
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <img
              src={AlliedLogo}
              alt="Allied Logo"
              className="w-28 h-28 object-contain transition-transform hover:scale-110"
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs leading-relaxed">
              Sign in to access your admin dashboard and manage your platform.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username or Email
              </label>
              <motion.input
                {...register("username")}
                placeholder="Enter username or email"
                className="w-full px-4 py-3 text-sm bg-blue-50 dark:bg-gray-700 border border-blue-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.username && (
                <p className="text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <motion.input
                  {...register("password")}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 text-sm bg-blue-50 dark:bg-gray-700 border border-blue-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 pr-12"
                  whileFocus={{ scale: 1.02 }}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <GlobalLoading color="white" /> : "Sign In"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;