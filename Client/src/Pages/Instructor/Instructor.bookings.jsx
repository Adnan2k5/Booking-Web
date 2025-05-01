import React from 'react'
import { motion } from "framer-motion"
import { Calendar, Users, Star, Clock, MapPin, Filter, Search, Check } from "lucide-react"
import { Card, CardContent, } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { useTranslation } from 'react-i18next'
import InstructorLayout from './InstructorLayout'

export const InstructorBookings = () => {

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

    const adventureTypes = [
        "Mountain Climbing",
        "Wilderness Survival",
        "Rock Climbing",
        "Alpine Hiking",
        "Kayaking",
        "Scuba Diving",
        "Paragliding",
        "Skiing",
    ]

    const locations = [
        "Alpine Heights",
        "Evergreen Forest",
        "Granite Peaks",
        "Mountain Range",
        "Crystal Lake",
        "Coastal Cliffs",
        "Desert Canyon",
        "Snowy Summit",
    ]
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    }


    const { t } = useTranslation()
    return (
        <InstructorLayout>
            <div value="bookings" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder={t("instructor.searchBookings")} className="w-full pl-8" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t("instructor.filterByStatus")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("instructor.allBookings")}</SelectItem>
                                <SelectItem value="upcoming">{t("instructor.upcomingOnly")}</SelectItem>
                                <SelectItem value="completed">{t("instructor.completedOnly")}</SelectItem>
                                <SelectItem value="pending">{t("instructor.pendingOnly")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs defaultValue="upcoming" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="upcoming">{t("instructor.upcoming")}</TabsTrigger>
                        <TabsTrigger value="completed">{t("instructor.completed")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                            {mockData.upcomingBookings.map((booking) => (
                                <motion.div key={booking.id} variants={fadeIn}>
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-3 rounded-full">
                                                        <Calendar className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{booking.adventure}</h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-3">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                <span>{booking.location}</span>
                                                            </div>
                                                            <div className="hidden sm:block">•</div>
                                                            <div className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                <span>
                                                                    {new Date(booking.date).toLocaleDateString()} {booking.time}
                                                                </span>
                                                            </div>
                                                            <div className="hidden sm:block">•</div>
                                                            <div>{booking.duration}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {booking.participants} {t("instructor.participants")}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-lg">${booking.amount}</div>
                                                    <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                                                        {booking.status === "confirmed" ? t("instructor.confirmed") : t("instructor.pending")}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4 gap-2">
                                                <Button variant="outline">{t("instructor.contactParticipants")}</Button>
                                                <Button>{t("instructor.viewDetails")}</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                            {mockData.recentBookings.map((booking) => (
                                <motion.div key={booking.id} variants={fadeIn}>
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-green-100 p-3 rounded-full">
                                                        <Check className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{booking.adventure}</h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-3">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                <span>{booking.location}</span>
                                                            </div>
                                                            <div className="hidden sm:block">•</div>
                                                            <div className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {booking.participants} {t("instructor.participants")}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-lg">${booking.amount}</div>
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        <span className="ml-1">{booking.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </InstructorLayout>
    )
}
