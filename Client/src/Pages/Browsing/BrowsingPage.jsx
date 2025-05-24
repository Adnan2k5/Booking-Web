import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { useAuth } from "../AuthProvider.jsx"
import { Loader } from "../../components/Loader.jsx"
import { SearchFilterBar } from "./SearchFilterBar"
import { CategorySelector } from "./CategorySelector"
import { AdventureCard } from "./AdventureCard"
import { AdventureCardSkeleton } from "./AdventureCardSkeleton"
import { NoResults } from "./NoResults"
import { useAdventures } from "../../hooks/useAdventure"
import { useBrowse } from "../../hooks/useBrowse"
import { containerVariants, itemVariants } from "../../assets/Animations"
import { Bubble } from "../../components/Bubble"

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

  const wrapperStyle = {
    width: 300,
    border: `1px solid #e2e8f0`,
    borderRadius: "0.375rem",
  }

  const { user, loading } = useAuth();
  const { adventures: categories } = useAdventures();
  const { adventures, isLoading, filters, setFilters } = useBrowse();

  const updateParams = (params, options = {}) => {
    const queryParams = new URLSearchParams(location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    });
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true, ...options });
  };

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
    const queryParams = new URLSearchParams(location.search);
    const adventureParam = queryParams.get("adventure") || "";
    const locationParam = queryParams.get("location") || "";
    const dateParam = queryParams.get("date") || "";

    setFilters({
      adventure: adventureParam,
      location: locationParam,
      session_date: dateParam,
    });

    setAdventure(adventureParam.toLowerCase());
    setLoc(locationParam.toLowerCase());
    setDate(dateParam ? new Date(dateParam) : undefined);

    if (location.search !== queryParams.toString()) {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    }
  }, [location.search, setFilters, navigate, location.pathname]);

  const onBook = (id) => {
    navigate(`/booking?id=${id}&location=${filters.location}&session_date=${filters.session_date}`, { replace: true })
  }

  const clearFilter = (type) => {
    switch (type) {
      case "adventure":
        setAdventure("");
        updateParams({ adventure: "" });
        break;
      case "location":
        setLoc("");
        updateParams({ location: "" });
        break;
      case "date":
        setDate(undefined);
        updateParams({ date: "" });
        break;
      case "all":
        setAdventure("");
        setLoc("");
        setDate(undefined);
        setActiveCategory("");
        setFilters({ adventure: "", location: "", session_date: "" });
        updateParams({ adventure: "", location: "", date: "" });
        break;
      default:
        break;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 relative overflow-hidden">
      <Bubble />

      <div className="relative z-10 mx-auto max-w-7xl">
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

        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchFilterBar
            adventure={adventure}
            setAdventure={setAdventure}
            loc={loc}
            setLoc={setLoc}
            date={date}
            setDate={setDate}
            clearFilter={clearFilter}
            handleDateChange={handleDateChange}
            wrapperStyle={wrapperStyle}
            onSearch={() => {
              updateParams({
                adventure,
                location: loc,
                date: date ? date.toISOString().split("T")[0] : ""
              });
            }}
            setSearchParams={updateParams}
          />
        </motion.div>

        <CategorySelector
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categoriesRef={categoriesRef}
          showScrollIndicator={showScrollIndicator}
          ChevronRight={ChevronRight}
        />

        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800">Results</h2>
          <Badge variant="outline" className="text-gray-500 bg-white/80 backdrop-blur-sm">
            {adventures?.length} adventures
          </Badge>
        </motion.div>

        <AnimatePresence>
          <motion.div
            className={`${loc ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col items-center justify-center"} `}
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
                    variants={itemVariants}
                  >
                    <AdventureCardSkeleton />
                  </motion.div>
                ))
              : (!loc ? <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center  py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <MapPin size={48} className="text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-800">Select a location to see adventures</h3>
                  <p className="text-gray-600 max-w-md">
                    Please use the search bar above to select a location and discover available adventures.
                  </p>
                </div>
              </motion.div> : adventures?.map((adventure) => (
                <motion.div
                  key={adventure._id}
                  variants={itemVariants}
                  layout
                  className="h-full"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => onBook(adventure._id)}
                  style={{ cursor: "pointer" }}
                >
                  <AdventureCard adventure={adventure} formatDate={formatDate} onBook={onBook} />
                </motion.div>
              )))}
          </motion.div>
        </AnimatePresence>

        {adventures?.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <NoResults clearFilter={clearFilter} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

