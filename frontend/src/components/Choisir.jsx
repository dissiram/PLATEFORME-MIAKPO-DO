import { motion } from 'framer-motion';

export default function Choisir() {
  return (
    <section className='pb-10 bg-blue-200/50 mx-20 rounded-2xl '>
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

          {/* Images responsives et plus grandes */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
            <img
              src="./why1.png"
              alt="illustration 1"
              className="w-80 md:w-96 lg:w-[28rem] object-contain"
            />
            <img
              src="./why2.png"
              alt="illustration 2"
              className="w-80 md:w-96 lg:w-[28rem] object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
