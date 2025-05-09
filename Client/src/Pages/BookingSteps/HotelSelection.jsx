"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Star, Building } from "lucide-react"
import { cn } from "../../lib/utils"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useTranslation } from "react-i18next"

// Import mock data
import { mockHotels } from "../../Data/mock_booking"

export const HotelSelection = ({ selectedHotel, onSelectHotel }) => {
    const { t } = useTranslation()
    const [priceFilter, setPriceFilter] = useState("all")

    const filteredHotels = mockHotels.filter((hotel) => {
        if (priceFilter === "all") return true
        if (priceFilter === "budget" && hotel.price < 150) return true
        if (priceFilter === "mid" && hotel.price >= 150 && hotel.price < 200) return true
        if (priceFilter === "luxury" && hotel.price >= 200) return true
        return false
    })

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Building className="w-6 h-6" /> {t("selectAccommodation")}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPriceFilter("all")}
                        className={`px-3 py-1 rounded-full text-sm ${priceFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {t("all")}
                    </button>
                    <button
                        onClick={() => setPriceFilter("budget")}
                        className={`px-3 py-1 rounded-full text-sm ${priceFilter === "budget" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {t("budget")}
                    </button>
                    <button
                        onClick={() => setPriceFilter("mid")}
                        className={`px-3 py-1 rounded-full text-sm ${priceFilter === "mid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {t("midRange")}
                    </button>
                    <button
                        onClick={() => setPriceFilter("luxury")}
                        className={`px-3 py-1 rounded-full text-sm ${priceFilter === "luxury" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {t("luxury")}
                    </button>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredHotels.map((hotel) => (
                    <motion.div key={hotel.id} variants={itemVariants}>
                        <Card
                            className={cn(
                                "overflow-hidden h-full transition-all duration-300 cursor-pointer border-2",
                                selectedHotel === hotel.id
                                    ? "border-blue-500 shadow-md shadow-blue-200"
                                    : "border-transparent hover:border-blue-200",
                            )}
                            onClick={() => onSelectHotel(hotel.id === selectedHotel ? null : hotel.id)}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/5 h-full">
                                    <img
                                        src={hotel.img || "/placeholder.svg"}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover md:h-48"
                                    />
                                </div>
                                <div className="md:w-3/5 p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <MapPin size={14} />
                                        <span>{hotel.location}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h3>
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs ml-1 text-gray-500">{hotel.rating}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-blue-600">
                                            ${hotel.price}
                                            <span className="text-sm font-normal text-gray-500">/night</span>
                                        </span>
                                        <Badge
                                            variant={selectedHotel === hotel.id ? "default" : "outline"}
                                            className={selectedHotel === hotel.id ? "bg-blue-600" : ""}
                                        >
                                            {selectedHotel === hotel.id ? t("selected") : t("select")}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {filteredHotels.length === 0 && <div className="text-center py-10 text-gray-500">{t("noHotelsFound")}</div>}

            <div className="mt-6 text-center text-sm text-gray-600">
                <p>{t("hotelDiscountInfo")}</p>
                <p>{t("hotelOptionalInfo")}</p>
            </div>
        </motion.div>
    )
}
