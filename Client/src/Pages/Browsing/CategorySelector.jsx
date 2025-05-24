import { motion } from "framer-motion"

export function CategorySelector({ categories, activeCategory, setActiveCategory, categoriesRef, showScrollIndicator, ChevronRight }) {
  return (
    <div className="relative mb-8">
      <motion.div
        className="flex items-center overflow-x-auto pb-2 py-2 px-2 scrollbar-hide"
        ref={categoriesRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category._id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full mr-3 whitespace-nowrap transition-all ${activeCategory === category.id
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white"
              }`}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >

            <span className="font-medium">{category.name}</span>
          </motion.button>
        ))}
      </motion.div>
      {showScrollIndicator && (
        <motion.div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-12 h-full bg-gradient-to-l from-blue-50 to-transparent flex items-center justify-end pr-1">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              <ChevronRight size={16} className="text-blue-600" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
