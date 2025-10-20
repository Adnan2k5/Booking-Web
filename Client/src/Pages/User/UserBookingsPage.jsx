import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Loader2, Hotel, Package, Activity } from "lucide-react"
import UserLayout from "./UserLayout"
import { getCurrentUserSessionBookings, getCurrentUserHotelBookings, getCurrentUserItemBookings } from "../../Api/booking.api"
import BookingDetailsDialog from "./BookingDetailsDialog"

export default function UserBookingsPage() {
  const [activeTab, setActiveTab] = useState("sessions")
  const [bookings, setBookings] = useState({ sessions: [], hotels: [], items: [] })
  const [loading, setLoading] = useState({ sessions: true, hotels: false, items: false })
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => { fetchBookings("sessions") }, [])

  async function fetchBookings(type = "sessions", page = 1) {
    try {
      setLoading(prev => ({ ...prev, [type]: true }))
      let response
      const queryParams = { page, limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }
      if (type === 'sessions') response = await getCurrentUserSessionBookings(queryParams)
      else if (type === 'hotels') response = await getCurrentUserHotelBookings(queryParams)
      else response = await getCurrentUserItemBookings(queryParams)

      const responseData = response.data?.data || response.data
      setBookings(prev => ({ ...prev, [type]: responseData.bookings || [] }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleTabChange = (value) => { setActiveTab(value); if (!bookings[value]?.length && !loading[value]) fetchBookings(value) }
  const handleViewDetails = (booking) => { setSelectedBooking(booking); setIsDialogOpen(true) }

  const renderBookingsList = (type) => {
    const list = bookings[type] || []
    if (loading[type]) return <div className="py-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>
    if (!list.length) return <div className="py-8 text-center text-gray-500">No {type} bookings found</div>
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(b => {
          const priceValue = (b.session.price ?? b.amount ?? 0)
          const priceDisplay = typeof priceValue === 'number' ? priceValue.toFixed(2) : String(priceValue)
          const statusLabel = b.status.toUpperCase()

          return (
            <Card key={b._id} className="rounded-2xl">
              <div className="h-40 w-full relative">
                <img src={b.session?.adventureId?.medias?.[0] || b.hotel?.medias?.[0] || "/placeholder.svg?height=200&width=300"} alt="media" className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2">{statusLabel}</Badge>
              </div>
              <CardHeader className="pt-4">
                <CardTitle>{b.session?.adventureId?.name || b.hotel?.name || 'Booking'}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{b.session?.location?.name || b.hotel?.location || ''}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm">${priceDisplay}</div>
                  <Button variant="outline" onClick={() => handleViewDetails(b)}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <UserLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600 mb-6">Manage your adventure bookings</p>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="sessions">
                <Activity className="h-4 w-4" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="hotels">
                <Hotel className="h-4 w-4" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="items">
                <Package className="h-4 w-4" />
                Items
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">{renderBookingsList('sessions')}</TabsContent>
            <TabsContent value="hotels">{renderBookingsList('hotels')}</TabsContent>
            <TabsContent value="items">{renderBookingsList('items')}</TabsContent>
          </Tabs>

          <BookingDetailsDialog isOpen={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)} selectedBooking={selectedBooking} onReviewSuccess={() => { setIsDialogOpen(false); fetchBookings(activeTab) }} />
        </div>
      </div>
    </UserLayout>
  )
}
