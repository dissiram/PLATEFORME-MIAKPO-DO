import { motion } from "framer-motion";

export default function Choisir() {
  // Animation d'apparition pour chaque image
  const imageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 50 },
    }),
  };

  const steps = [
    { src: "./Ellipse1.svg", text: "Créer votre compte" },
    { src: "./Ellipse2.svg", text: "Faire votre portfolio" },
    { src: "./Ellipse3.svg", text: "Explorez et postulez" },
    { src: "./Ellipse5.svg", text: "Décrocher votre opportunité" },
  ];

  return (
    <div className="min-h-screen relative mt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute w-96 h-96 bg-gradient-to-tr from-sky-200 to-sky-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 right-40 w-96 h-96 bg-gradient-to-tr from-blue-200 to-teal-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-300 to-blue-900/40 rounded-full opacity-20 blur-3xl" />
      </div>

      <section className="pb-10 mx-20 rounded-2xl ">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 "
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 py-15">
              Comment marche <span className="text-blue-700">MIAKPO DO</span> ?
            </h2>

            {/* Images responsives avec animation */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={imageVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center cursor-pointer"
                >
                  <img
                    src={step.src}
                    alt={`illustration ${index + 1}`}
                    className="w-80 md:w-96 lg:w-[28rem] object-contain"
                  />
                  <p className="font-bold mt-2">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
