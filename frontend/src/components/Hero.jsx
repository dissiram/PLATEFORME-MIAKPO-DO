import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (

 <section className="relative overflow-hidden py-20 lg:py-32 ">
           <div className="absolute inset-0 overflow-hidden bgimg">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full opacity-20 blur-3xl" />
      </div>
       
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-10 text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            >
              Connectez vos{' '}
              <span className="bg-blue-900 bg-clip-text text-transparent">
                talents
              </span>
              <br />
              aux{' '}
              <span className="bg-blue-900 bg-clip-text text-transparent">
                opportunités .
              </span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-20"
            >
              <Link to="/register">
                <Button className="bg-blue-800 hover:bg-blue-900 text-lg px-8 py-6">
                  Commencer maintenant
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className=" bg-blue-900/50 text-blue-700 text-lg px-8 py-6">
                  Explorer les offres
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
  );
}