"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const EnhancedLandingPage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: { scale: 0.95 },
    }

    const parallaxStyle = {
        transform: `translateY(${scrollY * 0.3}px)`,
        transition: "transform 0.1s ease-out",
    }

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section with Parallax */}
            <div className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20" style={parallaxStyle}>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/path/to/pattern.svg')] bg-repeat"></div>
                </div>

                <motion.div
                    className="container mx-auto px-4 z-10 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                >
                    <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={itemVariants}>
                        {t("landingPage.heroTitle")}
                    </motion.h1>

                    <motion.p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" variants={itemVariants}>
                        {t("landingPage.heroSubtitle")}
                    </motion.p>

                    <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
                        <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                            <Button
                                onClick={() => navigate("/browsing")}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300"
                            >
                                {t("landingPage.exploreButton")}
                            </Button>
                        </motion.div>

                        <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                            <Button
                                onClick={() => navigate("/group-booking")}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300"
                            >
                                {t("landingPage.groupButton")}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    animate={{
                        y: [0, 10, 0],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                    }}
                >
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>

            {/* Features Section with Animation */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        className="text-4xl font-bold text-center mb-16 text-gray-800"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t("landingPage.featuresTitle")}
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3].map((item) => (
                            <motion.div
                                key={item}
                                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: item * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">
                                    {t(`landingPage.feature${item}Title`)}
                                </h3>
                                <p className="text-gray-600 text-center">{t(`landingPage.feature${item}Description`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <motion.div
                className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        className="text-4xl font-bold mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t("landingPage.ctaTitle")}
                    </motion.h2>

                    <motion.p
                        className="text-xl mb-10 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {t("landingPage.ctaDescription")}
                    </motion.p>

                    <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                        <Button
                            onClick={() => navigate("/booking")}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-10 rounded-full text-lg shadow-lg transform transition-all duration-300"
                        >
                            {t("landingPage.ctaButton")}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default EnhancedLandingPage
