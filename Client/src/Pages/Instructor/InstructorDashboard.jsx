"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthProvider"
import { motion } from "framer-motion"
import { Calendar, DollarSign, Users, Star, TrendingUp, Clock, MapPin, Filter, Search, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import InstructorLayout from "./InstructorLayout"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import SessionCalendar from "../../components/SessionCalendar"

// Mock data for the instructor dashboard
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

// Adventure types and locations for the calendar
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

const InstructorDashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation()
    const [timeRange, setTimeRange] = useState("month")
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        // Check if user is logged in and is an instructor
        if (!user.user) {
            toast.error("Please login to access the instructor dashboard")
            navigate("/login")
        }
        // In a real app, you would check if the user has instructor role
    }, [user, navigate])

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    // COLORS for charts
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

    return (
        <InstructorLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t("instructor.dashboard")}</h2>
                        <p className="text-muted-foreground">{t("instructor.welcomeMessage")}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t("instructor.selectTimeRange")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">{t("instructor.last24Hours")}</SelectItem>
                                <SelectItem value="week">{t("instructor.lastWeek")}</SelectItem>
                                <SelectItem value="month">{t("instructor.lastMonth")}</SelectItem>
                                <SelectItem value="year">{t("instructor.lastYear")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <Calendar className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <div value="overview" className="space-y-4">
                        <motion.div
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeIn}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{t("instructor.totalRevenue")}</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${mockData.instructor.totalRevenue.toLocaleString()}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <span
                                                className={`flex items-center ${mockData.instructor.revenueIncrease > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {mockData.instructor.revenueIncrease > 0 ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                                                )}
                                                {Math.abs(mockData.instructor.revenueIncrease)}%
                                            </span>
                                            <span>
                                                {t("instructor.fromLast")} {timeRange}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{t("instructor.totalBookings")}</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{mockData.instructor.totalBookings}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <span
                                                className={`flex items-center ${mockData.instructor.bookingIncrease > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {mockData.instructor.bookingIncrease > 0 ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                                                )}
                                                {Math.abs(mockData.instructor.bookingIncrease)}%
                                            </span>
                                            <span>
                                                {t("instructor.fromLast")} {timeRange}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={fadeIn}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{t("instructor.upcomingSessions")}</CardTitle>
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{mockData.instructor.upcomingSessions}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <span className="text-blue-500">{t("instructor.scheduled")}</span>
                                            <span>•</span>
                                            <span>{t("instructor.nextWeek")}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{t("instructor.rating")}</CardTitle>
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{mockData.instructor.rating}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <span className="text-yellow-500 flex items-center">
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeIn} className="col-span-4">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>{t("instructor.revenueOverview")}</CardTitle>
                                        <CardDescription>{t("instructor.monthlyRevenue")}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={mockData.monthlyRevenue}>
                                                    <XAxis dataKey="month" stroke="#888888" />
                                                    <YAxis stroke="#888888" />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        stroke="#0ea5e9"
                                                        strokeWidth={2}
                                                        activeDot={{ r: 8 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={fadeIn} className="col-span-3">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>{t("instructor.adventureBreakdown")}</CardTitle>
                                        <CardDescription>{t("instructor.bookingsByType")}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={mockData.adventureTypes}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="bookings"
                                                        nameKey="name"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {mockData.adventureTypes.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.name]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <SessionCalendar adventureTypes={adventureTypes} locations={locations} />
                        </motion.div>
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("instructor.upcomingBookings")}</CardTitle>
                                    <CardDescription>{t("instructor.nextScheduledSessions")}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockData.upcomingBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <Calendar className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{booking.adventure}</h4>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            <span>{booking.location}</span>
                                                            <span className="mx-2">•</span>
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            <span>
                                                                {new Date(booking.date).toLocaleDateString()} {booking.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="font-medium">${booking.amount}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {booking.participants} {t("instructor.participants")}
                                                        </div>
                                                    </div>
                                                    <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                                                        {booking.status === "confirmed" ? t("instructor.confirmed") : t("instructor.pending")}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("bookings")}>
                                        {t("instructor.viewAllBookings")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    )
}

export default InstructorDashboard
