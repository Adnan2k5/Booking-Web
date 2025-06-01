import React from 'react'
import { motion } from "framer-motion"
import { Clock, MapPin, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useTranslation } from 'react-i18next'
import InstructorLayout from './InstructorLayout'
import { fadeIn, staggerContainer } from '../../assets/Animations'
import { useNavigate } from 'react-router-dom';

export const InstructorSession = () => {
    const navigate = useNavigate();
    const mockData = {
        instructor: {
            id: 1,
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            specialty: "Mountain Hiking",
            experience: "8 years",
            rating: 4.9,
            img: "/placeholder.svg?height=400&width=300",
            bio: "Certified mountain guide with expertise in alpine terrain and wilderness survival.",
            totalRevenue: 24580,
            totalBookings: 156,
            upcomingSessions: 12,
            completedSessions: 144,
            revenueIncrease: 12.5,
            bookingIncrease: 8.2,
            languages: ["English", "Spanish", "French"],
            certificates: ["Mountain Guide Certification", "First Aid Certification", "Avalanche Safety"],
        },
        sessions: [
            {
                id: "S-1001",
                title: "Mountain Climbing Basics",
                adventure: "Mountain Climbing",
                location: "Alpine Heights",
                price: 120,
                duration: "6 hours",
                capacity: 8,
                description: "Learn the fundamentals of mountain climbing in a safe environment with professional guidance.",
                upcoming: [
                    { date: "2025-04-20", time: "09:00 AM", booked: 4, available: 4 },
                    { date: "2025-04-27", time: "09:00 AM", booked: 6, available: 2 },
                    { date: "2025-05-04", time: "09:00 AM", booked: 2, available: 6 },
                ],
            },
            {
                id: "S-1002",
                title: "Wilderness Survival Workshop",
                adventure: "Wilderness Survival",
                location: "Evergreen Forest",
                price: 150,
                duration: "8 hours",
                capacity: 10,
                description: "Master essential survival skills in the wilderness, including shelter building, fire making, and navigation.",
                upcoming: [
                    { date: "2025-04-22", time: "10:00 AM", booked: 6, available: 4 },
                    { date: "2025-04-29", time: "10:00 AM", booked: 8, available: 2 },
                    { date: "2025-05-06", time: "10:00 AM", booked: 3, available: 7 },
                ],
            },
            {
                id: "S-1003",
                title: "Rock Climbing for Beginners",
                adventure: "Rock Climbing",
                location: "Granite Peaks",
                price: 125,
                duration: "5 hours",
                capacity: 6,
                description: "Introduction to rock climbing techniques, safety procedures, and equipment for beginners.",
                upcoming: [
                    { date: "2025-04-25", time: "08:30 AM", booked: 3, available: 3 },
                    { date: "2025-05-02", time: "08:30 AM", booked: 5, available: 1 },
                    { date: "2025-05-09", time: "08:30 AM", booked: 2, available: 4 },
                ],
            },
        ],
    }

    const { t } = useTranslation();
    return (
        <InstructorLayout>
            <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                        <div className="relative w-full sm:w-64 lg:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t("instructor.searchSessions")}
                                className="w-full pl-8 h-10 text-sm sm:text-base"
                            />
                        </div>
                    </div>
                    <Button
                        className="w-full sm:w-auto h-10 text-sm sm:text-base px-4 sm:px-6"
                        onClick={() => navigate("/instructor/sessions/new")}
                    >
                        <span className="hidden sm:inline">{t("instructor.createNewSession")}</span>
                        <span className="sm:hidden">New Session</span>
                    </Button>
                </div>

                <motion.div className="space-y-4 sm:space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
                    {mockData.sessions.map((session) => (
                        <motion.div key={session.id} variants={fadeIn}>
                            <Card className="overflow-hidden">
                                <CardHeader className="p-4 sm:p-6">
                                    <div className="flex flex-col space-y-3 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                                                {session.title}
                                            </CardTitle>
                                            <CardDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                                <div className="flex items-center text-sm sm:text-base">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" />
                                                    <span className="truncate">{session.location}</span>
                                                </div>
                                                <span className="hidden sm:inline text-muted-foreground">•</span>
                                                <div className="flex items-center text-sm sm:text-base">
                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" />
                                                    <span>{session.duration}</span>
                                                </div>
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 lg:flex-col lg:items-end lg:space-x-0 lg:space-y-2">
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700 border-blue-200 w-fit text-xs sm:text-sm px-2 py-1"
                                            >
                                                {session.adventure}
                                            </Badge>
                                            <div className="font-semibold text-lg sm:text-xl lg:text-2xl text-primary">
                                                ${session.price}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                                        {session.description}
                                    </p>

                                    <div className="space-y-3 sm:space-y-4">
                                        <h4 className="font-medium text-sm sm:text-base lg:text-lg">
                                            {t("instructor.upcomingDates")}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                            {session.upcoming.map((date, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-lg p-3 sm:p-4 bg-card hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-3">
                                                        <div className="font-medium text-sm sm:text-base">
                                                            {new Date(date.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                                                            {date.time}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                                                        <div className="text-xs sm:text-sm">
                                                            <span className="text-green-600 font-semibold">{date.booked}</span>
                                                            <span className="text-muted-foreground">/{session.capacity} </span>
                                                            <span className="hidden sm:inline">{t("instructor.booked")}</span>
                                                            <span className="sm:hidden">booked</span>
                                                        </div>
                                                        <Badge
                                                            variant={date.available > 0 ? "outline" : "secondary"}
                                                            className="w-fit text-xs px-2 py-1"
                                                        >
                                                            {date.available > 0
                                                                ? `${date.available} ${t("instructor.available") || "available"}`
                                                                : t("instructor.fullyBooked") || "Full"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-2 sm:space-y-3 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-3 p-4 sm:p-6 bg-gray-50/50">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto h-9 sm:h-10 text-sm px-4 hover:bg-accent"
                                    >
                                        <span className="hidden sm:inline">{t("instructor.editSession")}</span>
                                        <span className="sm:hidden">Edit</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto h-9 sm:h-10 text-sm px-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                        <span className="hidden sm:inline">{t("instructor.cancelSession")}</span>
                                        <span className="sm:hidden">Cancel</span>
                                    </Button>
                                    <Button className="w-full sm:w-auto h-9 sm:h-10 text-sm px-4">
                                        <span className="hidden sm:inline">{t("instructor.addDates")}</span>
                                        <span className="sm:hidden">Add Dates</span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </InstructorLayout>
    )
}
