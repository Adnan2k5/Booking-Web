import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, Star, Award, Gem, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { getEvents } from '../Api/event.api'
import { Loader } from '../components/Loader'

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
                    const eventsWithNfts = response.data.events?.filter(event =>
                        event.isNftEvent || (event.nftReward && event.nftReward.enabled)
                    ) || []

                    setNftEvents(eventsWithNfts)
                } else if (Array.isArray(response)) {
                    const eventsWithNfts = response.filter(event =>
                        event.isNftEvent || (event.nftReward && event.nftReward.enabled)
                    )
                    setNftEvents(eventsWithNfts)
                }
            } catch (err) {
                console.error('Error fetching NFT events:', err)
                setError('Failed to load NFT events')
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
        navigate('/')
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
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
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <Gem className="w-12 h-12 text-yellow-400" />
                        <h1 className="text-5xl font-bold text-white">Secret NFT Events</h1>
                        <Sparkles className="w-12 h-12 text-purple-400" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        🎉 Congratulations! You've discovered our hidden collection of exclusive events with NFT rewards.
                        These special adventures come with unique digital collectibles that commemorate your experience.
                    </motion.p>
                </motion.div>

                {/* Events Grid */}
                {error && (
                    <div className="text-center text-red-400 mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {nftEvents.length === 0 && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-300 py-20"
                    >
                        <Gem className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-xl">No NFT events available at the moment.</p>
                        <p className="text-gray-400 mt-2">Check back later for exclusive NFT adventures!</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    stiffness: 100
                                }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group"
                                onClick={() => handleEventClick(event._id)}
                            >
                                {/* NFT Badge */}
                                <div className="absolute top-4 right-4 z-20">
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                                        <Award className="w-3 h-3 mr-1" />
                                        NFT Reward
                                    </Badge>
                                </div>

                                {/* Event Image */}
                                <div className="relative h-48 overflow-hidden">
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
                                            rotate: [0, 5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                        className="absolute top-4 left-4"
                                    >
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
                                    </motion.div>
                                </div>

                                {/* Event Details */}
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-2">
                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPin className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm">{event.city}, {event.country}</span>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Calendar className="w-4 h-4 text-green-400" />
                                            <span className="text-sm">
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm">
                                                {event.startTime} - {event.endTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* NFT Reward Info */}
                                    {event.nftReward && event.nftReward.enabled && (
                                        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-3 rounded-lg border border-yellow-400/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Gem className="w-4 h-4 text-yellow-400" />
                                                <span className="text-yellow-400 font-semibold text-sm">
                                                    {event.nftReward.nftName || "Exclusive NFT"}
                                                </span>
                                            </div>
                                            {event.nftReward.nftDescription && (
                                                <p className="text-gray-300 text-xs">
                                                    {event.nftReward.nftDescription}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Level indicator */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < event.level ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-gray-300 text-xs ml-2">Level {event.level}</span>
                                        </div>

                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-yellow-400"
                                        >
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
                    <p className="text-gray-400 text-sm">
                        🏆 Each NFT event completion awards you with a unique digital collectible that proves your adventure achievements.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SecretNftEvents
