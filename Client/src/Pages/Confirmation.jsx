"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CheckCircle, ArrowLeft, Calendar, MapPin } from "lucide-react"
import { Button } from "../components/ui/button"

export default function ConfirmationPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 p-4 sm:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Booking Confirmation</h1>
        </div>

        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-8 border border-white/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="mx-auto mb-6 text-green-500"
          >
            <CheckCircle size={80} className="mx-auto" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your adventure has been booked successfully. We've sent a confirmation email with all the details.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Booking Details</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Mountain Hiking Expedition</p>
                  <p className="text-sm text-gray-500">June 15, 2023 at 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Meeting Point</p>
                  <p className="text-sm text-gray-500">Alpine Mountains Visitor Center</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-0.5">
                  #
                </div>
                <div>
                  <p className="font-medium text-gray-800">Booking Reference</p>
                  <p className="text-sm text-gray-500">ADV-2023-06789</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              Back to Home
            </Button>
            <Button onClick={() => navigate("/my-bookings")} className="bg-blue-600 hover:bg-blue-700 text-white">
              View My Bookings
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm"
        >
          Need help? Contact our support team at support@adventures.com
        </motion.div>
      </div>
    </div>
  )
}

