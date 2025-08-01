"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthProvider"
import { motion } from "framer-motion"
import { Calendar, DollarSign, Users, Star, TrendingUp, Clock, MapPin, Filter, Search, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import InstructorLayout from "./InstructorLayout"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import SessionCalendar from "../../components/SessionCalendar"
import UpcomingBookingsCard from "../../components/UpcomingBookingsCard"
import { fetchAllAdventures, getAdventure } from "../../Api/adventure.api"
import { getInstructorSessions } from "../../Api/session.api"
import { staggerContainer, fadeIn } from "../../assets/Animations"

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
            status: "active",
            days: ["Monday", "Wednesday"],
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
            status: "active",
            days: ["Tuesday", "Thursday"],
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
            status: "active",
            days: ["Friday"],
        },
    ],
}

const InstructorDashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation()
    const [timeRange, setTimeRange] = useState("month")
    const [adventureTypes, setAdventureTypes] = useState([])


    const [upcomingSessionsCount, setUpcomingSessionsCount] = useState(0)
    const [isLoadingSessions, setIsLoadingSessions] = useState(false)

    const fetchUpcomingSessions = async () => {
        if (!user?.user?._id) return

        setIsLoadingSessions(true)
        try {
            const res = await getInstructorSessions(user.user._id)
            if (res.status === 200 && res.data) {
                const sessions = res.data
                const now = new Date()

                // Count sessions that start after current time
                const upcomingCount = sessions.filter(session => {
                    const sessionStart = new Date(session.startTime)
                    return sessionStart > now
                }).length

                setUpcomingSessionsCount(upcomingCount)
            }
        } catch (error) {
            console.error("Error fetching sessions:", error)
            setUpcomingSessionsCount(0)
        } finally {
            setIsLoadingSessions(false)
        }
    }

    useEffect(() => {
        if (!user.user) {
            toast.error("Please login to access the instructor dashboard")
            navigate("/login")
            return
        }

        // Check if the user has instructor data and adventure ID
        if (user?.user?.instructor?.adventure) {
            getAdventure(user.user.instructor.adventure).then((res) => {
                setAdventureTypes(res.data)
            }).catch((err) => {
                toast.error("Failed to load adventure data")
            });
        } else {
            toast.error("No adventure ID found for instructor")
        }
        fetchUpcomingSessions()
    }, [user, navigate])

    return (
        <InstructorLayout>
            <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">{t("instructor.dashboard")}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">{t("instructor.welcomeMessage")}</p>
                    </div>
                    {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-10">
                                <SelectValue placeholder={t("instructor.selectTimeRange")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">{t("instructor.last24Hours")}</SelectItem>
                                <SelectItem value="week">{t("instructor.lastWeek")}</SelectItem>
                                <SelectItem value="month">{t("instructor.lastMonth")}</SelectItem>
                                <SelectItem value="year">{t("instructor.lastYear")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                            <Calendar className="h-4 w-4" />
                        </Button>
                    </div> */}
                </div>
                <div defaultValue="overview" className="space-y-4 sm:space-y-6">
                    <div value="overview" className="space-y-4 sm:space-y-6">
                        <motion.div
                            className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* <motion.div variants={fadeIn}>
                                <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                                        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{t("instructor.totalRevenue")}</CardTitle>
                                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">${mockData.instructor.totalRevenue.toLocaleString()}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                            <span
                                                className={`flex items-center ${mockData.instructor.revenueIncrease > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {mockData.instructor.revenueIncrease > 0 ? (
                                                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                                ) : (
                                                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1 transform rotate-180" />
                                                )}
                                                {Math.abs(mockData.instructor.revenueIncrease)}%
                                            </span>
                                            <span className="hidden sm:inline">
                                                {t("instructor.fromLast")} {timeRange}
                                            </span>
                                            <span className="sm:hidden">vs last {timeRange}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div> */}

                            <motion.div variants={fadeIn}>
                                <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                                        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{t("instructor.totalBookings")}</CardTitle>
                                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mockData.instructor.totalBookings}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                            <span
                                                className={`flex items-center ${mockData.instructor.bookingIncrease > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {mockData.instructor.bookingIncrease > 0 ? (
                                                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                                ) : (
                                                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1 transform rotate-180" />
                                                )}
                                                {Math.abs(mockData.instructor.bookingIncrease)}%
                                            </span>
                                            <span className="hidden sm:inline">
                                                {t("instructor.fromLast")} {timeRange}
                                            </span>
                                            <span className="sm:hidden">vs last {timeRange}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={fadeIn}>
                                <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                                        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{t("instructor.upcomingSessions")}</CardTitle>
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                                            {isLoadingSessions ? "..." : upcomingSessionsCount}
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                            <span className="text-blue-500">{t("instructor.scheduled")}</span>
                                            <span>•</span>
                                            <span className="hidden sm:inline">{t("instructor.nextWeek")}</span>
                                            <span className="sm:hidden">next week</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeIn}>
                                <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                                        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{t("instructor.rating")}</CardTitle>
                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mockData.instructor.rating}</div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                            <span className="text-yellow-500 flex items-center">
                                                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current mr-0.5" />
                                                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current mr-0.5" />
                                                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current mr-0.5" />
                                                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current mr-0.5" />
                                                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                        {/* <motion.div
                            className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-7"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeIn} className="lg:col-span-4">
                                <Card className="h-full">
                                    <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                                        <CardTitle className="text-base sm:text-lg">{t("instructor.revenueOverview")}</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">{t("instructor.monthlyRevenue")}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={mockData.monthlyRevenue}>
                                                    <XAxis
                                                        dataKey="month"
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `$${value}`}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'hsl(var(--background))',
                                                            border: '1px solid hsl(var(--border))',
                                                            borderRadius: '6px',
                                                            fontSize: '12px'
                                                        }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        stroke="#0ea5e9"
                                                        strokeWidth={2}
                                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                                        dot={false}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={fadeIn} className="lg:col-span-3">
                                <Card className="h-full">
                                    <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                                        <CardTitle className="text-base sm:text-lg">{t("instructor.adventureBreakdown")}</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">{t("instructor.bookingsByType")}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                        <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={mockData.adventureTypes}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius="70%"
                                                        fill="#8884d8"
                                                        dataKey="bookings"
                                                        nameKey="name"
                                                        label={({ name, percent }) => {
                                                            // Show labels only on larger screens
                                                            if (window.innerWidth < 640) return '';
                                                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                                                        }}
                                                        fontSize={12}
                                                    >
                                                        {mockData.adventureTypes.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value, name, props) => [`${value} bookings`, props.payload.name]}
                                                        contentStyle={{
                                                            backgroundColor: 'hsl(var(--background))',
                                                            border: '1px solid hsl(var(--border))',
                                                            borderRadius: '6px',
                                                            fontSize: '12px'
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div> */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full">
                            <SessionCalendar adventureTypes={adventureTypes} />
                        </motion.div>
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full">
                            <UpcomingBookingsCard
                                bookings={mockData.upcomingBookings}
                                onViewAll={() => navigate("/instructor/bookings")}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    )
}

export default InstructorDashboard
