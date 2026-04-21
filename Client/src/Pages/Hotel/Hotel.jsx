import { useState, useEffect, useMemo } from "react"
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
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useHotels } from "../../hooks/useHotel"
import { useCountrySlider } from "../../hooks/useCountrySlider"
import { Nav_Landing } from "../../components/Nav_Landing"

const stayCategories = [
    { id: '', name: 'All Stays', icon: HotelIcon },
    { id: 'hotel', name: 'Hotel', icon: HotelIcon },
    { id: 'camping', name: 'Camping', icon: Tent },
    { id: 'glamping', name: 'Glamping', icon: TreePine },
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
    const segments = address.split(",").map((part) => part.trim()).filter(Boolean)
    return segments[segments.length - 1] || ""
}

const extractCityFromAddress = (address) => {
    if (!address || typeof address !== "string") return ""
    const segments = address.split(",").map((part) => part.trim()).filter(Boolean)
    return segments.length >= 2 ? segments[segments.length - 2] : segments[0] || ""
}

export default function HotelBrowsingPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [filters, setFilters] = useState({
        location: searchParams.get('location') || "",
        checkIn: searchParams.get('checkin') || "",
        checkOut: searchParams.get('checkout') || "",
        guests: parseInt(searchParams.get('guests') || '1'),
        category: searchParams.get('category') || "",
        page: parseInt(searchParams.get('page') || '1')
    })

    const [limit] = useState(12)

    const { hotels, isLoading, total, totalPages } = useHotels({
        page: filters.page,
        limit,
        location: filters.location || null,
        category: filters.category || null
    })

    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.location) params.set('location', filters.location)
        if (filters.checkIn) params.set('checkin', filters.checkIn)
        if (filters.checkOut) params.set('checkout', filters.checkOut)
        if (filters.guests) params.set('guests', filters.guests.toString())
        if (filters.category) params.set('category', filters.category)
        params.set('page', filters.page.toString())
        setSearchParams(params)
    }, [filters, setSearchParams])

    const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

    const todayISO = new Date().toISOString().split('T')[0]
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const hotelsWithLocationMeta = useMemo(() => {
        return hotels.map((hotel) => {
            const locationName = typeof hotel.location === "object" ? hotel.location?.name : hotel.location
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

            return {
                ...hotel,
                city,
                country,
                countryLabel,
                locationName
            }
        })
    }, [hotels])

    const featuredCountrySlider = useCountrySlider(hotelsWithLocationMeta.map((hotel) => ({
        ...hotel,
        country: hotel.countryLabel
    })))

    const handleBookingSearch = (e) => {
        e.preventDefault()
        setFilters(prev => ({ ...prev, page: 1 }))
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }))
            window.scrollTo({ top: 500, behavior: 'smooth' })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Nav_Landing />

            <header
                className="relative bg-cover bg-center min-h-[720px] sm:min-h-[680px] md:min-h-[620px] rounded-b-3xl overflow-visible shadow-inner z-10 pt-28 sm:pt-32"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1719466419345-fdb12719ec29?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470')` }}
            >
                <div className="absolute inset-0 bg-black/45 backdrop-blur-sm z-10"></div>
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center z-20 pt-24 md:pt-28 pb-10">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">Find your perfect stay</h1>
                        <p className="mt-3 text-lg sm:text-xl text-white/90 max-w-2xl">Handpicked hostels, boutique stays and cozy hotels for every kind of traveler. Explore exclusive offers and flexible bookings.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-5xl z-30">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {stayCategories.map((cat) => {
                                const IconComponent = cat.icon
                                const isActive = filters.category === cat.id
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => updateFilter('category', cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${isActive
                                            ? 'bg-white text-rose-600 shadow-lg scale-105'
                                            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                            }`}
                                    >
                                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-white'}`} />
                                        <span>{cat.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/40">
                            <form onSubmit={handleBookingSearch}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                                        <div className="relative">
                                            <select
                                                value={filters.location}
                                                onChange={e => updateFilter('location', e.target.value)}
                                                className="h-12 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 px-4 pr-10 text-gray-700 bg-white appearance-none transition-all"
                                            >
                                                <option value="">All Locations</option>
                                                {Array.from(new Set(hotelsWithLocationMeta.map((hotel) => hotel.locationName).filter(Boolean))).map((locationName) => (
                                                    <option key={locationName} value={locationName}>{locationName}</option>
                                                ))}
                                            </select>
                                            <MapPin className="w-5 h-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                                        <Input
                                            type="date"
                                            value={filters.checkIn || todayISO}
                                            onChange={(e) => updateFilter('checkIn', e.target.value)}
                                            className="h-12 border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                                        <Input
                                            type="date"
                                            value={filters.checkOut || tomorrowISO}
                                            onChange={(e) => updateFilter('checkOut', e.target.value)}
                                            className="h-12 border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={filters.guests}
                                            onChange={(e) => updateFilter('guests', parseInt(e.target.value || '1'))}
                                            className="h-12 border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-1 lg:col-span-3 flex items-end">
                                        <Button
                                            type="submit"
                                            className="h-12 w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl shadow-lg font-semibold text-base transition-all"
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
                {!isLoading && featuredCountrySlider.countriesFromEvents.length > 0 && (
                    <section className="mb-14 rounded-3xl bg-slate-50 border border-slate-200/80 p-6 md:p-8">
                        <div className="text-center mb-8 md:mb-10">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Featured Stays</h2>
                            <p className="mt-2 text-base md:text-lg text-gray-600">
                                Curated picks by destination, crafted for comfort and style.
                            </p>
                        </div>

                        <div className="relative mb-8 md:mb-10">
                            <div className="flex items-center justify-center gap-2 md:gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={featuredCountrySlider.prevCountry}
                                    className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-white hover:shadow-md transition-all duration-300 text-gray-800"
                                >
                                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                                </Button>

                                <div className="flex-1 overflow-x-auto no-scrollbar">
                                    <div className="flex items-center justify-center space-x-5 md:space-x-8 px-2 min-w-max mx-auto">
                                        {featuredCountrySlider.countriesFromEvents.map((country, index) => (
                                            <motion.button
                                                key={country.name}
                                                onClick={() => featuredCountrySlider.goToCountry(index)}
                                                className={`cursor-pointer transition-all duration-300 whitespace-nowrap px-2 py-1 rounded-full ${index === featuredCountrySlider.currentCountryIndex
                                                    ? "text-2xl md:text-3xl font-bold text-gray-900"
                                                    : "text-lg md:text-xl font-medium text-gray-400 hover:text-gray-600"
                                                    }`}
                                                whileHover={{ scale: 1.04 }}
                                            >
                                                    <span className={index === featuredCountrySlider.currentCountryIndex ? "border-b-4 border-gray-900 pb-1" : ""}>
                                                        {country.name}
                                                    </span>
                                                </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={featuredCountrySlider.nextCountry}
                                    className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-white hover:shadow-md transition-all duration-300 text-gray-800"
                                >
                                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                                </Button>
                            </div>

                            <div className="flex justify-center space-x-2 mt-6">
                                {featuredCountrySlider.countriesFromEvents.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === featuredCountrySlider.currentCountryIndex ? "w-10 bg-gray-900" : "w-1.5 bg-gray-300"
                                            }`}
                                        onClick={() => featuredCountrySlider.goToCountry(index)}
                                        aria-label={`Show featured stays for country ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={featuredCountrySlider.currentCountryIndex}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {(featuredCountrySlider.currentCountry?.events || [])
                                    .slice()
                                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                                    .slice(0, 3)
                                    .map((hotel) => (
                                        <Card
                                            key={hotel._id}
                                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            onClick={() => navigate(`/hotel/${hotel._id}`)}
                                        >
                                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                                <img
                                                    src={hotel.logo || hotel.medias?.[0] || '/placeholder.svg'}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-white/95 text-gray-900 font-medium capitalize border-0 shadow-sm">
                                                        {hotel.category}
                                                    </Badge>
                                                </div>
                                                <div className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {(hotel.rating || 0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
                                                    {hotel.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                                                    <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                                    <span className="text-sm line-clamp-1">
                                                        {hotel.locationName}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ${hotel.pricePerNight || hotel.price || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-600">/night</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                )}

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {filters.location ? `Stays in ${filters.location}` : 'All Accommodations'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {total > 0 ? `${total} properties found` : 'No properties found'}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-16">
                        <HotelIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No accommodations found</h3>
                        <p className="text-gray-600">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {hotelsWithLocationMeta.map((hotel) => (
                                <motion.div
                                    key={hotel._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        className="group overflow-hidden rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                                        onClick={() => navigate(`/hotel/${hotel._id}`)}
                                    >
                                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={hotel.logo || hotel.medias?.[0] || '/placeholder.svg'}
                                                alt={hotel.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-white/95 text-gray-900 font-medium capitalize border-0 shadow-sm">
                                                    {hotel.category}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {(hotel.rating || 0).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
                                                {hotel.name}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                                                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                                <span className="text-sm line-clamp-1">
                                                    {typeof hotel.location === 'object' ? hotel.location?.name : hotel.location}
                                                </span>
                                            </div>

                                            {hotel.amenities && hotel.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {hotel.amenities.slice(0, 4).map((amenity, idx) => {
                                                        const IconComponent = getAmenityIcon(amenity)
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg"
                                                            >
                                                                <IconComponent className="w-3.5 h-3.5" />
                                                                <span className="line-clamp-1">{amenity}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-gray-600">Starting from</div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            ${hotel.pricePerNight || hotel.price || 0}
                                                        </span>
                                                        <span className="text-sm text-gray-600">/night</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-10 px-5"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/hotel/${hotel._id}`)
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    disabled={filters.page === 1}
                                    className="h-10 w-10 p-0 border-gray-300 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1
                                        const isCurrentPage = page === filters.page
                                        const showPage = page === 1 || page === totalPages || (page >= filters.page - 1 && page <= filters.page + 1)

                                        if (!showPage && page === 2) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>
                                        }
                                        if (!showPage && page === totalPages - 1) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>
                                        }
                                        if (!showPage) return null

                                        return (
                                            <Button
                                                key={page}
                                                variant={isCurrentPage ? "default" : "outline"}
                                                onClick={() => handlePageChange(page)}
                                                className={`h-10 w-10 p-0 ${isCurrentPage
                                                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    disabled={filters.page === totalPages}
                                    className="h-10 w-10 p-0 border-gray-300 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
