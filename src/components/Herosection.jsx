import { motion } from "framer-motion";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // Abstract shape components with movement
  const MovingShape = ({ 
    size, 
    left, 
    top, 
    color, 
    blur, 
    delay, 
    rotate, 
    borderRadius,
    path
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0.8, 0],
        scale: [0, 1, 1, 0],
        x: path.map(p => p.x),
        y: path.map(p => p.y),
        rotate: rotate
      }}
      transition={{ 
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay
      }}
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        background: color,
        filter: `blur(${blur}px)`,
        borderRadius: borderRadius,
      }}
    />
  );

  // Path generators for different movement patterns
  const circularPath = (radius = 50) => {
    const points = [];
    for (let i = 0; i <= 360; i += 30) {
      const angle = (i * Math.PI) / 180;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    return points;
  };

  const wavePath = (amplitude = 40) => {
    const points = [];
    for (let i = 0; i <= 360; i += 30) {
      points.push({
        x: i / 3.6, // Convert degrees to percentage
        y: amplitude * Math.sin((i * Math.PI) / 180)
      });
    }
    return points;
  };

  const randomPath = () => {
    return [
      { x: 0, y: 0 },
      { x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 },
      { x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 },
      { x: 0, y: 0 }
    ];
  };

  // Shape definitions
  const shapes = [
    // Circular moving shapes
    {
      type: "circle",
      size: 120,
      left: 10,
      top: 20,
      color: "rgba(98, 111, 71, 0.3)",
      blur: 40,
      delay: 0.2,
      rotate: [0, 360],
      borderRadius: "50%",
      path: circularPath(30)
    },
    {
      type: "blob",
      size: 180,
      left: 70,
      top: 10,
      color: "rgba(180, 235, 230, 0.2)",
      blur: 35,
      delay: 0.5,
      rotate: [-20, 340],
      borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
      path: wavePath(30)
    },
    {
      type: "triangle",
      size: 100,
      left: 85,
      top: 65,
      color: "rgba(244, 231, 225, 0.15)",
      blur: 30,
      delay: 0.7,
      rotate: [15, 375],
      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      path: circularPath(40)
    },
    // Additional shapes
    {
      type: "square",
      size: 80,
      left: 30,
      top: 70,
      color: "rgba(180, 235, 230, 0.15)",
      blur: 25,
      delay: 0.3,
      rotate: [45, 405],
      borderRadius: "10%",
      path: randomPath()
    },
    {
      type: "abstract",
      size: 150,
      left: 50,
      top: 50,
      color: "rgba(244, 231, 225, 0.1)",
      blur: 50,
      delay: 0.6,
      rotate: [0, 360],
      borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
      path: wavePath(20)
    }
  ];

  return (
    <section
      className="relative min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        color: "white",
        backgroundImage: `
          linear-gradient(to right, #000000, #2f3743),
          repeating-linear-gradient(
            0deg,
            rgba(253, 172, 51, 0.171) 0px,
            rgba(185, 182, 177, 0.08) 1px,
            transparent 1px,
            transparent 90px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(236, 223, 204, 0.08) 0px,
            rgba(236, 223, 204, 0.08) 1px,
            transparent 1px,
            transparent 80px
          )`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Moving shapes */}
      {shapes.map((shape, index) => (
        <MovingShape
          key={index}
          size={shape.size}
          left={shape.left}
          top={shape.top}
          color={shape.color}
          blur={shape.blur}
          delay={shape.delay}
          rotate={shape.rotate}
          borderRadius={shape.borderRadius}
          path={shape.path}
        />
      ))}

      {/* Content container */}
      <div className="relative z-10 text-center w-full max-w-7xl mx-auto py-20 md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-3xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-5xl text-white mb-4 sm:mb-6 leading-[1.1] md:leading-[1.2] tracking-wide hover:text-transparent hover:[-webkit-text-stroke:2px_grey] hover:[text-stroke:2px_grey] transition-colors duration-300 hover:cursor-none font-ZenDots"
          style={{
            textWrap: "balance",
          }}
        >
          Efficient C<span className="mx-0.5 text-[#626F47]">o</span>llab
          <span className="mx-0.5 text-[#626F47]">o</span>rati
          <span className="mx-0.5 text-[#626F47]">o</span>n f
          <span className="mx-0.5 text-[#626F47]">o</span>r M
          <span className="mx-0.5 text-[#626F47]">o</span>dern{" "}
          <br className="hidden md:block" />
          Devel<span className="mx-0.5 text-[#626F47]">o</span>pers
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="text-base sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-2xl md:max-w-3xl mx-auto mt-4 sm:mt-8 font-poppins px-2 sm:px-0"
        >
          C<span className="mx-0.5 text-[#626F47] font-ZenDots">o</span>de •
          Think • Share • Speak • Debug — T
          <span className="mx-0.5 text-[#626F47] font-ZenDots">o</span>gether.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
        >
          <Link
            to="/get-started"
            className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-black hover:bg-cyan-900 hover:text-white rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 active:scale-95 w-full sm:w-auto max-w-xs sm:max-w-none text-center"
          >
            Get Started
          </Link>
          <Link
            to="/docs"
            className="px-6 sm:px-8 py-2.5 sm:py-3.5 text-white bg-white/10 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 active:scale-95 border border-white/20 flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Read More
            <MdOutlineArrowRightAlt className="text-lg" />
          </Link>
        </motion.div>
      </div>

      {/* Scrolling indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.4 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 sm:border-3 border-white/40 rounded-full flex justify-center">
          <motion.div
            animate={{
              y: [0, 6, 8],
              opacity: [1, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="w-1 h-2 sm:h-3 bg-white/100 mt-1 sm:mt-2 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;