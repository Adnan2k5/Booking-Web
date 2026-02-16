import { useState, useRef, useCallback, lazy, Suspense, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { Users, UserPlus, UserX, ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useAdventures } from "../hooks/useAdventure"
import { useLocations } from "../hooks/useLocation"
import { Nav_Landing } from "../components/Nav_Landing"
import { Footer } from "../components/Footer"
import { fadeIn } from "../assets/Animations"

import { useFriend } from "../hooks/useFriend.jsx"
import { useEvents } from "../hooks/useEvent"
import { useEventBooking } from "../hooks/useEventBooking"
import { useGroupManagement } from "../hooks/useGroupManagement"
import { useCountrySlider } from "../hooks/useCountrySlider"

// Components
import EventCard from "../components/events/EventCard"
import SearchBar from "../components/search/SearchBar"
import PaginationComponent from "../components/ui/PaginationComponent"

// Utils
import { validateSearchForm } from "../utils/validationUtils"
import { formatDateWithWeekday } from "../utils/dateUtils"

// Lazy load heavy components
const ReactPlayer = lazy(() => import("react-player"))


export default function LandingPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [adventure, setAdventure] = useState("")
  const [eventsPage, setEventsPage] = useState(1)

  const eventsLimit = 6

  // Custom hooks - Prioritize events loading, defer others
  const { events, isLoading: eventsLoading, totalPages: eventsTotalPages } = useEvents({
    page: eventsPage,
    limit: eventsLimit,
    defer: false // Load events immediately (critical)
  })

  // Defer adventures and locations - they're not immediately visible
  const { adventures, loading: adventureLoading } = useAdventures(true)
  const { locations: allLocations, isLoading: locationsLoading } = useLocations(true)

  const eventBooking = useEventBooking()

  const groupManagement = useGroupManagement(user, useFriend, t)

  const countrySlider = useCountrySlider(events)

  // Handlers
  const handleNavigate = useCallback(() => {
    const validation = validateSearchForm({ location, date })
    if (!validation.isValid) {
      toast.error(t("pleaseSelectLocationAndDate"))
      return
    }

    // Store group members in sessionStorage to access in booking page
    groupManagement.saveGroupToSession()
    navigate(`/browse?adventure=${adventure}&location=${location}&date=${date}`)
  }, [location, date, adventure, navigate, t, groupManagement])

  const handleSubmitBooking = useCallback(() => {
    const result = eventBooking.submitBooking()
    if (!result.success) {
      toast.error(result.message)
    }
  }, [eventBooking])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden -z-50 bg-black">
        <motion.div
          className="absolute inset-0 bg-black/40 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 animate-fade-in transition-opacity duration-1000"
          onLoadedData={(e) => e.currentTarget.classList.remove("opacity-0")}
        >
          <source src="https://dazzling-chaja-b80bdd.netlify.app/video.mp4" type="video/mp4" />
        </video>
      </div>

      <Nav_Landing />
      {/* Main Content - First Section */}
      <section className="flex items-center min-h-screen justify-center pt-20 pb-16 px-4">
        <motion.div
          className="w-full max-w-5xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
              {t("discoverAdventures") || "Discover Your Next Adventure"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
              {t("adventureDescription") || "Explore the world's most exciting events and experiences."}
            </p>
          </div>

          <SearchBar
            adventures={adventures}
            adventure={adventure}
            onAdventureChange={setAdventure}
            location={location}
            onLocationChange={setLocation}
            date={date}
            onDateChange={setDate}
            groupMembers={groupManagement.groupMembers}
            onShowGroupDialog={groupManagement.setShowGroupDialog}
            onNavigate={handleNavigate}
            t={t}
            locationsList={allLocations?.map(l => l.name) || []}
            locationsLoading={locationsLoading}
          />
        </motion.div>
      </section>


      {/* Featured Events Content */}
      <div className="w-full relative overflow-hidden bg-slate-50 px-4 sm:px-6 md:px-8 py-24 min-h-[80vh] flex flex-col justify-between">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply filter"
            animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply filter"
            animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl mix-blend-multiply filter"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-6 tracking-tight">
              {t("featuredEvents")}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              {t("discoverAmazingAdventures")}
            </p>
          </motion.div>

          {/* Country Slider */}
          {countrySlider.countriesFromEvents.length > 0 && (
            <div className="relative mb-16">
              <motion.div
                className="flex items-center justify-center gap-4 md:gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={countrySlider.prevCountry}
                  className="rounded-full h-12 w-12 hover:bg-white hover:shadow-lg transition-all duration-300 text-gray-800"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Scrollable Container with Hidden Scrollbar */}
                <div className="flex-1 overflow-x-auto no-scrollbar mask-gradient-x">
                  <div className="flex items-center justify-center space-x-8 md:space-x-12 px-4 min-w-max mx-auto">
                    {countrySlider.countriesFromEvents.map((country, index) => (
                      <motion.div
                        key={country.name}
                        onClick={() => countrySlider.goToCountry(index)}
                        className={`cursor-pointer transition-all duration-500 whitespace-nowrap px-4 py-2 rounded-full ${index === countrySlider.currentCountryIndex
                          ? "text-3xl md:text-4xl font-bold text-gray-900 scale-100" // Highlighted
                          : "text-xl md:text-2xl text-gray-400 hover:text-gray-600 scale-95" // Dimmed
                          }`}
                        whileHover={{ scale: index === countrySlider.currentCountryIndex ? 1.05 : 1.05 }}
                        layout
                      >
                        <span className={index === countrySlider.currentCountryIndex ? "border-b-4 border-gray-900 pb-1" : ""}>
                          {country.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={countrySlider.nextCountry}
                  className="rounded-full h-12 w-12 hover:bg-white hover:shadow-lg transition-all duration-300 text-gray-800"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>

              {/* Minimalist Indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {countrySlider.countriesFromEvents.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${index === countrySlider.currentCountryIndex ? "w-12 bg-gray-900" : "w-1.5 bg-gray-300"
                      }`}
                    onClick={() => countrySlider.goToCountry(index)}
                    layoutId="activeIndicator"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : countrySlider.countriesFromEvents.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={countrySlider.currentCountryIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  <div
                    className="flex overflow-x-auto gap-6 sm:gap-8 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scroll-smooth"
                    id={`events-container-${countrySlider.currentCountryIndex}`}
                    onScroll={(e) => {
                      const container = e.currentTarget
                      const scrollLeft = container.scrollLeft
                      const cardWidth = container.scrollWidth / (countrySlider.currentCountry?.events.length || 1)
                      const currentIndex = Math.round(scrollLeft / cardWidth)
                      const dots = document.querySelectorAll('.event-dot')
                      dots.forEach((dot, idx) => {
                        if (idx === currentIndex) {
                          dot.classList.add('bg-gray-900', 'w-8')
                          dot.classList.remove('bg-gray-300', 'w-2')
                        } else {
                          dot.classList.remove('bg-gray-900', 'w-8')
                          dot.classList.add('bg-gray-300', 'w-2')
                        }
                      })
                    }}
                  >
                    {countrySlider.currentCountry?.events.map((event, index) => (
                      <motion.div
                        key={event._id}
                        className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center md:snap-none h-full"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <EventCard
                          event={event}
                          onBooking={eventBooking.handleBooking}
                          onViewMore={eventBooking.handleViewMore}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {countrySlider.currentCountry?.events && countrySlider.currentCountry.events.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
                      {countrySlider.currentCountry.events.map((_, index) => (
                        <button
                          key={index}
                          className={`event-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${index === 0 ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                            }`}
                          onClick={() => {
                            const container = document.getElementById(`events-container-${countrySlider.currentCountryIndex}`)
                            if (container) {
                              const cardWidth = container.scrollWidth / countrySlider.currentCountry.events.length
                              container.scrollTo({
                                left: cardWidth * index,
                                behavior: 'smooth'
                              })
                            }
                          }}
                          aria-label={`Go to event ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">{t("noEventsAvailable")}</p>
            </div>
          )}


          {/* Booking Dialog */}
          <Dialog open={eventBooking.bookingDialog} onOpenChange={eventBooking.setBookingDialog}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
                <DialogTitle className="text-2xl font-bold text-gray-900">{t("bookYourEvent")}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {eventBooking.selectedEvent?.title} in {eventBooking.selectedEvent?.city}, {eventBooking.selectedEvent?.country}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 min-h-0 overflow-y-auto dialog-scroll px-4 sm:px-6">
                <div className="space-y-6 py-4">
                  {/* Event Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={eventBooking.selectedEvent?.image || "/placeholder.svg"}
                        alt={eventBooking.selectedEvent?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{eventBooking.selectedEvent?.title}</h4>
                        <p className="text-sm text-gray-600">{eventBooking.selectedEvent?.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>
                          {eventBooking.selectedEvent?.startTime} - {eventBooking.selectedEvent?.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>
                          {eventBooking.selectedEvent?.date && formatDateWithWeekday(eventBooking.selectedEvent.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t("groupMembers")} ({groupManagement.groupMembers.length + 1})
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-gray-200 bg-gray-900">
                              <AvatarFallback className="text-white text-xs">
                                {user?.user ? user.user.email.charAt(0).toUpperCase() : "Y"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{user?.user ? user.user.email : "You"}</p>
                              <p className="text-xs text-gray-500">{t("groupLeader")}</p>
                            </div>
                          </div>
                        </div>
                        {groupManagement.groupMembers.map((member) => (
                          <div key={member._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-gray-200">
                                <AvatarImage src={member.profilePicture || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback className="text-xs">{member.name?.charAt(0) || member.email?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{member.name || "User"}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => groupManagement.setShowGroupDialog(true)}
                          className="w-full mt-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {t("addFriendsToGroup")}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        {t("emailAddress")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={eventBooking.bookingForm.email || user?.user?.email || ""}
                        onChange={(e) => eventBooking.updateBookingForm({ email: e.target.value })}
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        {t("phoneNumber")}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={eventBooking.bookingForm.phone || user?.user?.phone || ""}
                        onChange={(e) => eventBooking.updateBookingForm({ phone: e.target.value })}
                        className="mt-1"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-100">
                <Button variant="outline" onClick={eventBooking.closeDialogs} className="px-6 w-full sm:w-auto">
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSubmitBooking}
                  className="bg-black hover:bg-gray-800 text-white px-6 w-full sm:w-auto transition-colors"
                  disabled={!eventBooking.bookingForm.email || !eventBooking.bookingForm.phone}
                >
                  {t("continueToPayment")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View More Dialog */}
          <Dialog open={eventBooking.viewMoreDialog} onOpenChange={eventBooking.setViewMoreDialog}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {eventBooking.selectedEvent?.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {eventBooking.selectedEvent?.city}, {eventBooking.selectedEvent?.country}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 min-h-0 overflow-y-auto dialog-scroll px-4 sm:px-6">
                <div className="space-y-6 py-4">
                  {/* Event Image */}
                  <div className="relative h-64 overflow-hidden rounded-xl">
                    <img
                      src={eventBooking.selectedEvent?.image || "/placeholder.svg"}
                      alt={eventBooking.selectedEvent?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location Details */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="h-5 w-5" />
                        <span className="font-semibold">{t("locationDetails")}</span>
                      </div>
                      <div className="pl-7 space-y-1">
                        <p className="text-gray-900 font-medium">{eventBooking.selectedEvent?.city}, {eventBooking.selectedEvent?.country}</p>
                        {eventBooking.selectedEvent?.location && (
                          <p className="text-gray-600 text-sm">{eventBooking.selectedEvent.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Time & Date */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <span className="font-semibold">{t("schedule")}</span>
                      </div>
                      <div className="pl-7 space-y-1">
                        <p className="text-gray-900 font-medium">
                          {eventBooking.selectedEvent?.startTime} - {eventBooking.selectedEvent?.endTime}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {eventBooking.selectedEvent?.date && formatDateWithWeekday(eventBooking.selectedEvent.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Adventures Section */}
                  {eventBooking.selectedEvent?.adventures && eventBooking.selectedEvent.adventures.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <span className="font-semibold">{t("adventuresIncluded")}</span>
                      </div>
                      <div className="pl-7 space-y-2">
                        {eventBooking.selectedEvent.adventures.map((adventure, index) => (
                          <div key={adventure._id || index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            {adventure.thumbnail && (
                              <img
                                src={adventure.thumbnail}
                                alt={adventure.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{adventure.name}</h5>
                              {adventure.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{adventure.description}</p>
                              )}
                              {adventure.exp && (
                                <div className="flex items-center mt-2">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  <span className="text-xs text-gray-500">{adventure.exp} XP</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NFT Reward Section */}
                  {eventBooking.selectedEvent?.isNftEvent && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Star className="h-5 w-5 text-gray-900" />
                        <span className="font-semibold">{t("nftReward")}</span>
                      </div>
                      <div className="pl-7">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="h-4 w-4 text-gray-900" />
                            <span className="font-medium text-gray-900">{t("exclusiveNftAvailable")}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {t("completeAllAdventures")}
                          </p>
                          {eventBooking.selectedEvent.nftReward?.nftName && (
                            <div className="mt-3 space-y-1">
                              <p className="text-sm font-medium text-gray-900">{t("nft")} {eventBooking.selectedEvent.nftReward.nftName}</p>
                              {eventBooking.selectedEvent.nftReward.nftDescription && (
                                <p className="text-xs text-gray-600">{eventBooking.selectedEvent.nftReward.nftDescription}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Description */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span className="font-semibold">{t("aboutThisEvent")}</span>
                    </div>
                    <div className="pl-7">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {eventBooking.selectedEvent?.description}
                      </p>
                    </div>
                  </div>

                  {/* Additional Event Info (if available) */}
                  {(eventBooking.selectedEvent?.price || eventBooking.selectedEvent?.maxParticipants || eventBooking.selectedEvent?.difficulty) && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">{t("eventInformation")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {eventBooking.selectedEvent?.price && (
                          <div>
                            <span className="text-gray-600">{t("price")}</span>
                            <p className="font-medium text-gray-900">${eventBooking.selectedEvent.price}</p>
                          </div>
                        )}
                        {eventBooking.selectedEvent?.maxParticipants && (
                          <div>
                            <span className="text-gray-600">{t("maxParticipants")}</span>
                            <p className="font-medium text-gray-900">{eventBooking.selectedEvent.maxParticipants}</p>
                          </div>
                        )}
                        {eventBooking.selectedEvent?.difficulty && (
                          <div>
                            <span className="text-gray-600">{t("difficulty")}</span>
                            <p className="font-medium text-gray-900">{eventBooking.selectedEvent.difficulty}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-100">
                <Button variant="outline" onClick={eventBooking.closeDialogs} className="px-6 w-full sm:w-auto">
                  {t("close")}
                </Button>
                <Button
                  onClick={() => {
                    eventBooking.setViewMoreDialog(false);
                    eventBooking.handleBooking(eventBooking.selectedEvent);
                  }}
                  className="bg-black hover:bg-gray-800 text-white px-6 w-full sm:w-auto transition-colors"
                >
                  <Users className="h-5 w-5 mr-2" />
                  {t("bookNow")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mt-16">
            <PaginationComponent
              currentPage={eventsPage}
              totalPages={eventsTotalPages}
              onPageChange={setEventsPage}
            />
          </div>
        </div>
      </div>

      {/* Group Dialog */}
      <Dialog open={groupManagement.showGroupDialog} onOpenChange={groupManagement.setShowGroupDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">{t("addFriendsToGroup")}</DialogTitle>
            <DialogDescription>{t("inviteFriendsDescription")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={groupManagement.handleSearchFriends} className="flex flex-col sm:flex-row gap-2 mb-4 mt-4">
            <Input
              type="email"
              placeholder={t("searchByEmail")}
              value={groupManagement.searchEmail}
              onChange={(e) => groupManagement.setSearchEmail(e.target.value)}
              className="flex-1 focus:ring-2 focus:ring-gray-500"
            />
            <Button
              type="submit"
              disabled={groupManagement.friendLoading.search || !groupManagement.searchEmail}
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
            >
              {groupManagement.friendLoading.search ? t("searching") : t("search")}
            </Button>
          </form>          {/* Search Results */}
          {groupManagement.searchResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t("searchResults")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={groupManagement.searchResult.user?.profilePicture || "/placeholder.svg"} alt={groupManagement.searchResult.user?.name} />
                      <AvatarFallback>{groupManagement.searchResult.user?.name?.charAt(0) || groupManagement.searchResult.user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{groupManagement.searchResult.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{groupManagement.searchResult.user?.email}</p>
                      {groupManagement.searchResult.isAlreadyFriend && (
                        <p className="text-xs text-green-600">{t("alreadyFriends")}</p>
                      )}
                      {groupManagement.searchResult.hasPendingRequest && (
                        <p className="text-xs text-orange-600">
                          {groupManagement.searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {groupManagement.searchResult.isAlreadyFriend ? (
                      <Button
                        size="sm"
                        onClick={() => groupManagement.addGroupMember(groupManagement.searchResult.user)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      >
                        <UserPlus size={14} />
                        {t("add")}
                      </Button>
                    ) : groupManagement.searchResult.hasPendingRequest ? (
                      <Button
                        size="sm"
                        disabled
                        className="flex items-center gap-1 bg-gray-400 text-white cursor-not-allowed w-full sm:w-auto"
                      >
                        {groupManagement.searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => groupManagement.handleSendFriendRequest(groupManagement.searchResult.user._id)}
                          disabled={groupManagement.friendLoading.action}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs w-full sm:w-auto"
                        >
                          <UserPlus size={14} />
                          {groupManagement.friendLoading.action ? t("sending") : t("sendRequest")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => groupManagement.addGroupMember(groupManagement.searchResult.user)}
                          className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                        >
                          <UserPlus size={14} />
                          {t("addDirectly")}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show error if search failed */}
          {groupManagement.error.search && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{groupManagement.error.search}</p>
            </div>
          )}

          {/* Existing Friends List */}
          {groupManagement.showFriendsList && groupManagement.friends.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{t("yourFriends")}</h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {groupManagement.friends
                  .filter(friend => !groupManagement.groupMembers.some(member => member._id === friend._id))
                  .map((friend) => (
                    <div key={friend._id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-gray-100">
                          <AvatarImage src={friend.profilePicture || "/placeholder.svg"} alt={friend.name} />
                          <AvatarFallback className="text-xs">{friend.name?.charAt(0) || friend.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{friend.name || "User"}</p>
                          <p className="text-xs text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => groupManagement.addGroupMember(friend)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 w-full sm:w-auto"
                      >
                        <UserPlus size={12} />
                        {t("add")}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Loading friends */}
          {groupManagement.friendLoading.friends && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <p className="text-gray-600 text-sm">{t("loadingFriends")}</p>
            </div>
          )}

          {/* Group Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("yourGroup")} ({groupManagement.groupMembers.length + 1})
              </h3>
            </div>

            {/* Current User */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-100 bg-black">
                  <AvatarFallback className="text-white">
                    {user?.user ? user.user.email.charAt(0).toUpperCase() : "Y"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{user?.user ? user.user.email : "You"}</p>
                  <p className="text-xs text-gray-500">{t("groupLeader")}</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {groupManagement.groupMembers.map((member) => (
                <motion.div
                  key={member._id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={member.profilePicture || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name?.charAt(0) || member.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{member.name || "User"}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => groupManagement.removeGroupMember(member._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <UserX size={14} />
                    {t("remove")}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {groupManagement.groupMembers.length === 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">{t("noFriendsYet")}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => groupManagement.setShowGroupDialog(false)} className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer className="!mt-0" />
    </div>
  )
}
