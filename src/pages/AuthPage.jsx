import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Signup from '../components/Signup';
import Login from '../components/Login';
import Navbar from "../components/Navbar";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center p-4 pt-28 md:pt-16 lg:pt-4"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(25, 25, 45, 1) 0%, rgba(10, 10, 25, 1) 90%)",
        }}
      >
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl px-4"
        >
          {isLogin ? (
            <Login onToggleAuth={toggleAuthMode} />
          ) : (
            <Signup onToggleAuth={toggleAuthMode} />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;