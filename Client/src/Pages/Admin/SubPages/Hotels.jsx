"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, Eye, Edit, Trash2, Plus, Star, MapPin, Users, X } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { useForm, Controller } from "react-hook-form"

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Mountain View Resort",
    description: "Luxury resort with panoramic mountain views and premium amenities",
    location: "Alpine Heights, CO",
    manager: "Robert Johnson",
    rating: 4.8,
    rooms: 120,
    status: "active",
    occupancy: 85,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    name: "Oceanfront Paradise",
    description: "Beachfront hotel with direct access to pristine beaches and ocean views",
    location: "Coral Bay, FL",
    manager: "Jennifer Smith",
    rating: 4.6,
    rooms: 200,
    status: "active",
    occupancy: 78,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    name: "Desert Oasis Hotel",
    description: "Modern hotel surrounded by desert beauty with spa and pool facilities",
    location: "Phoenix, AZ",
    manager: "Michael Brown",
    rating: 4.3,
    rooms: 150,
    status: "active",
    occupancy: 65,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    name: "City Center Suites",
    description: "Contemporary suites in the heart of the city with business facilities",
    location: "New York, NY",
    manager: "Sarah Williams",
    rating: 4.5,
    rooms: 180,
    status: "active",
    occupancy: 90,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 5,
    name: "Lakeside Lodge",
    description: "Rustic lodge on the shores of a pristine lake with outdoor activities",
    location: "Lake Tahoe, CA",
    manager: "David Miller",
    rating: 4.7,
    rooms: 85,
    status: "inactive",
    occupancy: 0,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 6,
    name: "Forest Retreat",
    description: "Secluded retreat surrounded by forest with hiking trails and nature tours",
    location: "Portland, OR",
    manager: "Emily Davis",
    rating: 4.4,
    rooms: 60,
    status: "active",
    occupancy: 72,
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      location: "",
      manager: "",
      rooms: "",
      description: "",
      status: "",
    },
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddHotel, setShowAddHotel] = useState(false)
  const [images, setImages] = useState([])

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + images.length > 4) {
      alert("You can upload up to 4 images only.")
      return
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))

    setImages((prev) => [...prev, ...newImages])
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Filter hotels based on search term and status
  const filteredHotels = mockHotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || hotel.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onSubmit = (data) => {
    console.log("Form data:", data)
    console.log("Images:", images)
    // Here you would typically send the data to your API
    setShowAddHotel(false)
    reset()
    setImages([])
  }

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight">Hotel Management</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowAddHotel(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hotels..."
                  className="w-[200px] sm:w-[300px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Hotels</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Hotels</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive Hotels</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHotels.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.location}</TableCell>
                        <TableCell>{hotel.manager}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {hotel.rating}
                            <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                          </div>
                        </TableCell>
                        <TableCell>{hotel.rooms}</TableCell>
                        <TableCell>{hotel.occupancy}%</TableCell>
                        <TableCell>
                          <Badge variant={hotel.status === "active" ? "default" : "secondary"}>
                            {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
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
          </TabsContent>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="object-cover w-full h-full"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant={hotel.status === "active" ? "default" : "secondary"}
                    >
                      {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {hotel.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{hotel.rating} Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{hotel.rooms} Rooms</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="font-medium">{hotel.occupancy}% Occupancy</div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showAddHotel} onOpenChange={setShowAddHotel}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>Add a new hotel to your management system.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hotel Name</Label>
                    <Input id="name" placeholder="Enter hotel name" {...register("name", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, State" {...register("location", { required: true })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input id="manager" placeholder="Manager name" {...register("manager", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="0"
                      {...register("rooms", { required: true, min: 1 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the hotel"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Images (Max 4)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={images.length >= 4}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images?.map((img, index) => (
                      <div key={index} className="relative group w-[22%] h-24">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddHotel(false)
                    reset()
                    setImages([])
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Hotel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
  )
}

