"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  MapPin,
  Clock,
  UsersIcon,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { createAdventure } from "../../../Api/adventure.api";

// Mock data for adventures
const mockAdventures = [
  {
    id: 1,
    name: "Mountain Climbing",
    description:
      "Experience the thrill of climbing high peaks with expert guides",
    location: "Alpine Heights",
    date: "2025-03-15",
    price: 150,
    status: "active",
    bookings: 24,
    instructor: "John Mountaineer",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 2,
    name: "Scuba Diving",
    description:
      "Explore the underwater world with professional diving instructors",
    location: "Coral Bay",
    date: "2025-03-20",
    price: 200,
    status: "active",
    bookings: 18,
    instructor: "Sarah Diver",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 3,
    name: "Sky Diving",
    description: "Feel the adrenaline rush of free-falling from 15,000 feet",
    location: "Cloud Heights",
    date: "2025-03-25",
    price: 250,
    status: "active",
    bookings: 12,
    instructor: "Mike Skydiver",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 4,
    name: "River Rafting",
    description: "Navigate through exciting rapids with experienced guides",
    location: "Rapids Valley",
    date: "2025-04-05",
    price: 120,
    status: "upcoming",
    bookings: 8,
    instructor: "Lisa Rafter",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 5,
    name: "Bungee Jumping",
    description: "Experience the ultimate free fall with our safe bungee setup",
    location: "Cliff Edge",
    date: "2025-04-10",
    price: 100,
    status: "upcoming",
    bookings: 6,
    instructor: "Tom Jumper",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 6,
    name: "Paragliding",
    description: "Soar through the skies and enjoy breathtaking views",
    location: "Wind Hills",
    date: "2025-03-12",
    price: 180,
    status: "active",
    bookings: 15,
    instructor: "Emma Flyer",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 7,
    name: "Cave Exploration",
    description: "Discover hidden underground wonders with expert spelunkers",
    location: "Mystery Caverns",
    date: "2025-02-15",
    price: 90,
    status: "completed",
    bookings: 22,
    instructor: "Dave Explorer",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
  {
    id: 8,
    name: "Zip Lining",
    description:
      "Zoom through forest canopies on our thrilling zip line course",
    location: "Forest Heights",
    date: "2025-02-20",
    price: 85,
    status: "completed",
    bookings: 30,
    instructor: "Zoe Zipper",
    image:
      "https://www.india-tours.com/blog/wp-content/uploads/2020/07/adventure-sports-1.jpg",
  },
];

export default function AdventuresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      location: "",
      date: "",
      description: "",
      status: ""
    }
  });
  const formData = new FormData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddAdventure, setShowAddAdventure] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 4) {
      alert("You can upload up to 4 images only.");
      return;
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Filter adventures based on search term and status
  const filteredAdventures = mockAdventures.filter((adventure) => {
    const matchesSearch =
      adventure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adventure.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || adventure.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = async(data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("date", data.date);
    formData.append("description", data.description);
    formData.append("status", data.status);
    images.forEach((image) => {
      formData.append("medias", image.file);
    });
    console.log(formData);
    const res = await createAdventure(formData);

    console.log(res);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Adventures</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddAdventure(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Adventure
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
                placeholder="Search adventures..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Adventures
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active Adventures
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>
                  Upcoming Adventures
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Completed Adventures
                </DropdownMenuItem>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdventures.map((adventure) => (
                    <TableRow key={adventure.id}>
                      <TableCell className="font-medium">
                        {adventure.name}
                      </TableCell>
                      <TableCell>{adventure.location}</TableCell>
                      <TableCell>
                        {new Date(adventure.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${adventure.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            adventure.status === "active"
                              ? "default"
                              : adventure.status === "upcoming"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {adventure.status.charAt(0).toUpperCase() +
                            adventure.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{adventure.bookings}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit
                              onClick={() => {
                                setEdit(adventure.id);
                              }}
                              className="h-4 w-4"
                            />
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
            {filteredAdventures.map((adventure) => (
              <Card key={adventure.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={
                      adventure.image || "/placeholder.svg?height=300&width=500"
                    }
                    alt={adventure.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={
                      adventure.status === "active"
                        ? "default"
                        : adventure.status === "upcoming"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {adventure.status.charAt(0).toUpperCase() +
                      adventure.status.slice(1)}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{adventure.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {adventure.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(adventure.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-3 w-3 mr-1" />
                      <span>{adventure.bookings} bookings</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {adventure.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="font-bold">${adventure.price}</div>
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

      <Dialog open={showAddAdventure} onOpenChange={setShowAddAdventure}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Adventure</DialogTitle>
            <DialogDescription>
              Create a new adventure experience for your customers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name">Adventure Name</Label>
                  <input className="py-1 px-1 border rounded-md placeholder:text-sm"
                    {...register("name")}
                    id="name"
                    placeholder="Enter adventure name"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="location">Location</Label>
                  <input className="py-1 px-1 border rounded-md placeholder:text-sm"
                    {...register("location")}
                    id="location"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="date">Date</Label>
                  <input className="py-1 px-1 border rounded-md placeholder:text-sm" {...register("date")} id="date" type="date" />
                </div>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="description">Description</Label>
                <textarea  className="px-2 py-2 border rounded-md placeholder:text-sm"
                  {...register("description")}
                  id="description"
                  placeholder="Describe the adventure experience"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image">Upload Images (Max 4)</Label>
                <input className="py-1 px-1 border rounded-md placeholder:text-sm"
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
                        src={img.url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
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
                variant="outline"
                onClick={() => setShowAddAdventure(false)}
              >
                Cancel
              </Button>
              <Button>Create Adventure</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
