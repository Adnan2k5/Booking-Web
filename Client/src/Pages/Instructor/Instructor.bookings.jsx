import React from 'react'
import { motion } from "framer-motion"
import { Calendar, Users, Star, Clock, MapPin, Filter, Search, Check } from 'lucide-react'
import { Card, CardContent, } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { useTranslation } from 'react-i18next'
import InstructorLayout from './InstructorLayout'
import { staggerContainer, fadeIn } from '../../assets/Animations'

export const InstructorBookings = () => {
    const mockData = {
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
    }

    const { t } = useTranslation()

    return (
        <InstructorLayout>
            <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{t("instructor.bookings")}</h2>
                        <p className="text-muted-foreground text-sm sm:text-base">{t("instructor.manageYourBookings")}</p>
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder={t("instructor.searchBookings")} className="w-full pl-8 text-sm" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Filter className="h-4 w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">{t("instructor.filter")}</span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
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

                <Tabs defaultValue="upcoming" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                        <TabsTrigger value="upcoming" className="text-sm sm:text-base">{t("instructor.upcoming")}</TabsTrigger>
                        <TabsTrigger value="completed" className="text-sm sm:text-base">{t("instructor.completed")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                            {mockData.upcomingBookings.map((booking) => (
                                <motion.div key={booking.id} variants={fadeIn}>
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-3 sm:p-4 lg:p-6">
                                            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                                <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                                                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full w-fit flex-shrink-0">
                                                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                                    </div>
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base sm:text-lg truncate">{booking.adventure}</h3>
                                                        <div className="flex flex-col space-y-1 sm:space-y-0 text-xs sm:text-sm text-muted-foreground">
                                                            <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0">
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                    <span className="truncate">{booking.location}</span>
                                                                </div>
                                                                <div className="hidden sm:block mx-3">•</div>
                                                                <div className="flex items-center">
                                                                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                    <span className="whitespace-nowrap">
                                                                        {new Date(booking.date).toLocaleDateString()} {booking.time}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs sm:text-sm text-muted-foreground">{booking.duration}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:flex-shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                        <span className="text-xs sm:text-sm">
                                                            {booking.participants} {t("instructor.participants")}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-lg">${booking.amount}</div>
                                                    <Badge variant={booking.status === "confirmed" ? "default" : "outline"} className="text-xs">
                                                        {booking.status === "confirmed" ? t("instructor.confirmed") : t("instructor.pending")}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2 mt-4 pt-3 border-t border-gray-100">
                                                <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                                                    {t("instructor.contactParticipants")}
                                                </Button>
                                                <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">{t("instructor.viewDetails")}</Button>
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
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-3 sm:p-4 lg:p-6">
                                            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                                <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                                                    <div className="bg-green-100 p-2 sm:p-3 rounded-full w-fit flex-shrink-0">
                                                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                    </div>
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base sm:text-lg truncate">{booking.adventure}</h3>
                                                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 text-xs sm:text-sm text-muted-foreground">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                <span className="truncate">{booking.location}</span>
                                                            </div>
                                                            <div className="hidden sm:block mx-3">•</div>
                                                            <div className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                <span className="whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:flex-shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                        <span className="text-xs sm:text-sm">
                                                            {booking.participants} {t("instructor.participants")}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-lg">${booking.amount}</div>
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                                                        <span className="ml-1 text-sm">{booking.rating}</span>
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
export default InstructorBookings