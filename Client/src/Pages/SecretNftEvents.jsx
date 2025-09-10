import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { MapPin, Calendar, Clock, Star, Award, Gem, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { getEvents } from "../Api/event.api"
import { Loader } from "../components/Loader"

const SecretNftEvents = () => {
    const [nftEvents, setNftEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNftEvents = async () => {
            try {
                setIsLoading(true)
                const response = await getEvents({ limit: 100 }) // Get all events

                if (response && response.data) {
                    // Filter events that have NFT rewards
                    const eventsWithNfts =
                        response.data.events?.filter((event) => event.isNftEvent || (event.nftReward && event.nftReward.enabled)) ||
                        []

                    setNftEvents(eventsWithNfts)
                } else if (Array.isArray(response)) {
                    const eventsWithNfts = response.filter(
                        (event) => event.isNftEvent || (event.nftReward && event.nftReward.enabled),
                    )
                    setNftEvents(eventsWithNfts)
                }
            } catch (err) {
                console.error("Error fetching NFT events:", err)
                setError("Failed to load NFT events")
            } finally {
                setIsLoading(false)
            }
        }

        fetchNftEvents()
    }, [])

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`)
    }

    const handleBackToHome = () => {
        navigate("/")
    }

    if (isLoading) {
        return <Loader />
    }

    const generateShootingStars = () => {
        const stars = []
        for (let i = 0; i < 15; i++) {
            const delay = Math.random() * 5
            const duration = Math.random() * 3 + 2
            const startX = Math.random() * window.innerWidth
            const startY = Math.random() * window.innerHeight

            stars.push(
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-80"
                    style={{
                        left: startX,
                        top: startY,
                    }}
                    animate={{
                        x: [0, -200, -400],
                        y: [0, 100, 200],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: duration,
                        delay: delay,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: Math.random() * 3 + 2,
                        ease: "linear",
                    }}
                />,
            )
        }
        return stars
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                {generateShootingStars()}

                {/* Static twinkling stars */}
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={`static-${i}`}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Button
                            onClick={handleBackToHome}
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="flex items-center justify-center gap-3 mb-6 flex-wrap"
                    >
                        <Gem className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center">Secret NFT Events</h1>
                        <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4"
                    >
                        Adventures you did already were sidequests Let's start with real thrill.
                    </motion.p>
                </motion.div>

                {/* Events Grid */}
                {error && (
                    <div className="text-center text-red-400 mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {nftEvents.length === 0 && !error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-300 py-20">
                        <Gem className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-xl">No NFT events available at the moment.</p>
                        <p className="text-gray-400 mt-2">Check back later for exclusive NFT adventures!</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    <AnimatePresence>
                        {nftEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                    transition: { duration: 0.2 },
                                }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group"
                                onClick={() => handleEventClick(event._id)}
                            >
                                {/* NFT Badge */}
                                <div className="absolute top-4 right-4 z-20">
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">
                                        <Award className="w-3 h-3 mr-1" />
                                        NFT Reward
                                    </Badge>
                                </div>

                                {/* Event Image */}
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <motion.img
                                        src={event.image || "/placeholder.svg?height=200&width=300"}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                    {/* Floating NFT elements */}
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 5, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: "reverse",
                                        }}
                                        className="absolute top-4 left-4"
                                    >
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
                                    </motion.div>
                                </div>

                                {/* Event Details */}
                                <div className="p-4 sm:p-6 space-y-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-2">
                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            <span className="text-sm truncate">
                                                {event.city}, {event.country}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Calendar className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                            <span className="text-sm">
                                                {event.startTime} - {event.endTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* NFT Reward Info */}
                                    {event.nftReward && event.nftReward.enabled && (
                                        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-3 rounded-lg border border-yellow-400/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Gem className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                <span className="text-yellow-400 font-semibold text-sm truncate">
                                                    {event.nftReward.nftName || "Exclusive NFT"}
                                                </span>
                                            </div>
                                            {event.nftReward.nftDescription && (
                                                <p className="text-gray-300 text-xs line-clamp-2">{event.nftReward.nftDescription}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Level indicator */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < event.level ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                                />
                                            ))}
                                            <span className="text-gray-300 text-xs ml-2">Level {event.level}</span>
                                        </div>

                                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="text-yellow-400">
                                            <Sparkles className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-16 py-8"
                >
                    <p className="text-gray-400 text-sm px-4">
                        🏆 Each NFT event completion awards you with a unique digital collectible that proves your adventure
                        achievements.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SecretNftEvents
