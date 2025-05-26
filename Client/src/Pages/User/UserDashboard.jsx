"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Award,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../components/ui/dialog"
import { UserBookings } from "./UserBookings"
import { UserTickets } from "./UserTickets"
import { UserProfile } from "./UserProfile"
import { UserSettings } from "./UserSettings"
import { useAuth } from "../AuthProvider"

// Mock data for past bookings


// Mock data for user tickets


export default function UserDashboard() {
    const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
    const [ticketSubject, setTicketSubject] = useState("")
    const [ticketMessage, setTicketMessage] = useState("")
    const [activeTicket, setActiveTicket] = useState(null)
    const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false)
    const [ticketReply, setTicketReply] = useState("")

    const { user } = useAuth();
    const userProfile = {
        name: user.user.name || "John Doe",
        email: user.user.email || "",
        level: user.user.level || "Beginner",
        joinDate: user.user.joinDate || "2023-01-01",
        completedAdventures: user.user.completedAdventures || 3,
        experience: user.user.experience || 400,
        nextLevel: user.user.nextLevel || 1000,
    }
    const progressPercentage = (userProfile.experience / userProfile.nextLevel) * 100

    const handleCreateTicket = () => {
        console.log("Creating ticket:", { subject: ticketSubject, message: ticketMessage })
        setIsNewTicketDialogOpen(false)
        setTicketSubject("")
        setTicketMessage("")
        alert("Ticket created successfully!")
    }

    const handleOpenTicketDetail = (ticket) => {
        setActiveTicket(ticket)
        setIsTicketDetailOpen(true)
    }

    const handleReply = () => {
        console.log("Sending reply:", ticketReply)
        setTicketReply("")
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {userProfile.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2 rounded-xl border-gray-300 hover:bg-gray-50">
                            <Calendar className="h-4 w-4" />
                            Browse Adventures
                        </Button>

                        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl">Shop</Button>
                    </div>
                </div>

                {/* User Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Level Card */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Adventure Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-16 w-16 border-2 border-black">
                                        <AvatarFallback className="bg-black text-white">{userProfile.level.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute -bottom-2 -right-2 bg-black text-white rounded-full">Lv.2</Badge>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{userProfile.level}</span>
                                        <span className="text-sm text-gray-500">
                                            {userProfile.experience}/{userProfile.nextLevel} XP
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-black rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {userProfile.nextLevel - userProfile.experience} XP to next level
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed Adventures */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Completed Adventures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Award className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.completedAdventures}</p>
                                    <p className="text-sm text-gray-500">Adventures completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Adventures */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Upcoming Adventures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Calendar className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.upcomingAdventures}</p>
                                    <p className="text-sm text-gray-500">Adventures scheduled</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 rounded-2xl">
                        <TabsTrigger value="bookings" className="rounded-xl">
                            My Bookings
                        </TabsTrigger>
                        <TabsTrigger value="tickets" className="rounded-xl">
                            Support Tickets
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-xl">
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-xl">
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings">
                        <UserBookings />
                    </TabsContent>

                    {/* Support Tickets Tab */}
                    <TabsContent value="tickets">
                        <UserTickets />
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <UserProfile />
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <UserSettings />
                    </TabsContent>
                </Tabs>
            </div>

            {/* New Ticket Dialog */}
            <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Ticket</DialogTitle>
                        <DialogDescription>Describe your issue and we'll help you resolve it</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
                                placeholder="Brief description of your issue"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                value={ticketMessage}
                                onChange={(e) => setTicketMessage(e.target.value)}
                                placeholder="Provide more details about your issue"
                                rows={5}
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsNewTicketDialogOpen(false)}
                            className="rounded-xl border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateTicket}
                            disabled={!ticketSubject || !ticketMessage}
                            className="bg-black text-white hover:bg-gray-800 rounded-xl"
                        >
                            Submit Ticket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ticket Detail Dialog */}
            <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    {activeTicket && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{activeTicket.subject}</DialogTitle>
                                <DialogDescription>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            className={`rounded-full ${activeTicket.status === "resolved"
                                                ? "bg-black text-white"
                                                : activeTicket.status === "open"
                                                    ? "bg-gray-600 text-white"
                                                    : "bg-gray-400 text-white"
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
                                        <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${message.sender === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-gray-300" : "text-gray-500"}`}>
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {activeTicket.status === "open" && (
                                    <>
                                        <Textarea
                                            value={ticketReply}
                                            onChange={(e) => setTicketReply(e.target.value)}
                                            placeholder="Type your reply..."
                                            rows={3}
                                            className="mt-4 rounded-xl"
                                        />
                                        <Button
                                            onClick={handleReply}
                                            disabled={!ticketReply}
                                            className="mt-2 bg-black text-white hover:bg-gray-800 rounded-xl"
                                        >
                                            Send Reply
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
