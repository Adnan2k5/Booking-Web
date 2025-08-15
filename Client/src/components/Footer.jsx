import React from 'react'
import { MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export const Footer = () => {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/secret-nft-events')
  }

  return (
    <footer className="bg-gray-900 text-white mt-12 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left side - About Website */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">About Adventure Booking</h3>
            <p className="text-gray-300 leading-relaxed">
              Your gateway to extraordinary adventures around the world. We connect thrill-seekers with unforgettable experiences,
              from mountain climbing to deep-sea diving. Join thousands of adventurers who have discovered their passion through our platform.
            </p>
          </div>

          {/* Middle - Terms & Support */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col gap-4 text-center">
              <Link
                to="/terms"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/support"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                Customer Support
              </Link>
              <Link
                to="/faq"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Right side - Logo */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-lg group cursor-pointer"
            >
              <MapPin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-white">
                Adventure Booking
              </span>
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            © 2025 Adventure Booking. All rights reserved. | Made with ❤️ for adventurers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
