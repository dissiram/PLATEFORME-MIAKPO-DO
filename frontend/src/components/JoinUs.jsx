import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function JoinUs() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:gap-6">
        {/* Background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute w-96 h-96 bg-gradient-to-tr from-blue-200 to-blue-400 rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 right-40 w-96 h-96 bg-gradient-to-tr from-blue-300 to-blue-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400 to-blue-600/40 rounded-full opacity-20 blur-3xl" />
            </div>
        {/* Image à gauche */}
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="/join.png"
            alt="Rejoignez-nous"
            className="rounded-2xl shadow-lg w-full max-h-96 object-cover"
          />
        </motion.div>

        {/* Texte et bouton à droite */}
        <motion.div
          className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Rejoignez-nous dès 
            <span className="text-blue-700"> aujourd'hui !</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez des opportunités passionnantes et faites partie d'une communauté dynamique. 
            Que vous cherchiez un emploi, un stage ou des missions freelance, nous avons tout pour vous.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-start"
          >
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:bg-blue-800 transition-colors duration-200 inline-block text-center"
            >
              Faire partir de nos utilisateurs
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
