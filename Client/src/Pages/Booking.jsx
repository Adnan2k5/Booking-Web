"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useNavigate, useLocation } from "react-router-dom"
import {
  MapPin,
  Star,
  ArrowLeft,
  ChevronRight,
  Building,
  Check,
  Users,
  ShoppingCart,
  ClipboardCheck,
  Plus,
  Minus,
  Eye,
  Award,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import mock_adventure from "../Data/mock_adventure"
import { useAuth } from "./AuthProvider"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import LanguageSelector from "../components/LanguageSelector"
import { Navbar } from "../components/Navbar"

// Mock data for items
const mockItems = [
  {
    id: 1,
    name: "Adventure Backpack",
    price: 89.99,
    rentalPrice: 15.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    canRent: true,
  },
  {
    id: 2,
    name: "Hiking Boots",
    price: 129.99,
    rentalPrice: 25.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    canRent: true,
  },
  {
    id: 3,
    name: "Water Bottle",
    price: 24.99,
    rentalPrice: null,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    canRent: false,
  },
  {
    id: 4,
    name: "Camping Tent",
    price: 199.99,
    rentalPrice: 45.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    canRent: true,
  },
]

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Mountain View Resort",
    price: 189,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    location: "Alpine Heights",
  },
  {
    id: 2,
    name: "Lakeside Retreat",
    price: 159,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    location: "Crystal Lake",
  },
  {
    id: 3,
    name: "Forest Cabin Lodge",
    price: 129,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    location: "Evergreen Forest",
  },
  {
    id: 4,
    name: "Sunset Beach Hotel",
    price: 219,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    location: "Golden Coast",
  },
]

