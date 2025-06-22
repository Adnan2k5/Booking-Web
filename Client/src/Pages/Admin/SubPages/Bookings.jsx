import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  getAllSessionBookings,
  getAllHotelBookings,
  getAllItemBookings,
  getCurrentUserItemBookings,
} from "../../../Api/booking.api"

export default function Dash_Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("items")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState({
    items: 1,
    sessions: 1,
    hotels: 1
  })
  const [itemsPerPage] = useState(10)
  
  // State for different booking types
  const [itemBookings, setItemBookings] = useState([])
  const [sessionBookings, setSessionBookings] = useState([])
  const [hotelBookings, setHotelBookings] = useState([])
  
  const [loading, setLoading] = useState({
    items: false,
    sessions: false,
    hotels: false
  })

  // Fetch bookings data
  useEffect(() => {    const fetchItemBookings = async () => {
      setLoading(prev => ({ ...prev, items: true }))
      try {
        const response = await getAllItemBookings()
     
        // Ensure we're storing an array
        const bookingsData = response?.data?.data?.data || []
        setItemBookings(Array.isArray(bookingsData) ? bookingsData : [])
        console.log('All Item Bookings:', bookingsData)
      } catch (error) { 
        console.error("Error fetching item bookings:", error)
        setItemBookings([])
      } finally {
        setLoading(prev => ({ ...prev, items: false }))
      }
    }

    const fetchSessionBookings = async () => {
      setLoading(prev => ({ ...prev, sessions: true }))
      try {
        const response = await getAllSessionBookings()
        // Ensure we're storing an array
        const bookingsData = response?.data?.data || []
        setSessionBookings(Array.isArray(bookingsData) ? bookingsData : [])
        console.log('All Session Bookings:', bookingsData)
      } catch (error) {
        console.error("Error fetching session bookings:", error)
        setSessionBookings([])
      } finally {
        setLoading(prev => ({ ...prev, sessions: false }))
      }
    }

    const fetchHotelBookings = async () => {
      setLoading(prev => ({ ...prev, hotels: true }))
      try {
        const response = await getAllHotelBookings()
        // Ensure we're storing an array
        const bookingsData = response?.data?.data || []
        setHotelBookings(Array.isArray(bookingsData) ? bookingsData : [])
        console.log('All Hotel Bookings:', bookingsData)
      } catch (error) {
        console.error("Error fetching hotel bookings:", error)
        setHotelBookings([])
      } finally {
        setLoading(prev => ({ ...prev, hotels: false }))
      }
    }

    fetchItemBookings()
    fetchSessionBookings()
    fetchHotelBookings()
  }, [])
  // Filter bookings based on search term and status
  const getFilteredBookings = (bookings) => {
    // Ensure bookings is an array before filtering
    if (!Array.isArray(bookings)) {
      console.warn('Expected bookings to be an array but got:', typeof bookings)
      return []
    }
    
    return bookings.filter((booking) => {
      if (!booking) return false
      
      const bookingData = booking.user?.name || booking.customerName || ''
      const activityName = booking.item?.name || booking.session?.title || booking.hotel?.name || booking.adventure || ''
      
      const matchesSearch =
        bookingData.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activityName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const bookingStatus = booking.status || 'pending'
      const matchesStatus = statusFilter === "all" || bookingStatus === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  // Pagination logic
  const getPaginatedBookings = (bookings, type) => {
    const page = currentPage[type] || 1
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return bookings.slice(startIndex, endIndex)
  }

  const getTotalPages = (bookings) => {
    return Math.ceil(bookings.length / itemsPerPage)
  }

  const handlePageChange = (type, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [type]: page
    }))
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage({ items: 1, sessions: 1, hotels: 1 })
  }, [searchTerm, statusFilter])

  // Safely get filtered bookings
  const filteredItemBookings = getFilteredBookings(itemBookings)
  const filteredSessionBookings = getFilteredBookings(sessionBookings)
  const filteredHotelBookings = getFilteredBookings(hotelBookings)

  // Get paginated bookings
  const paginatedItemBookings = getPaginatedBookings(filteredItemBookings, 'items')
  const paginatedSessionBookings = getPaginatedBookings(filteredSessionBookings, 'sessions')
  const paginatedHotelBookings = getPaginatedBookings(filteredHotelBookings, 'hotels')

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  // Add debugging to see data structure
  useEffect(() => {
    console.log('Item Bookings Data Structure:', itemBookings)
    console.log('Session Bookings Data Structure:', sessionBookings)
    console.log('Hotel Bookings Data Structure:', hotelBookings)
  }, [itemBookings, sessionBookings, hotelBookings])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
        <div className="flex items-center space-x-2">
          <Button>Export Bookings</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Bookings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>Confirmed Bookings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending Bookings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed Bookings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled Bookings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="items">Item Bookings</TabsTrigger>
          <TabsTrigger value="sessions">Session Bookings</TabsTrigger>
          <TabsTrigger value="hotels">Hotel Bookings</TabsTrigger>
        </TabsList>
          <TabsContent value="items">
          <BookingsTable 
            bookings={paginatedItemBookings} 
            loading={loading.items} 
            type="item" 
          />
          <PaginationControls
            currentPage={currentPage.items}
            totalPages={getTotalPages(filteredItemBookings)}
            onPageChange={(page) => handlePageChange('items', page)}
            totalItems={filteredItemBookings.length}
            itemsPerPage={itemsPerPage}
          />
        </TabsContent>
        
        <TabsContent value="sessions">
          <BookingsTable 
            bookings={paginatedSessionBookings} 
            loading={loading.sessions} 
            type="session" 
          />
          <PaginationControls
            currentPage={currentPage.sessions}
            totalPages={getTotalPages(filteredSessionBookings)}
            onPageChange={(page) => handlePageChange('sessions', page)}
            totalItems={filteredSessionBookings.length}
            itemsPerPage={itemsPerPage}
          />
        </TabsContent>
        
        <TabsContent value="hotels">
          <BookingsTable 
            bookings={paginatedHotelBookings} 
            loading={loading.hotels} 
            type="hotel" 
          />
          <PaginationControls
            currentPage={currentPage.hotels}
            totalPages={getTotalPages(filteredHotelBookings)}
            onPageChange={(page) => handlePageChange('hotels', page)}
            totalItems={filteredHotelBookings.length}
            itemsPerPage={itemsPerPage}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

