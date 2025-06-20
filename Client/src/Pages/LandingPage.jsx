"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

import { Users, Search, UserPlus, UserX, MapPin, Calendar, Compass, Clock, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Nav_Landing } from "../components/Nav_Landing"
import { Footer } from "../components/Footer"
import { fadeIn, staggerContainer } from "../assets/Animations"

import { useFriend } from "../hooks/useFriend.jsx"
import ReactPlayer from "react-player"
import { useEvents } from "../hooks/useEvent"


export default function LandingPage() {
  const Navigate = useNavigate()
  const { user, loading } = useAuth()
  const { t, i18n } = useTranslation()
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")

  // Define mockCountries before using it in state
  const mockCountries = [
    {
      id: 1,
      name: "Lithuania",
      cities: [
        {
          name: "Kaunas",
          events: [
            {
              id: 1,
              title: "Marathon Run",
              image: "/placeholder.svg?height=200&width=300",
              startTime: "02:15:48",
              endTime: "06:30:00",
              description: "A scenic 10K run through city center.",
              mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.5!2d23.9!3d54.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDU0JzAwLjAiTiAyM8KwNTQnMDAuMCJF!5e0!3m2!1sen!2slt!4v1234567890",
            },
          ],
        },
        {
          name: "Klaipėda",
          events: [
            {
              id: 2,
              title: "Catamaran Race",
              image: "/placeholder.svg?height=200&width=300",
              startTime: "05:32:17",
              endTime: "08:45:30",
              description: "Exciting speed race by the coast.",
              mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.5!2d21.1!3d55.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQyJzAwLjAiTiAyMcKwMDYnMDAuMCJF!5e0!3m2!1sen!2slt!4v1234567890",
            },
          ],
        },
        {
          name: "Vilnius",
          events: [
            {
              id: 3,
              title: "Paintball Cup",
              image: "/placeholder.svg?height=200&width=300",
              startTime: "01:21:07",
              endTime: "04:15:22",
              description: "Team-based tactical game in a forest arena.",
              mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.5!2d25.3!3d54.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDQyJzAwLjAiTiAyNcKwMTgnMDAuMCJF!5e0!3m2!1sen!2slt!4v1234567890",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Latvia",
      cities: [
        {
          name: "Riga",
          events: [
            {
              id: 4,
              title: "Urban Cycling Tour",
              image: "/placeholder.svg?height=200&width=300",
              startTime: "09:00:00",
              endTime: "12:30:00",
              description: "Explore the historic old town on two wheels.",
              mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.5!2d24.1!3d56.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDU0JzAwLjAiTiAyNMKwMDYnMDAuMCJF!5e0!3m2!1sen!2slv!4v1234567890",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Estonia",
      cities: [
        {
          name: "Tallinn",
          events: [
            {
              id: 5,
              title: "Medieval Festival",
              image: "/placeholder.svg?height=200&width=300",
              startTime: "10:00:00",
              endTime: "18:00:00",
              description: "Step back in time with authentic medieval experiences.",
              mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2305.5!2d24.7!3d59.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTnCsDI0JzAwLjAiTiAyNMKwNDInMDAuMCJF!5e0!3m2!1sen!2see!4v1234567890",
            },
          ],
        },
      ],
    },
  ]

  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [adventure, setadventure] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [showFriendsList, setShowFriendsList] = useState(true)
  const [eventsPage, setEventsPage] = useState(1);
  const [countries, setCountries] = useState(mockCountries)
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [bookingDialog, setBookingDialog] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    participants: 1,
    email: "",
    phone: "",
    specialRequests: "",
  })
  const eventsLimit = 6 // Show 6 events per page
  const playerRef = useRef(null)
  const { events, isLoading: eventsLoading, totalPages: eventsTotalPages } = useEvents({
    page: eventsPage,
    limit: eventsLimit
  });
  const sliderRef = useRef(null)
  const currentCountry = countries[currentCountryIndex]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => (prev + 1) % countries.length)
    }, 8000) // Change country every 8 seconds

    return () => clearInterval(interval)
  }, [countries.length])

  const nextCountry = () => {
    setCurrentCountryIndex((prev) => (prev + 1) % countries.length)
  }

  const prevCountry = () => {
    setCurrentCountryIndex((prev) => (prev - 1 + countries.length) % countries.length)
  }

  const handleBooking = (event) => {
    setSelectedEvent(event)
    setBookingDialog(true)
  }

  const submitBooking = () => {
    // Handle booking submission here
    console.log("Booking submitted:", { event: selectedEvent, form: bookingForm })
    setBookingDialog(false)
    setBookingForm({ participants: 1, email: "", phone: "", specialRequests: "" })
  }

  const { adventures, loading: adventureLoading } = useAdventures()
  const {
    friends,
    searchResult,
    loading: friendLoading,
    error,
    searchUser,
    sendRequest,
    clearSearchResult,
    fetchFriends
  } = useFriend()

  // Fetch friends when component mounts or dialog opens
  useEffect(() => {
    if (showGroupDialog && friends.length === 0) {
      fetchFriends()
    }
  }, [showGroupDialog, fetchFriends, friends.length])

  // Clear search results when dialog closes
  useEffect(() => {
    if (!showGroupDialog) {
      clearSearchResult()
      setSearchEmail("")
    }
  }, [showGroupDialog, clearSearchResult])

  const handleSearchFriends = async (e) => {
    e.preventDefault()

    if (!searchEmail.trim()) {
      toast(t("pleaseEnterEmail"), { type: "error", position: "top-right" })
      return
    }

    try {
      console.log("Searching for user:", searchEmail)
      const result = await searchUser(searchEmail)
      if (!result) {
        toast(t("noUsersFound"), { type: "error", position: "top-right" })
      }
    } catch (err) {
      toast(t("searchFailed"), { type: "error", position: "top-right" })
    }
  }
  const addGroupMember = (user) => {
    // Check if user is already in group
    if (groupMembers.some((member) => member._id === user._id)) {
      toast(t("userAlreadyInGroup"), { type: "warning", position: "top-right" })
      return
    }

    setGroupMembers((prev) => [...prev, user])
    clearSearchResult()
    setSearchEmail("")
    toast(t("friendAdded"), { type: "success", position: "top-right" })
  }

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendRequest(userId)
      toast(t("friendRequestSent"), { type: "success", position: "top-right" })
    } catch (err) {
      toast(t("failedToSendRequest"), { type: "error", position: "top-right" })
    }
  }

  const removeGroupMember = (userId) => {
    // Remove from local state
    setGroupMembers((prev) => prev.filter((member) => member._id !== userId))

    // Remove from sessionStorage if present
    try {
      const stored = sessionStorage.getItem("groupMembers")
      if (stored) {
        const sessionMembers = JSON.parse(stored)
        const updatedSessionMembers = sessionMembers.filter((member) => member._id !== userId)
        sessionStorage.setItem("groupMembers", JSON.stringify(updatedSessionMembers))
      }
    } catch { }

    toast(t("friendRemoved"), { type: "success", position: "top-right" })
  }

  const handleNavigate = () => {
    // Check if required fields are filled
    if (!location || !date) {
      toast.error(t("pleaseSelectLocationAndDate") || "Please select location and date")
      return
    }

    // Store group members in sessionStorage to access in booking page
    if (groupMembers.length > 0) {
      sessionStorage.setItem("groupMembers", JSON.stringify(groupMembers))
    }
    Navigate(`/browse?adventure=${adventure}&location=${location}&date=${date}`)
  }
  const onReady = () => {
    const internalPlayer = playerRef.current.getInternalPlayer();
    // Tries to set quality — doesn't always work depending on YouTube
    if (internalPlayer.setPlaybackQuality) {
      internalPlayer.setPlaybackQuality('hd1080'); // 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video - Fixed at 100vh */}
      <div className="bg absolute top-0 left-0 w-full h-screen overflow-hidden -z-50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <ReactPlayer
          ref={playerRef}
          url={"https://youtu.be/FfPVvtNo92s"}
          onReady={onReady}
          controls={false}
          loop={true}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
        />
      </div>

      <Nav_Landing />
      {/* Main Content - First Section */}
      <section className="flex items-center h-screen justify-center">
        <motion.div
          className="bg-white/80 backdrop-blur-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex-col w-[90%] rounded-lg shadow-lg border border-white/50"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="search-bar w-full max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
              {/* Unified search container */}
              <div className="relative flex-1 flex flex-col md:flex-row gap-2">
                {/* Adventure selection */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <Compass className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    onChange={(e) => setadventure(e.target.value)}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1 bg-transparent"
                  >
                    <option value="all">{t("selectAdventure")}</option>
                    {adventures.map((adventure, index) => (
                      <option key={index} value={adventure.name}>
                        {adventure.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location input */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
                    type="text"
                    placeholder={t("searchLocation")}
                    required
                  />
                </div>

                {/* Date input */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    placeholder={t("selectDate")}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
                    required
                  />
                </div>

                {/* Group button */}
                <div className="flex-1 md:flex-initial flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <Button
                    onClick={() => setShowGroupDialog(true)}
                    className="w-full h-full px-4 py-6 bg-white hover:bg-gray-50 text-black"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">
                      {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Search button - separated and bigger */}
              <Button
                onClick={handleNavigate}
                className="w-full md:w-auto mt-2 md:mt-0 py-6 px-8 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-lg shadow-md"
                disabled={!location || !date}
              >
                <Search className="h-6 w-6 mr-2" />
                <span>{t("search")}</span>
              </Button>
            </div>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing adventures across different countries
            </p>
          </motion.div>

          {/* Country Slider */}
          <div className="relative mb-12">
            <motion.div
              className="flex justify-center items-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                size="lg"
                onClick={prevCountry}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div className="flex items-center space-x-8 mx-8">
                {countries.map((country, index) => (
                  <motion.div
                    key={country.id}
                    className={`cursor-pointer transition-all duration-500 ${index === currentCountryIndex
                      ? "scale-125 text-2xl font-bold text-gray-900"
                      : "scale-100 text-lg text-gray-400 hover:text-gray-600"
                      }`}
                    onClick={() => setCurrentCountryIndex(index)}
                    whileHover={{ scale: index === currentCountryIndex ? 1.25 : 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {country.name}
                  </motion.div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="lg"
                onClick={nextCountry}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Country Indicator Dots */}
            <div className="flex justify-center space-x-2 mb-8">
              {countries.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${index === currentCountryIndex ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
                    }`}
                  onClick={() => setCurrentCountryIndex(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCountryIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {currentCountry?.cities.map((city, cityIndex) => (
                <motion.div
                  key={`${city.name}-${cityIndex}`}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: cityIndex * 0.1 }}
                >
                  {/* City Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">CITY: {city.name}</h3>
                  </div>

                  {/* Event Cards */}
                  {city.events.map((event) => (
                    <motion.div
                      key={event.id}
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <motion.img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h4 className="text-xl font-bold text-white">{event.title}</h4>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-6 space-y-4">
                        {/* Embedded Map */}
                        <div className="relative h-32 rounded-xl overflow-hidden">
                          <iframe
                            src={event.mapEmbedUrl}
                            className="w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                            <MapPin className="h-4 w-4 text-gray-600 inline mr-1" />
                            <span className="text-sm font-medium text-gray-700">{city.name}</span>
                          </div>
                        </div>

                        {/* Time Info */}
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">
                            Start & End time: {event.startTime} - {event.endTime}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar className="h-5 w-5" />
                            <span className="font-semibold">Short Description:</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed pl-7">{event.description}</p>
                        </div>

                        {/* Book Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleBooking(event)}
                            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Users className="h-5 w-5 mr-2" />
                            BOOK YOUR SPOT
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Booking Dialog */}
          <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Book Your Adventure</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {selectedEvent?.title} in{" "}
                  {
                    currentCountry?.cities.find((city) => city.events.some((event) => event.id === selectedEvent?.id))
                      ?.name
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Event Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedEvent?.image || "/placeholder.svg"}
                      alt={selectedEvent?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedEvent?.title}</h4>
                      <p className="text-sm text-gray-600">{selectedEvent?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {selectedEvent?.startTime} - {selectedEvent?.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="participants" className="text-sm font-medium text-gray-700">
                      Number of Participants
                    </Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      max="10"
                      value={bookingForm.participants}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, participants: Number.parseInt(e.target.value) }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requests" className="text-sm font-medium text-gray-700">
                      Special Requests (Optional)
                    </Label>
                    <textarea
                      id="requests"
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="space-x-3">
                <Button variant="outline" onClick={() => setBookingDialog(false)} className="px-6">
                  Cancel
                </Button>
                <Button
                  onClick={submitBooking}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-6"
                  disabled={!bookingForm.email || !bookingForm.phone}
                >
                  Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pagination */}
      {eventsTotalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <Button
            variant="outline"
            onClick={() => setEventsPage(prev => Math.max(1, prev - 1))}
            disabled={eventsPage === 1}
            className="flex items-center gap-2 px-4"
          >
            <span>Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {eventsTotalPages <= 7 ? (
              // Show all pages if 7 or fewer
              Array.from({ length: eventsTotalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={eventsPage === pageNum ? "default" : "outline"}
                  onClick={() => setEventsPage(pageNum)}
                  className="w-10 h-10 p-0"
                  size="sm"
                >
                  {pageNum}
                </Button>
              ))
            ) : (
              <>
                <Button
                  variant={eventsPage === 1 ? "default" : "outline"}
                  onClick={() => setEventsPage(1)}
                  className="w-10 h-10 p-0"
                  size="sm"
                >
                  1
                </Button>
                {eventsPage > 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}

                {Array.from({ length: 3 }, (_, i) => {
                  const pageNum = eventsPage - 1 + i;
                  if (pageNum > 1 && pageNum < eventsTotalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={eventsPage === pageNum ? "default" : "outline"}
                        onClick={() => setEventsPage(pageNum)}
                        className="w-10 h-10 p-0"
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}

                {eventsPage < eventsTotalPages - 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                {eventsTotalPages > 1 && (
                  <Button
                    variant={eventsPage === eventsTotalPages ? "default" : "outline"}
                    onClick={() => setEventsPage(eventsTotalPages)}
                    className="w-10 h-10 p-0"
                    size="sm"
                  >
                    {eventsTotalPages}
                  </Button>
                )}
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setEventsPage(prev => Math.min(eventsTotalPages, prev + 1))}
            disabled={eventsPage === eventsTotalPages}
            className="flex items-center gap-2 px-4"
          >
            <span>Next</span>
          </Button>
        </div>
      )}

      {/* Group Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">{t("addFriendsToGroup")}</DialogTitle>
            <DialogDescription>{t("inviteFriendsDescription")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearchFriends} className="flex gap-2 mb-4 mt-4">
            <Input
              type="email"
              placeholder={t("searchByEmail")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 focus:ring-2 focus:ring-gray-500"
            />            <Button
              type="submit"
              disabled={friendLoading.search || !searchEmail}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
            >
              {friendLoading.search ? t("searching") : t("search")}
              <Search size={16} />
            </Button>
          </form>          {/* Search Results */}
          {searchResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t("searchResults")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={searchResult.user?.profilePicture || "/placeholder.svg"} alt={searchResult.user?.name} />
                      <AvatarFallback>{searchResult.user?.name?.charAt(0) || searchResult.user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{searchResult.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{searchResult.user?.email}</p>
                      {searchResult.isAlreadyFriend && (
                        <p className="text-xs text-green-600">{t("alreadyFriends")}</p>
                      )}
                      {searchResult.hasPendingRequest && (
                        <p className="text-xs text-orange-600">
                          {searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {searchResult.isAlreadyFriend ? (
                      <Button
                        size="sm"
                        onClick={() => addGroupMember(searchResult.user)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserPlus size={14} />
                        {t("add")}
                      </Button>
                    ) : searchResult.hasPendingRequest ? (
                      <Button
                        size="sm"
                        disabled
                        className="flex items-center gap-1 bg-gray-400 text-white cursor-not-allowed"
                      >
                        {searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSendFriendRequest(searchResult.user._id)}
                          disabled={friendLoading.action}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          <UserPlus size={14} />
                          {friendLoading.action ? t("sending") : t("sendRequest")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addGroupMember(searchResult.user)}
                          className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
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
          {error.search && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error.search}</p>
            </div>
          )}

          {/* Existing Friends List */}
          {showFriendsList && friends.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{t("yourFriends")}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFriendsList(!showFriendsList)}
                  className="text-xs text-gray-600"
                >
                  {showFriendsList ? t("hide") : t("show")}
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {friends
                  .filter(friend => !groupMembers.some(member => member._id === friend._id))
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
                        onClick={() => addGroupMember(friend)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
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
          {friendLoading.friends && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <p className="text-gray-600 text-sm">{t("loadingFriends")}</p>
            </div>
          )}

          {/* Group Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("yourGroup")} ({groupMembers.length + 1})
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
            </div>            <AnimatePresence>
              {groupMembers.map((member) => (
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
                    onClick={() => removeGroupMember(member._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <UserX size={14} />
                    {t("remove")}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {groupMembers.length === 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">{t("noFriendsYet")}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setShowGroupDialog(false)} className="bg-black hover:bg-gray-800 text-white">
              {t("done")}
            </Button>          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
