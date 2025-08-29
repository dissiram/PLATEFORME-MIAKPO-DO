import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const JobCategories = () => {
  const categories = [
    {
      icon: Briefcase,
      title: 'Emplois',
      description: 'Des milliers d\'offres d\'emploi dans tous les secteurs',
      count: '2,500+',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: GraduationCap,
      title: 'Stages',
      description: 'Stages et formations pour développer vos compétences',
      count: '800+',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Award,
      title: 'Bourses & Formations',
      description: 'Bourses d\'études et opportunités académiques',
      count: '150+',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Users,
      title: 'Missions & Freelance',
      description: 'Opportunités de missions et travail indépendant',
      count: '1,200+',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen relative mt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute  w-96 h-96 bg-gradient-to-tr from-sky-200 to-sky-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute  -bottom-20 right-40 w-96 h-96 bg-gradient-to-tr from-blue-200 to-teal-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-300 to-blue-700/40 rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Categories Section */}
      <section>
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Explorez nos catégories
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
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {category.description}
                    </p>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
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
