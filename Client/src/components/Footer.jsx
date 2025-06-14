import React from 'react'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 py-6 px-4 ">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              Adventure Bookings
            </span>
          </div>          <div className="flex gap-6 text-gray-600">
            <Link
              to="/terms"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Terms
            </Link>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
  )
}
