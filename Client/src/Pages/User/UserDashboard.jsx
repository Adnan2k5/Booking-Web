"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Clock,
    MapPin,
    Star,
    User,
    TicketIcon,
    MessageSquare,
    FileText,
    Award,
    ChevronRight,
    Plus,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Separator } from "../../components/ui/separator"
import { useAuth } from "../AuthProvider"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../components/ui/dialog"

// Mock data for past bookings
const mockBookings = [
    {
        id: "B-1234",
        adventure: "Mountain Climbing",
        date: "2025-01-15",
        location: "Alpine Heights",
        status: "completed",
        price: 250,
        instructor: "Alex Johnson",
        rating: 4.8,
        image: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "B-1235",
        adventure: "Scuba Diving",
        date: "2025-02-20",
        location: "Coral Bay",
        status: "completed",
        price: 350,
        instructor: "Sarah Chen",
        rating: 4.7,
        image: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "B-1236",
        adventure: "Paragliding",
        date: "2025-03-10",
        location: "Wind Hills",
        status: "upcoming",
        price: 180,
        instructor: "Emma Wilson",
        rating: null,
        image: "/placeholder.svg?height=200&width=300",
    },
]

// Mock data for user tickets
const mockTickets = [
    {
        id: "T-1001",
        subject: "Booking Cancellation Request",
        date: "2025-02-15",
        status: "resolved",
        priority: "high",
        messages: [
            {
                sender: "user",
                text: "I need to cancel my upcoming paragliding booking due to a schedule conflict.",
                timestamp: "2025-02-15T10:30:00",
            },
            {
                sender: "support",
                text: "We've processed your cancellation request. You'll receive a refund within 5-7 business days.",
                timestamp: "2025-02-15T14:45:00",
            },
        ],
    },
    {
        id: "T-1002",
        subject: "Equipment Question",
        date: "2025-03-01",
        status: "open",
        priority: "medium",
        messages: [
            {
                sender: "user",
                text: "Do I need to bring my own equipment for the mountain climbing adventure?",
                timestamp: "2025-03-01T09:15:00",
            },
        ],
    },
]



