import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu4Fill, RiCloseLargeFill } from "react-icons/ri";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Smooth scroll function
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const mobileMenuVariants = {
    open: {
      x: 0,
      transition: {
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.3,
        when: "afterChildren",
      },
    },
  };

  const mobileLinkVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        x: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        x: { stiffness: 1000 },
      },
    },
  };

  const mobileLinkHover = {
    scale: 1.05,
    x: 10,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  const mobileLinkTap = {
    scale: 0.95,
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed top-4 sm:top-6 md:top-7 inset-x-0 z-50 "
    >
      {/* Main Navbar */}
      <motion.div
        variants={itemVariants}
        className="mx-auto w-[95%] sm:w-[92%] flex items-center justify-between bg-white/10 backdrop-blur-[12px] border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.37)] rounded-full px-4 sm:px-6 py-3 sm:py-4 "
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Link to="/" className="z-50">
            <motion.h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-[#F4E7E1] font-thin font-ZenDots">
              C
              <span className="mx-0.5 sm:mx-1 font-thin text-[#626F47]">o</span>
              deVance
            </motion.h1>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-12 list-none capitalize text-sm sm:text-base lg:text-lg xl:text-xl tracking-wider text-white"
        >
          {navLinks.map((link, index) => (
            <motion.li
              key={link.id || link.path || index} // unique key
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.id ? (
                <button
                  onClick={() => handleScroll(link.id)}
                  className="hover:text-[#B4EBE6] transition text-sm sm:text-base lg:text-lg xl:text-xl font-semibold relative"
                >
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-px bg-[#B4EBE6]"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  {link.label}
                </button>
              ) : (
                <Link
                  to={link.path}
                  className="hover:text-[#B4EBE6] transition text-sm sm:text-base lg:text-lg xl:text-xl font-semibold relative"
                >
                  {link.label}
                </Link>
              )}
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Menu Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? (
            <RiCloseLargeFill size={24} className="sm:size-28" />
          ) : (
            <RiMenu4Fill size={24} className="sm:size-28" />
          )}
        </motion.button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 md:hidden bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          >
            {/* Glass Effect Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 top-0 h-full w-3/5 sm:w-3/4 max-w-sm bg-white/20 backdrop-blur-[12px] border-l border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-6 sm:p-8 pt-20 sm:pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-6 right-6 text-white z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RiCloseLargeFill size={24} className="sm:size-28" />
              </motion.button>

              {/* Menu Links */}
              <motion.ul
                variants={containerVariants}
                className="flex flex-col gap-6 sm:gap-8 list-none capitalize text-white mt-10"
              >
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.id || link.path || index} // unique key
                    variants={mobileLinkVariants}
                    whileHover={mobileLinkHover}
                    whileTap={mobileLinkTap}
                    className="border-b border-white/10 last:border-0 pb-2 sm:pb-3"
                  >
                    {link.id ? (
                      <button
                        onClick={() => {
                          handleScroll(link.id);
                          setIsOpen(false);
                        }}
                        className="text-lg sm:text-xl md:text-2xl hover:text-[#B4EBE6] transition font-semibold block py-2"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="text-lg sm:text-xl md:text-2xl hover:text-[#B4EBE6] transition font-semibold block py-2"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Nav links data
const navLinks = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { path: "/docs", label: "Docs" },
  { path: "/get-started", label: "Get Started" },
];

export default Navbar;
