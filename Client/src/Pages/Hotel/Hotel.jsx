import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MapPin,
    Star,
    Hotel as HotelIcon,
    Wifi,
    UtensilsCrossed,
    Waves,
    Wind,
    Zap,
    Tent,
    TreePine,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    X,
    Check,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useHotels } from "../../hooks/useHotel"
import { useCountrySlider } from "../../hooks/useCountrySlider"
import { Nav_Landing } from "../../components/Nav_Landing"

// ─── Constants ───────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
    { id: "hotel", label: "Hotel", icon: HotelIcon },
    { id: "camping", label: "Camping", icon: Tent },
    { id: "glamping", label: "Glamping", icon: TreePine },
]

const POPULAR_FILTERS = [
    { id: "free_cancellation", label: "Free cancellation" },
    { id: "breakfast_included", label: "Breakfast included" },
    { id: "wifi", label: "Free WiFi" },
    { id: "parking", label: "Parking" },
    { id: "pool", label: "Swimming pool" },
    { id: "very_good", label: "Very good: 8+" },
]

const SORT_OPTIONS = [
    { id: "top_picks", label: "Our top picks" },
    { id: "price_asc", label: "Price (lowest first)" },
    { id: "price_desc", label: "Price (highest first)" },
    { id: "rating_desc", label: "Best reviewed" },
]

const amenityIcons = {
    "wifi": Wifi,
    "wifi-free": Wifi,
    "free-wifi": Wifi,
    "restaurant": UtensilsCrossed,
    "pool": Waves,
    "ac": Wind,
    "air-conditioning": Wind,
    "parking": HotelIcon,
    "gym": Zap,
    "fitness": Zap,
}

const getAmenityIcon = (amenityName) => {
    const name = amenityName?.toLowerCase() || ""
    for (const [key, icon] of Object.entries(amenityIcons)) {
        if (name.includes(key)) return icon
    }
    return HotelIcon
}

const extractCountryFromAddress = (address) => {
    if (!address || typeof address !== "string") return ""
    const segments = address.split(",").map((p) => p.trim()).filter(Boolean)
    return segments[segments.length - 1] || ""
}

const extractCityFromAddress = (address) => {
    if (!address || typeof address !== "string") return ""
    const segments = address.split(",").map((p) => p.trim()).filter(Boolean)
    return segments.length >= 2 ? segments[segments.length - 2] : segments[0] || ""
}

const getRatingLabel = (rating) => {
    if (!rating) return null
    if (rating >= 9) return "Superb"
    if (rating >= 8) return "Very good"
    if (rating >= 7) return "Good"
    if (rating >= 6) return "Pleasant"
    return null
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function HotelCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex h-52 animate-pulse">
            <div className="w-52 flex-shrink-0 bg-gray-200" />
            <div className="flex-1 p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="mt-auto h-8 bg-gray-200 rounded w-1/3 ml-auto" />
            </div>
        </div>
    )
}

// ─── Horizontal Hotel Card (Booking.com style) ────────────────────────────────

