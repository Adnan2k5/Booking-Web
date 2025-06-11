
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Calendar, MapPin, Clock, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { toast } from "sonner"
import { useEvents } from "../../../hooks/useEvent"
import { createEvent, updateEvent, deleteEvent } from "../../../Api/event.api"
import MediaPreview from "../../../components/MediaPreview"

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        images: [],
    })
    const [mediaPreviews, setMediaPreviews] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)
    const limit = 12

    const { events, isLoading, totalPages, error } = useEvents({
        search: searchTerm,
        page,
        limit,
    })

    // Cleanup function to revoke object URLs on unmount
    useEffect(() => {
        return () => {
            mediaPreviews.forEach((preview) => {
                if (preview.url && preview.url.startsWith("blob:")) {
                    URL.revokeObjectURL(preview.url)
                }
            })
        }
    }, [mediaPreviews])

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            images: [],
        })
        setMediaPreviews([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        const maxSize = 10 * 1024 * 1024 // 10MB
        const maxImages = 6 // Maximum number of images

        if (formData.images.length + files.length > maxImages) {
            toast.error(`You can upload up to ${maxImages} images only`)
            return
        }

        const validFiles = files.filter((file) => {
            if (!validTypes.includes(file.type)) {
                toast.error(`${file.name} is not a valid image type`)
                return false
            }
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large (max 10MB)`)
                return false
            }
            return true
        })

        if (validFiles.length > 0) {
            const newPreviews = validFiles.map((file) => ({
                name: file.name,
                type: "image",
                url: URL.createObjectURL(file),
            }))

            setMediaPreviews((prev) => [...prev, ...newPreviews])
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...validFiles],
            }))
        }
    }

    const removeImage = (index) => {
        setMediaPreviews((prev) => {
            const newPreviews = [...prev]
            const removedItem = newPreviews[index]

            // Clean up the object URL to prevent memory leaks (only for newly uploaded files)
            if (removedItem?.url?.startsWith("blob:")) {
                URL.revokeObjectURL(removedItem.url)
            }

            newPreviews.splice(index, 1)
            return newPreviews
        })

        // Only remove from images array if it's a new upload (not existing)
        setFormData((prev) => {
            const imageToRemove = mediaPreviews[index]
            if (imageToRemove && !imageToRemove.isExisting) {
                // Find the corresponding file in the images array and remove it
                return {
                    ...prev,
                    images: prev.images.filter((_, i) => {
                        // This is a simplified approach - in a real app you might want better tracking
                        return i !== index - mediaPreviews.filter((p) => p.isExisting).length
                    }),
                }
            }
            return prev
        })
    }

    const handleCreateEvent = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await createEvent(formData)
            toast.success("Event created successfully")
            setShowCreateModal(false)
            resetForm()
            window.location.reload() // Refresh events list
        } catch (error) {
            toast.error("Failed to create event")
            console.error("Create event error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateEvent = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await updateEvent(selectedEvent._id, formData)
            toast.success("Event updated successfully")
            setShowEditModal(false)
            resetForm()
            setSelectedEvent(null)
            window.location.reload() // Refresh events list
        } catch (error) {
            toast.error("Failed to update event")
            console.error("Update event error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId)
                toast.success("Event deleted successfully")
                window.location.reload() // Refresh events list
            } catch (error) {
                toast.error("Failed to delete event")
            }
        }
    }

    const openEditModal = (event) => {
        setSelectedEvent(event)
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split("T")[0], // Format date for input
            time: event.time,
            location: event.location,
            images: [], // Reset images array for new uploads
        })

        // Set existing images in preview (if any)
        if (event.medias && event.medias.length > 0) {
            const existingPreviews = event.medias.map((imageUrl, index) => ({
                name: `existing-image-${index}`,
                type: "image",
                url: imageUrl,
                isExisting: true,
            }))
            setMediaPreviews(existingPreviews)
        } else {
            setMediaPreviews([])
        }

        setShowEditModal(true)
    }

    const openDetailsModal = (event) => {
        setSelectedEvent(event)
        setShowDetailsModal(true)
    }

    const formatDisplayDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatDisplayTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Events</h2>
                    <p className="text-gray-600 mb-4">{error.message || "Failed to load events"}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    console.log("Events:", events)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 max-w-full lg:max-w-7xl"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Events Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">Create and manage your events</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {events && events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    {events.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <Card className="h-fit flex flex-col hover:shadow-lg transition-shadow duration-200">
                                {/* Event Image */}
                                <div className="relative h-36 sm:h-40 overflow-hidden rounded-t-lg bg-gray-100">
                                    {event.medias && event.medias.length > 0 ? (
                                        <>
                                            <img
                                                src={event.medias[0] || "/placeholder.svg"}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                onError={(e) => {
                                                    e.target.style.display = "none"
                                                    e.target.nextSibling.style.display = "flex"
                                                }}
                                            />
                                            <div
                                                className="hidden w-full h-full items-center justify-center bg-gray-100 text-gray-400"
                                                style={{ display: "none" }}
                                            >
                                                <Calendar className="h-8 w-8" />
                                            </div>
                                            {event.medias.length > 1 && (
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-xs font-medium">
                                                    +{event.medias.length - 1} more
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <Calendar className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="flex-shrink-0 p-3 sm:p-4">
                                    <CardTitle className="line-clamp-2 text-sm sm:text-base font-semibold leading-tight">
                                        {event.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs sm:text-sm mt-1">
                                        {event.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 p-3 sm:p-4 pt-0">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            <span className="truncate">{formatDisplayDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                            <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            <span className="truncate">{formatDisplayTime(event.time)}</span>
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                            <MapPin className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-row sm:flex-col items-start gap-2 p-3 sm:p-4 pt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDetailsModal(event)}
                                        className="w-full sm:w-auto text-xs sm:text-sm"
                                    >
                                        <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        View
                                    </Button>
                                    <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(event)}
                                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                                        >
                                            <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                                        >
                                            <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
                    <div className="text-center max-w-md">
                        <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-sm text-gray-500 mb-3">
                            {searchTerm ? `No events match your search "${searchTerm}"` : "You haven't created any events yet."}
                        </p>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 flex-wrap gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-xs sm:text-sm"
                    >
                        Previous
                    </Button>

                    <span className="text-xs sm:text-sm text-muted-foreground px-2">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="text-xs sm:text-sm"
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Create Event Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Create New Event</DialogTitle>
                        <DialogDescription className="text-sm">Fill in the details to create a new event.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateEvent} className="space-y-3">
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium">
                                Event Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Enter event title"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Enter event description"
                                rows={3}
                                className="mt-1 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="date" className="text-sm font-medium">
                                    Date *
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="time" className="text-sm font-medium">
                                    Time *
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location" className="text-sm font-medium">
                                Location *
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Enter event location"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="images" className="text-sm font-medium">
                                Event Images
                            </Label>
                            <div className="space-y-2 mt-1">
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">Upload images (JPEG, PNG, GIF, WebP - Max 10MB each)</p>
                            </div>

                            {mediaPreviews.length > 0 && (
                                <div className="mt-2">
                                    <MediaPreview mediaPreviews={mediaPreviews} onRemove={removeImage} isSubmitting={isSubmitting} />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Event Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Edit Event</DialogTitle>
                        <DialogDescription className="text-sm">Update the event details.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateEvent} className="space-y-3">
                        <div>
                            <Label htmlFor="edit-title" className="text-sm font-medium">
                                Event Title *
                            </Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Enter event title"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-description" className="text-sm font-medium">
                                Description *
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Enter event description"
                                rows={3}
                                className="mt-1 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="edit-date" className="text-sm font-medium">
                                    Date *
                                </Label>
                                <Input
                                    id="edit-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-time" className="text-sm font-medium">
                                    Time *
                                </Label>
                                <Input
                                    id="edit-time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit-location" className="text-sm font-medium">
                                Location *
                            </Label>
                            <Input
                                id="edit-location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Enter event location"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-images" className="text-sm font-medium">
                                Event Images
                            </Label>
                            <div className="space-y-2 mt-1">
                                <Input
                                    id="edit-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload new images (JPEG, PNG, GIF, WebP - Max 10MB each)
                                </p>
                            </div>

                            {mediaPreviews.length > 0 && (
                                <div className="mt-2">
                                    <MediaPreview mediaPreviews={mediaPreviews} onRemove={removeImage} isSubmitting={isSubmitting} />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting ? "Updating..." : "Update Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Event Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl line-clamp-2">{selectedEvent?.title}</DialogTitle>
                        <DialogDescription className="text-sm">Event Details</DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-3">
                            {/* Event Images */}
                            {selectedEvent.medias && selectedEvent.medias.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Event Images</h4>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-3">
                                        {selectedEvent.medias.map((imageUrl, index) => (
                                            <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={`Event image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = "none"
                                                        e.target.nextSibling.style.display = "flex"
                                                    }}
                                                />
                                                <div
                                                    className="hidden w-full h-full items-center justify-center bg-gray-100 text-gray-400 text-xs"
                                                    style={{ display: "none" }}
                                                >
                                                    Image not available
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                                <p className="text-sm leading-relaxed">{selectedEvent.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Date</h4>
                                    <p className="text-sm">{formatDisplayDate(selectedEvent.date)}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Time</h4>
                                    <p className="text-sm">{formatDisplayTime(selectedEvent.time)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Location</h4>
                                <p className="text-sm">{selectedEvent.location}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="w-full sm:w-auto">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
