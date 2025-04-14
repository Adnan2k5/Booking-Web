"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useLocation, useNavigate } from "react-router-dom"
import {
  CalendarIcon,
  MapPin,
  Star,
  X,
  Search,
  Filter,
  ArrowLeft,
  Compass,
  Wind,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { cn } from "../lib/utils.js"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "antd"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Skeleton } from "../components/ui/skeleton"
import mock_adventure from "../Data/mock_adventure"
import { useAuth } from "./AuthProvider.jsx"
import { Loader } from "../components/Loader.jsx"

export default function BrowsingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location?.search)
  const [isLoading, setIsLoading] = useState(true)
  const [adventure, setAdventure] = useState(query.get("adventure")?.toLowerCase() || "")
  const [loc, setLoc] = useState(query.get("location")?.toLowerCase() || "")
  const [date, setDate] = useState(() => {
    const queryDate = query.get("date")
    return queryDate ? new Date(queryDate) : undefined
  })
  const [activeCategory, setActiveCategory] = useState("all")
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const categoriesRef = useRef(null)

  const categories = [
    { id: "all", name: "All", icon: <Compass /> },
    { id: "hiking", name: "Hiking", icon: <Wind /> },
    { id: "water", name: "Water Sports", icon: <Sparkles /> },
    { id: "camping", name: "Camping", icon: <Compass /> },
    { id: "climbing", name: "Climbing", icon: <Wind /> },
    { id: "cycling", name: "Cycling", icon: <Sparkles /> },
  ]

  const onPanelChange = (value) => {
    console.log(value.format("YYYY-MM-DD"))
  }

  const wrapperStyle = {
    width: 300,
    border: `1px solid #e2e8f0`,
    borderRadius: "0.375rem",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])


  const { user, loading } = useAuth();
  // Background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const bubbles = document.querySelectorAll(".bubble")
      bubbles.forEach((bubble) => {
        const randomX = Math.random() * 20 - 10
        bubble.style.transform = `translate(${randomX}px, -5px)`
        setTimeout(() => {
          bubble.style.transform = "translate(0, 0)"
        }, 500)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle category scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (categoriesRef.current) {
        const { scrollWidth, scrollLeft, clientWidth } = categoriesRef.current
        setShowScrollIndicator(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 20)
      }
    }

    const categoryContainer = categoriesRef.current
    if (categoryContainer) {
      categoryContainer.addEventListener("scroll", handleScroll)
      handleScroll() // Check initially
    }

    return () => {
      if (categoryContainer) {
        categoryContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const adv = mock_adventure

  const filteredAdventures = adv.filter((adventureItem) => {
    const matchesAdventure = !adventure || adventure === "all" || adventureItem.name.toLowerCase().includes(adventure)
    const matchesLoc = !loc || loc === "all" || adventureItem.location.toLowerCase().includes(loc)

    const matchesCategory =
      activeCategory === "all" || (adventureItem.category && adventureItem.category === activeCategory)

    // Safe date comparison
    let matchesDate = true
    if (date && date instanceof Date && !isNaN(date)) {
      const advDate = new Date(adventureItem.date)
      if (advDate instanceof Date && !isNaN(advDate)) {
        matchesDate = format(advDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      }
    }

    return matchesAdventure && matchesLoc && matchesDate && matchesCategory
  })

  const onBook = (id) => {
    navigate(`/booking?id=${id}`)
  }

  const clearFilter = (type) => {
    switch (type) {
      case "adventure":
        setAdventure("")
        break
      case "location":
        setLoc("")
        break
      case "date":
        setDate(undefined)
        break
      case "all":
        setAdventure("")
        setLoc("")
        setDate(undefined)
        setActiveCategory("all")
        break
      default:
        break
    }
  }

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

  const handleDateChange = (value) => {
    if (value) {
      // Ensure we're working with a proper Date object
      const selectedDate = new Date(value.format("YYYY-MM-DD"))
      setDate(selectedDate)
    } else {
      setDate(undefined)
    }
  }

  const formatDate = (dateString) => {
    try {
      // Safely parse the date string
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bubble absolute top-[10%] left-[15%] w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-[80px] transition-transform duration-1000 ease-in-out"></div>
        <div className="bubble absolute top-[40%] left-[60%] w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-[100px] transition-transform duration-1000 ease-in-out"></div>
        <div className="bubble absolute bottom-[10%] right-[20%] w-72 h-72 bg-cyan-200 rounded-full opacity-20 blur-[90px] transition-transform duration-1000 ease-in-out"></div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-[20%] left-[30%] w-2 h-2 bg-blue-400 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-[50%] left-[70%] w-3 h-3 bg-purple-400 rounded-full opacity-60"
          animate={{
            y: [0, -30, 0],
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-[70%] left-[20%] w-2 h-2 bg-cyan-400 rounded-full opacity-60"
          animate={{
            y: [0, -25, 0],
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header with back button and user info */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <Loader />
            ) : (
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-full text-white font-medium shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.user?.email.charAt(0).toUpperCase()}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Main title with animation */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Adventures
          </h1>
          <p className="text-gray-600 mt-2">Find your next unforgettable experience</p>
        </motion.div>

        {/* Search and filter section */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={
                  adventure ? adventure.charAt(0).toUpperCase() + adventure.slice(1) : "Search adventures..."
                }
                value={adventure}
                onChange={(e) => setAdventure(e.target.value.toLowerCase())}
                className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
              {adventure && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-full"
                  onClick={() => clearFilter("adventure")}
                >
                  <X size={14} className="text-white" />
                </Button>
              )}
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={loc ? loc.charAt(0).toUpperCase() + loc.slice(1) : "All locations"}
                value={loc}
                onChange={(e) => setLoc(e.target.value.toLowerCase())}
                className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
              {loc && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-full"
                  onClick={() => clearFilter("location")}
                >
                  <X size={14} className="text-white" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal border-gray-200 rounded-xl flex-1",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date && !isNaN(date.getTime()) ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div style={wrapperStyle}>
                    <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={handleDateChange} />
                  </div>
                  {date && (
                    <div className="p-2 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-blue-500"
                        onClick={() => clearFilter("date")}
                      >
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-gray-200 rounded-xl">
                    <Filter size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => clearFilter("all")}>Clear all filters</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Categories section with horizontal scroll */}
        <div className="relative mb-8">
          <motion.div
            className="flex items-center overflow-x-auto pb-2 scrollbar-hide"
            ref={categoriesRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full mr-3 whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white"
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="w-5 h-5">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          {showScrollIndicator && (
            <motion.div
              className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-12 h-full bg-gradient-to-l from-blue-50 to-transparent flex items-center justify-end pr-1">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <ChevronRight size={16} className="text-blue-600" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800">Results</h2>
          <Badge variant="outline" className="text-gray-500 bg-white/80 backdrop-blur-sm">
            {filteredAdventures.length} adventures
          </Badge>
        </motion.div>

        {/* Adventure cards grid */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md"
                      variants={itemVariants}
                    >
                      <Skeleton className="w-full h-48" />
                      <div className="p-4">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </motion.div>
                  ))
              : filteredAdventures.map((adventure) => (
                  <motion.div
                    key={adventure.id}
                    variants={itemVariants}
                    layout
                    className="h-full"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => onBook(adventure.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card className="overflow-hidden h-full border-0 bg-white/90 backdrop-blur-sm shadow-lg">
                      <div className="relative h-52 overflow-hidden group">
                        <img
                          src={adventure.img || "/placeholder.svg"}
                          alt={adventure.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-md">
                            +{adventure.exp} EXP
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <MapPin size={14} />
                          <span>{adventure.location}</span>
                          <span className="text-gray-300">•</span>
                          <span>{formatDate(adventure.date)}</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800">{adventure.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm ml-1 text-gray-500">4.8</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex flex-col gap-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="text-sm font-medium text-gray-900">From $99</div>
                          <div className="text-xs text-gray-500">Limited spots</div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation() // Prevent the card click from triggering
                            onBook(adventure.id)
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md"
                        >
                          Book Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>

        {/* No results message */}
        {filteredAdventures.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md inline-block">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No adventures found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
              <Button
                onClick={() => clearFilter("all")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Clear all filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