function HotelListCard({ hotel, onClick }) {
    const ratingLabel = getRatingLabel(hotel.rating)
    const locationDisplay =
        typeof hotel.location === "object"
            ? hotel.location?.name
            : hotel.location

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative sm:w-52 sm:flex-shrink-0 h-48 sm:h-auto overflow-hidden bg-gray-100">
                <img
                    src={hotel.logo || hotel.medias?.[0] || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                        {hotel.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                    {/* Left info */}
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 leading-snug line-clamp-1 group-hover:text-black transition-colors mb-1">
                            {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{locationDisplay}</span>
                        </div>

                        {/* Amenity tags */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                                {hotel.amenities.length > 3 && (
                                    <span className="text-xs text-gray-400 py-1">
                                        +{hotel.amenities.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Rating box */}
                    {hotel.rating > 0 && (
                        <div className="flex-shrink-0 text-right">
                            {ratingLabel && (
                                <p className="text-xs font-semibold text-gray-900 mb-1">{ratingLabel}</p>
                            )}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 text-white text-sm font-bold rounded-lg rounded-tr-sm">
                                {hotel.rating.toFixed(1)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom row: price + CTA */}
                <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-gray-900">
                                ${hotel.pricePerNight || hotel.price || 0}
                            </span>
                            <span className="text-sm text-gray-500">/night</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Includes taxes & fees</p>
                    </div>
                    <button
                        className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            onClick()
                        }}
                    >
                        See availability
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Sidebar Filter Panel ─────────────────────────────────────────────────────

function FilterSidebar({ sideFilters, setSideFilters, total }) {
    const togglePropertyType = useCallback((typeId) => {
        setSideFilters((prev) => ({
            ...prev,
            propertyTypes: prev.propertyTypes.includes(typeId)
                ? prev.propertyTypes.filter((t) => t !== typeId)
                : [...prev.propertyTypes, typeId],
        }))
    }, [setSideFilters])

    const togglePopularFilter = useCallback((filterId) => {
        setSideFilters((prev) => ({
            ...prev,
            popularFilters: prev.popularFilters.includes(filterId)
                ? prev.popularFilters.filter((f) => f !== filterId)
                : [...prev.popularFilters, filterId],
        }))
    }, [setSideFilters])

    const hasActiveFilters =
        sideFilters.propertyTypes.length > 0 || sideFilters.popularFilters.length > 0

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-0">
            {/* Filter header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter by:
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={() => setSideFilters({ propertyTypes: [], popularFilters: [] })}
                        className="text-xs text-gray-500 hover:text-gray-900 underline transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            {/* Budget note */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Your budget (per night)
                </p>
                <div className="flex items-center justify-between text-sm text-gray-700 font-medium mb-3">
                    <span>$0</span>
                    <span>$500+</span>
                </div>
                {/* Visual budget bar — decorative */}
                <div className="relative h-1.5 bg-gray-200 rounded-full">
                    <div className="absolute left-0 right-0 h-full bg-gray-900 rounded-full opacity-60" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Showing all price ranges</p>
            </div>

            {/* Popular filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Popular filters
                </p>
                <ul className="space-y-2">
                    {POPULAR_FILTERS.map((filter) => {
                        const isChecked = sideFilters.popularFilters.includes(filter.id)
                        return (
                            <li key={filter.id}>
                                <button
                                    onClick={() => togglePopularFilter(filter.id)}
                                    className="flex items-center justify-between w-full text-left group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                                                isChecked
                                                    ? "bg-gray-900 border-gray-900"
                                                    : "border-gray-300 group-hover:border-gray-500"
                                            }`}
                                        >
                                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                        </span>
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {filter.label}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Property type */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Property type
                </p>
                <ul className="space-y-2">
                    {PROPERTY_TYPES.map((type) => {
                        const isChecked = sideFilters.propertyTypes.includes(type.id)
                        const IconComp = type.icon
                        return (
                            <li key={type.id}>
                                <button
                                    onClick={() => togglePropertyType(type.id)}
                                    className="flex items-center justify-between w-full text-left group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                                                isChecked
                                                    ? "bg-gray-900 border-gray-900"
                                                    : "border-gray-300 group-hover:border-gray-500"
                                            }`}
                                        >
                                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                        </span>
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {type.label}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </aside>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HotelBrowsingPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    // URL-synced filters (location, category, page)
    const [filters, setFilters] = useState({
        location: searchParams.get("location") || "",
        checkIn: searchParams.get("checkin") || "",
        checkOut: searchParams.get("checkout") || "",
        guests: parseInt(searchParams.get("guests") || "1"),
        category: searchParams.get("category") || "",
        page: parseInt(searchParams.get("page") || "1"),
    })

    // Sidebar-only UI filters (client-side, not in URL)
    const [sideFilters, setSideFilters] = useState({
        propertyTypes: [],
        popularFilters: [],
    })

    const [sortBy, setSortBy] = useState("top_picks")
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const [limit] = useState(10)

    const { hotels, isLoading, total, totalPages } = useHotels({
        page: filters.page,
        limit,
        location: filters.location || null,
        category: filters.category || null,
    })

    // Sync URL params
    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.location) params.set("location", filters.location)
        if (filters.checkIn) params.set("checkin", filters.checkIn)
        if (filters.checkOut) params.set("checkout", filters.checkOut)
        if (filters.guests) params.set("guests", filters.guests.toString())
        if (filters.category) params.set("category", filters.category)
        params.set("page", filters.page.toString())
        setSearchParams(params)
    }, [filters, setSearchParams])

    const updateFilter = useCallback(
        (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 })),
        []
    )

    const todayISO = new Date().toISOString().split("T")[0]
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split("T")[0]

    // Enrich hotels with city/country metadata
    const hotelsWithLocationMeta = useMemo(() => {
        return hotels.map((hotel) => {
            const locationName =
                typeof hotel.location === "object" ? hotel.location?.name : hotel.location
            const locationAddress = hotel?.location?.address || ""
            const city =
                hotel?.city ||
                hotel?.location?.city ||
                extractCityFromAddress(locationAddress)
            const country =
                hotel?.country ||
                hotel?.location?.country ||
                extractCountryFromAddress(locationAddress) ||
                "Other"
            const countryLabel = city ? `${city}, ${country}` : country

            return { ...hotel, city, country, countryLabel, locationName }
        })
    }, [hotels])

    // Apply client-side sidebar filters
    const filteredHotels = useMemo(() => {
        let result = [...hotelsWithLocationMeta]

        // Property type filter
        if (sideFilters.propertyTypes.length > 0) {
            result = result.filter((h) =>
                sideFilters.propertyTypes.includes(h.category?.toLowerCase())
            )
        }

        // Sort
        if (sortBy === "price_asc") result.sort((a, b) => (a.pricePerNight || a.price || 0) - (b.pricePerNight || b.price || 0))
        else if (sortBy === "price_desc") result.sort((a, b) => (b.pricePerNight || b.price || 0) - (a.pricePerNight || a.price || 0))
        else if (sortBy === "rating_desc") result.sort((a, b) => (b.rating || 0) - (a.rating || 0))

        return result
    }, [hotelsWithLocationMeta, sideFilters, sortBy])

    // Country slider for featured section
    const featuredCountrySlider = useCountrySlider(
        hotelsWithLocationMeta.map((hotel) => ({
            ...hotel,
            country: hotel.countryLabel,
        }))
    )

    const handlePageChange = useCallback(
        (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
                setFilters((prev) => ({ ...prev, page: newPage }))
                window.scrollTo({ top: 600, behavior: "smooth" })
            }
        },
        [totalPages]
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav_Landing />

            {/* ── Hero Header ── */}
            <header
                className="relative bg-cover bg-center min-h-[600px] sm:min-h-[560px] rounded-b-3xl overflow-hidden shadow-inner z-10"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1719466419345-fdb12719ec29?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470')`,
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/55 z-10" />

                <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center z-20 pt-28 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                            Find your perfect stay
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-white/80 max-w-xl">
                            Handpicked hotels, camping spots, and glampings for every traveler.
                        </p>
                    </motion.div>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-8 max-w-5xl"
                    >
                        <div className="bg-white rounded-2xl p-5 shadow-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Destination */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Destination
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filters.location}
                                            onChange={(e) => updateFilter("location", e.target.value)}
                                            className="h-11 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 px-4 pr-10 text-gray-800 bg-white appearance-none transition-all text-sm font-medium"
                                        >
                                            <option value="">All Locations</option>
                                            {Array.from(
                                                new Set(
                                                    hotelsWithLocationMeta
                                                        .map((h) => h.locationName)
                                                        .filter(Boolean)
                                                )
                                            ).map((loc) => (
                                                <option key={loc} value={loc}>
                                                    {loc}
                                                </option>
                                            ))}
                                        </select>
                                        <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Check-in */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Check-in
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.checkIn || todayISO}
                                        onChange={(e) => updateFilter("checkIn", e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 px-4 text-gray-800 text-sm font-medium transition-all"
                                    />
                                </div>

                                {/* Check-out */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Check-out
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.checkOut || tomorrowISO}
                                        onChange={(e) => updateFilter("checkOut", e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 px-4 text-gray-800 text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Bottom row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Guests
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={filters.guests}
                                        onChange={(e) =>
                                            updateFilter("guests", parseInt(e.target.value || "1"))
                                        }
                                        className="h-11 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 px-4 text-gray-800 text-sm font-medium transition-all"
                                    />
                                </div>

                                <div className="sm:col-span-1 lg:col-span-3 flex items-end">
                                    <button
                                        onClick={() => updateFilter("page", 1)}
                                        className="h-11 w-full bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Featured Stays Section (kept as-is, styling enhanced) ── */}
                {!isLoading && featuredCountrySlider.countriesFromEvents.length > 0 && (
                    <section className="mb-14 rounded-3xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                                Featured Stays
                            </h2>
                            <p className="mt-2 text-base text-gray-500">
                                Curated picks by destination, crafted for comfort and style.
                            </p>
                        </div>

                        {/* Country Tabs */}
                        <div className="relative mb-8">
                            <div className="flex items-center justify-center gap-3 md:gap-5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={featuredCountrySlider.prevCountry}
                                    className="rounded-full h-10 w-10 hover:bg-gray-100 transition-all text-gray-700"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <div className="flex-1 overflow-x-auto no-scrollbar">
                                    <div className="flex items-center justify-center space-x-6 md:space-x-10 px-2 min-w-max mx-auto">
                                        {featuredCountrySlider.countriesFromEvents.map((country, index) => {
                                            const isActive = index === featuredCountrySlider.currentCountryIndex
                                            return (
                                                <motion.button
                                                    key={country.name}
                                                    onClick={() => featuredCountrySlider.goToCountry(index, true)}
                                                    className={`cursor-pointer transition-all duration-300 whitespace-nowrap py-1 ${
                                                        isActive
                                                            ? "text-xl md:text-2xl font-bold text-gray-900"
                                                            : "text-base md:text-lg font-medium text-gray-400 hover:text-gray-700"
                                                    }`}
                                                    whileHover={{ scale: 1.03 }}
                                                >
                                                    <span
                                                        className={
                                                            isActive
                                                                ? "border-b-[3px] border-gray-900 pb-0.5"
                                                                : ""
                                                        }
                                                    >
                                                        {country.name}
                                                    </span>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={featuredCountrySlider.nextCountry}
                                    className="rounded-full h-10 w-10 hover:bg-gray-100 transition-all text-gray-700"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Dot indicators */}
                            <div className="flex justify-center space-x-2 mt-5">
                                {featuredCountrySlider.countriesFromEvents.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            index === featuredCountrySlider.currentCountryIndex
                                                ? "w-8 bg-gray-900"
                                                : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        onClick={() => featuredCountrySlider.goToCountry(index, true)}
                                        aria-label={`Show featured stays for country ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Featured Cards Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={featuredCountrySlider.currentCountryIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.22 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                            >
                                {(featuredCountrySlider.currentCountry?.events || [])
                                    .slice()
                                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                                    .slice(0, 3)
                                    .map((hotel) => (
                                        <div
                                            key={hotel._id}
                                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            onClick={() => navigate(`/hotel/${hotel._id}`)}
                                        >
                                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                                <img
                                                    src={hotel.logo || hotel.medias?.[0] || "/placeholder.svg"}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                                                        {hotel.category}
                                                    </span>
                                                </div>
                                                {hotel.rating > 0 && (
                                                    <div className="absolute top-3 right-3 bg-white/95 rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                                        <Star className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {hotel.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-bold text-base text-gray-900 line-clamp-1 mb-1.5">
                                                    {hotel.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-gray-500 mb-3">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <span className="text-xs line-clamp-1">{hotel.locationName}</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-extrabold text-gray-900">
                                                        ${hotel.pricePerNight || hotel.price || 0}
                                                    </span>
                                                    <span className="text-xs text-gray-500">/night</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                )}

                {/* ── Browsing Section (Booking.com style) ── */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Mobile filter toggle */}
                    <div className="flex items-center justify-between lg:hidden mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                            {total > 0 ? `${total} properties found` : "All Accommodations"}
                        </h2>
                        <button
                            onClick={() => setMobileFiltersOpen((v) => !v)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>
                    </div>

                    {/* Mobile filter drawer */}
                    <AnimatePresence>
                        {mobileFiltersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="lg:hidden overflow-hidden"
                            >
                                <FilterSidebar
                                    sideFilters={sideFilters}
                                    setSideFilters={setSideFilters}
                                    total={total}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar
                            sideFilters={sideFilters}
                            setSideFilters={setSideFilters}
                            total={total}
                        />
                    </div>

                    {/* Right Column: Results */}
                    <div className="flex-1 min-w-0">
                        {/* Results header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div className="hidden lg:block">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {filters.location
                                        ? `Stays in ${filters.location}`
                                        : "All Accommodations"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {total > 0 ? `${total} properties found` : "No properties found"}
                                </p>
                            </div>

                            {/* Sort selector */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Hotel list */}
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <HotelCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
                                <HotelIcon className="w-14 h-14 text-gray-200 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    No accommodations found
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Try adjusting your search filters or browse all locations.
                                </p>
                                <button
                                    onClick={() => {
                                        setSideFilters({ propertyTypes: [], popularFilters: [] })
                                        updateFilter("location", "")
                                    }}
                                    className="mt-5 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {filteredHotels.map((hotel) => (
                                        <HotelListCard
                                            key={hotel._id}
                                            hotel={hotel}
                                            onClick={() => navigate(`/hotel/${hotel._id}`)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => handlePageChange(filters.page - 1)}
                                            disabled={filters.page === 1}
                                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1
                                                const isCurrent = page === filters.page
                                                const showPage =
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= filters.page - 1 && page <= filters.page + 1)

                                                if (!showPage && page === 2) {
                                                    return (
                                                        <span key={page} className="px-2 text-gray-400 text-sm">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                                if (!showPage && page === totalPages - 1) {
                                                    return (
                                                        <span key={page} className="px-2 text-gray-400 text-sm">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                                if (!showPage) return null

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`h-10 w-10 text-sm font-semibold rounded-lg transition-colors ${
                                                            isCurrent
                                                                ? "bg-gray-900 text-white"
                                                                : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(filters.page + 1)}
                                            disabled={filters.page === totalPages}
                                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
