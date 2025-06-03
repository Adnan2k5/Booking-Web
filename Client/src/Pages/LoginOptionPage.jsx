"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { Nav_Landing } from "../components/Nav_Landing"
import ReactPlayer from "react-player"

export default function LoginOptionsPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [hoveredCard, setHoveredCard] = useState(null)

    const onReady = (reactPlayer) => {
        const internalPlayer = reactPlayer.getInternalPlayer();
        // Tries to set quality — doesn't always work depending on YouTube
        if (internalPlayer.setPlaybackQuality) {
            internalPlayer.setPlaybackQuality('hd1080'); // 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'
        }
    };

    const cards = [
        {
            id: "explorer",
            title: "Explorer",
            description: t("Joiin As Explorer"),
            image: "/src/assets/scubadiving-min.jpg",
            path1: "/login",
            path2: "/login",
            color: "from-emerald-500 to-teal-600"
        },
        {
            id: "instructor",
            title: "Instructor",
            description: t("Join As Instructor"),
            image: "/src/assets/face.jpeg",
            path1: "/instructor/register",
            path2: "/login",
            color: "from-blue-500 to-indigo-600"
        },
        {
            id: "hotel",
            title: "Hotel",
            description: t("Join As Hotel"),
            image: "/src/assets/login.jpg",
            color: "from-amber-500 to-orange-600",
            path1: "/hotel/register",
            path2: "/login",
        }
    ]

    return (
        <div className="min-h-screen flex flex-col relative ">
            {/* Background Video - Fixed at 100vh */}
            <div className="bg absolute top-0 left-0 w-full h-screen overflow-hidden -z-50">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <ReactPlayer
                    url={"https://youtu.be/FfPVvtNo92s"}
                    onReady={onReady}
                    controls={false}
                    loop={true}
                    playing={true}
                    muted={true}
                    width="100%"
                    height="100%"
                />
            </div>

            <Nav_Landing />

            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-7xl w-full px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t("Choose Your Account Type")}
                        </motion.h1>
                        <motion.p
                            className="text-lg text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {t("selectAccountType")}
                        </motion.p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 perspective-[1000px]">
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                className="relative w-full md:w-1/3 max-w-sm h-[450px] cursor-pointer group"
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
                                    delay: index * 0.2
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
                                <div className="absolute inset-0 overflow-hidden rounded-2xl transform-style-3d rotate-y-[-15deg] shadow-2xl">
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
                                                onClick={() => { navigate(card.path2) }}
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
                                                onClick={() => { navigate(card.path1) }}
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
