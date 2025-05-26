import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { MapPin, Calendar, User, Star } from "lucide-react"
export const UserBookings = () => {
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden rounded-2xl border-gray-200">
                    <div className="relative h-40">
                        <img
                            src={booking.image || "/placeholder.svg"}
                            alt={booking.adventure}
                            className="w-full h-full object-cover"
                        />
                        <Badge
                            className={`absolute top-2 right-2 rounded-full ${booking.status === "completed"
                                ? "bg-black text-white"
                                : booking.status === "upcoming"
                                    ? "bg-gray-600 text-white"
                                    : "bg-gray-400 text-white"
                                }`}
                        >
                            {booking.status === "completed"
                                ? "Completed"
                                : booking.status === "upcoming"
                                    ? "Upcoming"
                                    : "Pending"}
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
                                    <Star className="h-3 w-3 fill-black text-black" />
                                    <span className="text-xs ml-1">{booking.rating}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                        <Button variant="outline" className="w-full rounded-xl border-gray-300 hover:bg-gray-50">
                            View Details
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
