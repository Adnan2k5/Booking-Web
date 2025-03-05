import React from 'react'
import { MapPin } from "lucide-react";
export const Navbar = () => {
  return (
    <header className="bg-white shadow-sm ">
        <div className=" mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Adventure Bookings
            </span>
          </div>
        </div>
      </header>
  )
}
