"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Star, Clock, ArrowLeft, ShoppingBag, Hotel, ChevronRight, Check, X } from 'lucide-react'
import { Checkbox } from "../components/ui/checkbox"
import { useSelector } from "react-redux"
import { Modal } from "antd"
import mock_adventure from "../Data/mock_adventure.json"
import mock_instructor from "../Data/mock_instructor.json"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ShopSection } from "./shop-selection"
import { HotelSection } from "./hotel-selection"
import "./booking.css"

const InstructorCard = ({ instructor, onViewClick }) => (
  <motion.div
    className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-300"
    whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <img
      src={instructor.profile_photo || "/placeholder.svg?height=100&width=100"}
      alt={instructor.name}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
      <h3 className="text-lg font-semibold text-gray-800">{instructor.name}</h3>
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <RatingStars rating={instructor.ratings} />
        <span className="text-sm text-gray-600">{instructor.ratings}</span>
      </div>
    </div>
    <div className="text-center sm:text-right mt-3 sm:mt-0">
      <p className="text-blue-600 font-semibold mb-2">${instructor.charges}</p>
      <button
        onClick={onViewClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        View
      </button>
    </div>
  </motion.div>
)

// Rating stars component
const RatingStars = ({ rating }) => (
  <div className="flex">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
        />
      ))}
  </div>
)

// Profile edit form component
const ProfileEditForm = ({ profileData, onSubmit, onCancel }) => (
  <Modal 
    title="Edit Profile Details" 
    open={true} 
    onCancel={onCancel} 
    footer={null} 
    className="professional-modal"
    width="90%"
    style={{ maxWidth: "500px" }}
  >
    <form className="space-y-4 py-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={profileData.name}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={profileData.email}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={profileData.phone}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Update Profile
      </button>
    </form>
  </Modal>
)

