"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    MapPin,
    Star,
    Hotel as HotelIcon,
    Wifi,
    UtensilsCrossed,
    Waves,
    Wind,
    Zap,
    Users,
    Award,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useHotels } from "../../hooks/useHotel"
import { Navbar } from "../../components/Navbar"
import { fetchLocations } from "../../Api/location.api"
import { useTranslation } from "react-i18next"

// Lightweight amenity icon detection (keeps previous behavior)
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

export default function HotelBrowsingPage() {
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    // keep basic filter state for search integration
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || "",
        checkIn: searchParams.get('checkin') || "",
        checkOut: searchParams.get('checkout') || "",
        guests: parseInt(searchParams.get('guests') || '1'),
        page: parseInt(searchParams.get('page') || '1')
    })

    const [locations, setLocations] = useState([])
    const [limit] = useState(12)

    const { hotels, isLoading, error, total, totalPages } = useHotels({
        page: filters.page,
        limit,
        location: filters.location || null
    })

    useEffect(() => {
        const getLocations = async () => {
            try {
                const res = await fetchLocations()
                setLocations(res.data || [])
            } catch (err) {
                console.error(err)
            }
        }
        getLocations()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.location) params.set('location', filters.location)
        if (filters.checkIn) params.set('checkin', filters.checkIn)
        if (filters.checkOut) params.set('checkout', filters.checkOut)
        if (filters.guests) params.set('guests', filters.guests.toString())
        params.set('page', filters.page.toString())
        setSearchParams(params)
    }, [filters, setSearchParams])

    const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

    const clearFilters = () => setFilters({ location: '', checkIn: '', checkOut: '', guests: 1, page: 1 })

    // Simple helpers for date defaults
    const todayISO = new Date().toISOString().split('T')[0]
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split('T')[0]


    // Handler for booking/search form submit
    const handleBookingSearch = (e) => {
        e.preventDefault();
        // Always reset to first page on new search
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
            <Navbar />

            {/* HERO */}
            <header
                className="relative bg-cover bg-center h-[520px] sm:h-[600px] rounded-b-3xl overflow-hidden shadow-inner z-10"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632')` }}
            >
                <div className="absolute inset-0 bg-black/45 backdrop-blur-sm z-10"></div>
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center z-20">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">Find your perfect stay</h1>
                        <p className="mt-3 text-lg sm:text-xl text-white/90 max-w-2xl">Handpicked hostels, boutique stays and cozy hotels for every kind of traveler. Explore exclusive offers and flexible bookings.</p>
                    </motion.div>

                    {/* Booking Form (overlay) */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-4xl z-30">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/40">
                            <form className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" onSubmit={handleBookingSearch}>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Destination</label>
                                    <div className="relative">
                                        <select
                                            value={filters.location}
                                            onChange={e => updateFilter('location', e.target.value)}
                                            className="h-12 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 px-3 pr-8 text-gray-700 bg-white appearance-none"
                                        >
                                            <option value="">All Locations</option>
                                            {locations.map(loc => (
                                                <option key={loc._id} value={loc.name}>{loc.name}</option>
                                            ))}
                                        </select>
                                        <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check-in</label>
                                    <Input type="date" value={filters.checkIn || todayISO} onChange={(e) => updateFilter('checkIn', e.target.value)} className="h-12" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check-out</label>
                                    <Input type="date" value={filters.checkOut || tomorrowISO} onChange={(e) => updateFilter('checkOut', e.target.value)} className="h-12" />
                                </div>

                                <div className="sm:col-span-1 flex items-center gap-3">
                                    <div className="w-full">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Guests</label>
                                        <Input type="number" min={1} value={filters.guests} onChange={(e) => updateFilter('guests', parseInt(e.target.value || '1'))} className="h-12" />
                                    </div>

                                    <div>
                                        <Button type="submit" className="h-12 px-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl shadow-lg">Search</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-8 mt-8">
                <section className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Featured Stays</h2>
                                    <p className="text-sm text-gray-500">Curated picks for comfort & value</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="h-44 bg-gray-100 rounded-lg animate-pulse" />
                                        ))
                                    ) : (
                                        (hotels.slice(0, 6)).map((hotel) => (
                                            <Card key={hotel._id} className="overflow-hidden rounded-xl hover:shadow-2xl transition-all">
                                                <div className="aspect-video bg-gray-50 relative">
                                                    <img src={hotel.logo || hotel.medias?.[0] || '/placeholder.svg'} alt={hotel.name} className="w-full h-full object-cover" />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white capitalize">{hotel.category}</Badge>
                                                    </div>
                                                </div>
                                                <CardContent>
                                                    <h3 className="font-semibold text-lg line-clamp-2">{hotel.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                                                        <span>{typeof hotel.location === 'object' ? hotel.location?.name : hotel.location}</span>
                                                    </div>
                                                    {hotel.website && (
                                                        <div className="mt-1 text-xs text-blue-600 underline"><a href={hotel.website} target="_blank" rel="noopener noreferrer">{hotel.website}</a></div>
                                                    )}
                                                    {hotel.socials && hotel.socials.length > 0 && (
                                                        <div className="mt-1 flex gap-2 flex-wrap">
                                                            {hotel.socials.map((s, i) => (
                                                                <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline">{s}</a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">{[...Array(5)].map((_,i)=> <Star key={i} className={`w-4 h-4 ${i < Math.floor(hotel.rating||0) ? 'text-yellow-400' : 'text-gray-200'}`} />)}</div>
                                                            <span className="text-sm text-gray-600">{(hotel.rating||0).toFixed(1)}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500">From</div>
                                                            <div className="text-lg font-bold text-gray-900">${hotel.pricePerNight || hotel.price || 0}</div>
                                                        </div>
                                                    </div>
                                                    {hotel.amenities && hotel.amenities.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {hotel.amenities.map((amenity, idx) => {
                                                                const IconComponent = getAmenityIcon(amenity)
                                                                return (
                                                                    <span key={idx} className="flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-full text-xs text-rose-700"><IconComponent className="h-3 w-3 text-rose-600" />{amenity}</span>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <aside className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                                <h3 className="text-lg font-semibold mb-2">Why book with us?</h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-3"><span className="text-rose-600 mt-1"><Users className="w-5 h-5" /></span><div><strong>Trusted hosts</strong><div className="text-xs">Verified stays & 24/7 support</div></div></li>
                                    <li className="flex items-start gap-3"><span className="text-rose-600 mt-1"><Award className="w-5 h-5" /></span><div><strong>Best prices</strong><div className="text-xs">Exclusive offers & deals</div></div></li>
                                    <li className="flex items-start gap-3"><span className="text-rose-600 mt-1"><Zap className="w-5 h-5" /></span><div><strong>Easy bookings</strong><div className="text-xs">Instant confirmation & flexible dates</div></div></li>
                                </ul>
                            </motion.div>

                            
                        </aside>
                    </div>
                </section>
            

                {/* CTA */}
                <section className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white mb-16 shadow-2xl">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-3xl font-extrabold">Ready for your next trip?</h3>
                            <p className="mt-2 text-white/90">Find unique stays and unforgettable experiences. Book now & get exclusive member discounts.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={()=> navigate('/login')} className="bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold">Join & Save</Button>
                            <Button onClick={()=> window.scrollTo({top: 400, behavior:'smooth'})} className="bg-white/20 border border-white text-white px-5 py-3 rounded-xl">Browse Stays</Button>
                        </div>
                    </div>
                </section>

                {/* Footer spacing */}
                <div className="h-24" />
            </main>
        </div>
    )
}