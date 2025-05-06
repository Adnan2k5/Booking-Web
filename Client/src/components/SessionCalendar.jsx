"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { useTranslation } from "react-i18next"
import { useAuth } from "../Pages/AuthProvider"
import { createPreset, getAllSessions, deleteSession } from "../Api/session.api"
import { toast } from "sonner"

const SessionCalendar = ({ adventureTypes }) => {
    const { t } = useTranslation()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [presetDialog, setPresetDialog] = useState(false)
    const [sessionDetailDialog, setSessionDetailDialog] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const user = useAuth()
    const [sessions, setSessions] = useState([])
    const [sessionForm, setSessionForm] = useState({
        location: "",
        time: "09:00",
        duration: "2 hours",
        capacity: "8",
        notes: "",
        days: [],
        instructorId: user?.user?.user?._id,
        adventureId: "",
    })

    // Preset form state
    const [presetAdventureId, setPresetAdventureId] = useState("")
    const [presetLocation, setPresetLocation] = useState("")
    const [presetDays, setPresetDays] = useState([])
    const [presetCapacity, setPresetCapacity] = useState("8")
    const [presetStartTime, setPresetStartTime] = useState("09:00")
    const [presetNotes, setPresetNotes] = useState("")

    // Fetch sessions from API
    const fetchSessions = async () => {
        try {
            const res = await getAllSessions(user?.user?.user?._id)
            if (res.status === 200) {
                setSessions(res.data)
            } else {
                toast.error("Failed to fetch sessions")
            }
        } catch (error) {
            console.error("Error fetching sessions:", error)
            toast.error("Error loading sessions")
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    // Filter locations based on selected adventure
    const filteredLocations = () => {
        const selectedAdventure = adventureTypes?.find(
            (adv) => adv._id === sessionForm.adventureId
        );
        if (!selectedAdventure) return [];
        const location = selectedAdventure.location;
        return location;
    }

    // Filter locations based on selected adventure (for preset dialog)
    const filteredPresetLocations = () => {
        const selectedAdventure = adventureTypes?.find(
            (adv) => adv._id === presetAdventureId
        );
        if (!selectedAdventure) return [];
        return selectedAdventure.location;
    }

    // Handle preset form change
    const handlePresetInputChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name === "days") {
            if (checked) {
                setPresetDays((prev) => [...prev, value])
            } else {
                setPresetDays((prev) => prev.filter((d) => d !== value))
            }
        } else if (name === "capacity") {
            setPresetCapacity(value)
        } else if (name === "startTime") {
            setPresetStartTime(value)
        } else if (name === "notes") {
            setPresetNotes(value)
        }
    }

    // Handle preset select change
    const handlePresetSelectChange = (name, value) => {
        if (name === "location") {
            setPresetLocation(value)
        } else if (name === "adventureId") {
            setPresetAdventureId(value)
            setPresetLocation("") // Reset location when adventure changes
        }
    }

    // Format time to HH:mm
    const formatTime = (timeStr) => {
        if (!timeStr) return "09:00"
        return timeStr.length === 5 ? timeStr : timeStr.slice(0, 5)
    }

    // Create preset
    const handlePreset = async () => {
        const toastId = toast.loading("Creating preset...");
        const presetPayload = {
            location: presetLocation,
            days: presetDays,
            capacity: presetCapacity,
            startTime: formatTime(presetStartTime),
            notes: presetNotes,
            instructorId: user?.user?.user?._id,
            adventureId: presetAdventureId,
        }

        try {
            const res = await createPreset(presetPayload)
            if (res) {
                toast.success("Preset created successfully", { id: toastId })
                fetchSessions() // Refresh sessions after creating preset
            } else {
                toast.error("Error creating preset", { id: toastId })
            }
        } catch (error) {
            console.error("Error creating preset:", error)
            toast.error("Failed to create preset", { id: toastId })
        }

        setPresetDialog(false)
        setPresetAdventureId("")
        setPresetLocation("")
        setPresetDays([])
        setPresetCapacity("8")
        setPresetStartTime("09:00")
        setPresetNotes("")
    }

    // Get current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Get first day of month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Get month name
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
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

    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
        } catch (error) {
            return dateString
        }
    }

    // Handle date click - show sessions for that date or create new session
    const handleDateClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day)
        setSelectedDate(clickedDate)

        // Find sessions for this date
        const sessionsForDate = sessions.filter((session) => {
            const sessionDate = new Date(session.startTime)
            return (
                sessionDate.getDate() === day &&
                sessionDate.getMonth() === currentMonth &&
                sessionDate.getFullYear() === currentYear
            )
        })

        if (sessionsForDate.length > 0) {
            // If sessions exist for this date, show the first one
            setSelectedSession(sessionsForDate[0])
            setSessionDetailDialog(true)
        } else {
            // If no sessions, open create dialog
            setIsDialogOpen(true)
        }
    }

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setSessionForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle select change
    const handleSelectChange = (name, value) => {
        setSessionForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle session update
    const handleUpdateSession = async () => {
        if (!selectedSession) return

        try {
            toast.loading("Updating session...")
            // Implement your updateSession API call here
            await updateSession(selectedSession._id, updatedData)
            toast.success("Session updated successfully")
            fetchSessions() // Refresh sessions
            setSessionDetailDialog(false)
            setIsEditMode(false)
        } catch (error) {
            console.error("Error updating session:", error)
            toast.error("Failed to update session")
        }
    }

    // Handle session deletion
    const handleDeleteSession = async () => {
        if (!selectedSession) return

        try {
            toast.loading("Deleting session...")
            const res = await deleteSession(selectedSession._id)
            toast.success("Session deleted successfully")
            fetchSessions() // Refresh sessions
            setSessionDetailDialog(false)
        } catch (error) {
            console.error("Error deleting session:", error)
            toast.error("Failed to delete session")
        }
    }

    // Check if a date has sessions
    const hasSessionsOnDate = (day) => {
        return sessions.some((session) => {
            const sessionDate = new Date(session.startTime)
            return (
                sessionDate.getDate() === day &&
                sessionDate.getMonth() === currentMonth &&
                sessionDate.getFullYear() === currentYear
            )
        })
    }

    // Get session count for a date
    const getSessionCount = (day) => {
        return sessions.filter((session) => {
            const sessionDate = new Date(session.startTime)
            return (
                sessionDate.getDate() === day &&
                sessionDate.getMonth() === currentMonth &&
                sessionDate.getFullYear() === currentYear
            )
        }).length
    }

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = []
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-transparent"></div>)
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear()

            const hasSessionForDay = hasSessionsOnDate(day)
            const sessionCount = getSessionCount(day)

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-24 border rounded-lg relative cursor-pointer transition-all overflow-hidden group
                        ${isToday ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-blue-300"}
                        ${hasSessionForDay ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                    `}
                    onClick={() => handleDateClick(day)}
                >
                    <div className="absolute top-1 right-1">
                        {isToday && (
                            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                {day}
                            </div>
                        )}
                        {!isToday && <div className="h-6 w-6 rounded-full flex items-center justify-center text-sm">{day}</div>}
                    </div>

                    {hasSessionForDay ? (
                        <div className="absolute bottom-1 left-1 right-1">
                            <Badge className="bg-blue-500 hover:bg-blue-600">
                                {sessionCount} {sessionCount === 1 ? "Session" : "Sessions"}
                            </Badge>
                        </div>
                    ) : (
                        <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className="border-dashed border-blue-300 text-blue-500">
                                <Plus className="h-3 w-3 mr-1" /> Add
                            </Badge>
                        </div>
                    )}
                </motion.div>,
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
                    <div className="sessionpreset">
                        <Button variant="outline" size="icon" onClick={() => setPresetDialog(true)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
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
                    {dayNames.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>

                {/* Create New Session Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDate ? `Schedule Session for ${selectedDate.toLocaleDateString()}` : "Schedule Session"}
                            </DialogTitle>
                            <DialogDescription>Create a new session for this date. Fill in the details below.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Adventure Type Dropdown */}
                            <div className="grid gap-2">
                                <Label htmlFor="adventure">Adventure Type</Label>
                                <Select
                                    value={sessionForm.adventureId}
                                    onValueChange={(value) => {
                                        handleSelectChange("adventureId", value)
                                        // Reset location when adventure changes
                                        setSessionForm((prev) => ({ ...prev, location: "" }))
                                    }}
                                >
                                    <SelectTrigger id="adventure">
                                        <SelectValue placeholder="Select adventure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {adventureTypes?.map((adv) => (
                                            <SelectItem key={adv._id} value={adv._id}>
                                                {adv.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Location Dropdown (filtered) */}
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Select
                                    value={sessionForm.location}
                                    onValueChange={(value) => handleSelectChange("location", value)}
                                    disabled={!sessionForm.adventureId}
                                >
                                    <SelectTrigger id="location">
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredLocations()?.map((location) => (
                                            <SelectItem key={location._id} value={location._id}>
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    // Implement session creation logic
                                    toast.success("Session created")
                                    setIsDialogOpen(false)
                                    fetchSessions()
                                }}
                            >
                                Create Session
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Session Details Dialog */}
                <Dialog open={sessionDetailDialog} onOpenChange={setSessionDetailDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? "Edit Session" : "Session Details"}</DialogTitle>
                            <DialogDescription>
                                {isEditMode
                                    ? "Modify the session details below."
                                    : `Session on ${selectedSession ? formatDate(selectedSession.startTime) : ""}`}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedSession && (
                            <div className="grid gap-4 py-4">
                                {isEditMode ? (
                                    // Edit Mode
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-location">Location</Label>
                                            <Select
                                                value={selectedSession.location}
                                                onValueChange={(value) =>
                                                    setSelectedSession({
                                                        ...selectedSession,
                                                        location: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger id="edit-location">
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredLocations()?.map((location) => (
                                                        <SelectItem key={location._id} value={location.name}>
                                                            {location.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-time">Start Time</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="edit-time"
                                                        type="time"
                                                        value={formatTime(new Date(selectedSession.startTime).toTimeString().slice(0, 5))}
                                                        onChange={(e) => {
                                                            // Update time logic would go here
                                                            // This is simplified
                                                        }}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-capacity">Capacity</Label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="edit-capacity"
                                                        type="number"
                                                        value={selectedSession.capacity}
                                                        onChange={(e) =>
                                                            setSelectedSession({
                                                                ...selectedSession,
                                                                capacity: e.target.value,
                                                            })
                                                        }
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-notes">Notes</Label>
                                            <Textarea
                                                id="edit-notes"
                                                value={selectedSession.notes}
                                                onChange={(e) =>
                                                    setSelectedSession({
                                                        ...selectedSession,
                                                        notes: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Day</h3>
                                                <p>{selectedSession.days}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                                <Badge variant={selectedSession.status === "active" ? "default" : "secondary"}>
                                                    {selectedSession.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                                                <p className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    {formatDate(selectedSession.startTime)}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Expires At</h3>
                                                <p>{formatDate(selectedSession.expiresAt)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                                                <p className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {selectedSession.location}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                                                <p className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {selectedSession.capacity} participants
                                                </p>
                                            </div>
                                        </div>

                                        {selectedSession.notes && (
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                                                <p className="text-sm mt-1">{selectedSession.notes}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            {isEditMode ? (
                                <>
                                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateSession}>Save Changes</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setSessionDetailDialog(false)}>
                                        Close
                                    </Button>
                                    <div className="flex space-x-2">
                                        <Button variant="destructive" size="icon" onClick={handleDeleteSession}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="default" onClick={() => setIsEditMode(true)}>
                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    </div>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Preset Dialog */}
                <Dialog open={presetDialog} onOpenChange={setPresetDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Session Preset</DialogTitle>
                            <DialogDescription>
                                Create a preset for your sessions. Sessions will be created automatically with the same settings.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Adventure Type Dropdown */}
                        <div className="grid gap-1">
                            <Label htmlFor="preset-adventure">Adventure Type</Label>
                            <Select
                                id="preset-adventure"
                                value={presetAdventureId}
                                onValueChange={(value) => handlePresetSelectChange("adventureId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select adventure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {adventureTypes?.map((adv) => (
                                        <SelectItem key={adv._id} value={adv._id}>
                                            {adv.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Location Dropdown (filtered by adventure) */}
                        <div className="grid gap-1">
                            <Label htmlFor="preset-location">Location</Label>
                            <Select
                                id="preset-location"
                                value={presetLocation}
                                onValueChange={(value) => handlePresetSelectChange("location", value)}
                                disabled={!presetAdventureId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredPresetLocations()?.map((location) => (
                                        <SelectItem key={location._id} value={location._id}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-4 py-4">
                            <Label>Days</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {dayNames.map((day, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`day-${index}`}
                                            name="days"
                                            value={day}
                                            checked={presetDays.includes(day)}
                                            onChange={handlePresetInputChange}
                                            className="checkbox"
                                        />
                                        <label htmlFor={`day-${index}`} className="text-sm">
                                            {day}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="preset-capacity">Members Capacity</Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="preset-capacity"
                                    name="capacity"
                                    type="number"
                                    value={presetCapacity}
                                    onChange={handlePresetInputChange}
                                    placeholder="Enter capacity"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="preset-start-time">Start Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="preset-start-time"
                                    name="startTime"
                                    type="time"
                                    value={presetStartTime}
                                    onChange={handlePresetInputChange}
                                    placeholder="09:00"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="preset-notes">Notes (Optional)</Label>
                            <Textarea
                                id="preset-notes"
                                name="notes"
                                value={presetNotes}
                                onChange={handlePresetInputChange}
                                placeholder="Add any additional information"
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setPresetDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handlePreset}>Create Preset</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default SessionCalendar
