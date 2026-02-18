import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { MapPin, Calendar, Clock, Star, Award, Sparkles, ArrowLeft, Trophy, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { getEvents } from "../Api/event.api"
import { Loader } from "../components/Loader"

const SecretNftEvents = () => {
    const [nftEvents, setNftEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showEasterEgg, setShowEasterEgg] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNftEvents = async () => {
            try {
                setIsLoading(true)
                const response = await getEvents({ limit: 10 })
                if (response && Array.isArray(response.data)) {
                    const eventsWithNfts = response.data.filter(
                        (event) => event.isNftEvent || (event.nftReward && event.nftReward.enabled),
                    )
                    setNftEvents(eventsWithNfts)
                } else {
                    setError("No event data received from server.")
                    setNftEvents([])
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

    if (showEasterEgg) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(200)].map((_, i) => (
                        <motion.div
                            key={`star-${i}`}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                opacity: [0.1, 1, 0.1],
                                scale: [0.5, 1.5, 0.5],
                            }}
                            transition={{
                                duration: Math.random() * 4 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"
                />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 1.2,
                        }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Trophy className="w-32 h-32 text-yellow-400" strokeWidth={1.5} />
                            </motion.div>

                            <motion.div
                                className="absolute -top-2 -right-2"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Sparkles className="w-12 h-12 text-pink-400" />
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-2 -left-2"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [360, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Zap className="w-12 h-12 text-blue-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight"
                            style={{
                                textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(138,43,226,0.4)',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            You Found It!
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="relative"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                                The Secret Easter Egg
                            </h2>
                            <motion.div
                                className="absolute -inset-4"
                                animate={{
                                    background: [
                                        'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                                        'radial-gradient(circle, rgba(255,105,180,0.1) 0%, transparent 70%)',
                                        'radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)',
                                        'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                                    ],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{ zIndex: -1 }}
                            />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                            style={{
                                fontWeight: 300,
                                letterSpacing: '0.01em',
                            }}
                        >
                            Unlock exclusive NFT adventures that were hidden from the ordinary.
                            <br />
                            <span className="text-purple-300 font-medium">
                                Your journey into the extraordinary begins now.
                            </span>
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="mt-12"
                    >
                        <motion.button
                            onClick={() => setShowEasterEgg(false)}
                            className="relative group px-12 py-5 text-xl font-bold text-black bg-white rounded-full overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 tracking-wide">Continue</span>

                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(255,255,255,0.5)',
                                        '0 0 40px rgba(255,105,180,0.6)',
                                        '0 0 20px rgba(255,255,255,0.5)',
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.8 }}
                        className="mt-8"
                    >
                        <p className="text-sm text-gray-500 tracking-widest uppercase">
                            Limited Access · Elite Adventures Only
                        </p>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="fixed inset-0 z-0">
                {[...Array(200)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.1, 1, 0.1],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30 z-0"
            />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                    className="flex justify-start mb-8"
                >
                    <motion.button
                        onClick={handleBackToHome}
                        className="group relative px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden"
                        whileHover={{ scale: 1.05, x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                        />
                        <div className="relative flex items-center gap-2 text-white">
                            <motion.div
                                animate={{ x: [0, -4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </motion.div>
                            <span className="font-medium tracking-wide">Back to Home</span>
                        </div>
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                                boxShadow: [
                                    '0 0 0 0 rgba(255,255,255,0)',
                                    '0 0 0 4px rgba(138,43,226,0.1)',
                                    '0 0 0 0 rgba(255,255,255,0)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-16 space-y-6"
                >
                    <div className="relative inline-block">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 150 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight"
                            style={{
                                textShadow: '0 0 60px rgba(255,255,255,0.2), 0 0 100px rgba(138,43,226,0.3)',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Secret NFT Events
                        </motion.h1>
                        <motion.div
                            className="absolute -inset-8 opacity-30"
                            animate={{
                                background: [
                                    'radial-gradient(circle, rgba(138,43,226,0.2) 0%, transparent 70%)',
                                    'radial-gradient(circle, rgba(255,105,180,0.2) 0%, transparent 70%)',
                                    'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                                    'radial-gradient(circle, rgba(138,43,226,0.2) 0%, transparent 70%)',
                                ],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ zIndex: -1 }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex items-center justify-center gap-3 flex-wrap"
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                        <p
                            className="text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300 max-w-3xl"
                            style={{
                                fontWeight: 300,
                                letterSpacing: '0.02em',
                            }}
                        >
                            Adventures you did already were sidequests.
                            <br />
                            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
                                Let's start with the real thrill.
                            </span>
                        </p>
                        <motion.div
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Award className="w-6 h-6 text-purple-400" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
                        className="inline-block"
                    >
                        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                                Elite Collection
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-block px-8 py-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl">
                            <p className="text-red-400 font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}

                {nftEvents.length === 0 && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center py-32"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-6 flex justify-center"
                        >
                            <Trophy className="w-24 h-24 text-gray-600" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No Events Available</h3>
                        <p className="text-gray-500 text-lg">Check back later for exclusive NFT adventures</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <AnimatePresence>
                        {nftEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -60, scale: 0.8 }}
                                transition={{
                                    duration: 0.7,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15,
                                }}
                                whileHover={{
                                    y: -12,
                                    scale: 1.02,
                                    transition: { duration: 0.3, type: "spring", stiffness: 300 },
                                }}
                                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                                onClick={() => handleEventClick(event._id)}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500"
                                />

                                <div className="relative">
                                    <div className="absolute top-4 right-4 z-20">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                                        >
                                            <Badge className="bg-white/90 text-black font-semibold text-xs px-3 py-1 shadow-sm">
                                                <Award className="w-3 h-3 mr-1" />
                                                NFT
                                            </Badge>
                                        </motion.div>
                                    </div>

                                    <div className="relative h-48 sm:h-56 overflow-hidden">
                                        <motion.img
                                            src={event.image || "/placeholder.svg?height=200&width=300"}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.15 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <h3
                                            className="text-xl font-bold text-white transition-all duration-300 line-clamp-2"
                                            style={{ letterSpacing: '-0.01em' }}
                                        >
                                            {event.title}
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <span className="text-sm font-normal truncate">
                                                    {event.city}, {event.country}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <span className="text-sm font-normal">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <span className="text-sm font-normal">
                                                    {event.startTime} - {event.endTime}
                                                </span>
                                            </div>
                                        </div>

                                        {event.nftReward && event.nftReward.enabled && (
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="w-4 h-4 text-gray-400" />
                                                    <span className="text-white font-semibold text-sm truncate">
                                                        {event.nftReward.nftName || "Exclusive NFT"}
                                                    </span>
                                                </div>
                                                {event.nftReward.nftDescription && (
                                                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                                                        {event.nftReward.nftDescription}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {event.price > 0 && (
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm font-medium">Price</span>
                                                    <span className="text-white text-xl font-bold">£{event.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {event.price === 0 && (
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <span className="text-gray-300 text-sm font-semibold tracking-wider">FREE EVENT</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 + i * 0.05 }}
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${i < event.level
                                                                ? "text-gray-300 fill-gray-300"
                                                                : "text-gray-700"
                                                                }`}
                                                        />
                                                    </motion.div>
                                                ))}
                                                <span className="text-gray-400 text-xs ml-2 font-medium">
                                                    Level {event.level}
                                                </span>
                                            </div>

                                            <motion.div
                                                whileHover={{ rotate: 180, scale: 1.2 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Sparkles className="w-5 h-5 text-gray-500" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-center mt-20 py-12"
                >
                    <div className="max-w-3xl mx-auto px-6">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-flex items-center gap-3 mb-4"
                        >
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            <Sparkles className="w-5 h-5 text-pink-400" />
                            <Award className="w-6 h-6 text-purple-400" />
                        </motion.div>
                        <p
                            className="text-gray-400 leading-relaxed"
                            style={{ letterSpacing: '0.02em' }}
                        >
                            Each NFT event completion awards you with a unique digital collectible
                            <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 font-semibold">
                                {" "}that proves your adventure achievements.
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default SecretNftEvents
