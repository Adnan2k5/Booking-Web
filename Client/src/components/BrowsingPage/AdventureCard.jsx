"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"
import { Dialog, DialogContent } from "../../components/ui/dialog"

export const AdventureCard = ({ adventure, formatDate, onBook }) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden">
          {adventure.thumbnail ? (
            <img
              src={adventure.thumbnail || "/placeholder.svg"}
              alt={adventure.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-medium">{adventure.name}</span>
            </div>
          )}

          {adventure.previewVideo && (
            <motion.button
              className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowPreview(true)
              }}
            >
              <Play size={20} className="text-blue-600" />
            </motion.button>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{adventure.name}</h3>

          <div className="flex items-center text-gray-500 text-sm mb-2">
            <span>{adventure.location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{adventure.description}</p>

          <div className="mt-auto">
            {adventure.session_date && (
              <div className="text-xs text-gray-500 mb-2">Available: {formatDate(adventure.session_date)}</div>
            )}

            <motion.button
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md font-medium"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => onBook(adventure._id)}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preview Video Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black rounded-lg">
          <div className="relative">
            <button
              className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1 rounded-full"
              onClick={() => setShowPreview(false)}
            >
              <X size={20} />
            </button>
            <video src={adventure.previewVideo} controls autoPlay className="w-full h-auto max-h-[80vh]" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AdventureCard