export default function UserDashboard() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
    const [ticketSubject, setTicketSubject] = useState("")
    const [ticketMessage, setTicketMessage] = useState("")
    const [activeTicket, setActiveTicket] = useState(null)
    const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false)
    const [newReply, setNewReply] = useState("")
    console.log(user)
    const userProfile = {
        name: "Adnan",
        email: user.email,
        level: "Explorer",
        experience: 450,
        nextLevel: 500,
        completedAdventures: 2,
        upcomingAdventures: 1,
        preferences: {
            notifications: true,
            newsletter: false,
            language: "en",
        },
    }

    // Calculate progress percentage for experience bar
    const progressPercentage = (userProfile.experience / userProfile.nextLevel) * 100

    const handleCreateTicket = () => {
        // In a real app, this would submit the ticket to an API
        console.log("Creating ticket:", { subject: ticketSubject, message: ticketMessage })
        setIsNewTicketDialogOpen(false)
        setTicketSubject("")
        setTicketMessage("")
        // Show success message
        alert(t("ticketCreated"))
    }

    const handleOpenTicketDetail = (ticket) => {
        setActiveTicket(ticket)
        setIsTicketDetailOpen(true)
    }

    const handleSendReply = () => {
        if (!newReply.trim()) return

        // In a real app, this would send the reply to an API
        console.log("Sending reply:", newReply)
        setNewReply("")
        // Show success message
        alert(t("replySent"))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-800">{t("dashboard")}</h1>
                        <p className="text-gray-500">{t("welcomeBack")}, {userProfile.name}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-3"
                    >
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            {t("browseAdventures")}
                        </Button>

                        <Button
                            onClick={() => navigate("/shop")}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        >
                            {t("shop")}
                        </Button>
                    </motion.div>
                </div>

                {/* User Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Level Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">{t("adventureLevel")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-16 w-16 border-2 border-blue-500">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                                            {userProfile.level.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                                        Lv.2
                                    </Badge>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{userProfile.level}</span>
                                        <span className="text-sm text-gray-500">{userProfile.experience}/{userProfile.nextLevel} XP</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t("needXpToNextLevel", { xp: userProfile.nextLevel - userProfile.experience })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed Adventures */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">{t("completedAdventures")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <Award className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.completedAdventures}</p>
                                    <p className="text-sm text-gray-500">{t("adventuresCompleted")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Adventures */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">{t("upcomingAdventures")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.upcomingAdventures}</p>
                                    <p className="text-sm text-gray-500">{t("adventuresScheduled")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Tabs defaultValue="bookings" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-8">
                            <TabsTrigger value="bookings">{t("myBookings")}</TabsTrigger>
                            <TabsTrigger value="tickets">{t("supportTickets")}</TabsTrigger>
                            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
                            <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
                        </TabsList>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mockBookings.map((booking) => (
                                    <Card key={booking.id} className="overflow-hidden">
                                        <div className="relative h-40">
                                            <img
                                                src={booking.image || "/placeholder.svg"}
                                                alt={booking.adventure}
                                                className="w-full h-full object-cover"
                                            />
                                            <Badge
                                                className={`absolute top-2 right-2 ${booking.status === 'completed'
                                                    ? 'bg-green-500'
                                                    : booking.status === 'upcoming'
                                                        ? 'bg-blue-500'
                                                        : 'bg-yellow-500'
                                                    }`}
                                            >
                                                {booking.status === 'completed' ? t("completed") :
                                                    booking.status === 'upcoming' ? t("upcoming") : t("pending")}
                                            </Badge>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <CardTitle>{booking.adventure}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {booking.location}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <div className="flex justify-between text-sm mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{booking.date}</span>
                                                </div>
                                                <div className="font-medium">${booking.price}</div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    <span className="text-sm">{booking.instructor}</span>
                                                </div>
                                                {booking.rating && (
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs ml-1">{booking.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <div className="px-6 pb-4">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => navigate(`/booking-details/${booking.id}`)}
                                            >
                                                {t("viewDetails")}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Support Tickets Tab */}
                        <TabsContent value="tickets">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle>{t("supportTickets")}</CardTitle>
                                            <Button
                                                onClick={() => setIsNewTicketDialogOpen(true)}
                                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                {t("newTicket")}
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {mockTickets.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                                    <p className="text-gray-500">{t("noTicketsYet")}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {mockTickets.map((ticket) => (
                                                        <div
                                                            key={ticket.id}
                                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                            onClick={() => handleOpenTicketDetail(ticket)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Badge
                                                                    className={`${ticket.status === 'resolved'
                                                                        ? 'bg-green-500'
                                                                        : ticket.status === 'open'
                                                                            ? 'bg-blue-500'
                                                                            : 'bg-yellow-500'
                                                                        }`}
                                                                >
                                                                    {ticket.status}
                                                                </Badge>
                                                                <div>
                                                                    <p className="font-medium">{ticket.subject}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        <Clock className="inline h-3 w-3 mr-1" />
                                                                        {ticket.date}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("needHelp")}</CardTitle>
                                            <CardDescription>
                                                {t("contactSupportDescription")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{t("liveChat")}</p>
                                                    <p className="text-sm text-gray-500">{t("availableNow")}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <TicketIcon className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{t("supportTicket")}</p>
                                                    <p className="text-sm text-gray-500">{t("responseTime24h")}</p>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                                onClick={() => setIsNewTicketDialogOpen(true)}
                                            >
                                                {t("createTicket")}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("profileInformation")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex flex-col items-center">
                                                <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-lg">
                                                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-2xl">
                                                        {userProfile.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="text-xl font-bold">{userProfile.name}</h3>
                                                <p className="text-gray-500">{userProfile.email}</p>
                                                <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                                                    {userProfile.level}
                                                </Badge>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-medium mb-2">{t("accountDetails")}</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">{t("memberSince")}</span>
                                                        <span>{userProfile.joinDate}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">{t("completedAdventures")}</span>
                                                        <span>{userProfile.completedAdventures}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">{t("experiencePoints")}</span>
                                                        <span>{userProfile.experience} XP</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                                                {t("editProfile")}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("adventureStats")}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-medium mb-3">{t("experienceProgress")}</h4>
                                                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                                                            style={{ width: `${progressPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between mt-2 text-sm">
                                                        <span>{userProfile.experience} XP</span>
                                                        <span>{userProfile.nextLevel} XP ({t("nextLevel")})</span>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h4 className="font-medium mb-3">{t("achievements")}</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                                                            <Award className="h-8 w-8 text-blue-600 mb-2" />
                                                            <span className="text-sm font-medium">{t("firstAdventure")}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                                                            <Award className="h-8 w-8 text-green-600 mb-2" />
                                                            <span className="text-sm font-medium">{t("adventureExplorer")}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center p-3 bg-gray-100 rounded-lg opacity-50">
                                                            <Award className="h-8 w-8 text-gray-400 mb-2" />
                                                            <span className="text-sm font-medium">{t("adventureMaster")}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h4 className="font-medium mb-3">{t("favoriteAdventures")}</h4>
                                                    <p className="text-gray-500 text-sm">{t("noFavoritesYet")}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("accountSettings")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <h4 className="font-medium mb-3">{t("personalInformation")}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">{t("fullName")}</label>
                                                        <Input defaultValue={userProfile.name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">{t("email")}</label>
                                                        <Input defaultValue={userProfile.email} />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-medium mb-3">{t("changePassword")}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">{t("currentPassword")}</label>
                                                        <Input type="password" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">{t("newPassword")}</label>
                                                        <Input type="password" />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                                                {t("saveChanges")}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("preferences")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <h4 className="font-medium mb-3">{t("notifications")}</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm">{t("emailNotifications")}</label>
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={userProfile.preferences.notifications}
                                                            className="toggle toggle-primary"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm">{t("newsletter")}</label>
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={userProfile.preferences.newsletter}
                                                            className="toggle toggle-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-medium mb-3">{t("language")}</h4>
                                                <select
                                                    className="w-full p-2 border rounded-md"
                                                    defaultValue={userProfile.preferences.language}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="fr">Français</option>
                                                    <option value="de">Deutsch</option>
                                                    <option value="es">Español</option>
                                                    <option value="it">Italiano</option>
                                                </select>
                                            </div>

                                            <Button variant="outline" className="w-full">
                                                {t("savePreferences")}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* New Ticket Dialog */}
            <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t("createNewTicket")}</DialogTitle>
                        <DialogDescription>
                            {t("createTicketDescription")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("subject")}</label>
                            <Input
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
                                placeholder={t("ticketSubjectPlaceholder")}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("message")}</label>
                            <Textarea
                                value={ticketMessage}
                                onChange={(e) => setTicketMessage(e.target.value)}
                                placeholder={t("ticketMessagePlaceholder")}
                                rows={5}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsNewTicketDialogOpen(false)}
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={handleCreateTicket}
                            disabled={!ticketSubject || !ticketMessage}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        >
                            {t("submitTicket")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ticket Detail Dialog */}
            <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    {activeTicket && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{activeTicket.subject}</DialogTitle>
                                <DialogDescription>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            className={`${activeTicket.status === 'resolved'
                                                ? 'bg-green-500'
                                                : activeTicket.status === 'open'
                                                    ? 'bg-blue-500'
                                                    : 'bg-yellow-500'
                                                }`}
                                        >
                                            {activeTicket.status}
                                        </Badge>
                                        <span className="text-sm">{activeTicket.date}</span>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
                                    {activeTicket.messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>


                                            </div>
                                            {message.sender === 'user' && (
                                                <Avatar className="h-8 w-8 ml-2">
                                                    <AvatarFallback className="bg-blue-600 text-white">
                                                        {user?.user ? user.user.email.charAt(0).toUpperCase() : "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Textarea
                                    value={ticketReply}
                                    onChange={(e) => setTicketReply(e.target.value)}
                                    placeholder={t("replyPlaceholder")}
                                    rows={3}
                                    className="mt-4"
                                />
                                <Button
                                    onClick={handleReply}
                                    disabled={!ticketReply}
                                    className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                >
                                    {t("sendReply")}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

