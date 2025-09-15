import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const categories = [
  {
    title: "Emplois",
    count: "2,500+",
    icon: Briefcase,
    description: "Des milliers d'offres d'emploi dans tous les secteurs",
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Stages",
    count: "800+",
    icon: GraduationCap,
    description: "Stages et formations pour développer vos compétences",
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Bourses & Formations",
    count: "150+",
    icon: Award,
    description: "Bourses d'études et opportunités académiques",
    color: "from-blue-300 to-blue-500",
  },
  {
    title: "Missions & Freelance",
    count: "1,200+",
    icon: Users,
    description: "Opportunités de missions et travail indépendant",
    color: "from-blue-400 to-blue-700",
  },
];

const JobCategories = () => {
  return (
    <div className="min-h-screen relative mt-20">
   

      {/* Categories Section */}
      <section>
        <div className="px-4 sm:px-6 lg:px-8 mt-30 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Explorez nos  <span className="text-white bg-blue-700 p-2 rounded-2xl">catégories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez des milliers d'opportunités dans tous les secteurs d'activité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group pt-5 h-full rounded-2xl border border-white/40 bg-white/80 backdrop-blur-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-2xl font-bold text-blue-700"
                    >
                      {category.count}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobCategories;
