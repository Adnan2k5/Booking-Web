import React from 'react'
import { motion } from 'framer-motion'

export const Loader = ({ btn }) => {
  return (
    <div className={`w-full ${btn ? `` : `h-[100vh]`} flex justify-center items-center bg-white`}>
      <div className="flex space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-12 bg-black rounded-full"
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        {/* Minimalist container */}
        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-black rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>

        <motion.p
          className="mt-8 text-sm font-medium tracking-[0.3em] text-gray-500 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading
        </motion.p>
      </div>
    </div>
  )
}
