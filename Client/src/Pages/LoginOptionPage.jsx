"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Compass, GraduationCap, Building2 } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { Nav_Landing } from "../components/Nav_Landing"

export default function LoginOptionsPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [hoveredCard, setHoveredCard] = useState(null)

    const cards = [
        {
            id: "explorer",
            title: "Explorer",
            description: t("Joiin As Explorer"),
            image: "/src/assets/scubadiving-min.jpg",
            path1: "/login",
            path2: "/login",
            color: "from-emerald-500 to-teal-600",
            icon: Compass
        },
        {
            id: "instructor",
            title: "Instructor",
            description: t("Join As Instructor"),
            image: "/src/assets/face.jpeg",
            path1: "/instructor/register",
            path2: "/login",
            color: "from-blue-500 to-indigo-600",
            icon: GraduationCap
        },
        {
            id: "hotel",
            title: "Accommodation",
            description: t("Join As Accommodation Provider"),
            image: "/src/assets/login.jpg",
            color: "from-amber-500 to-orange-600",
            path1: "/hotel/register",
            path2: "/login",
            icon: Building2
        }
    ]

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <Nav_Landing />

            <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
                <div className="max-w-7xl w-full">
                    {/* Header - Compact on mobile */}
                    <div className="text-center mb-8 md:mb-12">
                        <motion.h1
                            className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t("Choose Your Account Type")}
                        </motion.h1>
                        <motion.p
                            className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {t("selectAccountType")}
                        </motion.p>
                    </div>

                    {/* Cards Container */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-4 perspective-[1000px]">
                        {cards.map((card, index) => {
                            const IconComponent = card.icon
                            return (
                                <motion.div
                                    key={card.id}
                                    className="relative w-full md:w-1/3 max-w-sm h-[160px] md:h-[450px] cursor-pointer group"
                                    initial={{
                                        opacity: 0,
                                        rotateY: 15,
                                        rotateX: 15,
                                        translateZ: -50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        rotateY: index === 0 ? -15 : index === 2 ? 15 : 0,
                                        rotateX: 0,
                                        translateZ: 0
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.15
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        rotateY: 0,
                                        translateZ: 50,
                                        transition: { duration: 0.3 }
                                    }}
                                    onHoverStart={() => setHoveredCard(card.id)}
                                    onHoverEnd={() => setHoveredCard(null)}
                                >
                                    {/* Mobile: Glassmorphism horizontal card */}
                                    <div className="md:hidden absolute inset-0 overflow-hidden rounded-2xl mobile-glass-input backdrop-blur-xl transition-all duration-300 active:scale-[0.98]">
                                        <div className="absolute inset-0 flex items-center p-5 gap-4">
                                            {/* Icon with gradient background */}
                                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                                <IconComponent className="h-7 w-7 text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">{card.title}</h3>
                                                <p className="text-sm text-white/80 truncate">{card.description}</p>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => navigate(`${card.path2}?action=signin&role=${card.id}`)}
                                                    className="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 text-sm font-semibold rounded-lg transition-all duration-200 shadow-md flex items-center gap-1"
                                                >
                                                    Sign In
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`${card.path1}?action=signup&role=${card.id}`)}
                                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-white/30 flex items-center gap-1"
                                                >
                                                    Sign Up
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Original tilted card design */}
                                    <div className="hidden md:block absolute inset-0 overflow-hidden rounded-2xl transform-style-3d rotate-y-[-15deg] shadow-2xl">
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${card.image})` }}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80`} />
                                        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                            <h3 className="text-3xl font-bold mb-2">{card.title}</h3>
                                            <p className="text-white/90 mb-6">{card.description}</p>
                                            <div className="flex items-center justify-between">
                                                <motion.div
                                                    onClick={() => { navigate(`${card.path2}?action=signin&role=${card.id}`) }}
                                                    className="flex items-center text-sm font-semibold"
                                                    animate={{
                                                        x: hoveredCard === card.id ? 10 : 0
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    Sign In
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </motion.div>
                                                <motion.div
                                                    onClick={() => { navigate(`${card.path1}?action=signup&role=${card.id}`) }}
                                                    className="flex items-center text-sm font-semibold"
                                                    animate={{
                                                        x: hoveredCard === card.id ? 10 : 0
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    Sign Up
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </motion.div>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
