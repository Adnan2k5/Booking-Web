import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MapPin,
    Star,
    Hotel as HotelIcon,
    Tent,
    TreePine,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { useHotels } from "../../hooks/useHotel"
import { useCountrySlider } from "../../hooks/useCountrySlider"
import { Nav_Landing } from "../../components/Nav_Landing"

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

export default function HotelBrowsingPage() {
    const navigate = useNavigate()

    const { hotels, isLoading } = useHotels({
        page: 1,
        limit: 30,
        location: null,
        category: null,
    })

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

    const featuredCountrySlider = useCountrySlider(
        hotelsWithLocationMeta.map((hotel) => ({
            ...hotel,
            country: hotel.countryLabel,
        }))
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav_Landing />

            <header
                className="relative bg-cover bg-center min-h-[560px] rounded-b-3xl overflow-hidden shadow-inner z-10"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1719466419345-fdb12719ec29?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470')`,
                }}
            >
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
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {isLoading && (
                    <section className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
                        <div className="text-center mb-8">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-3" />
                            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mx-auto" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-200" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {!isLoading && featuredCountrySlider.countriesFromEvents.length > 0 && (
                    <section className="mb-10 rounded-3xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                                Featured Accommodations
                            </h2>
                            <p className="mt-2 text-base text-gray-500">
                                Curated picks by destination, crafted for comfort and style.
                            </p>
                        </div>

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

                        <div className="mt-8 flex justify-center">
                            <motion.button
                                onClick={() => window.open("/hotels/all", "_blank", "noopener,noreferrer")}
                                className="group flex items-center gap-3 px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Show More Accommodations</span>
                                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}