// Reusable component for bookings tables
function BookingsTable({ bookings, loading, type }) {
  // Ensure bookings is always an array
  const safeBookings = Array.isArray(bookings) ? bookings : []
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <p>Loading {type} bookings...</p>
        </CardContent>
      </Card>
    )
  }

  if (safeBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <p>No {type} bookings found.</p>
        </CardContent>
      </Card>
    )
  }

  const getTableHeaders = () => {
    const commonHeaders = [
      <TableHead key="customer">Customer</TableHead>,
      <TableHead key="date">Date</TableHead>,
      <TableHead key="amount">Amount</TableHead>,
      <TableHead key="status">Status</TableHead>,
      <TableHead key="actions" className="text-right">Actions</TableHead>
    ]

    if (type === "item") {
      return [
        <TableHead key="item">Booking Id</TableHead>,
        ...commonHeaders
      ]
    } else if (type === "session") {
      return [
        <TableHead key="session">Session</TableHead>,
        ...commonHeaders,
        <TableHead key="participants">Participants</TableHead>
      ]
    } else if (type === "hotel") {
      return [
        <TableHead key="hotel">Hotel</TableHead>,
        ...commonHeaders,
        <TableHead key="checkin">Check-in</TableHead>,
        <TableHead key="checkout">Check-out</TableHead>
      ]
    }
    
    return commonHeaders
  }

  const renderTableRow = (booking) => {
    if (!booking) return null
    
    const userName = booking.user?.name || booking.customerName || 'N/A'
    const bookingDate = booking.createdAt || booking.bookingDate || booking.date
    const formattedDate = bookingDate ? new Date(bookingDate).toLocaleDateString() : 'N/A'
    const bookingStatus = booking.status || 'pending'
    const amount = booking.totalAmount || booking.amount || 0
    
    const getStatusVariant = (status) => {
      switch (status.toLowerCase()) {
        case 'confirmed': return 'default'
        case 'pending': return 'outline'
        case 'completed': return 'secondary'
        case 'cancelled': return 'destructive'
        default: return 'outline'
      }
    }

    const commonCells = [
      <TableCell key="customer" className="font-medium">{userName}</TableCell>,
      <TableCell key="date">{formattedDate}</TableCell>,
      <TableCell key="amount">${amount}</TableCell>,
      <TableCell key="status">
        <Badge variant={getStatusVariant(bookingStatus)}>
          {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
        </Badge>
      </TableCell>,
      <TableCell key="actions" className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    ]

    if (type === "item") {
      const itemName = booking._id;
      return (
        <TableRow key={booking._id || booking.id}>
          <TableCell>{itemName}</TableCell>
          {commonCells}
        </TableRow>
      )
    } else if (type === "session") {
      const sessionTitle = booking.session?.title || 'N/A'
      const participants = booking.participants || booking.bookedSeats || 1
      return (
        <TableRow key={booking._id || booking.id}>
          <TableCell>{sessionTitle}</TableCell>
          {commonCells}
          <TableCell>{participants}</TableCell>
        </TableRow>
      )
    } else if (type === "hotel") {
      const hotelName = booking.hotel?.name || 'N/A'
      const checkIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'
      const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'
      return (
        <TableRow key={booking._id || booking.id}>
          <TableCell>{hotelName}</TableCell>
          {commonCells}
          <TableCell>{checkIn}</TableCell>
          <TableCell>{checkOut}</TableCell>
        </TableRow>
      )
    }
    
    return null
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {getTableHeaders()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeBookings.map(renderTableRow)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Pagination Controls Component
function PaginationControls({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

