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
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  const eventsLimit = 6
  const videoContainerRef = useRef(null)

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

  const onReady = useCallback(() => {
    setIsVideoReady(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoadVideo(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadVideo(true)
        observer.disconnect()
      }
    }, {
      threshold: 0.2
    })

    const target = videoContainerRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!shouldLoadVideo && typeof window !== "undefined") {
      const timeoutId = window.setTimeout(() => setShouldLoadVideo(true), 2000)
      return () => window.clearTimeout(timeoutId)
    }
  }, [shouldLoadVideo])

  const handleSubmitBooking = useCallback(() => {
    const result = eventBooking.submitBooking()
    if (!result.success) {
      toast.error(result.message)
    }
  }, [eventBooking])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video */}
      <div
        className="bg absolute inset-0 w-full h-[70vh] md:h-screen min-h-[420px] overflow-hidden -z-50"
        ref={videoContainerRef}
        style={{ width: "100vw" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <Suspense fallback={<div className="w-full h-full bg-gray-900" />}>
          {shouldLoadVideo && (
            <div className="player-wrapper h-full w-full absolute top-0 left-0">
              <ReactPlayer
                url={"https://dazzling-chaja-b80bdd.netlify.app/video.mp4"}
                onReady={onReady}
                controls={false}
                loop={true}
                playing={shouldLoadVideo}
                muted={true}
                width="100%"
                height="100%"
                onStart={() => setIsVideoReady(true)}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                className="react-player absolute top-0 left-0"
                wrapperClassName={`h-full w-full transition-opacity duration-700 ${isVideoReady ? "opacity-100" : "opacity-0"}`}
                config={{
                  file: {
                    attributes: {
                      preload: "auto",
                      playsInline: true,
                      autoPlay: true,
                      muted: true
                    }
                  }
                }}
              />
            </div>
          )}
        </Suspense>
      </div>

      <Nav_Landing />
      {/* Main Content - First Section */}
      <section className="flex items-center min-h-[70vh] md:min-h-screen justify-center pt-20 pb-16 sm:pt-28">
        <motion.div
          className="mx-auto px-4 sm:px-6 md:px-8 py-8 flex-col w-full max-w-5xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
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
      <div className="w-full bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 md:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("featuredEvents")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("discoverAmazingAdventures")}
            </p>
          </motion.div>

          {/* Country Slider - Always show if we have events */}
          {countrySlider.countriesFromEvents.length > 0 && (
            <div className="relative mb-12">
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-3 sm:gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                    size="lg"
                  onClick={countrySlider.prevCountry}
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                    <div className="flex items-center space-x-4 sm:space-x-8 mx-4 sm:mx-8 w-full sm:w-auto overflow-x-auto no-scrollbar justify-center">
                  {countrySlider.countriesFromEvents.map((country, index) => (
                    <motion.div
                      key={country.name}
                          className={`cursor-pointer transition-all duration-500 text-base sm:text-lg ${index === countrySlider.currentCountryIndex
                            ? "scale-110 sm:scale-125 sm:text-2xl font-bold text-gray-900"
                            : "scale-100 text-sm sm:text-lg text-gray-400 hover:text-gray-600"
                        }`}
                      onClick={() => countrySlider.goToCountry(index)}
                          whileHover={{ scale: index === countrySlider.currentCountryIndex ? 1.2 : 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {country.name}
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={countrySlider.nextCountry}
                  className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>

              {/* Country Indicator Dots */}
              <div className="flex justify-center space-x-2 mb-8">
                {countrySlider.countriesFromEvents.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${index === countrySlider.currentCountryIndex ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
                      }`}
                    onClick={() => countrySlider.goToCountry(index)}
                    whileHover={{ scale: 1.2 }}
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
            /* Show country-specific events */
            <AnimatePresence mode="wait">
              <motion.div
                key={countrySlider.currentCountryIndex}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {countrySlider.currentCountry?.events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    className="h-full"
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
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Show empty state when no events */
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">{t("noEventsAvailable")}</p>
            </div>
          )}

          {/* Booking Dialog */}
          <Dialog open={eventBooking.bookingDialog} onOpenChange={eventBooking.setBookingDialog}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">{t("bookYourEvent")}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {eventBooking.selectedEvent?.title} in {eventBooking.selectedEvent?.city}, {eventBooking.selectedEvent?.country}
                </DialogDescription>
              </DialogHeader>

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

              <DialogFooter className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                <Button variant="outline" onClick={eventBooking.closeDialogs} className="px-6 w-full sm:w-auto">
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSubmitBooking}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-6 w-full sm:w-auto"
                  disabled={!eventBooking.bookingForm.email || !eventBooking.bookingForm.phone}
                >
                  {t("continueToPayment")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View More Dialog */}
          <Dialog open={eventBooking.viewMoreDialog} onOpenChange={eventBooking.setViewMoreDialog}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {eventBooking.selectedEvent?.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {eventBooking.selectedEvent?.city}, {eventBooking.selectedEvent?.country}
                </DialogDescription>
              </DialogHeader>

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
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Star className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold">{t("nftReward")}</span>
                    </div>
                    <div className="pl-7">
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-900">{t("exclusiveNftAvailable")}</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          {t("completeAllAdventures")}
                        </p>
                        {eventBooking.selectedEvent.nftReward?.nftName && (
                          <div className="mt-3 space-y-1">
                            <p className="text-sm font-medium text-purple-900">{t("nft")} {eventBooking.selectedEvent.nftReward.nftName}</p>
                            {eventBooking.selectedEvent.nftReward.nftDescription && (
                              <p className="text-xs text-purple-700">{eventBooking.selectedEvent.nftReward.nftDescription}</p>
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

              <DialogFooter className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                <Button variant="outline" onClick={eventBooking.closeDialogs} className="px-6 w-full sm:w-auto">
                  {t("close")}
                </Button>
                <Button
                  onClick={() => {
                    eventBooking.setViewMoreDialog(false);
                    eventBooking.handleBooking(eventBooking.selectedEvent);
                  }}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-6 w-full sm:w-auto"
                >
                  <Users className="h-5 w-5 mr-2" />
                  {t("bookNow")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <PaginationComponent
        currentPage={eventsPage}
        totalPages={eventsTotalPages}
        onPageChange={setEventsPage}
      />

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

      <Footer />
    </div>
  )
}
