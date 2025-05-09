import React from 'react'
import { motion } from "framer-motion"
import { Clock, MapPin, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useTranslation } from 'react-i18next'
import InstructorLayout from './InstructorLayout'
import { fadeIn, staggerContainer } from '../../assets/Animations'

export const InstructorSession = () => {
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
        upcomingBookings: [
            {
                id: "B-1234",
                adventure: "Mountain Climbing",
                location: "Alpine Heights",
                date: "2025-04-20",
                time: "09:00 AM",
                duration: "6 hours",
                participants: 4,
                amount: 450,
                status: "confirmed",
            },
            {
                id: "B-1235",
                adventure: "Wilderness Survival",
                location: "Evergreen Forest",
                date: "2025-04-22",
                time: "10:00 AM",
                duration: "8 hours",
                participants: 6,
                amount: 720,
                status: "confirmed",
            },
            {
                id: "B-1236",
                adventure: "Rock Climbing",
                location: "Granite Peaks",
                date: "2025-04-25",
                time: "08:30 AM",
                duration: "5 hours",
                participants: 3,
                amount: 375,
                status: "pending",
            },
        ],
        recentBookings: [
            {
                id: "B-1230",
                adventure: "Mountain Climbing",
                location: "Alpine Heights",
                date: "2025-04-10",
                participants: 5,
                amount: 550,
                status: "completed",
                rating: 5,
            },
            {
                id: "B-1231",
                adventure: "Wilderness Survival",
                location: "Evergreen Forest",
                date: "2025-04-08",
                participants: 4,
                amount: 480,
                status: "completed",
                rating: 4.8,
            },
            {
                id: "B-1232",
                adventure: "Rock Climbing",
                location: "Granite Peaks",
                date: "2025-04-05",
                participants: 3,
                amount: 375,
                status: "completed",
                rating: 5,
            },
            {
                id: "B-1233",
                adventure: "Alpine Hiking",
                location: "Mountain Range",
                date: "2025-04-02",
                participants: 6,
                amount: 600,
                status: "completed",
                rating: 4.7,
            },
        ],
        monthlyRevenue: [
            { month: "Jan", revenue: 1800 },
            { month: "Feb", revenue: 2200 },
            { month: "Mar", revenue: 2500 },
            { month: "Apr", revenue: 2800 },
            { month: "May", revenue: 3200 },
            { month: "Jun", revenue: 3500 },
            { month: "Jul", revenue: 3800 },
            { month: "Aug", revenue: 3600 },
            { month: "Sep", revenue: 3400 },
            { month: "Oct", revenue: 3100 },
            { month: "Nov", revenue: 2800 },
            { month: "Dec", revenue: 2500 },
        ],
        adventureTypes: [
            { name: "Mountain Climbing", bookings: 45, revenue: 5400 },
            { name: "Wilderness Survival", bookings: 38, revenue: 4560 },
            { name: "Rock Climbing", bookings: 32, revenue: 3840 },
            { name: "Alpine Hiking", bookings: 41, revenue: 4920 },
        ],
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
                description:
                    "Master essential survival skills in the wilderness, including shelter building, fire making, and navigation.",
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
            <div value="sessions" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder={t("instructor.searchSessions")} className="w-full pl-8" />
                        </div>
                    </div>
                    <Button onClick={() => navigate("/instructor/sessions/new")}>{t("instructor.createNewSession")}</Button>
                </div>

                <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
                    {mockData.sessions.map((session) => (
                        <motion.div key={session.id} variants={fadeIn}>
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                            <CardTitle>{session.title}</CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {session.location}
                                                <span className="mx-2">•</span>
                                                <Clock className="h-3 w-3 mr-1" />
                                                {session.duration}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {session.adventure}
                                            </Badge>
                                            <div className="font-semibold text-lg">${session.price}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{session.description}</p>

                                    <div className="space-y-3">
                                        <h4 className="font-medium">{t("instructor.upcomingDates")}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {session.upcoming.map((date, index) => (
                                                <div key={index} className="border rounded-lg p-3 bg-card">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="font-medium">{new Date(date.date).toLocaleDateString()}</div>
                                                        <div className="text-sm text-muted-foreground">{date.time}</div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm">
                                                            <span className="text-green-600">{date.booked}</span>/{session.capacity}{" "}
                                                            {t("instructor.booked")}
                                                        </div>
                                                        <Badge variant={date.available > 0 ? "outline" : "secondary"}>
                                                            {date.available > 0
                                                                ? `${date.available} ${t("instructor.available")}`
                                                                : t("instructor.fullyBooked")}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline">{t("instructor.editSession")}</Button>
                                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        {t("instructor.cancelSession")}
                                    </Button>
                                    <Button>{t("instructor.addDates")}</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </InstructorLayout>
    )
}
