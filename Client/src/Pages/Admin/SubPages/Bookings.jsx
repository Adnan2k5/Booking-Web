import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, Eye, Edit, Trash2 } from "lucide-react"
import AdminLayout from "../Layout"
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

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    customerName: "John Doe",
    adventure: "Mountain Climbing",
    date: "2025-03-15",
    amount: 150,
    status: "confirmed",
    participants: 2,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    adventure: "Scuba Diving",
    date: "2025-03-20",
    amount: 400,
    status: "confirmed",
    participants: 2,
  },
  {
    id: 3,
    customerName: "Mike Johnson",
    adventure: "Sky Diving",
    date: "2025-03-25",
    amount: 250,
    status: "pending",
    participants: 1,
  },
  {
    id: 4,
    customerName: "Sarah Williams",
    adventure: "River Rafting",
    date: "2025-04-05",
    amount: 240,
    status: "pending",
    participants: 2,
  },
  {
    id: 5,
    customerName: "Robert Brown",
    adventure: "Bungee Jumping",
    date: "2025-04-10",
    amount: 100,
    status: "cancelled",
    participants: 1,
  },
  {
    id: 6,
    customerName: "Emily Davis",
    adventure: "Paragliding",
    date: "2025-03-12",
    amount: 180,
    status: "confirmed",
    participants: 1,
  },
  {
    id: 7,
    customerName: "David Wilson",
    adventure: "Cave Exploration",
    date: "2025-02-15",
    amount: 180,
    status: "completed",
    participants: 2,
  },
  {
    id: 8,
    customerName: "Lisa Miller",
    adventure: "Zip Lining",
    date: "2025-02-20",
    amount: 170,
    status: "completed",
    participants: 2,
  },
]

export default function Dash_Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter bookings based on search term and status
  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.adventure.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Adventure</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.customerName}</TableCell>
                    <TableCell>{booking.adventure}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>${booking.amount}</TableCell>
                    <TableCell>{booking.participants}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "outline"
                              : booking.status === "completed"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
  )
}

