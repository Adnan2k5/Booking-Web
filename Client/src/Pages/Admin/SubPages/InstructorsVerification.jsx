"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Eye, Edit, Trash2, FileText, X } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

// Mock data for instructors
const mockInstructors = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        specialties: ["Scuba Diving", "Snorkeling"],
        experience: "5 years",
        status: "verified",
        documents: [
            { id: 1, name: "Diving Certification", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "CPR Certificate", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        specialties: ["Rock Climbing", "Hiking"],
        experience: "8 years",
        status: "pending",
        documents: [
            { id: 1, name: "Climbing Certification", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "First Aid Certificate", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
    {
        id: 3,
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        phone: "+1 (555) 456-7890",
        specialties: ["Kayaking", "Canoeing"],
        experience: "3 years",
        status: "verified",
        documents: [
            { id: 1, name: "Kayaking Certification", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "Water Safety Certificate", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 (555) 789-0123",
        specialties: ["Paragliding", "Hang Gliding"],
        experience: "6 years",
        status: "rejected",
        documents: [
            { id: 1, name: "Paragliding License", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "Aviation Safety Certificate", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
    {
        id: 5,
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        phone: "+1 (555) 234-5678",
        specialties: ["Surfing", "Paddleboarding"],
        experience: "10 years",
        status: "verified",
        documents: [
            { id: 1, name: "Surfing Instructor Certification", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "Water Rescue Certificate", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
    {
        id: 6,
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        phone: "+1 (555) 876-5432",
        specialties: ["Mountain Biking", "Trail Running"],
        experience: "4 years",
        status: "pending",
        documents: [
            { id: 1, name: "Mountain Biking Certification", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 2, name: "Wilderness First Aid", type: "pdf", url: "/placeholder.svg?height=800&width=600" },
            { id: 3, name: "ID Proof", type: "image", url: "/placeholder.svg?height=800&width=600" },
        ],
    },
]

export default function InstructorsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedInstructor, setSelectedInstructor] = useState(null)
    const [showDocuments, setShowDocuments] = useState(false)

    // Filter instructors based on search term and status
    const filteredInstructors = mockInstructors.filter((instructor) => {
        const matchesSearch =
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" || instructor.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleViewDocuments = (instructor) => {
        setSelectedInstructor(instructor)
        setShowDocuments(true)
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-2xl font-bold tracking-tight">Instructors</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export List
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search instructors..."
                        className="w-full sm:w-[300px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Adventures</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInstructors.map((instructor) => (
                                <TableRow key={instructor.id}>
                                    <TableCell className="font-medium">{instructor.name}</TableCell>
                                    <TableCell>{instructor.email}</TableCell>
                                    <TableCell>{instructor.specialties.join(", ")}</TableCell>
                                    <TableCell>{instructor.experience}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                instructor.status === "verified"
                                                    ? "default"
                                                    : instructor.status === "pending"
                                                        ? "outline"
                                                        : "secondary"
                                            }
                                        >
                                            {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewDocuments(instructor)}>
                                                <FileText className="h-4 w-4" />
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
            {/* Full-width Document Viewer Dialog */}
            <Dialog open={showDocuments} onOpenChange={setShowDocuments} className="w-full">
                <DialogContent className="max-w-full w-full h-[90vh] p-0 border-none rounded-none sm:rounded-none">
                    <DialogHeader className="sticky top-0 z-10 bg-background px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl">Documents for {selectedInstructor?.name}</DialogTitle>
                            <DialogClose className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </div>
                        <DialogDescription className="mt-1">Review all submitted documents and certifications</DialogDescription>
                    </DialogHeader>

                    {selectedInstructor && (
                        <div className="p-6 overflow-y-auto">
                            <Tabs defaultValue="documents" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="details">Instructor Details</TabsTrigger>
                                </TabsList>
                                <TabsContent value="documents" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedInstructor.documents.map((doc) => (
                                            <motion.div
                                                key={doc.id}
                                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="aspect-[4/3] bg-muted relative group">
                                                    <img
                                                        src={doc.url || "/placeholder.svg"}
                                                        alt={doc.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium">{doc.name}</h3>
                                                    <p className="text-sm text-muted-foreground capitalize">{doc.type} Document</p>
                                                    <div className="mt-4 flex space-x-2">
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="details">
                                    <div className="bg-muted/40 rounded-lg p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                                                <div className="mt-3 space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium">Full Name</p>
                                                        <p>{selectedInstructor.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Email Address</p>
                                                        <p>{selectedInstructor.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Phone Number</p>
                                                        <p>{selectedInstructor.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Professional Information</h3>
                                                <div className="mt-3 space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium">Specialties</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {selectedInstructor.specialties.map((specialty, index) => (
                                                                <Badge key={index} variant="secondary">
                                                                    {specialty}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Experience</p>
                                                        <p>{selectedInstructor.experience}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Verification Status</p>
                                                        <Badge
                                                            variant={
                                                                selectedInstructor.status === "verified"
                                                                    ? "default"
                                                                    : selectedInstructor.status === "pending"
                                                                        ? "outline"
                                                                        : "secondary"
                                                            }
                                                            className="mt-1"
                                                        >
                                                            {selectedInstructor.status.charAt(0).toUpperCase() + selectedInstructor.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="mt-8 flex justify-end space-x-4 sticky bottom-0 bg-background p-4 border-t">
                                <Button variant="outline">Reject Documents</Button>
                                <Button>Approve Documents</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
