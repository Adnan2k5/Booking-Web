import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, Users, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { useTranslation } from "react-i18next"

const SessionCalendar = ({ adventureTypes, locations }) => {
    const { t } = useTranslation()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [sessions, setSessions] = useState({})
    const [sessionForm, setSessionForm] = useState({
        title: "",
        adventure: "",
        location: "",
        time: "09:00",
        duration: "2 hours",
        capacity: "8",
        notes: ""
    })

    // Get current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Get first day of month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Get month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    // Get day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Handle previous month
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    // Handle next month
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    // Handle date click
    const handleDateClick = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day)
        setSelectedDate(selectedDate)
        setIsDialogOpen(true)
    }

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setSessionForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle select change
    const handleSelectChange = (name, value) => {
        setSessionForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle session creation
    const handleCreateSession = () => {
        if (!selectedDate) return

        const dateKey = selectedDate.toISOString().split('T')[0]

        setSessions(prev => ({
            ...prev,
            [dateKey]: [
                ...(prev[dateKey] || []),
                {
                    ...sessionForm,
                    id: Date.now()
                }
            ]
        }))

        // Reset form
        setSessionForm({
            title: "",
            adventure: "",
            location: "",
            time: "09:00",
            duration: "2 hours",
            capacity: "8",
            notes: ""
        })

        setIsDialogOpen(false)
    }

    // Check if a date has sessions
    const hasSession = (day) => {
        const dateKey = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]
        return sessions[dateKey] && sessions[dateKey].length > 0
    }

    // Get session count for a date
    const getSessionCount = (day) => {
        const dateKey = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]
        return sessions[dateKey] ? sessions[dateKey].length : 0
    }

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-transparent"></div>)
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear()

            const hasSessionForDay = hasSession(day)
            const sessionCount = getSessionCount(day)

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-24 border rounded-lg relative cursor-pointer transition-all overflow-hidden group
            ${isToday ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}
            ${hasSessionForDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
                    onClick={() => handleDateClick(day)}
                >
                    <div className="absolute top-1 right-1">
                        {isToday && (
                            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                {day}
                            </div>
                        )}
                        {!isToday && (
                            <div className="h-6 w-6 rounded-full flex items-center justify-center text-sm">
                                {day}
                            </div>
                        )}
                    </div>

                    {hasSessionForDay ? (
                        <div className="absolute bottom-1 left-1 right-1">
                            <Badge className="bg-blue-500 hover:bg-blue-600">
                                {sessionCount} {sessionCount === 1 ? 'Session' : 'Sessions'}
                            </Badge>
                        </div>
                    ) : (
                        <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className="border-dashed border-blue-300 text-blue-500">
                                <Plus className="h-3 w-3 mr-1" /> Add
                            </Badge>
                        </div>
                    )}
                </motion.div>
            )
        }

        return days
    }

    return (
        <Card className="col-span-7">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>{t("instructor.sessionCalendar")}</CardTitle>
                    <CardDescription>{t("instructor.manageYourSessions")}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-medium">
                        {monthNames[currentMonth]} {currentYear}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays()}
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDate ? `Schedule Session for ${selectedDate.toLocaleDateString()}` : 'Schedule Session'}
                            </DialogTitle>
                            <DialogDescription>
                                Create a new session for this date. Fill in the details below.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Session Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={sessionForm.title}
                                    onChange={handleFormChange}
                                    placeholder="Enter session title"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="adventure">Adventure Type</Label>
                                    <Select
                                        value={sessionForm.adventure}
                                        onValueChange={(value) => handleSelectChange("adventure", value)}
                                    >
                                        <SelectTrigger id="adventure">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {adventureTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Select
                                        value={sessionForm.location}
                                        onValueChange={(value) => handleSelectChange("location", value)}
                                    >
                                        <SelectTrigger id="location">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location} value={location}>
                                                    {location}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Start Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="time"
                                            name="time"
                                            type="time"
                                            value={sessionForm.time}
                                            onChange={handleFormChange}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Select
                                        value={sessionForm.duration}
                                        onValueChange={(value) => handleSelectChange("duration", value)}
                                    >
                                        <SelectTrigger id="duration">
                                            <SelectValue placeholder="Duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2 hours">2 hours</SelectItem>
                                            <SelectItem value="3 hours">3 hours</SelectItem>
                                            <SelectItem value="4 hours">4 hours</SelectItem>
                                            <SelectItem value="6 hours">6 hours</SelectItem>
                                            <SelectItem value="Full day">Full day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            value={sessionForm.capacity}
                                            onChange={handleFormChange}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={sessionForm.notes}
                                    onChange={handleFormChange}
                                    placeholder="Add any additional information"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateSession}>Create Session</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default SessionCalendar
