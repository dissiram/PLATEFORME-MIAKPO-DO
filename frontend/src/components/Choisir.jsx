import { motion } from "framer-motion";

export default function Choisir() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 50 },
    }),
  };

  const candidatSteps = [
    "Créer votre compte",
    "Remplir vos informations",
    "rechercher des opportunités",
    "Postuler en un seul clic",
  ];

  const recruteurSteps = [
    "Créer votre compte",
    "Publier vos offres",
    "Consulter les candidatures",
    "Trouver le talent idéal",
  ];

  return (
    <div className="min-h-screen bg-blue-50 font-sans py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-20">
            Comment  <span className="text-white bg-blue-700 p-2 rounded-2xl">marche</span> MIAKPODO ?
          </h2>
        </motion.div>

        {/* 3 Columns responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start lg:items-center">
          {/* Colonne 1 - Candidat */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Candidat</h3>
            {candidatSteps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
                className="flex items-center gap-3 bg-white px-4 py-4 rounded-2xl shadow-md"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
                  {index + 1}
                </span>
                <p className="text-base md:text-lg font-medium text-gray-800">{step}</p>
              </motion.div>
            ))}
          </div>

          {/* Colonne 2 - Image centrée verticalement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <img
              src="./Group 36.svg"
              alt="Illustration"
              className="w-full max-w-sm md:max-w-md object-contain"
            />
          </motion.div>

          {/* Colonne 3 - Recruteur */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Recruteur</h3>
            {recruteurSteps.map((step, index) => (
              <motion.div
                 key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
                className="flex items-center gap-3 bg-white px-4 py-4 rounded-2xl shadow-md"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
                  {index + 1}
                </span>
                <p className="text-base md:text-lg font-medium text-gray-800">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
