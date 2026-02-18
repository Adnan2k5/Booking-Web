"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useLocation, useNavigate } from "react-router-dom"
import { MapPin, Compass } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { useAuth } from "../AuthProvider.jsx"
import { SearchFilterBar } from "./SearchFilterBar"
import { AdventureCard } from "./AdventureCard"
import { AdventureCardSkeleton } from "./AdventureCardSkeleton"
import { NoResults } from "./NoResults"
import { useBrowse } from "../../hooks/useBrowse"
import { useLocations } from "../../hooks/useLocation"
import { useAdventures } from "../../hooks/useAdventure"
import { containerVariants, itemVariants } from "../../assets/Animations"
import { Nav_Landing } from "../../components/Nav_Landing"

// Empty State Component
const EmptyLocationState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 px-6"
  >
    <div className="inline-block mb-6">
      <div className="bg-gray-100 p-6 rounded-full">
        <MapPin size={56} className="text-gray-900" strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">Where would you like to explore?</h3>
    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
      Select a location above to discover amazing adventures waiting for you.
    </p>
  </motion.div>
)

// Results Header Component
const ResultsHeader = ({ count, hasLocation }) => {
  if (!hasLocation) return null

  return (
    <motion.div
      className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-900 rounded-lg">
          <Compass size={20} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Available Adventures
        </h2>
      </div>
      <Badge
        variant="secondary"
        className="text-sm font-medium bg-gray-100 text-gray-900 border-gray-200 px-4 py-1.5"
      >
        {count} {count === 1 ? 'adventure' : 'adventures'}
      </Badge>
    </motion.div>
  )
}

export default function BrowsingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location?.search)
  const [adventure, setAdventure] = useState(query.get("adventure")?.toLowerCase() || "")
  const [loc, setLoc] = useState(query.get("location")?.toLowerCase() || "")
  const [date, setDate] = useState(() => {
    const queryDate = query.get("date")
    return queryDate ? new Date(queryDate) : undefined
  })
  const [activeCategory, setActiveCategory] = useState("")
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const categoriesRef = useRef(null)

  const { adventures, isLoading, filters, setFilters } = useBrowse()
  const { locations } = useLocations()
  const { adventures: allAdventures } = useAdventures()

  const updateParams = (params, options = {}) => {
    const queryParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value)
      } else {
        queryParams.delete(key)
      }
    })
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true, ...options })
  }

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
      handleScroll()
    }

    return () => {
      if (categoryContainer) {
        categoryContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    // Parse URL params and set filters
    const queryParams = new URLSearchParams(location.search)
    const adventureParam = queryParams.get("adventure") || ""
    const locationParam = queryParams.get("location") || ""
    const dateParam = queryParams.get("date") || ""

    setFilters({
      adventure: adventureParam,
      location: locationParam,
      session_date: dateParam,
    })

    setAdventure(adventureParam.toLowerCase())
    setLoc(locationParam.toLowerCase())
    setDate(dateParam ? new Date(dateParam) : undefined)

    if (location.search !== queryParams.toString()) {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    }
  }, [location.search, setFilters, navigate, location.pathname])

  const onBook = (id) => {
    navigate(`/booking?id=${id}&location=${filters.location}&session_date=${filters.session_date}`, { replace: true })
  }

  const clearFilter = (type) => {
    switch (type) {
      case "adventure":
        setAdventure("")
        updateParams({ adventure: "" })
        break
      case "location":
        setLoc("")
        updateParams({ location: "" })
        break
      case "date":
        setDate(undefined)
        updateParams({ date: "" })
        break
      case "all":
        setAdventure("")
        setLoc("")
        setDate(undefined)
        setActiveCategory("")
        setFilters({ adventure: "", location: "", session_date: "" })
        updateParams({ adventure: "", location: "", date: "" })
        break
      default:
        break
    }
  }

  const handleDateChange = (value) => {
    if (value) {
      const selectedDate = new Date(value.format("YYYY-MM-DD"))
      setDate(selectedDate)
    } else {
      setDate(undefined)
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

  // Determine what to display
  const hasLocation = loc && loc.length > 0
  const hasResults = adventures && adventures.length > 0
  const showEmptyLocationState = !hasLocation && !isLoading
  const showNoResults = hasLocation && !hasResults && !isLoading
  const showResults = hasLocation && hasResults && !isLoading

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Nav_Landing />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Hero Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 leading-tight">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find unforgettable experiences and create lasting memories
          </p>
        </motion.div>

        {/* Search Filter Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <SearchFilterBar
              adventure={adventure}
              setAdventure={setAdventure}
              loc={loc}
              setLoc={setLoc}
              date={date}
              setDate={setDate}
              clearFilter={clearFilter}
              handleDateChange={handleDateChange}
              locations={locations}
              allAdventures={allAdventures}
              onSearch={(newFilters) => {
                // Use the new filter values passed directly from SearchFilterBar
                updateParams({
                  adventure: newFilters.adventure,
                  location: newFilters.location,
                  date: newFilters.date ? newFilters.date.toISOString().split("T")[0] : "",
                })
              }}
              setSearchParams={updateParams}
            />
          </div>
        </motion.div>

        {/* Results Section */}
        <ResultsHeader count={adventures?.length || 0} hasLocation={hasLocation} />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                    <AdventureCardSkeleton />
                  </motion.div>
                ))}
            </motion.div>
          ) : showEmptyLocationState ? (
            <motion.div
              key="empty-location"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyLocationState />
            </motion.div>
          ) : showNoResults ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <NoResults clearFilter={clearFilter} />
            </motion.div>
          ) : showResults ? (
            <motion.div
              key="results"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {adventures.map((adventure, index) => (
                <motion.div
                  key={adventure._id}
                  variants={itemVariants}
                  custom={index}
                  layout
                  className="h-full"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <AdventureCard adventure={adventure} formatDate={formatDate} onBook={onBook} />
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
