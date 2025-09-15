import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className=" mt-10"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Connectez vos Compétences{" "}
            <span className="relative">
              aux Opportunités
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-1 -right-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full w-40 shadow-lg"
              >
                100% Gratuit
              </motion.span>
            </span>
            .
          </h1>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mb-16 h-80 flex items-center justify-center"
        >

          {/* Background Cards */}
          <motion.div
            initial={{ rotateY: -30, rotateX: 10, x: -200 }}
            animate={{ rotateY: -20, rotateX: 5, x: -150 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute w-64 h-40 rounded-2xl shadow-2xl transform -rotate-12 overflow-hidden"
          >
            <img
              src="/hero5.jfif"
              alt="Card 1"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ rotateY: 30, rotateX: 10, x: 200 }}
            animate={{ rotateY: 20, rotateX: 5, x: 150 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute w-64 h-40 rounded-2xl shadow-2xl transform rotate-12 overflow-hidden"
          >
            <img
              src="/hero6.png"
              alt="Card 2"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Main Center Card */}
          <motion.div
            initial={{ y: 50, rotateX: 20 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="relative w-72 h-48 rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            <img
              src="/hero7.jfif"
              alt="Main Card"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Additional Cards */}
          <motion.div
            initial={{ rotateY: -45, x: -300, y: 30 }}
            animate={{ rotateY: -35, x: -250, y: 20 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="absolute w-56 h-36 rounded-2xl shadow-2xl transform -rotate-6 overflow-hidden"
          >
            <img
              src="/hero1.png"
              alt="Card 3"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ rotateY: 45, x: 300, y: 30 }}
            animate={{ rotateY: 35, x: 250, y: 20 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="absolute w-56 h-36 rounded-2xl shadow-2xl transform rotate-6 overflow-hidden"
          >
            <img
              src="/hero2.png"
              alt="Card 4"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 15 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="absolute w-32 h-20 rounded-xl shadow-lg transform rotate-45 -top-10 left-20 overflow-hidden"
          >
            <img
              src="/hero3.png"
              alt="Accent 1"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: -15 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="absolute w-32 h-20 rounded-xl shadow-lg transform -rotate-45 -bottom-10 right-20 overflow-hidden"
          >
            <img
              src="/hero4.png"
              alt="Accent 2"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Trouvez de belles opportunités ici, commencez en vous inscrivant.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-700 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:bg-blue-800 transition-colors duration-200"
          >
            <Link to="/register">Commencer</Link>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
