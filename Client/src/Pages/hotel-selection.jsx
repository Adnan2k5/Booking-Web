"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Hotel, Star, MapPin, Check } from "lucide-react"

// Mock data for hotels
const hotelsList = [
  {
    id: 1,
    name: "Mountain View Resort",
    description: "Luxury resort with panoramic mountain views and spa facilities",
    price: 150,
    image: "https://www.palaceresorts.com/playacar_resort_palace_resorts_431d891c3e.webp",
    rating: 4.8,
    location: "Alpine Heights",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Pool"],
  },
  {
    id: 2,
    name: "Adventure Lodge",
    description: "Cozy lodge close to adventure activities with rustic charm",
    price: 95,
    image: "https://www.palaceresorts.com/playacar_resort_palace_resorts_431d891c3e.webp",
    rating: 4.5,
    location: "Forest Edge",
    amenities: ["Free WiFi", "Breakfast", "Fireplace", "Guided Tours"],
  },
  {
    id: 3,
    name: "Riverside Retreat",
    description: "Peaceful accommodation by the river with private balconies",
    price: 120,
    image: "https://www.palaceresorts.com/playacar_resort_palace_resorts_431d891c3e.webp",
    rating: 4.6,
    location: "River Valley",
    amenities: ["Free WiFi", "River View", "Restaurant", "Kayak Rental"],
  },
  {
    id: 4,
    name: "Summit Hotel",
    description: "Modern hotel at high altitude with breathtaking views",
    price: 180,
    image: "https://www.palaceresorts.com/playacar_resort_palace_resorts_431d891c3e.webp",
    rating: 4.9,
    location: "Peak Point",
    amenities: ["Free WiFi", "Breakfast", "Gym", "Terrace"],
  },
]

const HotelCard = ({ hotel, isSelected, onSelectHotel }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg overflow-hidden border ${isSelected ? "border-blue-500" : "border-gray-200"} hover:shadow-lg transition-all duration-300`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" /> {hotel.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
          <MapPin className="w-3 h-3" /> {hotel.location}
        </div>
        <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden">{hotel.description}</p>

        <div className="flex flex-wrap gap-1 mt-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-bold text-blue-600">${hotel.price}</span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          <button
            onClick={() => onSelectHotel(hotel)}
            className={`px-3 py-1 rounded-md ${
              isSelected
                ? "bg-green-100 text-green-600 flex items-center gap-1"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" /> Selected
              </>
            ) : (
              "Select"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const HotelSection = ({ selectedHotel, onSelectHotel }) => {
  const [priceFilter, setPriceFilter] = useState("all")

  const filteredHotels = hotelsList.filter((hotel) => {
    if (priceFilter === "all") return true
    if (priceFilter === "budget" && hotel.price < 100) return true
    if (priceFilter === "mid" && hotel.price >= 100 && hotel.price < 150) return true
    if (priceFilter === "luxury" && hotel.price >= 150) return true
    return false
  })

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Hotel className="w-6 h-6" /> Partner Hotels
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPriceFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              priceFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setPriceFilter("budget")}
            className={`px-3 py-1 rounded-full text-sm ${
              priceFilter === "budget" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Budget
          </button>
          <button
            onClick={() => setPriceFilter("mid")}
            className={`px-3 py-1 rounded-full text-sm ${
              priceFilter === "mid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Mid-range
          </button>
          <button
            onClick={() => setPriceFilter("luxury")}
            className={`px-3 py-1 rounded-full text-sm ${
              priceFilter === "luxury" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Luxury
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isSelected={selectedHotel?.id === hotel.id}
            onSelectHotel={onSelectHotel}
          />
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-10 text-gray-500">No hotels found matching your filters.</div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>All partner hotels offer special discounts for adventure participants.</p>
        <p>Booking a hotel is optional but recommended for multi-day adventures.</p>
      </div>
    </motion.div>
  )
}

