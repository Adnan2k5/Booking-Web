import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useTranslation } from "react-i18next"

const UpcomingBookingsCard = ({ bookings, onViewAll }) => {
    const { t } = useTranslation()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("instructor.upcomingBookings")}</CardTitle>
                <CardDescription>{t("instructor.nextScheduledSessions")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {bookings.map((booking) => (
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
                <Button variant="outline" className="w-full" onClick={onViewAll}>
                    {t("instructor.viewAllBookings")}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default UpcomingBookingsCard
