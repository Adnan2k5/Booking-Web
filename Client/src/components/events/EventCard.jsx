import { memo } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Compass, Clock, Users } from "lucide-react"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

const EventCard = memo(({ event, onBooking, onViewMore }) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group h-full flex flex-col"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Event Image with Title Overlay */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={event.image || "/placeholder.svg?height=200&width=300"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h4 className="text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h4>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{event.city}, {event.country}</span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          {/* Date & Time - Two Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">{t("date")}</p>
                <p className="text-sm text-gray-900 font-semibold truncate">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">{t("time")}</p>
                <p className="text-sm text-gray-900 font-semibold truncate">
                  {event.startTime}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Location */}
          {event.location && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-600 line-clamp-2">{event.location}</p>
            </div>
          )}

          {/* Adventures */}
          {event.adventures && event.adventures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">{t("adventures")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.adventures.slice(0, 2).map((adventure, index) => (
                  <span
                    key={adventure._id || index}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                  >
                    {adventure.name}
                  </span>
                ))}
                {event.adventures.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-xs font-medium text-white">
                    +{event.adventures.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* Book Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto"
        >
          <Button
            onClick={() => onViewMore?.(event)}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Users className="h-5 w-5 mr-2" />
            {t("bookYourSpot").toUpperCase()}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard