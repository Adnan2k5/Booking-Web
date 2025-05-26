import React from 'react'
import {
    Clock,
    TicketIcon,
    MessageSquare,
    FileText,
    ChevronRight,
    Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"


export const UserTickets = () => {
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
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="rounded-2xl border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Support Tickets</CardTitle>
                        <Button
                            onClick={() => setIsNewTicketDialogOpen(true)}
                            className="bg-black text-white hover:bg-gray-800 rounded-xl"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Ticket
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {mockTickets.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500">No tickets yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {mockTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => handleOpenTicketDetail(ticket)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Badge
                                                className={`rounded-full ${ticket.status === "resolved"
                                                    ? "bg-black text-white"
                                                    : ticket.status === "open"
                                                        ? "bg-gray-600 text-white"
                                                        : "bg-gray-400 text-white"
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
                <Card className="rounded-2xl border-gray-200">
                    <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                        <CardDescription>Contact our support team for assistance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="font-medium">Live Chat</p>
                                <p className="text-sm text-gray-500">Available now</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <TicketIcon className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="font-medium">Support Ticket</p>
                                <p className="text-sm text-gray-500">Response within 24h</p>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-black text-white hover:bg-gray-800 rounded-xl"
                            onClick={() => setIsNewTicketDialogOpen(true)}
                        >
                            Create Ticket
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
