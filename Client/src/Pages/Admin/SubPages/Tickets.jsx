"use client"

import { useState } from "react"
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

// Mock data for tickets
const mockTickets = [
  {
    id: "TKT-001",
    subject: "Booking Cancellation Request",
    customer: "John Doe",
    email: "john.doe@example.com",
    status: "open",
    priority: "high",
    category: "booking",
    createdAt: "2025-03-10T10:30:00",
    lastUpdated: "2025-03-10T14:45:00",
  },
  {
    id: "TKT-002",
    subject: "Payment Issue",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    status: "in-progress",
    priority: "medium",
    category: "payment",
    createdAt: "2025-03-09T15:20:00",
    lastUpdated: "2025-03-10T09:15:00",
  },
  {
    id: "TKT-003",
    subject: "Adventure Date Change",
    customer: "Mike Johnson",
    email: "mike.johnson@example.com",
    status: "open",
    priority: "low",
    category: "booking",
    createdAt: "2025-03-10T08:45:00",
    lastUpdated: "2025-03-10T08:45:00",
  },
  {
    id: "TKT-004",
    subject: "Refund Request",
    customer: "Sarah Williams",
    email: "sarah.williams@example.com",
    status: "in-progress",
    priority: "high",
    category: "payment",
    createdAt: "2025-03-08T11:30:00",
    lastUpdated: "2025-03-10T10:20:00",
  },
  {
    id: "TKT-005",
    subject: "Technical Issue with Website",
    customer: "Robert Brown",
    email: "robert.brown@example.com",
    status: "closed",
    priority: "medium",
    category: "technical",
    createdAt: "2025-03-07T14:15:00",
    lastUpdated: "2025-03-09T16:30:00",
  },
  {
    id: "TKT-006",
    subject: "Special Accommodation Request",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    status: "open",
    priority: "medium",
    category: "accommodation",
    createdAt: "2025-03-10T09:20:00",
    lastUpdated: "2025-03-10T09:20:00",
  },
]

export default function Dash_Tickets() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter tickets based on search term and status
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight">Tickets & Support</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <TicketCheck className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Tickets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("open")}>Open Tickets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress Tickets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed Tickets</DropdownMenuItem>
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
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "default"
                            : ticket.status === "in-progress"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {ticket.status === "in-progress"
                          ? "In Progress"
                          : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === "high"
                            ? "destructive"
                            : ticket.priority === "medium"
                              ? "default"
                              : "outline"
                        }
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</TableCell>
                    <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
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