// Progress steps component
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Select Instructor", icon: Star },
    { id: 2, name: "Shop & Hotels", icon: ShoppingBag },
    { id: 3, name: "Confirm Booking", icon: Check },
  ]

  return (
    <div className="w-full py-4 sm:py-6 overflow-x-auto">
      <div className="flex items-center justify-center min-w-max">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <motion.div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                currentStep >= step.id ? "bg-blue-600" : "bg-gray-200"
              } transition-colors duration-300`}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <step.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentStep >= step.id ? "text-white" : "text-gray-500"}`} />
            </motion.div>

            {/* Step name */}
            <div className="hidden sm:block ml-2 mr-4 lg:mr-8">
              <p className={`text-xs sm:text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 w-16 sm:w-24 lg:w-32 h-1 mx-1 sm:mx-2 lg:mx-4 bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                  style={{ width: currentStep > step.id ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main component
export const Booking = () => {
  const { user } = useSelector((state) => state.user)
  const location = useLocation()
  const query = new URLSearchParams(location?.search)
  const id = query.get("id")

  // Find adventure and related instructors
  const adventure = mock_adventure.find((item) => item.id === Number(id))
  const instructorList = mock_instructor.filter((instructor) => instructor.adventure === adventure?.name)

  // State management
  const [isChecked, setIsChecked] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInstructorModal, setShowInstructorModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 234 567 8900",
  })
  const [bookingSummary, setBookingSummary] = useState({
    adventure: adventure?.name || "Adventure",
    date: "2025-02-26",
    instructor: "",
    price: adventure?.price || "0",
    items: [],
    hotel: null,
  })

  // Calculate fees
  const instructorFee = selectedInstructor?.charges || 0
  const itemsTotal = selectedItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  const hotelFee = selectedHotel?.price || 0
  const platformFee = Math.ceil((instructorFee + itemsTotal + hotelFee) * 0.12)
  const totalFee = Math.ceil((instructorFee + itemsTotal + hotelFee) * 1.12)

  // Effects
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Update booking summary when instructor changes
    if (selectedInstructor) {
      setBookingSummary((prev) => ({
        ...prev,
        instructor: selectedInstructor.name,
      }))
    }
  }, [selectedInstructor])

  useEffect(() => {
    // Update booking summary when items or hotel changes
    setBookingSummary((prev) => ({
      ...prev,
      items: selectedItems,
      hotel: selectedHotel,
    }))
  }, [selectedItems, selectedHotel])

  // Event handlers
  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor)
    setIsChecked(true)
    setShowInstructorModal(false)
    setCurrentStep(2)
  }

  const handleCancelInstructor = () => {
    setSelectedInstructor(null)
    setIsChecked(false)
    setCurrentStep(1)
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setProfileData({
      name: formData.get("name"),
      email: user?.email || formData.get("email"),
      phone: formData.get("phone"),
    })
    setShowProfileEdit(false)
  }

  const handleConfirmBooking = () => {
    console.log("Booking confirmed:", {
      ...bookingSummary,
      totalFee,
      user: profileData,
    })
  }

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 2) {
        setSelectedInstructor(null)
      }
    } else {
      window.history.back()
    }
  }

  const handleViewInstructor = (instructor) => {
    setSelectedInstructor(instructor)
    setShowInstructorModal(true)
  }

  const handleAddItem = (item) => {
    setSelectedItems((prev) => [...prev, item])
  }

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel)
  }

  const handleProceedToBooking = () => {
    setCurrentStep(3)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <button 
            onClick={handleGoBack}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          Book Your Adventure
        </h1>

        <ProgressSteps currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Section - Adventure Details */}
          <div className="w-full lg:w-2/5 space-y-4 sm:space-y-6 flex flex-col justify-between">
            {adventure ? (
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={adventure.img || "/placeholder.svg?height=400&width=600"}
                  alt={adventure.name}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{adventure.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{adventure.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{adventure.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <p className="text-lg text-gray-600">Adventure not found!</p>
              </div>
            )}

            <motion.div
              className="bg-white rounded-lg shadow-md p-4 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Location</h3>
              <div className="aspect-w-16 aspect-h-9 mb-3 sm:mb-4">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Location map"
                  className="rounded-lg object-cover w-full"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Our adventure takes place in a scenic location with breathtaking views and exciting challenges.
              </p>
            </motion.div>
          </div>

          {/* Right Section - Instructors, Shop, Hotels & Form */}
          <div className="w-full lg:w-3/5">
            {/* Step 1: Instructor Selection */}
            <AnimatePresence>
              {currentStep === 1 && (
                <motion.div
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Select Your Instructor</h2>
                  {instructorList.length === 0 ? (
                    <p className="text-gray-600 text-center p-4">No instructors available for this adventure.</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {instructorList.map((instructor) => (
                        <InstructorCard
                          key={instructor.id}
                          instructor={instructor}
                          onViewClick={() => handleViewInstructor(instructor)}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Shop & Hotels */}
            <AnimatePresence>
              {currentStep === 2 && (
                <motion.div
                  className="space-y-6 sm:space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Selected Instructor Summary */}
                  <motion.div
                    className="bg-white rounded-lg shadow-md p-3 sm:p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedInstructor?.profile_photo || "/placeholder.svg?height=100&width=100"}
                          alt={selectedInstructor?.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-sm sm:text-base font-medium">
                            Selected Instructor: <span className="text-blue-600">{selectedInstructor?.name}</span>
                          </h3>
                          <div className="flex items-center gap-1">
                            <RatingStars rating={selectedInstructor?.ratings || 0} />
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleCancelInstructor} 
                        className="text-blue-600 hover:text-blue-800 text-sm self-end sm:self-auto"
                      >
                        Change
                      </button>
                    </div>
                  </motion.div>

                  {/* Shop Section */}
                  <ShopSection
                    selectedItems={selectedItems}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                  />

                  {/* Hotels Section */}
                  <HotelSection selectedHotel={selectedHotel} onSelectHotel={handleSelectHotel} />

                  {/* Proceed Button */}
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center sm:justify-start gap-2"
                    >
                      Proceed to Booking <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Booking Form */}
            <AnimatePresence>
              {currentStep === 3 && (
                <motion.div
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Booking Form</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Profile Section */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="title flex justify-between items-center">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Profile</h3>
                        <button
                          onClick={() => setShowProfileEdit(true)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-xs sm:text-sm"
                        >
                          Edit Profile
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                          <img
                            src="/placeholder.svg?height=100&width=100"
                            alt="Your profile"
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="text-sm sm:text-base text-gray-800 font-semibold">{profileData.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{user?.email || profileData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Instructor Section */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="title flex justify-between items-center">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Selected Instructor</h3>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-blue-500 hover:text-gray-800 text-xs sm:text-sm transition-colors duration-300"
                        >
                          Change Instructor
                        </button>
                      </div>

                      {selectedInstructor && (
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <img
                              src={selectedInstructor.profile_photo || "/placeholder.svg?height=100&width=100"}
                              alt={selectedInstructor.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="text-sm sm:text-base text-gray-800 font-semibold">{selectedInstructor.name}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <span className="text-xs sm:text-sm text-gray-600">{selectedInstructor.ratings}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Items & Hotel */}
                  {(selectedItems.length > 0 || selectedHotel) && (
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Your Selections</h3>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 space-y-3 sm:space-y-4">
                        {selectedItems.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4" /> Selected Items
                            </h4>
                            <div className="space-y-2">
                              {selectedItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-2 bg-white rounded border border-gray-100"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0"
                                    />
                                    <span className="text-xs sm:text-sm truncate">{item.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                      ${item.price} × {item.quantity || 1}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      aria-label="Remove item"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedHotel && (
                          <div>
                            <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Hotel className="w-4 h-4" /> Selected Hotel
                            </h4>
                            <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <img
                                  src={selectedHotel.image || "/placeholder.svg"}
                                  alt={selectedHotel.name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0"
                                />
                                <span className="text-xs sm:text-sm truncate">{selectedHotel.name}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">${selectedHotel.price}/night</span>
                                <button
                                  onClick={() => setSelectedHotel(null)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  aria-label="Remove hotel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            onClick={() => setCurrentStep(2)}
                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                          >
                            Modify Selections
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Booking Summary</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">Adventure:</span>
                        <span className="text-sm sm:text-base text-gray-800 font-medium">{bookingSummary.adventure}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">Date:</span>
                        <span className="text-sm sm:text-base text-gray-800 font-medium">{bookingSummary.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">Instructor:</span>
                        <span className="text-sm sm:text-base text-gray-800 font-medium">{bookingSummary.instructor}</span>
                      </div>
                      <div className="flex flex-col pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-800 font-semibold">Instructor Charges:</span>
                          <span className="text-sm sm:text-base text-blue-600 font-bold">${instructorFee}</span>
                        </div>
                        {itemsTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm sm:text-base text-gray-800 font-semibold">Equipment Charges:</span>
                            <span className="text-sm sm:text-base text-blue-600 font-bold">${itemsTotal}</span>
                          </div>
                        )}
                        {hotelFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm sm:text-base text-gray-800 font-semibold">Hotel Charges:</span>
                            <span className="text-sm sm:text-base text-blue-600 font-bold">${hotelFee}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-800 font-semibold">Platform fee:</span>
                          <span className="text-sm sm:text-base text-blue-600 font-bold">${platformFee}</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                          <span className="text-sm sm:text-base text-gray-800 font-semibold">Total Charges:</span>
                          <span className="text-base sm:text-xl text-blue-600 font-bold">${totalFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agreement"
                        checked={isChecked}
                        onClick={() => setIsChecked(!isChecked)}
                        className="mt-1"
                      />
                      <label htmlFor="agreement" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                        I agree to the terms and conditions, including the privacy policy and the use of my data for
                        processing this booking.
                      </label>
                    </div>

                    <motion.button
                      className={`w-full py-2 sm:py-3 rounded-md font-medium text-white transition-all duration-300 ${
                        isChecked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isChecked}
                      onClick={handleConfirmBooking}
                      whileHover={isChecked ? { scale: 1.02 } : {}}
                      whileTap={isChecked ? { scale: 0.98 } : {}}
                    >
                      Confirm Booking
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <ProfileEditForm
          profileData={profileData}
          onSubmit={handleProfileUpdate}
          onCancel={() => setShowProfileEdit(false)}
        />
      )}

      {/* Instructor Profile Modal */}
      <Modal
        open={showInstructorModal}
        onCancel={() => {
          setShowInstructorModal(false)
          setSelectedInstructor(null)
        }}
        width="95%"
        style={{ maxWidth: "1280px" }}
        footer={null}
        className="instructor-profile-modal"
      >
        {selectedInstructor && (
          <div className="py-2 px-2 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Instructor Profile</h2>
              <button
                onClick={() => {
                  setShowInstructorModal(false)
                  setSelectedInstructor(null)
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Close modal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 mx-auto">
              {/* Left side - Profile photo and about */}
              <div className="w-full md:w-1/3">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4">
                    <img
                      src={selectedInstructor.profile_photo || "/placeholder.svg?height=200&width=200"}
                      alt={selectedInstructor.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{selectedInstructor.name}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <RatingStars rating={selectedInstructor.ratings} />
                        <span className="text-xs sm:text-sm text-gray-600">{selectedInstructor.ratings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">About</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedInstructor.about ||
                        "Experienced adventure instructor with a passion for outdoor activities and safety. Specialized in guiding beginners and advanced adventurers through challenging terrains while ensuring a memorable experience."}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Contact</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Email: {selectedInstructor.email || "instructor@example.com"}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Experience: {selectedInstructor.experience || "5+ years"}</p>
                  </div>
                </div>
              </div>

              {/* Right side - Photos, videos, certificates, badges, past adventures */}
              <div className="space-y-4 sm:space-y-6 w-full md:w-2/3">
                {/* Photos & Videos */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Photos & Videos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="aspect-square rounded-md overflow-hidden">
                        <img
                          src="https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg"
                          alt={`Instructor activity ${item}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates & Badges */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Certificates & Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Safety Expert", "First Aid", "Mountain Guide", "Water Rescue"].map((badge) => (
                      <span key={badge} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Past Adventures */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Past Adventures</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { name: "Mountain Climbing", date: "Jan 2023", participants: 12 },
                      { name: "River Rafting", date: "Mar 2023", participants: 8 },
                      { name: "Jungle Trek", date: "May 2023", participants: 15 },
                    ].map((adventure, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-white rounded border border-gray-100"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-800">{adventure.name}</p>
                          <p className="text-xs text-gray-500">{adventure.date}</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">{adventure.participants} participants</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Instructor Button */}
                <button
                  onClick={() => handleSelectInstructor(selectedInstructor)}
                  className="w-full bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
                >
                  Select This Instructor
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}
