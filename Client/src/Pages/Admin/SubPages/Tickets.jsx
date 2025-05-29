"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, Eye, Edit, MessageCircle, TicketCheck } from "lucide-react"
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
import { getAllTickets } from "../../../Api/ticket.api" // Import API function

export default function Dash_Tickets() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 })

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      setError(null)
      try {
        const filters = {
          page: pagination.page,
          limit: pagination.limit,
        }
        if (statusFilter !== "all") {
          filters.status = statusFilter
        }

        const response = await getAllTickets(filters)
        if (response && Array.isArray(response.tickets)) {
          if (response.tickets.length === 0) {
            setTickets([])
            setPagination((prev) => ({ ...prev, totalPages: 1, page: 1 }))
          } else {
            setTickets(response.tickets)
            setPagination((prev) => ({
              ...prev,
              totalPages: response.totalPages || 1,
              page: response.currentPage || 1,
            }))
          }
        } else {
          setTickets([])
          setPagination((prev) => ({ ...prev, totalPages: 1, page: 1 }))
        }
      } catch (err) {
        console.error("Error fetching tickets:", err)
        setError("Failed to fetch tickets. Please try again.")
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [statusFilter, pagination.page, pagination.limit])

  const filteredTickets = tickets.filter((ticket) => {
    const ticketId = ticket._id || ticket.id
    const customerName = ticket.user?.name || "N/A"
    const customerEmail = ticket.user?.email || "N/A"

    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticketId && ticketId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Invalid Date"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading tickets...</p></div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Support Tickets</h1>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search by ID, subject, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("open")}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      {filteredTickets.length === 0 && !loading ? (
        <div className="text-center py-10">
          <TicketCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no tickets matching your current filters.
          </p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket._id || ticket.id}>
                  <TableCell className="font-medium">{ticket._id || ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.user?.name || 'N/A'}</TableCell>
                  <TableCell>{ticket.user?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.status === "open" ? "default"
                          : ticket.status === "in-progress" ? "secondary"
                            : ticket.status === "resolved" ? "outline"
                              : ticket.status === "closed" ? "destructive"
                                : "default"
                      }
                      className={
                        ticket.status === "open" ? "bg-blue-500 text-white"
                          : ticket.status === "in-progress" ? "bg-yellow-500 text-black"
                            : ticket.status === "resolved" ? "bg-green-500 text-white"
                              : ticket.status === "closed" ? "bg-gray-500 text-white"
                                : ""
                      }
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        ticket.priority === "high" ? "bg-red-500 text-white" :
                          ticket.priority === "critical" ? "bg-red-700 text-white" :
                            ticket.priority === "medium" ? "bg-orange-500 text-white" :
                              "bg-gray-200 text-gray-700" // Low or default
                      }
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit Ticket">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Respond">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page <= 1 || loading}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages || loading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  )
}

