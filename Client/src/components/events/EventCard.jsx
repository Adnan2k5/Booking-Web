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
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={event.image || "/placeholder.svg?height=200&width=300"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h4 className="text-xl font-bold text-white">{event.title}</h4>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Content wrapper that grows to fill available space */}
        <div className="flex-1 space-y-4">
          {/* Location Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">{t("location")}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-7">{event.city}, {event.country}</p>
            {event.location && (
              <p className="text-gray-500 text-xs leading-relaxed pl-7">{event.location}</p>
            )}
          </div>

          {/* Time Info */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              {t("time")} {event.startTime} - {event.endTime}
            </span>
          </div>

          {/* Date Info */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              {t("date")} {new Date(event.date).toLocaleDateString()}
            </span>
          </div>

          {/* Adventures */}
          {event.adventures && event.adventures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Compass className="h-5 w-5" />
                <span className="font-semibold">{t("adventures")}</span>
              </div>
              <div className="pl-7 space-y-1">
                {event.adventures.slice(0, 2).map((adventure, index) => (
                  <div key={adventure._id || index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm">{adventure.name}</span>
                  </div>
                ))}
                {event.adventures.length > 2 && (
                  <p className="text-gray-500 text-xs pl-4">
                    +{event.adventures.length - 2} {event.adventures.length - 2 > 1 ? t("moreAdventures") : t("moreAdventure")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <Compass className="h-5 w-5" />
              <span className="font-semibold">{t("description")}</span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-7">
              {event.description && event.description.length > 20
                ? `${event.description.substring(0, 20)}...`
                : event.description}
            </p>
            {event.description && event.description.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMore?.(event);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium pl-7"
              >
                {t("viewMore")}
              </button>
            )}
          </div>
        </div>

        {/* Book Button - Fixed at bottom */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto"
        >
          <Button
            onClick={() => onBooking?.(event)}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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