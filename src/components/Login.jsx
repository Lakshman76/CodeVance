import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = ({ onToggleAuth }) => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!loginDetails.email || !loginDetails.password) {
      toast.error("All fields are required");
      return;
    }
    toast.promise(axiosInstance.post("/auth/login", loginDetails), {
      loading: "Logging in...",
      success: (data) => {
        navigate("/dashboard");
        return data.data;
      },
      error: (err) => err.response.data,
    });
  }
  return (
    <div className="relative bg-gray-900 bg-opacity-40 rounded-2xl shadow-2xl overflow-hidden p-8 backdrop-blur-lg border border-gray-700 border-opacity-50">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-600 opacity-20 mix-blend-overlay"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-600 opacity-15 mix-blend-overlay"></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 bg-opacity-20 flex items-center justify-center border border-indigo-500 border-opacity-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Login to your account</p>
      </motion.div>

      <form className="space-y-4">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            id="email"
            name="email"
            type="email"
            value={loginDetails.email}
            onChange={handleUserInput}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Email Address"
          />
        </motion.div>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            id="password"
            name="password"
            value={loginDetails.password}
            onChange={handleUserInput}
            type="password"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Password"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2"
        >
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            onClick={onFormSubmit}
          >
            Login
          </button>
        </motion.div>
      </form>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={onToggleAuth}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Sign up here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