// Mock data for instructors
const mockInstructors = [
  {
    id: 1,
    name: "Alex Johnson",
    specialty: "Mountain Hiking",
    experience: "8 years",
    rating: 4.9,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Certified mountain guide with expertise in alpine terrain and wilderness survival.",
    achievements: ["Summit of Mt. Everest", "Led 200+ expeditions", "Wilderness First Responder"],
    languages: ["English", "Spanish", "French"],
    reviews: ["Warrior Training", "Survival Skills"],
    price: 50,
    gallery: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    certificates: ["Mountain Guide Certification", "First Aid Certification", "Avalanche Safety"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Rock Climbing",
    experience: "6 years",
    rating: 4.8,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Professional climber with experience leading expeditions across three continents.",
    achievements: ["Free-climbed El Capitan", "National Climbing Champion", "Authored 'Vertical World'"],
    languages: ["English", "Mandarin", "German"],
    reviews: ["Warrior Training", "Survival Skills"],
    price: 80,
    gallery: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    certificates: ["Rock Climbing Instructor", "Rescue Techniques", "Advanced First Aid"],
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    specialty: "Wilderness Survival",
    experience: "10 years",
    rating: 4.7,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Former military survival expert specializing in natural navigation and foraging.",
    achievements: ["Military Survival Instructor", "Survived 30 days in the Amazon", "TV Show Consultant"],
    languages: ["English", "Spanish", "Portuguese"],
    reviews: ["Warrior Training", "Survival Skills"],
    price: 40,
    gallery: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    certificates: ["Wilderness Survival Expert", "Navigation Specialist", "Foraging Certification"],
  },
  {
    id: 4,
    name: "Emma Wilson",
    specialty: "Nature Photography",
    experience: "5 years",
    rating: 4.6,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Award-winning photographer who combines adventure with capturing stunning landscapes.",
    achievements: [
      "National Geographic Feature",
      "Wildlife Photographer of the Year Finalist",
      "Published in 'Outdoor Magazine'",
    ],
    languages: ["English", "Italian"],
    reviews: ["Warrior Training", "Survival Skills"],
    price: 60,
    gallery: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    certificates: ["Professional Photography", "Wildlife Photography", "Digital Editing"],
  },
]

export default function BookingFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [selectedHotel, setSelectedHotel] = useState()
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adventure, setAdventure] = useState()
  const [isInstructorDialogOpen, setIsInstructorDialogOpen] = useState(false)
  const [currentInstructor, setCurrentInstructor] = useState()
  const [groupMembers, setGroupMembers] = useState([])
  const [activeGalleryImage, setActiveGalleryImage] = useState(0)
  const [activeTab, setActiveTab] = useState("instructor")

  // Load group members from sessionStorage if available
  useEffect(() => {
    const storedGroupMembers = sessionStorage.getItem("groupMembers")
    if (storedGroupMembers) {
      setGroupMembers(JSON.parse(storedGroupMembers))
    }
  }, [])

  // Parse the adventure ID from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const adventureId = query.get("id")

    if (adventureId) {
      // Find the adventure in mock data
      const foundAdventure = mock_adventure.find((adv) => adv.id.toString() === adventureId)
      if (foundAdventure) {
        setAdventure(foundAdventure)
      } else {
        navigate("/")
      }
    } else {
      navigate("/")
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [location, navigate])

  useEffect(() => {
    if (!user.user) {
      toast(t("pleaseLogin"), { type: "error" })
      navigate("/login")
    }
  }, [user, navigate, t])

  const handleAddToCart = (itemId, isRental = false) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId && item.isRental === isRental)
      if (existingItem) {
        // Increment quantity if item already in cart
        return prev.map((item) =>
          item.id === itemId && item.isRental === isRental ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Add new item with quantity 1
        return [...prev, { id: itemId, quantity: 1, isRental }]
      }
    })
  }

  const handleRemoveFromCart = (itemId, isRental = false) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId && item.isRental === isRental)
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity if more than 1
        return prev.map((item) =>
          item.id === itemId && item.isRental === isRental ? { ...item, quantity: item.quantity - 1 } : item,
        )
      } else {
        // Remove item if quantity would be 0
        return prev.filter((item) => !(item.id === itemId && item.isRental === isRental))
      }
    })
  }

  const handleHotelSelect = (hotelId) => {
    setSelectedHotel((prev) => (prev === hotelId ? null : hotelId))
  }

  const handleInstructorSelect = (instructorId) => {
    const instructor = mockInstructors.find((i) => i.id === instructorId)
    setSelectedInstructor((prev) => (prev?.id === instructorId ? null : instructor))
    setIsInstructorDialogOpen(false)
  }

  const openInstructorDialog = (instructor) => {
    setCurrentInstructor(instructor)
    setActiveGalleryImage(0)
    setIsInstructorDialogOpen(true)
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Proceed to payment/confirmation
      navigate("/confirmation")
    }
  }

  const handleSkip = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate(-1)
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    const itemsPrice = cartItems.reduce((sum, item) => {
      const itemData = mockItems.find((i) => i.id === item.id)
      if (!itemData) return sum

      const price = item.isRental ? itemData.rentalPrice || 0 : itemData.price || 0
      return sum + price * item.quantity
    }, 0)

    const hotelPrice = selectedHotel ? mockHotels.find((hotel) => hotel.id === selectedHotel)?.price || 0 : 0

    // Calculate instructor price
    let instructorPrice = 0
    if (selectedInstructor) {
      // If instructor is selected, use their base price plus additional fee for group members
      instructorPrice = selectedInstructor.price + groupMembers.length * 30
    } else if (groupMembers.length > 0) {
      // If no instructor but there are group members, just charge for the additional members
      instructorPrice = groupMembers.length * 30
    }

    return itemsPrice + hotelPrice + instructorPrice
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
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

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    }),
  }

  // If still loading or adventure not found
  if (isLoading || !adventure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mt-[10vh] mx-auto pt-20 p-4 sm:p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => handleBack()}
            className="flex items-center gap-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{t("back")}</span>
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">{t("bookYourAdventure")}</h1>

          <div className="ml-auto">
            <LanguageSelector variant="minimal" />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { step: 1, icon: <ShoppingCart size={18} />, label: t("shop") },
              { step: 2, icon: <Building size={18} />, label: t("hotel") },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                    currentStep === item.step
                      ? "bg-blue-600 text-white"
                      : currentStep > item.step
                        ? "bg-green-500 text-white"
                        : "bg-white/70 backdrop-blur-sm text-gray-400",
                  )}
                >
                  {currentStep > item.step ? <Check size={18} /> : item.icon}
                </div>
                <span
                  className={cn("text-sm font-medium", currentStep === item.step ? "text-blue-600" : "text-gray-500")}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area with steps */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={currentStep}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 overflow-hidden rounded-xl">
                      <motion.img
                        src={adventure.img || "/placeholder.svg?height=300&width=500"}
                        alt={adventure.name}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin size={16} />
                          <span>{adventure.location}</span>
                          <span className="text-gray-300">•</span>
                          <span>{formatDate(adventure.date)}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{adventure.name}</h2>
                        <div className="flex items-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm ml-1 text-gray-500">4.8</span>
                        </div>
                        <p className="text-gray-600 mb-4">{t("adventureDescription")}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                          +{adventure.exp} EXP
                        </Badge>

                        {groupMembers.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {t("groupSize")}: {groupMembers.length + 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="instructor" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t("instructor")}
                      </TabsTrigger>
                      <TabsTrigger value="shop" className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        {t("shop")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="instructor">
                      <div className="flex items-center gap-2 mb-6">
                        <Users className="text-blue-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">{t("selectInstructor")}</h2>
                        {groupMembers.length > 0 && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            {t("groupOf")} {groupMembers.length + 1}
                          </Badge>
                        )}
                      </div>

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {mockInstructors.map((instructor) => (
                          <motion.div key={instructor.id} variants={itemVariants}>
                            <Card
                              className={cn(
                                "overflow-hidden h-full transition-all duration-300 border-2",
                                selectedInstructor && selectedInstructor.id === instructor.id
                                  ? "border-blue-500 shadow-md shadow-blue-200"
                                  : "border-transparent hover:border-blue-200",
                              )}
                            >
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 p-4 flex justify-center items-start">
                                  <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                    <AvatarImage src={instructor.img || "/placeholder.svg"} alt={instructor.name} />
                                    <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="md:w-2/3 p-4">
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">{instructor.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span>{instructor.specialty}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>{instructor.experience}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-xs ml-1 text-gray-500">{instructor.rating}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{instructor.bio}</p>
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-blue-600">
                                      ${instructor.price + groupMembers.length * 30}
                                      <span className="text-sm font-normal text-gray-500">/session</span>
                                    </span>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => openInstructorDialog(instructor)}
                                      >
                                        <Eye size={14} />
                                        {t("view")}
                                      </Button>
                                      <Button
                                        size="sm"
                                        className={cn(
                                          "flex items-center gap-1",
                                          selectedInstructor && selectedInstructor.id === instructor.id
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-blue-600 hover:bg-blue-700",
                                        )}
                                        onClick={() => handleInstructorSelect(instructor.id)}
                                      >
                                        {selectedInstructor && selectedInstructor.id === instructor.id ? (
                                          <>
                                            <Check size={14} />
                                            {t("selected")}
                                          </>
                                        ) : (
                                          <>
                                            <Plus size={14} />
                                            {t("select")}
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="shop">
                      <div className="flex items-center gap-2 mb-6">
                        <ShoppingCart className="text-blue-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">{t("shopItems")}</h2>
                      </div>

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {mockItems.map((item) => {
                          const buyCartItem = cartItems.find((ci) => ci.id === item.id && !ci.isRental)
                          const rentCartItem = cartItems.find((ci) => ci.id === item.id && ci.isRental)
                          const buyQuantity = buyCartItem ? buyCartItem.quantity : 0
                          const rentQuantity = rentCartItem ? rentCartItem.quantity : 0

                          return (
                            <motion.div key={item.id} variants={itemVariants}>
                              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
                                <div className="relative h-40 overflow-hidden">
                                  <img
                                    src={item.img || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {(buyQuantity > 0 || rentQuantity > 0) && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      {buyQuantity > 0 && (
                                        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                          {t("buy")}: {buyQuantity}
                                        </div>
                                      )}
                                      {rentQuantity > 0 && (
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                          {t("rent")}: {rentQuantity}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg font-bold text-gray-800">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-xs ml-1 text-gray-500">{item.rating}</span>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-blue-600">${item.price}</span>
                                      {buyQuantity > 0 ? (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7 rounded-full"
                                            onClick={() => handleRemoveFromCart(item.id, false)}
                                          >
                                            <Minus size={12} />
                                          </Button>
                                          <span className="w-5 text-center font-medium">{buyQuantity}</span>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7 rounded-full"
                                            onClick={() => handleAddToCart(item.id, false)}
                                          >
                                            <Plus size={12} />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1"
                                          onClick={() => handleAddToCart(item.id, false)}
                                        >
                                          <Plus size={12} />
                                          {t("buy")}
                                        </Button>
                                      )}
                                    </div>

                                    {item.canRent && (
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-green-600">
                                          ${item.rentalPrice} <span className="text-xs">/day</span>
                                        </span>
                                        {rentQuantity > 0 ? (
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              className="h-7 w-7 rounded-full"
                                              onClick={() => handleRemoveFromCart(item.id, true)}
                                            >
                                              <Minus size={12} />
                                            </Button>
                                            <span className="w-5 text-center font-medium">{rentQuantity}</span>
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              className="h-7 w-7 rounded-full"
                                              onClick={() => handleAddToCart(item.id, true)}
                                            >
                                              <Plus size={12} />
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAddToCart(item.id, true)}
                                          >
                                            <Plus size={12} />
                                            {t("rent")}
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </motion.div>

                      {/* Cart Summary */}
                      {cartItems.length > 0 && (
                        <motion.div
                          className="mt-8 bg-blue-50 rounded-xl p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourCart")}</h3>
                          <div className="space-y-3">
                            {cartItems.map((cartItem) => {
                              const item = mockItems.find((i) => i.id === cartItem.id)
                              const price = cartItem.isRental ? item?.rentalPrice : item?.price
                              return (
                                <div
                                  key={`${cartItem.id}-${cartItem.isRental ? "rent" : "buy"}`}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                      <img
                                        src={item?.img || "/placeholder.svg"}
                                        alt={item?.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {item?.name}{" "}
                                        {cartItem.isRental && (
                                          <span className="text-xs text-green-600">({t("rental")})</span>
                                        )}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {t("qty")}: {cartItem.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="font-medium text-blue-600">
                                    ${((price || 0) * cartItem.quantity).toFixed(2)}
                                  </div>
                                </div>
                              )
                            })}
                            <div className="pt-3 border-t border-blue-200 flex justify-between items-center font-bold">
                              <span>{t("cartTotal")}</span>
                              <span className="text-blue-600">
                                $
                                {cartItems
                                  .reduce((sum, item) => {
                                    const itemData = mockItems.find((i) => i.id === item.id)
                                    const price = item.isRental ? itemData?.rentalPrice : itemData?.price
                                    return sum + (price || 0) * item.quantity
                                  }, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <Building className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">{t("selectAccommodation")}</h2>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {mockHotels.map((hotel) => (
                      <motion.div key={hotel.id} variants={itemVariants}>
                        <Card
                          className={cn(
                            "overflow-hidden h-full transition-all duration-300 cursor-pointer border-2",
                            selectedHotel === hotel.id
                              ? "border-blue-500 shadow-md shadow-blue-200"
                              : "border-transparent hover:border-blue-200",
                          )}
                          onClick={() => handleHotelSelect(hotel.id)}
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
                </div>

                {/* Booking Summary */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardCheck className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">{t("bookingSummary")}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - User and Adventure */}
                    <div>
                      {/* User Profile */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourProfile")}</h3>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-white shadow-md bg-gradient-to-r from-blue-600 to-cyan-500">
                            <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{user?.user?.email}</p>
                            <p className="text-sm text-gray-500">{t("adventureEnthusiast")}</p>
                          </div>
                        </div>
                      </div>

                      {/* Adventure Details */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("adventureDetails")}</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={adventure.img || "/placeholder.svg"}
                                alt={adventure.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{adventure.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{adventure.location}</span>
                                <span className="text-gray-300">•</span>
                                <span>{formatDate(adventure.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Instructor Details (if selected) */}
                      {selectedInstructor && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourInstructor")}</h3>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                              <AvatarImage
                                src={selectedInstructor.img || "/placeholder.svg"}
                                alt={selectedInstructor.name}
                              />
                              <AvatarFallback>{selectedInstructor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">{selectedInstructor.name}</p>
                              <p className="text-sm text-gray-500">{selectedInstructor.specialty}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                            <span className="text-gray-600">{t("instructorFee")}</span>
                            <span className="font-medium">${selectedInstructor.price}</span>
                          </div>
                          {groupMembers.length > 0 && (
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-gray-600">{t("additionalGroupFee")}</span>
                              <span className="font-medium">${groupMembers.length * 30}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Group Members */}
                      {groupMembers.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6 mt-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourGroup")}</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-md bg-gradient-to-r from-blue-600 to-cyan-500">
                                <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{user?.user?.email}</p>
                                <p className="text-sm text-gray-500">{t("groupLeader")}</p>
                              </div>
                            </div>

                            {groupMembers.map((member) => (
                              <div key={member.id} className="flex items-start gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{member.name}</p>
                                  <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                              <span className="text-gray-600">{t("groupSize")}</span>
                              <span className="font-medium">
                                {groupMembers.length + 1} {t("people")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right column - Items, Hotel, and Total */}
                    <div>
                      {/* Selected Items */}
                      {cartItems.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("selectedItems")}</h3>
                          <div className="space-y-3">
                            {cartItems.map((cartItem) => {
                              const item = mockItems.find((i) => i.id === cartItem.id)
                              const price = cartItem.isRental ? item?.rentalPrice : item?.price
                              return (
                                <div
                                  key={`${cartItem.id}-${cartItem.isRental ? "rent" : "buy"}`}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={item?.img || "/placeholder.svg"}
                                      alt={item?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      {item?.name}{" "}
                                      {cartItem.isRental && (
                                        <span className="text-xs text-green-600">({t("rental")})</span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {t("qty")}: {cartItem.quantity}
                                    </p>
                                  </div>
                                  <div className="font-medium text-blue-600">
                                    ${((price || 0) * cartItem.quantity).toFixed(2)}
                                  </div>
                                </div>
                              )
                            })}
                            <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                              <span className="text-gray-600">{t("itemsTotal")}</span>
                              <span className="font-medium">
                                $
                                {cartItems
                                  .reduce((sum, item) => {
                                    const itemData = mockItems.find((i) => i.id === item.id)
                                    const price = item.isRental ? itemData?.rentalPrice : itemData?.price
                                    return sum + (price || 0) * item.quantity
                                  }, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Selected Hotel */}
                      {selectedHotel && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("selectedAccommodation")}</h3>
                          <div className="flex items-start gap-3">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={mockHotels.find((h) => h.id === selectedHotel)?.img || "/placeholder.svg"}
                                alt={mockHotels.find((h) => h.id === selectedHotel)?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {mockHotels.find((h) => h.id === selectedHotel)?.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{mockHotels.find((h) => h.id === selectedHotel)?.location}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-xs ml-1 text-gray-500">
                                  {mockHotels.find((h) => h.id === selectedHotel)?.rating}
                                </span>
                              </div>
                            </div>
                            <div className="font-medium text-blue-600">
                              ${mockHotels.find((h) => h.id === selectedHotel)?.price}
                              <span className="text-xs font-normal text-gray-500">/night</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Summary */}
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">{t("paymentSummary")}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span>{t("adventure")}</span>
                            <span>{t("included")}</span>
                          </div>

                          {cartItems.length > 0 && (
                            <div className="flex justify-between items-center">
                              <span>
                                {t("items")} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                              </span>
                              <span>
                                $
                                {cartItems
                                  .reduce((sum, item) => {
                                    const itemData = mockItems.find((i) => i.id === item.id)
                                    const price = item.isRental ? itemData?.rentalPrice : itemData?.price
                                    return sum + (price || 0) * item.quantity
                                  }, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          )}

                          {selectedHotel && (
                            <div className="flex justify-between items-center">
                              <span>{t("hotel")}</span>
                              <span>${mockHotels.find((h) => h.id === selectedHotel)?.price}</span>
                            </div>
                          )}

                          {selectedInstructor && (
                            <div className="flex justify-between items-center">
                              <span>
                                {t("instructor")} ({groupMembers.length + 1} {t("people")})
                              </span>
                              <span>${selectedInstructor.price + groupMembers.length * 30}</span>
                            </div>
                          )}

                          {!selectedInstructor && groupMembers.length > 0 && (
                            <div className="flex justify-between items-center">
                              <span>
                                {t("groupFee")} ({groupMembers.length} {t("additionalPeople")})
                              </span>
                              <span>${groupMembers.length * 30}</span>
                            </div>
                          )}
                        </div>

                        <Separator className="bg-white/20 my-4" />

                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>{t("total")}</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <Button
                          onClick={() => navigate("/confirmation")}
                          className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50"
                        >
                          {t("proceedToPayment")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons (only show if not on summary page) */}
        {currentStep < 2 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              {t("back")}
            </Button>

            <div className="flex gap-3">
              {currentStep < 2 && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
                >
                  {t("skip")}
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2"
              >
                {currentStep === 1 ? t("reviewBooking") : t("next")}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructor Dialog */}
      <Dialog open={isInstructorDialogOpen} onOpenChange={setIsInstructorDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white rounded-xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">{currentInstructor?.name}</DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Photo and Gallery */}
              <div className="md:w-1/2">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
                    <TabsTrigger value="gallery">{t("gallery")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile" className="mt-4">
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={currentInstructor?.img || "/placeholder.svg"}
                        alt={currentInstructor?.name}
                        className="w-full aspect-[3/4] object-cover rounded-xl"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="gallery" className="mt-4">
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={currentInstructor?.gallery?.[activeGalleryImage] || "/placeholder.svg"}
                          alt={`${currentInstructor?.name} gallery`}
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {currentInstructor?.gallery?.map((img, index) => (
                          <div
                            key={index}
                            className={`rounded-lg overflow-hidden cursor-pointer border-2 ${activeGalleryImage === index ? "border-blue-500" : "border-transparent"}`}
                            onClick={() => setActiveGalleryImage(index)}
                          >
                            <img src={img || "/placeholder.svg"} alt="" className="w-full h-16 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{t("about")}</h3>
                  <p className="text-gray-600">{currentInstructor?.bio}</p>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{t("languages")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentInstructor?.languages?.map((language, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="md:w-1/2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <span>{currentInstructor?.specialty}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex w-full items-center gap-1">
                        <Clock size={14} />
                        <span>{currentInstructor?.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:mr-8 bg-blue-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{currentInstructor?.rating}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{t("achievements")}</h3>
                    <ul className="space-y-2">
                      {currentInstructor?.achievements?.map((achievement, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{t("certificates")}</h3>
                    <ul className="space-y-2">
                      {currentInstructor?.certificates?.map((certificate, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Award size={14} className="text-blue-500 mt-1 flex-shrink-0" />
                          <span>{certificate}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{t("contactInstructor")}</h3>
                    <Button className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                      <MessageCircle size={16} />
                      {t("sendMessage")}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-5 md:gap-0 md:flex-row justify-between items-center">
                  <div className="font-bold text-blue-600 text-xl">
                    ${currentInstructor?.price + groupMembers.length * 30}
                    <span className="text-sm font-normal text-gray-500">/session</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className={cn(
                        "flex items-center gap-1 bg-gradient-to-r",
                        selectedInstructor && selectedInstructor.id === currentInstructor?.id
                          ? "from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                          : "from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
                      )}
                      onClick={() => {
                        handleInstructorSelect(currentInstructor?.id)
                      }}
                    >
                      {selectedInstructor && selectedInstructor.id === currentInstructor?.id ? (
                        <>
                          <Check size={14} />
                          {t("selected")}
                        </>
                      ) : (
                        <>
                          <Heart size={14} />
                          {t("selectInstructor")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
