import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

// Logos fictifs pour les partenaires
const partnerLogos = [
  "/logo1.png",
"/logo3.png",
  "/logo2.png",
  "/logo6.png",
  "/logo5.png",
];

export default function Partners() {
  return (
    <section className="bg-gray-50 py-20 mt-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Nos <span className="text-blue-700 "> partenaires </span>
 
        </motion.h2>

        {/* Logos des partenaires */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {partnerLogos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={logo}
                alt={`Partenaire ${index + 1}`}
                className="h-16 md:h-20 object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Call to action pour nouveaux partenaires */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Devenez partenaire !
          </h3>
          <p className="text-gray-600 mb-6">
            Rejoignez notre réseau de partenaires et profitez d'une visibilité accrue auprès de talents qualifiés et de nouvelles opportunités.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300">
            Nous rejoindre
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
