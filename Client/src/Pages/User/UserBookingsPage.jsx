import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Calendar, MapPin, Star, User, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import UserLayout from "./UserLayout"
import { getCurrentUserSessionBookings } from "../../Api/booking.api"


const UserBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6, // Show 6 bookings per page
        total: 0,
        totalPages: 0
    })

    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true)
            const response = await getCurrentUserSessionBookings({
                page,
                limit: pagination.limit,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            })
            
            const responseData = response.data.data || response.data
            setBookings(responseData.bookings || [])
            setPagination({
                page: responseData.page || 1,
                limit: pagination.limit,
                total: responseData.total || 0,
                totalPages: responseData.totalPages || 0
            })
        } catch (err) {
            setError("Failed to fetch bookings")
            console.error("Error fetching bookings:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-600 text-white"
            case "pending":
                return "bg-yellow-600 text-white"
            case "cancelled":
                return "bg-red-600 text-white"
            default:
                return "bg-gray-400 text-white"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Date TBD"
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return "Invalid Date"
        }
    }

    const formatTime = (dateString) => {
        if (!dateString) return "Time TBD"
        try {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return "Invalid Time"
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBookings(newPage)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading your bookings...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button 
                    onClick={() => fetchBookings(pagination.page)} 
                    className="mt-4"
                    variant="outline"
                >
                    Try Again
                </Button>
            </div>
        )
    }

    if (!bookings.length) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400">Book your first adventure to see it here!</p>
            </div>
        )
    }    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <Card key={booking._id} className="overflow-hidden rounded-2xl border-gray-200">
                        <div className="relative h-40">
                            <img
                                src={booking.session?.adventureId?.medias[0] || "/placeholder.svg?height=200&width=300"}
                                alt={booking.session?.adventureId?.name || "Adventure"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=200&width=300"
                                }}
                            />
                            <Badge className={`absolute top-2 right-2 rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Pending"}
                            </Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle>{booking.session?.adventureId?.name || "Adventure Session"}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.session?.location?.name || booking.session?.location?.address || "Location TBD"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex justify-between text-sm mb-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <div className="flex flex-col">
                                        <span>{formatDate(booking.session?.startTime)}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(booking.session?.startTime)}
                                        </span>
                                    </div>
                                </div>
                                <div className="font-medium">
                                    ${booking.amount || booking.session?.price || 0}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span className="text-sm">
                                        {booking.session?.instructorId?.fullName || 
                                         booking.session?.instructorId?.name || 
                                         "Instructor TBD"}
                                    </span>
                                </div>
                                {booking.rating && (
                                    <div className="flex items-center">
                                        <Star className="h-3 w-3 fill-black text-black" />
                                        <span className="text-xs ml-1">{booking.rating}</span>
                                    </div>
                                )}
                            </div>
                            {booking.groupMember?.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    Group size: {booking.groupMember.length + 1}
                                </div>
                            )}
                        </CardContent>
                        <div className="px-6 pb-4">
                            <Button 
                                variant="outline" 
                                className="w-full rounded-xl border-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    // Handle view details - you can navigate to a detailed view
                                    console.log('View booking details:', booking._id)
                                }}
                            >
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            variant="outline"
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            variant="outline"
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">
                                    {((pagination.page - 1) * pagination.limit) + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    variant="outline"
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </Button>
                                {[...Array(pagination.totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    const isCurrentPage = pageNumber === pagination.page;
                                    
                                    return (
                                        <Button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            variant={isCurrentPage ? "default" : "outline"}                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                isCurrentPage
                                                    ? 'z-10 bg-black text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            }`}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    variant="outline"
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default function UserBookingsPage() {
    return (
        <UserLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">My Bookings</h1>
                            <p className="text-gray-600">Manage your adventure bookings</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserBookings />
                </div>
            </div>
        </UserLayout>
    )
}
